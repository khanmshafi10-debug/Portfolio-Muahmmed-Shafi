/**
 * PageTransitionOverlay — Full-Screen Cinematic Curtain Overlay
 *
 * Each element carries a static id= that transitionManager.ts looks up
 * via document.getElementById() — no React refs or registerElements() needed.
 * This makes the overlay immune to HMR singleton re-creation.
 *
 * IDs (must match IDS object in transitionManager.ts):
 *   #barba-curtain   — main clip-path animated panel
 *   #barba-shimmer   — right-edge violet glow line
 *   #barba-label     — section name watermark text
 *   #barba-progress  — thin top progress bar
 */

import React from 'react';

export const PageTransitionOverlay: React.FC = () => (
  <>
    {/* ── Progress Bar ─────────────────────────────────────────────────── */}
    <div
      id="barba-progress"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2.5px',
        background: 'linear-gradient(90deg, #A855F7, #38BDF8, #C084FC)',
        zIndex: 99999,
        transformOrigin: 'left center',
        transform: 'scaleX(0)',
        pointerEvents: 'none',
        opacity: 1,
        willChange: 'transform',
      }}
    />

    {/* ── Main Curtain Panel ───────────────────────────────────────────── */}
    <div
      id="barba-curtain"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        backgroundColor: '#1a0a2e',
        clipPath: 'inset(0 100% 0 0)',
        visibility: 'hidden',
        pointerEvents: 'none',
        willChange: 'clip-path',
        overflow: 'hidden',
      }}
    >
      {/* Radial violet spotlight glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(168,85,247,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Subtle CRT scan-lines texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.013) 3px, rgba(255,255,255,0.013) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Section name watermark */}
      <div
        id="barba-label"
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Kanit', sans-serif",
          fontSize: 'clamp(2.5rem, 7vw, 6rem)',
          fontWeight: 900,
          letterSpacing: '0.4em',
          color: 'rgba(248,250,252,0.07)',
          textTransform: 'uppercase',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>

    {/* ── Shimmer Edge (right-side violet line while curtain is entering) ── */}
    <div
      id="barba-shimmer"
      style={{
        position: 'fixed',
        top: 0, right: 0,
        width: '3px',
        height: '100%',
        zIndex: 99991,
        background: 'linear-gradient(180deg, transparent 0%, #A855F7 30%, #C084FC 50%, #A855F7 70%, transparent 100%)',
        boxShadow: '0 0 22px 7px rgba(168,85,247,0.55), 0 0 60px 16px rgba(168,85,247,0.22)',
        opacity: 0,
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
    />
  </>
);
