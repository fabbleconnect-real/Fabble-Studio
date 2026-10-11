"use client";

import { useSyncExternalStore } from "react";

/**
 * Background music + live analysis for the hero orb.
 *
 * The loop is decoded into an AudioBuffer and played by a looping buffer source, so it
 * repeats with no gap (an <audio loop> would click at the seam). It runs through an
 * analyser the orb reads every frame via `readBeat()`, then a gain for volume and fades.
 * The analyser sits before the gain, so the beat sync doesn't depend on the volume.
 *
 * Music is on by default, but browsers only allow sound after the visitor interacts with
 * the page, so it starts on their first click, tap or key press anywhere (`initMusic`).
 * If they turn it off, that choice is remembered.
 */
const SRC = "/media/audio/trap-loop.flac";
const VOLUME = 0.35;
const FADE = 0.4; // seconds
const PREF_KEY = "fabble-music";

let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let bins: Uint8Array<ArrayBuffer> | null = null;
let started = false;
let loading: Promise<void> | null = null;
let unlockedAt = -Infinity; // when the first gesture started the music

const readPref = () => {
  try {
    return localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
};
const savePref = (on: boolean) => {
  try {
    localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {}
};

let playing = typeof window === "undefined" ? true : readPref();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function setup() {
  ctx = new AudioContext();
  gain = ctx.createGain();
  gain.gain.value = 0;
  analyser = ctx.createAnalyser();
  analyser.fftSize = 1024; // ~43 Hz per bin at 44.1 kHz
  analyser.smoothingTimeConstant = 0.35;
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  bins = new Uint8Array(analyser.frequencyBinCount);
  analyser.connect(gain).connect(ctx.destination);

  const data = await fetch(SRC).then((r) => r.arrayBuffer());
  const buffer = await ctx.decodeAudioData(data);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(analyser);
  source.start();
  started = true;
}

// must run inside a user gesture the first time: that's what lets the browser start audio
async function start() {
  try {
    if (!ctx) loading = setup();
    await ctx!.resume();
    await loading;
    if (!playing || !ctx || !gain) return; // turned off again while loading
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(VOLUME, ctx.currentTime, FADE / 3);
  } catch (e) {
    console.warn("Music unavailable:", e);
    playing = false;
    emit();
  }
}

function stop() {
  if (!ctx || !gain) return;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setTargetAtTime(0, ctx.currentTime, FADE / 3);
  // suspend once faded, so the loop keeps its place and costs nothing while paused
  setTimeout(() => !playing && ctx?.suspend(), FADE * 1000 + 50);
}

/**
 * Call once on mount. If music is on, it starts on the visitor's first click, tap or key
 * press anywhere on the page. Returns a cleanup function.
 */
export function initMusic() {
  if (!playing || ctx) return () => {};
  const events = ["pointerdown", "keydown", "touchend"] as const;
  const unlock = () => {
    events.forEach((e) => window.removeEventListener(e, unlock, true));
    if (!playing) return;
    unlockedAt = performance.now();
    start();
  };
  events.forEach((e) => window.addEventListener(e, unlock, true));
  return () => events.forEach((e) => window.removeEventListener(e, unlock, true));
}

/** The music button. */
export function toggleMusic() {
  // this click was the visitor's first gesture and has just started the music: keep it on
  if (playing && performance.now() - unlockedAt < 1000) return;
  playing = !playing;
  savePref(playing);
  emit();
  if (playing) start();
  else stop();
}

export function useMusicPlaying() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => playing,
    () => true,
  );
}

/* ---- beat analysis ---- */

const beat = { level: 0, kick: 0, shimmer: 0 };
let prevBins: Uint8Array<ArrayBuffer> | null = null;
let fluxMean = 0; // running mean and mean-square of the flux, ~1 s memory, for an adaptive threshold
let fluxSq = 0;
let peak = 0.4; // slowly decaying loudest bass, so the level uses its full range
let lastKick = 0;
let lastT = 0;

const band = (from: number, to: number) => {
  let s = 0;
  for (let i = from; i <= to; i++) s += bins![i];
  return s / ((to - from + 1) * 255);
};

/**
 * Called once per animation frame by the orb. Returns, each 0..1:
 * - `level`   how hard the low end is hitting right now (follows the 808s and their tails)
 * - `kick`    a pulse on each detected beat, sized by how hard that hit was, then decaying
 * - `shimmer` hi-hat / snare energy, for finer sparkle
 * Everything eases back to 0 while paused.
 *
 * Beats are found by spectral flux: how much the low end (~45–520 Hz) suddenly grows from
 * one frame to the next. Sustained 808s keep the bass high between hits, so watching the
 * bass level itself misses re-hits; its sudden increase catches them. Tuned on the track
 * offline: big downbeats score ~0.24, 808 re-hits 0.05–0.17, the soft intro under 0.04.
 */
export function readBeat(now: number) {
  const dt = Math.min(0.1, lastT ? (now - lastT) / 1000 : 1 / 60);
  lastT = now;

  if (!started || !analyser || !bins || !playing) {
    beat.level *= Math.exp(-dt * 4);
    beat.kick *= Math.exp(-dt * 8);
    beat.shimmer *= Math.exp(-dt * 6);
    prevBins = null;
    return beat;
  }

  analyser.getByteFrequencyData(bins);

  // beat: low-end flux above an adaptive threshold, at most one per 120 ms
  let flux = 0;
  if (prevBins) for (let i = 1; i <= 12; i++) flux += Math.max(0, bins[i] - prevBins[i]);
  flux /= 12 * 255;
  (prevBins ??= new Uint8Array(bins.length)).set(bins);
  const sd = Math.sqrt(Math.max(0, fluxSq - fluxMean * fluxMean));
  if (flux > Math.max(0.025, fluxMean + 1.5 * sd) && now - lastKick > 120) {
    lastKick = now;
    beat.kick = Math.max(beat.kick, Math.min(1, flux / 0.2));
  } else {
    beat.kick *= Math.exp(-dt * 7);
  }
  const a = Math.min(1, dt); // ~1 s memory
  fluxMean += (flux - fluxMean) * a;
  fluxSq += (flux * flux - fluxSq) * a;

  // level: quick attack, slower release, scaled to the loudest recent bass
  const bass = band(1, 4); // ~45–215 Hz: kicks and 808s
  peak = Math.max(bass, peak - dt * 0.05);
  const target = Math.min(1, bass / Math.max(peak, 0.25));
  beat.level += (target - beat.level) * Math.min(1, dt * (target > beat.level ? 18 : 5));

  const sh = Math.min(1, band(70, 180) * 2.2); // ~3–7.7 kHz: hats, snare snap
  beat.shimmer += (sh - beat.shimmer) * Math.min(1, dt * (sh > beat.shimmer ? 20 : 6));
  return beat;
}
