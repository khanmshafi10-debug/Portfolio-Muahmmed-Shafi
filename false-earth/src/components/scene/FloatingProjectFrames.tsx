/**
 * FloatingProjectFrames — 6 project screenshot frames floating in the 3D world.
 * Each frame is a drei Html element positioned at a unique world coordinate,
 * with a CSS float animation (different phase per frame) and a slight 3D tilt
 * using Html's `transform` prop which maps CSS rotation into scene space.
 *
 * Frames are scattered along the Z axis (ahead of character spawn at [0,0,0])
 * so the player "discovers" them as they walk forward.
 */

import { Html } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// ─── CSS injected once ────────────────────────────────────────────────────────

const CSS_ID = 'fpf-css';
function ensureCSS() {
    if (document.getElementById(CSS_ID)) return;
    const el = document.createElement('style');
    el.id = CSS_ID;
    el.textContent = `
      @keyframes fpf-float {
        0%,100% { transform: translateY(0px) rotate(var(--tilt,0deg)); }
        50%      { transform: translateY(-16px) rotate(var(--tilt,0deg)); }
      }
      @keyframes fpf-appear {
        from { opacity:0; transform: translateY(24px) scale(.9); }
        to   { opacity:1; transform: translateY(0) scale(1); }
      }
      @keyframes fpf-badge-glow {
        0%,100% { box-shadow: 0 0 8px var(--ac); }
        50%      { box-shadow: 0 0 16px var(--ac); }
      }
      .fpf-card:hover {
        transform: scale(1.06) !important;
        z-index: 10 !important;
      }
      .fpf-card:hover .fpf-overlay {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(el);
}

// ─── Project data ─────────────────────────────────────────────────────────────

interface ProjectFrame {
    id: string;
    title: string;
    category: string;
    image: string;
    accent: string;
    /** 3D world position [x, y, z] */
    position: [number, number, number];
    /** Euler rotation in radians [x, y, z] applied via Html transform */
    rotation: [number, number, number];
    /** CSS float animation phase offset (seconds) */
    phase: number;
    /** CSS tilt angle for the idle float */
    tilt: string;
}

const FRAMES: ProjectFrame[] = [
    {
        id: 'nexus',
        title: 'NEXUS 3D',
        category: '3D & WebGL Graphics',
        image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=640&q=85',
        accent: '#34D399',
        position: [-22, 5.5, -28],
        rotation: [0, 0.25, 0.04],
        phase: 0,
        tilt: '-2deg',
    },
    {
        id: 'luxe',
        title: 'LUXE ESTATE',
        category: 'Full-Stack Platform',
        image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=640&q=85',
        accent: '#A855F7',
        position: [24, 4.5, -42],
        rotation: [0, -0.28, -0.04],
        phase: 1.5,
        tilt: '2deg',
    },
    {
        id: 'cashup',
        title: 'CASHUP WALLET',
        category: 'Fintech & Enterprise API',
        image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=640&q=85',
        accent: '#38BDF8',
        position: [-18, 6, -58],
        rotation: [0.05, 0.22, 0.05],
        phase: 0.8,
        tilt: '-1.5deg',
    },
    {
        id: 'azure',
        title: 'AZURE DATA ENG.',
        category: 'Cloud & Data Pipelines',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop',
        accent: '#60A5FA',
        position: [20, 5, -72],
        rotation: [-0.04, -0.2, -0.04],
        phase: 2.2,
        tilt: '2.5deg',
    },
    {
        id: 'wasm',
        title: 'WASM C++ ENGINE',
        category: 'Systems & WebAssembly',
        image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=640&auto=format&fit=crop',
        accent: '#FBBF24',
        position: [-14, 6.5, -88],
        rotation: [0, 0.18, 0.03],
        phase: 1.0,
        tilt: '-1deg',
    },
    {
        id: 'cisco',
        title: 'CISCO NETWORK',
        category: 'Enterprise Infrastructure',
        image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=640&auto=format&fit=crop',
        accent: '#F472B6',
        position: [16, 5.5, -105],
        rotation: [0, -0.22, -0.03],
        phase: 3.0,
        tilt: '1.5deg',
    },
];

// ─── Single frame ─────────────────────────────────────────────────────────────

function Frame({ frame, index }: { frame: ProjectFrame; index: number }) {
    const floatRef = useRef<HTMLDivElement>(null);

    useFrame(({ clock }) => {
        if (!floatRef.current) return;
        const t = clock.elapsedTime + frame.phase;
        const y = Math.sin(t * 0.55) * 14;
        const r = Math.sin(t * 0.3) * 1.5;
        floatRef.current.style.transform = `translateY(${y}px) rotate(${r}deg)`;
    });

    const { accent: ac } = frame;

    return (
        <Html
            center
            transform
            position={frame.position}
            rotation={frame.rotation}
            distanceFactor={12}
            style={{ pointerEvents: 'all', userSelect: 'none' }}
            zIndexRange={[1, 2]}
            occlude={false}
        >
            <div ref={floatRef} style={{
                // Initial animation staggered by index
                animation: `fpf-appear 0.8s cubic-bezier(.22,1,.36,1) both ${index * 0.15 + 0.5}s`,
                willChange: 'transform',
            }}>
                <div
                    className="fpf-card"
                    style={{
                        width: '190px',
                        background: 'rgba(8,5,20,.9)',
                        backdropFilter: 'blur(18px)',
                        WebkitBackdropFilter: 'blur(18px)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: `1px solid ${ac}30`,
                        boxShadow: `0 16px 48px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.04), 0 0 28px ${ac}18`,
                        transition: 'transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease',
                        cursor: 'default',
                    }}
                >
                    {/* Image */}
                    <div style={{ position: 'relative', width: '190px', height: '108px', overflow: 'hidden' }}>
                        <img
                            src={frame.image}
                            alt={frame.title}
                            style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover', display: 'block',
                                filter: 'brightness(.85) saturate(1.1)',
                            }}
                            loading="lazy"
                            draggable={false}
                        />
                        {/* Image overlay: colored vignette */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: `linear-gradient(180deg, transparent 40%, rgba(8,5,20,.85) 100%)`,
                        }} />
                        {/* Accent corner badge */}
                        <div style={{
                            position: 'absolute', top: 8, right: 8,
                            width: 8, height: 8, borderRadius: '50%',
                            background: ac,
                            boxShadow: `0 0 10px ${ac}`,
                            animation: 'fpf-badge-glow 2s ease-in-out infinite',
                        }} />
                        {/* "fpf-overlay" — project name over image on hover */}
                        <div className="fpf-overlay" style={{
                            position: 'absolute', inset: 0,
                            background: `linear-gradient(135deg, ${ac}22, rgba(8,5,20,.7))`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: 'opacity .25s ease',
                        }}>
                            <span style={{
                                fontFamily: 'Cousine,monospace',
                                fontSize: '11px', fontWeight: 900,
                                letterSpacing: '0.15em', color: '#fff',
                                textTransform: 'uppercase',
                                textShadow: `0 0 12px ${ac}`,
                            }}>
                                {frame.category}
                            </span>
                        </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '10px 12px 12px' }}>
                        {/* Category eyebrow */}
                        <div style={{
                            fontFamily: 'Cousine,monospace', fontSize: '9px',
                            letterSpacing: '0.2em', color: ac, fontWeight: 700,
                            textTransform: 'uppercase', marginBottom: '4px',
                        }}>
                            {frame.category}
                        </div>

                        {/* Title */}
                        <div style={{
                            fontFamily: 'Cousine,monospace', fontSize: '15px',
                            fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.01em',
                            textShadow: `0 0 14px ${ac}60`,
                        }}>
                            {frame.title}
                        </div>

                        {/* Bottom accent line */}
                        <div style={{
                            marginTop: '8px', height: '1px',
                            background: `linear-gradient(90deg, ${ac}70, rgba(255,255,255,.04))`,
                        }} />
                    </div>
                </div>
            </div>
        </Html>
    );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function FloatingProjectFrames() {
    useEffect(() => { ensureCSS(); }, []);

    return (
        <>
            {FRAMES.map((f, i) => <Frame key={f.id} frame={f} index={i} />)}
        </>
    );
}
