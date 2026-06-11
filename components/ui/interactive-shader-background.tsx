"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive cosmic shader background — adapted from a public-domain WebGL2
 * shader by Matthias Hurrle (@atzedent), retuned to our green/gold palette
 * and dialed down to ~50% opacity so it stays atmospheric.
 *
 * Pointer-aware: mouse movement subtly warps the field, making the page feel
 * alive without distracting. Fixed-position, pointer-events disabled,
 * gracefully no-ops on devices without WebGL2.
 */

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main() { gl_Position = position; }`;

/**
 * Fragment shader — original cosmic dust, retuned:
 *   - replaced the warm-amber dust color with cool green-gold
 *   - clamped overall brightness to ~50% for atmospheric feel
 *   - kept the pointer-warped clouds and orbiting points intact
 */
const FRAGMENT_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 touch;
uniform int pointerCount;

#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x, R.y)

float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(in vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  float a = rnd(i),
        b = rnd(i + vec2(1, 0)),
        c = rnd(i + vec2(0, 1)),
        d = rnd(i + 1.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float t = 0.0, a = 1.0;
  mat2 m = mat2(1.0, -0.5, 0.2, 1.2);
  for (int i = 0; i < 5; i++) {
    t += a * noise(p);
    p *= 2.0 * m;
    a *= 0.5;
  }
  return t;
}

float clouds(vec2 p) {
  float d = 1.0, t = 0.0;
  for (float i = 0.0; i < 3.0; i++) {
    float a = d * fbm(i * 10.0 + p.x * 0.2 + 0.2 * (1.0 + i) * p.y + d + i * i + p);
    t = mix(t, d, a);
    d = a;
    p *= 2.0 / (i + 1.0);
  }
  return t;
}

void main(void) {
  vec2 uv = (FC - 0.5 * R) / MN;
  vec2 st = uv * vec2(2.0, 1.0);

  /* Pointer drift — when the user moves their mouse, the cloud subtly
     follows. Effectively zero when no pointer. */
  vec2 mouseInfluence = vec2(0.0);
  if (pointerCount > 0) {
    vec2 m = (touch - 0.5 * R) / MN;
    mouseInfluence = m * 0.08;
  }

  vec3 col = vec3(0);
  float bg = clouds(vec2(st.x + T * 0.4 + mouseInfluence.x, -st.y + mouseInfluence.y));
  uv *= 1.0 - 0.25 * (sin(T * 0.18) * 0.5 + 0.5);

  for (float i = 1.0; i < 12.0; i++) {
    uv += 0.1 * cos(i * vec2(0.1 + 0.01 * i, 0.8) + i * i + T * 0.5 + 0.1 * uv.x);
    vec2 p = uv;
    float d = length(p);

    /* Shooting-star micro-sparkles — original RGB rainbow orbit, the
       signature effect of this shader. cos(sin(i)*vec3(1,2,3)) creates
       different hues per iteration giving the multicolor pop. */
    col += 0.0018 / d * (cos(sin(i) * vec3(1.0, 2.0, 3.0)) + 1.0);

    float b = noise(i + p + bg * 1.731);
    col += 0.003 * b / length(max(p, vec2(b * p.x * 0.02, p.y)));

    /* Background dust tinted to our green-gold brand */
    col = mix(col, vec3(bg * 0.14, bg * 0.22, bg * 0.06), d);
  }

  O = vec4(col, 1.0);
}`;

export default function InteractiveShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) return; // older devices — silent fallback to the plain bg

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("shader compile error:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "resolution");
    const uTime = gl.getUniformLocation(program, "time");
    const uTouch = gl.getUniformLocation(program, "touch");
    const uPointerCount = gl.getUniformLocation(program, "pointerCount");

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let pointerCount = 0;
    let touchX = 0;
    let touchY = 0;
    const onMove = (e: PointerEvent) => {
      pointerCount = 1;
      touchX = e.clientX * dpr;
      touchY = canvas.height - e.clientY * dpr;
    };
    const onLeave = () => {
      pointerCount = 0;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const start = performance.now();
    const render = () => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uTouch, touchX, touchY);
      gl.uniform1i(uPointerCount, pointerCount);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ opacity: 1 }}
      aria-hidden
    />
  );
}
