import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";

type Clip = { track: number; start: number; len: number; color: string; at: number };

// start/len are in timeline units (0–100); `at` is the frame the clip snaps in
const clips: Clip[] = [
  { track: 1, start: 0, len: 28, color: brand.indigo, at: 4 },
  { track: 1, start: 28, len: 22, color: brand.violet, at: 12 },
  { track: 1, start: 50, len: 30, color: brand.cyan, at: 20 },
  { track: 1, start: 80, len: 20, color: brand.fabble, at: 28 },
  { track: 0, start: 12, len: 18, color: brand.ember, at: 36 },
  { track: 0, start: 58, len: 16, color: brand.emberHot, at: 44 },
];

/** Clips snap onto a timeline, a playhead scrubs and the monitor cuts. Loops at 180f. */
export const EditTimeline: React.FC<{ transparent?: boolean; size?: number }> = ({
  size,
  transparent,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const R = (n: number) => (n * (size ?? width)) / 960;
  const out = interpolate(frame, [156, 176], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const head = interpolate(frame, [48, 150], [0, 100], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const live =
    clips.filter((c) => c.track === 1).find((c) => head >= c.start && head < c.start + c.len) ??
    clips[0];
  const cutFlash = clips
    .filter((c) => c.track === 1 && c.start > 0)
    .reduce((m, c) => Math.max(m, 1 - Math.min(1, Math.abs(head - c.start) / 1.6)), 0);

  const trackTop = 640;
  const trackX = 80;
  const trackW = 800;
  const rows = ["V2", "V1", "A1"];

  return (
    <AbsoluteFill style={{ background: transparent ? "transparent" : brand.ink }}>
      {/* program monitor */}
      <div
        style={{
          position: "absolute",
          left: R(150),
          top: R(90),
          width: R(660),
          height: R(371),
          borderRadius: R(14),
          overflow: "hidden",
          border: `${R(1.5)}px solid rgba(238,237,247,0.16)`,
          background: `radial-gradient(90% 120% at ${30 + head * 0.4}% 30%, ${live.color} 0%, ${brand.night} 70%)`,
          opacity: 1 - out * 0.6,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 660 371">
          <circle
            cx={200 + head * 2.6}
            cy={185 + 40 * Math.sin(frame / 12)}
            r={70}
            fill="none"
            stroke={brand.paper}
            strokeOpacity={0.5}
            strokeWidth={2}
          />
          <rect
            x={330 - head * 1.2}
            y={110}
            width={150}
            height={150}
            rx={30}
            fill={brand.paper}
            fillOpacity={0.12}
            transform={`rotate(${head * 1.8} ${405 - head * 1.2} 185)`}
          />
          {/* safe-area corners */}
          {[
            "M24 54V24h30",
            "M606 24h30v30",
            "M24 317v30h30",
            "M606 347h30v-30",
          ].map((d) => (
            <path key={d} d={d} fill="none" stroke={brand.paper} strokeOpacity={0.4} strokeWidth={2} />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: brand.paper,
            opacity: cutFlash * 0.35,
          }}
        />
      </div>

      {/* ruler */}
      <svg
        style={{ position: "absolute", left: R(trackX), top: R(trackTop - 46) }}
        width={R(trackW)}
        height={R(24)}
        viewBox={`0 0 ${trackW} 24`}
      >
        {Array.from({ length: 41 }, (_, i) => (
          <line
            key={i}
            x1={i * 20}
            x2={i * 20}
            y1={i % 5 === 0 ? 4 : 14}
            y2={24}
            stroke={brand.paper}
            strokeOpacity={0.3}
          />
        ))}
      </svg>

      {/* tracks */}
      {rows.map((label, t) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: R(trackX),
            top: R(trackTop + t * 74),
            width: R(trackW),
            height: R(60),
            borderRadius: R(10),
            background: "rgba(238,237,247,0.035)",
            border: `${R(1)}px solid rgba(238,237,247,0.08)`,
          }}
        />
      ))}

      {/* clips */}
      {clips.map((c, i) => {
        const s = spring({ frame: frame - c.at, fps, config: { damping: 15, mass: 0.7 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: R(trackX + (c.start / 100) * trackW + 2),
              top: R(trackTop + c.track * 74 + 4),
              width: R((c.len / 100) * trackW - 4),
              height: R(52),
              borderRadius: R(8),
              background: `linear-gradient(180deg, ${c.color}, ${c.color}bb)`,
              opacity: s * (1 - out),
              transform: `translateX(${(1 - s) * R(260)}px)`,
              boxShadow: `inset 0 0 0 ${R(1)}px rgba(255,255,255,0.18)`,
            }}
          />
        );
      })}

      {/* audio waveform */}
      <svg
        style={{ position: "absolute", left: R(trackX), top: R(trackTop + 2 * 74) }}
        width={R(trackW)}
        height={R(60)}
        viewBox={`0 0 ${trackW} 60`}
        opacity={interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - out)}
      >
        {Array.from({ length: 100 }, (_, i) => {
          const h =
            8 +
            20 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11 + frame / 9));
          return (
            <rect
              key={i}
              x={i * 8 + 2}
              y={30 - h / 2}
              width={4}
              height={h}
              rx={2}
              fill={brand.cyan}
              fillOpacity={i * 8 < (head / 100) * trackW ? 0.9 : 0.35}
            />
          );
        })}
      </svg>

      {/* playhead */}
      <div
        style={{
          position: "absolute",
          left: R(trackX + (head / 100) * trackW),
          top: R(trackTop - 54),
          width: R(2),
          height: R(54 + 3 * 74),
          background: brand.emberHot,
          opacity: interpolate(frame, [40, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - out),
          boxShadow: `0 0 ${R(14)}px ${brand.ember}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: R(-9),
            top: 0,
            width: 0,
            height: 0,
            borderLeft: `${R(10)}px solid transparent`,
            borderRight: `${R(10)}px solid transparent`,
            borderTop: `${R(14)}px solid ${brand.emberHot}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
