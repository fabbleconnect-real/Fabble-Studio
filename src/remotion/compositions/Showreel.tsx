import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";
import { WebBuild } from "./WebBuild";
import { EditTimeline } from "./EditTimeline";

import { SHOWREEL_FRAMES } from "../constants";

export { SHOWREEL_FRAMES };

const display = "var(--ff-display), 'Arial Black', sans-serif";
const sans = "var(--ff-body), system-ui, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const a = (f / SHOWREEL_FRAMES) * Math.PI * 2;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 50% at ${50 + 25 * Math.cos(a)}% ${40 + 15 * Math.sin(a)}%, ${brand.fabble}55, transparent 70%), radial-gradient(50% 40% at ${30 - 15 * Math.sin(a)}% 80%, ${brand.cyan}22, transparent 70%), ${brand.ink}`,
      }}
    />
  );
};

/** Words drop in through a mask, one after another, then exit upward together. */
const Kinetic: React.FC<{ lines: string[]; dur: number; accent: string }> = ({
  lines,
  dur,
  accent,
}) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const exit = interpolate(f, [dur - 14, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: width * 0.08 }}>
      {lines.map((line, i) => {
        const t = interpolate(f, [i * 9, i * 9 + 22], [0, 1], { ...clamp, easing: ease });
        const big = i === 1;
        return (
          <div key={line} style={{ overflow: "hidden", lineHeight: 0.92 }}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: big ? width * 0.112 : width * 0.07,
                letterSpacing: big ? `${-0.04 + 0.03 * (1 - t)}em` : "-0.03em",
                color: big ? "transparent" : brand.paper,
                backgroundImage: big ? `linear-gradient(90deg, ${accent}, ${brand.paper})` : undefined,
                backgroundClip: big ? "text" : undefined,
                WebkitBackgroundClip: big ? "text" : undefined,
                transform: `translateY(${(1 - t) * 105 - exit * 110}%) skewY(${(1 - t) * 6}deg)`,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const LogoIntro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const tile = spring({ frame: f, fps, config: { damping: 13 } });
  const play = spring({ frame: f - 14, fps, config: { damping: 10 } });
  const word = "Fabble Studio";
  const exit = interpolate(f, [62, 75], [0, 1], clamp);
  const u = width / 1920;
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", gap: 40 * u, flexDirection: "row", opacity: 1 - exit, transform: `scale(${1 + exit * 0.15})` }}
    >
      <div
        style={{
          width: 220 * u,
          height: 220 * u,
          borderRadius: 48 * u,
          background: brand.fabble,
          transform: `scale(${tile}) rotate(${(1 - tile) * -20}deg)`,
          position: "relative",
          boxShadow: `0 0 ${120 * u}px ${brand.fabble}aa`,
        }}
      >
        <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
          <path d="M30 78 C 32 52, 34 36, 46 28 C 54 23, 66 22, 80 22 L 76 34 C 64 34, 55 35, 50 40 L 49 44 L 68 44 L 64 56 L 46 56 C 42 66, 38 74, 30 78 Z" fill={brand.paper} />
          <path
            d="M62 60 L 78 70 L 62 80 Z"
            fill={brand.ember}
            transform={`translate(${(1 - play) * 30} 0)`}
            opacity={play}
          />
        </svg>
      </div>
      <div style={{ display: "flex", fontFamily: display, fontWeight: 800, fontSize: 130 * u, color: brand.paper, letterSpacing: "-0.04em" }}>
        {word.split("").map((ch, i) => {
          const t = interpolate(f, [18 + i * 2, 34 + i * 2], [0, 1], { ...clamp, easing: ease });
          return (
            <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: t, transform: `translateY(${(1 - t) * 60}%)` }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneFrame: React.FC<{ children: React.ReactNode; dur: number; side: "left" | "right"; caption: string }> = ({
  children,
  dur,
  side,
  caption,
}) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const inT = interpolate(f, [0, 20], [0, 1], { ...clamp, easing: ease });
  const outT = interpolate(f, [dur - 12, dur], [0, 1], clamp);
  const size = height * 0.9;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: (height - size) / 2,
          [side]: width * 0.04,
          width: size,
          height: size,
          opacity: inT * (1 - outT),
          transform: `translateY(${(1 - inT) * 60}px) scale(${0.96 + 0.04 * inT})`,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          [side === "left" ? "right" : "left"]: width * 0.07,
          top: "50%",
          transform: `translateY(-50%)`,
          width: width * 0.36,
          fontFamily: display,
          fontWeight: 700,
          fontSize: width * 0.04,
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          color: brand.paper,
          opacity: interpolate(f, [10, 30], [0, 1], clamp) * (1 - outT),
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const t = interpolate(f, [0, 30], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: width * (0.3 + i * 0.12) * t,
            height: width * (0.3 + i * 0.12) * t,
            borderRadius: "50%",
            border: `1px solid ${[brand.indigo, brand.violet, brand.cyan][i]}`,
            opacity: 0.5 - i * 0.12,
            transform: `rotate(${f * (i + 1) * 0.6}deg) scaleX(${1 + 0.08 * Math.sin(f / 15 + i)})`,
          }}
        />
      ))}
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: width * 0.06, letterSpacing: "-0.04em", color: brand.paper, lineHeight: 0.95, transform: `translateY(${(1 - t) * 40}px)`, opacity: t }}>
        Websites that grab Attention
        <br />
        Edits that tell Stories
      </div>
      <div style={{ marginTop: width * 0.02, fontFamily: sans, fontSize: width * 0.016, color: brand.mist, opacity: interpolate(f, [20, 45], [0, 1], clamp) }}>
        Fabble Studio. Web design and video editing.
      </div>
    </AbsoluteFill>
  );
};

export const Showreel: React.FC = () => (
  <AbsoluteFill style={{ background: brand.ink, overflow: "hidden" }}>
    <Backdrop />
    <Sequence durationInFrames={75}>
      <LogoIntro />
    </Sequence>
    <Sequence from={75} durationInFrames={80}>
      <Kinetic lines={["We build", "websites", "that move."]} dur={80} accent={brand.violet} />
    </Sequence>
    <Sequence from={155} durationInFrames={100}>
      <SceneFrame dur={100} side="left" caption="Fast, custom sites. Designed and built in-house.">
        <WebBuild transparent size={972} />
      </SceneFrame>
    </Sequence>
    <Sequence from={255} durationInFrames={80}>
      <Kinetic lines={["We cut", "videos", "that hold."]} dur={80} accent={brand.cyan} />
    </Sequence>
    <Sequence from={335} durationInFrames={115}>
      <Sequence durationInFrames={70}>
        <SceneFrame dur={70} side="right" caption="Reels, ads and long-form, edited to keep people watching.">
          <Sequence from={-40}>
            <EditTimeline transparent size={972} />
          </Sequence>
        </SceneFrame>
      </Sequence>
      <Sequence from={70}>
        <EndCard />
      </Sequence>
    </Sequence>
  </AbsoluteFill>
);
