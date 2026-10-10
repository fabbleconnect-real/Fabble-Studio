"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A molten star: a latitude/longitude mesh of particles on a rippling shell,
 * electric blue at the base, lilac at the flanks, ember at the crown, white-hot
 * where the meridians meet at the poles. Flares outward under the pointer.
 * Plain WebGL2, no dependencies.
 */

const VERT = /* glsl */ `#version 300 es
precision highp float;
in vec3 aDir;   // unit direction on the sphere
in float aRand;
uniform float uTime;
uniform vec2 uFit;     // min(w,h)/w, min(w,h)/h
uniform vec2 uMouse;   // pointer, in sphere units
uniform float uHover;  // 0..1, eased
uniform float uPx;     // base point size in device px
uniform float uRadius;
out vec3 vColor;
out float vAlpha;

// 3D simplex noise, Ashima Arts / Stefan Gustavson (MIT)
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

mat3 rotY(float a){ float c = cos(a), s = sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
mat3 rotX(float a){ float c = cos(a), s = sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }

void main(){
  // spin about the vertical axis, then tip the crown slightly toward the viewer
  vec3 o = rotY(uTime * 0.06) * aDir;
  vec3 n = rotX(0.07) * o;
  float t = uTime * 0.2;

  // rippling shell: a slow swell, plus finer ribbons that run around the sphere
  float swell = snoise(o * 1.8 + vec3(0.0, t, 0.0));
  float ribbon = snoise(vec3(o.x * 3.2, o.y * 6.0, o.z * 3.2) - vec3(t * 1.4));
  float breathe = 1.0 + sin(uTime * 0.6) * 0.014;
  float r = uRadius * breathe * (1.0 + swell * 0.05 + ribbon * 0.04);
  vec3 p = n * r;

  // prominences: points under the pointer lift off the surface and run hot
  float md = length(p.xy - uMouse);
  float near = uHover * smoothstep(0.4, 0.0, md);
  float flick = snoise(o * 7.0 + vec3(uTime * 1.6));
  float flare = near * (0.35 + 0.65 * smoothstep(-0.2, 0.8, flick));
  p += n * flare * (0.05 + 0.2 * aRand);

  // the shell reads as a ring: bright at the limb, nearly gone face-on
  float rim = pow(1.0 - abs(n.z), 2.4);
  float back = n.z < 0.0 ? 0.6 : 1.0;
  // meridians crowd together near the poles; thin them out, but let the very tip burn
  float lat = sqrt(1.0 - aDir.y * aDir.y);
  float pole = smoothstep(0.9, 1.0, abs(aDir.y));
  float density = clamp(lat * 1.3, 0.12, 1.0);
  vAlpha = (0.02 + rim * 2.6) * back * density * (0.7 + 0.3 * aRand) * (0.85 + 0.25 * ribbon) + pole * rim * 0.25 + flare * 0.9;

  // palette, base to crown: indigo, lilac, ember
  float h = clamp(n.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 indigo = vec3(0.20, 0.36, 1.0);
  vec3 lilac = vec3(0.80, 0.62, 0.92);
  vec3 ember = vec3(1.0, 0.22, 0.14);
  vec3 c = mix(indigo, lilac, smoothstep(0.12, 0.55, h));
  c = mix(c, ember, smoothstep(0.5, 0.86, h));
  // white-hot poles, warm above and icy below
  vec3 hot = aDir.y > 0.0 ? vec3(1.0, 0.86, 0.72) : vec3(0.72, 0.86, 1.0);
  c = mix(c, hot, pole * 0.85);
  // where the shell is seen edge-on it runs hotter and paler
  c = mix(c, vec3(1.0, 0.94, 0.96), rim * rim * 0.3);
  c = mix(c, vec3(1.0, 0.6, 0.32), flare * 0.6);
  vColor = c;

  float persp = 1.0 / (1.0 - p.z * 0.3);
  gl_Position = vec4(p.xy * persp * uFit, 0.0, 1.0);
  gl_PointSize = uPx * (0.8 + aRand * 0.5) * (1.0 + flare * 1.2) * persp;
}`;

const FRAG = /* glsl */ `#version 300 es
precision mediump float;
in vec3 vColor;
in float vAlpha;
out vec4 outColor;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  outColor = vec4(vColor * a, a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

// taller than the layer so flares never hit an edge; the foot dissolves into the next section
const CANVAS_CLASS = "absolute inset-x-0 -top-1/4 block h-[150%] w-full [mask-image:linear-gradient(to_bottom,#000_80%,transparent_100%)]";

export function SolarOrb({ className, radius = 0.72 }: { className?: string; radius?: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  // portrait phones size the orb from the width, so let it fill more of it
  const smallRadius = Math.max(radius, 0.9);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // A fresh canvas per mount: cleanup destroys the WebGL context, and a reused canvas
    // (React remounts, client-side navigation back to this page) would hand back that dead context.
    const canvas = document.createElement("canvas");
    canvas.className = CANVAS_CLASS;
    root.appendChild(canvas);
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) {
      canvas.remove();
      return;
    }

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    } catch (e) {
      console.warn("SolarOrb disabled:", e);
      canvas.remove();
      return;
    }
    gl.useProgram(prog);

    // a latitude/longitude grid, so the dots line up into threads like a woven mesh.
    // Phones get a lighter mesh; rebuilt if the window crosses the breakpoint (e.g. a resized pane).
    const phone = matchMedia("(max-width: 767px)");
    const dirBuf = gl.createBuffer();
    const randBuf = gl.createBuffer();
    const bind = (buf: WebGLBuffer | null, name: string, size: number) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    bind(dirBuf, "aDir", 3);
    bind(randBuf, "aRand", 1);
    let small = false;
    let count = 0;
    const build = () => {
      small = phone.matches;
      const rings = small ? 120 : 190;
      const segs = small ? 170 : 260;
      count = rings * segs;
      const dirs = new Float32Array(count * 3);
      const rands = new Float32Array(count);
      for (let i = 0, k = 0; i < rings; i++) {
        for (let j = 0; j < segs; j++, k++) {
          // a little jitter keeps the threads but breaks up moiré and bullseyes at the poles
          const th = ((i + 0.5 + (Math.random() - 0.5) * 0.6) / rings) * Math.PI;
          const ph = ((j + (Math.random() - 0.5) * 0.5) / segs) * Math.PI * 2;
          const y = Math.cos(th);
          const rr = Math.sin(th);
          dirs[k * 3] = Math.cos(ph) * rr;
          dirs[k * 3 + 1] = y;
          dirs[k * 3 + 2] = Math.sin(ph) * rr;
          rands[k] = Math.random();
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, dirBuf);
      gl.bufferData(gl.ARRAY_BUFFER, dirs, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, randBuf);
      gl.bufferData(gl.ARRAY_BUFFER, rands, gl.STATIC_DRAW);
    };

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uTime = u("uTime");
    const uFit = u("uFit");
    const uMouse = u("uMouse");
    const uHover = u("uHover");
    const uPx = u("uPx");
    const uRadius = u("uRadius");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // additive: overlapping embers burn brighter
    gl.clearColor(0, 0, 0, 0);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, inside: false };
    const eased = { x: 0, y: 0, hover: 0 };
    const t0 = performance.now();

    const resize = () => {
      // match the CSS bloom, which switches size at the same breakpoint
      if (count === 0 || phone.matches !== small) build();
      gl.uniform1f(uRadius, small ? smallRadius : radius);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      // size the orb from the layer it sits in; the canvas itself bleeds past it top and bottom
      const box = canvas.parentElement!;
      const m = Math.min(box.clientWidth, box.clientHeight);
      gl.uniform2f(uFit, m / w, m / h);
      gl.uniform1f(uPx, (small ? 1.5 : 1.6) * dpr);
      if (reduce || !raf) render(reduce ? 0 : (performance.now() - t0) / 1000);
    };

    const render = (time: number) => {
      eased.x += (pointer.x - eased.x) * 0.12;
      eased.y += (pointer.y - eased.y) * 0.12;
      eased.hover += ((pointer.inside ? 1 : 0) - eased.hover) * 0.05;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, eased.x, eased.y);
      gl.uniform1f(uHover, eased.hover);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    };

    const loop = () => {
      render((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!reduce && visible && !document.hidden && !raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // pointer → sphere units (1 = half the canvas's shorter side, +y up)
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const box = canvas.parentElement!.getBoundingClientRect();
      const m = Math.min(box.width, box.height) / 2;
      pointer.x = (e.clientX - rect.left - rect.width / 2) / m;
      pointer.y = -(e.clientY - rect.top - rect.height / 2) / m;
      pointer.inside = e.clientY >= rect.top && e.clientY <= rect.bottom;
    };
    const onLeave = () => (pointer.inside = false);
    const onVis = () => (document.hidden ? stop() : start());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [radius, smallRadius]);

  return (
    <div
      ref={rootRef}
      className={cn("relative size-full [container-type:size] [--r:var(--r-sm)] md:[--r:var(--r-lg)]", className)}
      style={{ "--r-lg": radius, "--r-sm": smallRadius } as React.CSSProperties}
      aria-hidden
    >
      {/* bloom: the corona bleeding into the dark, ember above and indigo below */}
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[calc(var(--r)*100cqmin*1.12)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background: "linear-gradient(180deg, #ff3d2e 0%, #ff3d2e 18%, #8a5bd6 52%, #3d63ff 85%, #3d63ff 100%)",
          // soft stops instead of a blur filter, which would re-rasterize every scroll frame
          maskImage: "radial-gradient(closest-side, transparent 62%, rgba(0,0,0,0.35) 74%, #000 86%, rgba(0,0,0,0.3) 95%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, transparent 62%, rgba(0,0,0,0.35) 74%, #000 86%, rgba(0,0,0,0.3) 95%, transparent 100%)",
        }}
      />
      {/* hot spots where the meridians meet */}
      <div className="absolute left-1/2 top-[calc(50%-var(--r)*50cqmin)] size-[calc(var(--r)*30cqmin)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#ff6a3d40,#ff6a3d14_50%,transparent)]" />
      <div className="absolute left-1/2 top-[calc(50%+var(--r)*50cqmin)] size-[calc(var(--r)*30cqmin)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#4f7bff4d,#4f7bff17_50%,transparent)]" />
      {/* the WebGL canvas is appended here by the effect above */}
    </div>
  );
}
