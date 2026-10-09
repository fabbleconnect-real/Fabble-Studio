import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { brand } from "../brand";

import { PROCESS_FRAMES, PROCESS_STAGE } from "../constants";

export { PROCESS_FRAMES, PROCESS_STAGE };

type P = { x: number; y: number; w: number; h: number; r: number; rot: number; c: string };

const N = 24;
const rand = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const palette = [brand.indigo, brand.violet, brand.cyan, brand.fabble];

// five formations: ideas → a focus → storyboard → timeline/build → play
const formations: P[][] = [
  Array.from({ length: N }, (_, i) => ({
    x: 140 + rand(i, 1) * 720,
    y: 140 + rand(i, 2) * 720,
    w: 10 + rand(i, 3) * 16,
    h: 10 + rand(i, 3) * 16,
    r: 99,
    rot: 0,
    c: palette[i % 4],
  })),
  Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return { x: 500 + Math.cos(a) * 290, y: 500 + Math.sin(a) * 290, w: 22, h: 22, r: 99, rot: 0, c: i % 2 ? brand.violet : brand.indigo };
  }),
  Array.from({ length: N }, (_, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    return {
      x: 500 + (col - 2.5) * 136,
      y: 500 + (row - 1.5) * 92,
      w: 120,
      h: 68,
      r: 8,
      rot: 0,
      c: interpolateColors(col / 5, [0, 0.5, 1], [brand.indigo, brand.violet, brand.cyan]),
    };
  }),
  (() => {
    const out: P[] = [];
    const lens = [
      [120, 80, 150, 60, 110, 90, 100, 90],
      [70, 160, 90, 130, 80, 120, 100, 50],
      [200, 140, 180, 100, 100, 60, 60, 60],
    ];
    lens.forEach((row, t) => {
      let x = 120;
      row.forEach((len, k) => {
        out.push({ x: x + len / 2, y: 380 + t * 120, w: len - 8, h: 74, r: 10, rot: 0, c: [brand.violet, brand.indigo, brand.cyan][t] });
        x += len;
        void k;
      });
    });
    return out;
  })(),
  Array.from({ length: N }, (_, i) => {
    // points around a rounded play triangle
    const verts = [
      [380, 260],
      [380, 740],
      [780, 500],
    ];
    const per = N / 3;
    const side = Math.floor(i / per);
    const t = (i % per) / per;
    const [ax, ay] = verts[side];
    const [bx, by] = verts[(side + 1) % 3];
    return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, w: 18, h: 18, r: 99, rot: 45, c: interpolateColors(i / N, [0, 1], [brand.ember, brand.emberHot]) };
  }),
];

const ease = Easing.bezier(0.65, 0, 0.35, 1);

/** Scroll-scrubbed: the page seeks this composition as the Process section scrolls. */
export const ProcessMorph: React.FC = () => {
  const frame = useCurrentFrame();
  const stage = Math.min(3, Math.floor(frame / PROCESS_STAGE));
  const local = ease(Math.min(1, (frame - stage * PROCESS_STAGE) / PROCESS_STAGE));
  const from = formations[stage];
  const to = formations[stage + 1];
  const triFill = interpolate(frame, [PROCESS_FRAMES - 40, PROCESS_FRAMES - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1000 1000" width="100%" height="100%">
        <defs>
          <linearGradient id="tri" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={brand.ember} />
            <stop offset="1" stopColor={brand.emberHot} />
          </linearGradient>
          <radialGradient id="pglow">
            <stop offset="0" stopColor={to[0].c} stopOpacity={0.28} />
            <stop offset="1" stopColor={to[0].c} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={500} cy={500} r={480} fill="url(#pglow)" />
        <path
          d="M380 260 L780 500 L380 740 Z"
          fill="url(#tri)"
          opacity={triFill * 0.9}
          stroke="url(#tri)"
          strokeWidth={30}
          strokeLinejoin="round"
          transform={`translate(${500 * (1 - (0.9 + 0.1 * triFill))} ${500 * (1 - (0.9 + 0.1 * triFill))}) scale(${0.9 + 0.1 * triFill})`}
        />
        {from.map((a, i) => {
          const b = to[i];
          const m = (k: keyof P) =>
            (a[k] as number) + ((b[k] as number) - (a[k] as number)) * local;
          const drift = stage === 0 ? (1 - local) * 10 : 0;
          const x = m("x") + drift * Math.sin(frame / 9 + i);
          const y = m("y") + drift * Math.cos(frame / 11 + i);
          const w = m("w");
          const h = m("h");
          return (
            <rect
              key={i}
              x={x - w / 2}
              y={y - h / 2}
              width={w}
              height={h}
              rx={Math.min(m("r"), Math.min(w, h) / 2)}
              fill={interpolateColors(local, [0, 1], [a.c, b.c])}
              fillOpacity={0.9 - triFill * 0.5}
              transform={`rotate(${m("rot")} ${x} ${y})`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
