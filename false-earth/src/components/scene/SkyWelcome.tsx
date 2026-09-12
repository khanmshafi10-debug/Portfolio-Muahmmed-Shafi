/**
 * SkyWelcome — Holographic "WELCOME TO SHAFI WORLD" sign in the sky.
 * Uses drei's Html to place a DOM element at a specific 3D world position,
 * always facing the camera (billboard mode).
 *
 * Positioned at Y=20 directly ahead of the character spawn — visible
 * as soon as you look up or walk forward a little.
 */

import { Html } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

const CSS_ID = 'sky-welcome-css';
function ensureCSS() {
    if (document.getElementById(CSS_ID)) return;
    const el = document.createElement('style');
    el.id = CSS_ID;
    el.textContent = `
      @keyframes sw-float {
        0%,100% { transform: translateY(0px); }
        50%      { transform: translateY(-14px); }
      }
      @keyframes sw-shimmer {
        0%   { background-position: -300% center; }
        100% { background-position:  300% center; }
      }
      @keyframes sw-scan-line {
        0%   { opacity: 0; top: 0%; }
        10%  { opacity: 0.6; }
        90%  { opacity: 0.6; }
        100% { opacity: 0; top: 100%; }
      }
      @keyframes sw-pulse-glow {
        0%,100% { opacity: .85; }
        50%      { opacity: 1; }
      }
      @keyframes sw-appear {
        from { opacity:0; transform: translateY(-20px) scale(.94); }
        to   { opacity:1; transform: none; }
      }
      @keyframes sw-sub-appear {
        from { opacity:0; transform: translateY(10px); }
        to   { opacity:.75; transform: none; }
      }
      @keyframes sw-letter-glow {
        0%,100% { text-shadow: 0 0 18px #A855F7CC, 0 0 40px #A855F755, 0 0 80px #A855F722; }
        50%      { text-shadow: 0 0 28px #C084FCFF, 0 0 60px #A855F788, 0 0 120px #A855F733; }
      }
    `;
    document.head.appendChild(el);
}

export function SkyWelcome() {
    useEffect(() => { ensureCSS(); }, []);

    const wrapRef = useRef<HTMLDivElement>(null);

    // Gentle sinusoidal float driven by useFrame (smooth 60fps)
    useFrame(({ clock }) => {
        if (!wrapRef.current) return;
        const t = clock.elapsedTime;
        const y = Math.sin(t * 0.45) * 10;
        wrapRef.current.style.transform = `translateY(${y}px)`;
    });

    return (
        <Html
            center
            // High in the sky, directly ahead of character spawn
            position={[0, 20, -38]}
            // distanceFactor: element scales relative to camera distance
            // giving it a proper "in-world" size feel
            distanceFactor={22}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
            zIndexRange={[1, 2]}
        >
            <div ref={wrapRef} style={{
                textAlign: 'center',
                animation: 'sw-appear 1.8s cubic-bezier(.22,1,.36,1) both',
                position: 'relative',
            }}>
                {/* Scan-line effect overlay */}
                <div style={{
                    position: 'absolute', left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(168,85,247,.9), transparent)',
                    animation: 'sw-scan-line 4s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />

                {/* "WELCOME TO" — small eyebrow */}
                <div style={{
                    fontFamily: 'Cousine, monospace',
                    fontSize: '18px',
                    fontWeight: 700,
                    letterSpacing: '0.45em',
                    color: 'rgba(196,132,252,.8)',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    animation: 'sw-sub-appear 2s ease both 0.3s',
                }}>
                    WELCOME TO
                </div>

                {/* "SHAFI WORLD" — massive display headline */}
                <div style={{
                    fontFamily: 'Cousine, monospace',
                    fontSize: '80px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    lineHeight: 1,
                    animation: 'sw-letter-glow 3s ease-in-out infinite, sw-appear 1.8s cubic-bezier(.22,1,.36,1) both',
                    // Inline shimmer via background-clip IS safe here because
                    // Html elements are normal DOM — NOT inside WebGPU render pipeline.
                    background: 'linear-gradient(120deg, #e9d5ff 0%, #A855F7 25%, #fff 45%, #C084FC 65%, #818CF8 85%, #e9d5ff 100%)',
                    backgroundSize: '300% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animationName: 'sw-shimmer, sw-appear',
                    animationDuration: '5s, 1.8s',
                    animationTimingFunction: 'linear, cubic-bezier(.22,1,.36,1)',
                    animationIterationCount: 'infinite, 1',
                    animationDelay: '0s, 0s',
                }}>
                    SHAFI WORLD
                </div>

                {/* Subtitle */}
                <div style={{
                    fontFamily: 'Cousine, monospace',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.28em',
                    color: 'rgba(148,163,184,.65)',
                    marginTop: '10px',
                    textTransform: 'uppercase',
                    animation: 'sw-sub-appear 2.5s ease both 0.8s',
                }}>
                    Software Engineer · WebGL · Cloud · Full-Stack
                </div>

                {/* Bottom glow line */}
                <div style={{
                    marginTop: '16px',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(168,85,247,.6), rgba(129,140,248,.6), transparent)',
                    animation: 'sw-pulse-glow 3s ease-in-out infinite',
                }} />
            </div>
        </Html>
    );
}
