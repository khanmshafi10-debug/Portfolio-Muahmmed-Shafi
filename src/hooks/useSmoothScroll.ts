import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { transitionManager } from '../lib/transitionManager';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    // 1. Initialize Lenis with agency-grade smooth scroll physics
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    // 1b. Hand Lenis to TransitionManager so it can pause/resume scroll
    //     during Barba.js-style curtain transitions
    transitionManager.setLenis(lenis);

    // 2. Sync Lenis scroll event to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Connect Lenis RAF to GSAP Ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    // 4. Enable smooth lag compensation (avoids stutter when reversing scroll direction)
    gsap.ticker.lagSmoothing(500, 33);

    // 5. Batch refresh triggers after render
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // 6. Cleanup on unmount
    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);
}

