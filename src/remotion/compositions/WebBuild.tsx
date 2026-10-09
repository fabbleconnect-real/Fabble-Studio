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

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const grow = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** A website assembling itself inside a browser frame. Loops at 180f. */
export const WebBuild: React.FC<{ transparent?: boolean; size?: number }> = ({
  size,
  transparent,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const u = (size ?? width) / 960;
  // content clears out at the end so the loop restarts on an empty page
  const out = interpolate(frame, [150, 172], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const content = {
    opacity: 1 - out,
    transform: `translateY(${-30 * out * u}px)`,
  };
  const btn = spring({ frame: frame - 52, fps, config: { damping: 12 } });
  const click = grow(frame, 124, 140);
  const cursorX = interpolate(frame, [92, 122], [820, 205], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [92, 122], [860, 512], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const R = (n: number) => n * u;

  return (
    <AbsoluteFill
      style={{ background: transparent ? "transparent" : brand.ink }}
    >
      {/* browser chrome */}
      <div
        style={{
          position: "absolute",
          left: R(80),
          top: R(120),
          width: R(800),
          height: R(720),
          borderRadius: R(22),
          border: `${R(1.5)}px solid rgba(238,237,247,0.16)`,
          background:
            "linear-gradient(180deg, rgba(20,20,40,0.9), rgba(10,10,20,0.95))",
          boxShadow: `0 ${R(40)}px ${R(120)}px rgba(61,99,255,0.18)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: R(48),
            borderBottom: `${R(1)}px solid rgba(238,237,247,0.1)`,
            display: "flex",
            alignItems: "center",
            gap: R(9),
            paddingLeft: R(20),
          }}
        >
          {[brand.ember, "#F5B83D", "#3DDC97"].map((c) => (
            <div
              key={c}
              style={{
                width: R(12),
                height: R(12),
                borderRadius: 99,
                background: c,
                opacity: 0.85,
              }}
            />
          ))}
          <div
            style={{
              marginLeft: R(24),
              width: R(300),
              height: R(22),
              borderRadius: 99,
              background: "rgba(238,237,247,0.07)",
            }}
          />
        </div>

        <div style={{ position: "relative", padding: R(36), ...content }}>
          {/* nav */}
          <div style={{ display: "flex", alignItems: "center", gap: R(14) }}>
            <div
              style={{
                width: R(34),
                height: R(34),
                borderRadius: R(9),
                background: brand.fabble,
                transform: `scale(${grow(frame, 6, 22)})`,
              }}
            />
            <div style={{ flex: 1 }} />
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: R(70),
                  height: R(10),
                  borderRadius: 99,
                  background: "rgba(238,237,247,0.25)",
                  opacity: grow(frame, 10 + i * 4, 26 + i * 4),
                }}
              />
            ))}
          </div>

          {/* hero */}
          <div style={{ display: "flex", marginTop: R(54), gap: R(30) }}>
            <div style={{ flex: 1.1 }}>
              {[0.95, 0.7].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: R(40),
                    width: `${w * 100 * grow(frame, 20 + i * 7, 46 + i * 7)}%`,
                    borderRadius: R(8),
                    marginBottom: R(14),
                    background: `linear-gradient(90deg, ${brand.paper}, ${brand.violet})`,
                  }}
                />
              ))}
              {[1, 0.85, 0.6].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: R(9),
                    width: `${w * 100 * grow(frame, 36 + i * 5, 58 + i * 5)}%`,
                    borderRadius: 99,
                    marginTop: R(12),
                    background: "rgba(238,237,247,0.22)",
                  }}
                />
              ))}
              <div
                style={{
                  marginTop: R(34),
                  width: R(160),
                  height: R(48),
                  borderRadius: 99,
                  transform: `scale(${btn * (1 - 0.08 * Math.sin(click * Math.PI))})`,
                  transformOrigin: "left center",
                  background:
                    click > 0.5
                      ? `linear-gradient(90deg, ${brand.ember}, ${brand.emberHot})`
                      : brand.paper,
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                height: R(280),
                borderRadius: R(16),
                overflow: "hidden",
                clipPath: `inset(0 0 ${100 - 100 * grow(frame, 40, 72)}% 0 round ${R(16)}px)`,
                background: `radial-gradient(120% 90% at 20% 20%, ${brand.violet} 0%, transparent 55%), radial-gradient(100% 100% at 90% 90%, ${brand.cyan} 0%, transparent 50%), ${brand.indigo}`,
              }}
            />
          </div>

          {/* cards */}
          <div style={{ display: "flex", gap: R(18), marginTop: R(46) }}>
            {[0, 1, 2].map((i) => {
              const g = grow(frame, 70 + i * 8, 96 + i * 8);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: R(130),
                    borderRadius: R(14),
                    border: `${R(1)}px solid rgba(238,237,247,0.12)`,
                    background: "rgba(238,237,247,0.04)",
                    opacity: g,
                    transform: `translateY(${(1 - g) * R(40)}px)`,
                    padding: R(18),
                  }}
                >
                  <div
                    style={{
                      width: R(30),
                      height: R(30),
                      borderRadius: 99,
                      background: [brand.indigo, brand.violet, brand.cyan][i],
                    }}
                  />
                  <div
                    style={{
                      marginTop: R(22),
                      height: R(9),
                      width: "70%",
                      borderRadius: 99,
                      background: "rgba(238,237,247,0.25)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* cursor + click ripple */}
      <div
        style={{
          position: "absolute",
          left: R(cursorX),
          top: R(cursorY),
          opacity: interpolate(frame, [88, 96, 146, 156], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: R(-30),
            top: R(-30),
            width: R(60),
            height: R(60),
            borderRadius: 99,
            border: `${R(2)}px solid ${brand.emberHot}`,
            transform: `scale(${click * 1.6})`,
            opacity: 1 - click,
          }}
        />
        <svg width={R(30)} height={R(30)} viewBox="0 0 24 24">
          <path
            d="M3 2l7.5 19 2.6-7.9L21 10.5z"
            fill={brand.paper}
            stroke={brand.ink}
            strokeWidth={1.2}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
