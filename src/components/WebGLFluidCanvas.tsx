'use client';
import { useEffect, useRef } from 'react';

/* ============================================================
   Pure WebGL Cursor Fluid — Perfectly Balanced Soft & Bright
   - Positioned in background (z-index: 0) behind all content
   - Balanced violet & electric cyan liquid trail
   - Pure cursor-following motion trail with smooth dissolution
   ============================================================ */

const VERT = `#version 100
attribute vec2 a_position;
void main(){gl_Position=vec4(a_position,0,1);}`;

const TRAIL_FRAG = `#version 100
precision highp float;
uniform sampler2D u_prev;
uniform vec2 u_resolution;
uniform vec2 u_point;
uniform float u_radius;
uniform float u_strength;
uniform float u_decay;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  vec4 prev=texture2D(u_prev,uv)*u_decay;
  float d=length(gl_FragCoord.xy-u_point);
  float splat=u_strength*exp(-d*d/(2.0*u_radius*u_radius));
  gl_FragColor=prev+vec4(splat);
}`;

const DISPLAY_FRAG = `#version 100
precision highp float;
uniform sampler2D u_trail;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float t=texture2D(u_trail,uv).r;
  if(t<0.001){discard;}
  
  // Balanced palette (Deep Violet -> Icy Cyan -> Soft Glow)
  float h=t*2.0+u_time*0.25;
  vec3 col=vec3(
    0.50+0.40*sin(h+0.0),
    0.40+0.40*sin(h+2.094),
    0.60+0.35*sin(h+4.188)
  );
  
  // Refined purple/cyan glow scaling (0.88x balanced brightness)
  col=mix(col, vec3(0.60, 0.30, 0.98), 0.35) * 0.88;
  
  // Smooth, balanced opacity curve (max alpha 0.58)
  float alpha=clamp(t * 1.8, 0.0, 0.58);
  gl_FragColor=vec4(col * alpha, alpha);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function makeProgram(gl: WebGLRenderingContext, vert: string, frag: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vert));
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  return p;
}

function makeFBO(gl: WebGLRenderingContext, w: number, h: number) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { tex, fb };
}

export default function CursorFluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isReducedMotion || isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Quad
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

    const trailProg = makeProgram(gl, VERT, TRAIL_FRAG);
    const dispProg = makeProgram(gl, VERT, DISPLAY_FRAG);

    let W = Math.min(window.innerWidth, 1920);
    let H = Math.min(window.innerHeight, 1080);
    canvas.width = W;
    canvas.height = H;

    let fbo0 = makeFBO(gl, W, H);
    let fbo1 = makeFBO(gl, W, H);

    const mouse = { x: -9999, y: -9999, active: false };
    let startTime = performance.now();
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = H - e.clientY;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = H - e.touches[0].clientY;
        mouse.active = true;
      }
    };
    const onTouchEnd = () => { mouse.active = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    function bindAttrib(prog: WebGLProgram) {
      const loc = gl!.getAttribLocation(prog, 'a_position');
      gl!.enableVertexAttribArray(loc);
      gl!.vertexAttribPointer(loc, 2, gl!.FLOAT, false, 0, 0);
    }

    function render() {
      const t = (performance.now() - startTime) / 1000;
      const isMobile = Math.min(W, H) < 640;

      // Trail Pass
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo1.fb);
      gl!.viewport(0, 0, W, H);
      gl!.useProgram(trailProg);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, fbo0.tex);
      gl!.uniform1i(gl!.getUniformLocation(trailProg, 'u_prev'), 0);
      gl!.uniform2f(gl!.getUniformLocation(trailProg, 'u_resolution'), W, H);
      gl!.uniform2f(
        gl!.getUniformLocation(trailProg, 'u_point'),
        mouse.active ? mouse.x : -9999,
        mouse.active ? mouse.y : -9999
      );
      gl!.uniform1f(gl!.getUniformLocation(trailProg, 'u_radius'), isMobile ? 42.0 : 60.0);
      gl!.uniform1f(gl!.getUniformLocation(trailProg, 'u_strength'), mouse.active ? (isMobile ? 0.52 : 0.42) : 0.0);
      gl!.uniform1f(gl!.getUniformLocation(trailProg, 'u_decay'), 0.958);
      bindAttrib(trailProg);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      // Swap FBOs
      [fbo0, fbo1] = [fbo1, fbo0];

      // Display Pass
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, W, H);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(dispProg);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, fbo0.tex);
      gl!.uniform1i(gl!.getUniformLocation(dispProg, 'u_trail'), 0);
      gl!.uniform2f(gl!.getUniformLocation(dispProg, 'u_resolution'), W, H);
      gl!.uniform1f(gl!.getUniformLocation(dispProg, 'u_time'), t);
      bindAttrib(dispProg);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(render);
    }

    render();

    const onResize = () => {
      W = Math.min(window.innerWidth, 1920);
      H = Math.min(window.innerHeight, 1080);
      canvas.width = W;
      canvas.height = H;
      fbo0 = makeFBO(gl!, W, H);
      fbo1 = makeFBO(gl!, W, H);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchstart', onTouchMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
}
