/**
 * TransitionManager — Barba.js-Inspired Cinematic Page Transition Engine
 *
 * Key design decision: elements are looked up by DOM ID on each call,
 * NOT cached via React refs + registerElements(). This avoids:
 *   - Vite HMR singleton re-creation (new singleton loses registered refs)
 *   - React StrictMode double-effect races
 *   - Any mount-order timing issues
 *
 * Transition flow (total ~1.1s):
 *   1. lenis.stop()            → user can't scroll
 *   2. Curtain slides IN       → right → center (0.5s, power3.inOut)
 *   3. DOM scroll teleport     → document.documentElement.scrollTop = Y
 *   4. lenis.start()           → Lenis re-syncs to new window.scrollY
 *   5. Curtain slides OUT      → center → left (0.5s, power3.inOut)
 *   6. Content stagger reveal  → headings + children animate in
 */

import gsap from 'gsap';
import type Lenis from 'lenis';

// ─── Element IDs (must match PageTransitionOverlay.tsx) ───────────────────────
const IDS = {
  curtain:  'barba-curtain',
  shimmer:  'barba-shimmer',
  label:    'barba-label',
  progress: 'barba-progress',
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type TransitionEvent = 'curtain:enter' | 'curtain:exit' | 'content:reveal' | 'transition:start' | 'transition:end';
type Listener = (sectionId?: string) => void;

// ─── Singleton ────────────────────────────────────────────────────────────────
class TransitionManager {
  private lenis: Lenis | null = null;
  private isAnimating = false;
  private listeners: Map<TransitionEvent, Set<Listener>> = new Map();

  private readonly labels: Record<string, string> = {
    about:                 'About',
    'engineering-pillars': 'Capabilities',
    services:              'Services',
    certifications:        'Honors',
    projects:              'Projects',
  };

  private readonly colors: Record<string, string> = {
    about:                 '#1e0a3c',
    'engineering-pillars': '#0a1a2e',
    services:              '#1a0a2e',
    certifications:        '#0e1a2e',
    projects:              '#18082e',
  };

  // ── Lazy DOM getters ─────────────────────────────────────────────────────
  // These look up elements fresh each call → immune to HMR / mount order
  private get curtain()  { return document.getElementById(IDS.curtain); }
  private get shimmer()  { return document.getElementById(IDS.shimmer); }
  private get label()    { return document.getElementById(IDS.label); }
  private get progress() { return document.getElementById(IDS.progress); }

  // ── Lenis registration ───────────────────────────────────────────────────
  public setLenis(instance: Lenis) { this.lenis = instance; }

  // ── Main navigation method ───────────────────────────────────────────────
  public async navigateTo(sectionId: string): Promise<void> {
    if (this.isAnimating) return;

    const targetEl = document.getElementById(sectionId);
    if (!targetEl) {
      console.warn(`[TransitionManager] Section #${sectionId} not found`);
      return;
    }

    const curtain  = this.curtain;
    const shimmer  = this.shimmer;
    const label    = this.label;
    const progress = this.progress;

    // If overlay isn't mounted yet, fall back to smooth scroll gracefully
    if (!curtain) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    this.isAnimating = true;
    this.emit('transition:start', sectionId);

    try {
      // ── 1. Stop Lenis (freeze user wheel / touch input) ──────────────────
      this.lenis?.stop();

      // ── 2. Prepare curtain ───────────────────────────────────────────────
      curtain.style.backgroundColor = this.colors[sectionId] ?? '#1a0a2e';
      if (label) label.textContent  = (this.labels[sectionId] ?? sectionId).toUpperCase();

      // Ensure curtain is ready (visibility + clip reset)
      gsap.set(curtain, { clipPath: 'inset(0 100% 0 0)', visibility: 'visible', pointerEvents: 'auto' });

      this.emit('curtain:enter', sectionId);

      // Progress bar fire-and-forget
      if (progress) {
        gsap.fromTo(progress,
          { scaleX: 0, opacity: 1 },
          { scaleX: 0.75, duration: 0.45, ease: 'power2.out', transformOrigin: 'left center' }
        );
      }

      // ── 3. Curtain IN: right → center ────────────────────────────────────
      await gsap.to(curtain, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.50,
        ease: 'power3.inOut',
        onStart: () => {
          if (shimmer) gsap.to(shimmer, { opacity: 1, duration: 0.22 });
        },
      });

      // ── 4. Scroll teleport (curtain fully covers screen) ─────────────────
      //
      // document.documentElement.scrollTop is a plain DOM write.
      // It bypasses Lenis completely and works in all browsers.
      // When Lenis restarts below, it reads window.scrollY and self-syncs.
      //
      const targetY = Math.round(targetEl.getBoundingClientRect().top + window.scrollY);
      document.documentElement.scrollTop = targetY;
      document.body.scrollTop = targetY; // fallback for Safari

      // Allow one frame for browser to apply the scroll
      await this.delay(32);

      // ── 5. Restart Lenis (picks up new window.scrollY automatically) ──────
      this.lenis?.start();

      // Complete progress bar
      if (progress) {
        gsap.to(progress, { scaleX: 1, duration: 0.16, ease: 'none', transformOrigin: 'left center' });
      }

      this.emit('curtain:exit', sectionId);

      // ── 6. Curtain OUT: center → left ────────────────────────────────────
      await gsap.to(curtain, {
        clipPath: 'inset(0 0% 0 100%)',
        duration: 0.50,
        ease: 'power3.inOut',
        onStart: () => {
          if (shimmer) gsap.to(shimmer, { opacity: 0, duration: 0.16 });
        },
        onComplete: () => {
          gsap.set(curtain, { clipPath: 'inset(0 100% 0 0)', visibility: 'hidden', pointerEvents: 'none' });
        },
      });

      // Progress bar reset
      if (progress) {
        gsap.to(progress, {
          opacity: 0, duration: 0.22, delay: 0.06,
          onComplete: () => gsap.set(progress, { scaleX: 0, opacity: 1, transformOrigin: 'left center' }),
        });
      }

      // ── 7. Content stagger reveal ─────────────────────────────────────────
      this.emit('content:reveal', sectionId);
      this.revealSection(targetEl);

    } catch (err) {
      // Always clean up so the page is never frozen
      console.warn('[TransitionManager] error:', err);
      if (curtain) {
        gsap.set(curtain, { clipPath: 'inset(0 100% 0 0)', visibility: 'hidden', pointerEvents: 'none' });
      }
      targetEl.scrollIntoView({ behavior: 'smooth' });

    } finally {
      this.lenis?.start(); // safe no-op if already started
      this.isAnimating = false;
      this.emit('transition:end', sectionId);
    }
  }

  // ── Stagger-animate section headings + top-level children ────────────────
  private revealSection(sectionEl: HTMLElement) {
    const headings = Array.from(sectionEl.querySelectorAll<HTMLElement>('h1, h2, h3'));
    if (headings.length) {
      gsap.fromTo(headings,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05, delay: 0.05 }
      );
    }
    const firstKids = Array.from(sectionEl.children).slice(0, 8);
    if (firstKids.length) {
      gsap.fromTo(firstKids,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.05, delay: 0.12 }
      );
    }
  }

  // ── Tiny event bus ───────────────────────────────────────────────────────
  public on(event: TransitionEvent, listener: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
    return () => this.listeners.get(event)?.delete(listener);
  }
  private emit(event: TransitionEvent, sectionId?: string) {
    this.listeners.get(event)?.forEach((fn) => fn(sectionId));
  }
  private delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }
}

export const transitionManager = new TransitionManager();
