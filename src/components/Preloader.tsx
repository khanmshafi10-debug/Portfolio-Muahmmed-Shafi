import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

interface PreloaderProps {
  onComplete: () => void;
  faceElementRef: React.RefObject<HTMLDivElement | null>;
  navElementRef: React.RefObject<HTMLElement | null>;
  headlineElementRef: React.RefObject<HTMLDivElement | null>;
  bottomElementRef: React.RefObject<HTMLDivElement | null>;
  onProgressUpdate: (progress: number) => void;
  isRepeatVisit: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  faceElementRef,
  navElementRef,
  headlineElementRef,
  bottomElementRef,
  onProgressUpdate,
  isRepeatVisit,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterValRef = useRef({ value: 0 });
  const [displayPercent, setDisplayPercent] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const loadingManagerRef = useRef<THREE.LoadingManager | null>(null);

  if (!loadingManagerRef.current) {
    loadingManagerRef.current = new THREE.LoadingManager();
  }

  useEffect(() => {
    // Disable body scroll while intro preloader is running
    document.body.style.overflow = 'hidden';

    // RETURN VISIT: Skip 1.5s intro sequence, play fast 300ms hero fade-in
    if (isRepeatVisit) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = '';
            setIsFinished(true);
            onComplete();
          },
        });

        if (overlayRef.current) {
          tl.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 0);
        }

        const elementsToFade = [];
        if (faceElementRef.current) elementsToFade.push(faceElementRef.current);
        if (headlineElementRef.current) elementsToFade.push(headlineElementRef.current);
        if (navElementRef.current) elementsToFade.push(navElementRef.current);
        if (bottomElementRef.current) elementsToFade.push(bottomElementRef.current);

        if (elementsToFade.length > 0) {
          tl.fromTo(
            elementsToFade,
            { opacity: 0, y: 0, scale: 1 },
            { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' },
            0
          );
        }
      });

      return () => {
        ctx.revert();
        document.body.style.overflow = '';
      };
    }

    // INITIAL LOAD: REAL ASSET TRACKING + CINEMATIC TIMELINE (~1.5s)
    const manager = loadingManagerRef.current;
    if (!manager) return;

    let targetProgress = 0;
    let hasTriggered = false;

    manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      if (itemsTotal > 0) {
        targetProgress = itemsLoaded / itemsTotal;
        animateCounter(targetProgress);
      }
    };

    manager.onLoad = () => {
      animateCounter(1.0, true);
    };

    // Pre-trigger image preload
    const avatarImg = new Image();
    avatarImg.src = '/avatar.png';
    avatarImg.onload = () => {
      if (targetProgress < 0.6) {
        targetProgress = 0.85;
        animateCounter(0.85);
      }
    };

    // Minimum display timer fallback (prevents flash on instant cache load)
    const fallbackTimer = setTimeout(() => {
      if (targetProgress < 1.0) {
        animateCounter(1.0, true);
      }
    }, 1100);

    function animateCounter(prog: number, triggerComplete = false) {
      const targetPercent = Math.min(Math.round(prog * 100), 100);

      gsap.to(counterValRef.current, {
        value: targetPercent,
        duration: 0.25,
        ease: 'power1.out',
        onUpdate: () => {
          const currentVal = Math.round(counterValRef.current.value);
          setDisplayPercent(currentVal);
          onProgressUpdate(currentVal / 100);

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${currentVal}%`;
          }
        },
        onComplete: () => {
          if ((targetPercent >= 100 || triggerComplete) && !hasTriggered) {
            hasTriggered = true;
            runCinematicZoomOutTimeline();
          }
        },
      });
    }

    // Heavy Cinematic Zoom-Out Timeline (~1.5s total)
    function runCinematicZoomOutTimeline() {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = '';
            setIsFinished(true);
            onComplete();
          },
        });

        // 1. Fade out progress line & counter UI
        if (counterRef.current) {
          tl.to(counterRef.current, { opacity: 0, duration: 0.2, ease: 'power2.out' }, 0);
        }

        // 2. PHASE 1: Face scales in from extreme close-up (2.8x) centered in viewport with unblur
        if (faceElementRef.current) {
          tl.fromTo(
            faceElementRef.current,
            {
              scale: 2.8 * 0.8,
              opacity: 0,
              filter: 'blur(8px)',
              y: 0,
            },
            {
              scale: 2.8,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.4,
              ease: 'power2.out',
            },
            0.1
          );

          // PHASE 2 (0.4s-1.1s): Heavy cinematic deceleration zoom OUT to final hero scale & position
          tl.to(
            faceElementRef.current,
            {
              scale: 1.0,
              y: 0,
              duration: 0.7,
              ease: 'power4.inOut',
            },
            '>-0.05'
          );
        }

        // 3. PHASE 3 (0.9s-1.5s Overlapping): Loader background wipes out, hero elements reveal with stagger
        if (overlayRef.current) {
          tl.to(
            overlayRef.current,
            { opacity: 0, duration: 0.35, ease: 'power2.out' },
            '-=0.3'
          );
        }

        const staggerTargets: Element[] = [];
        if (navElementRef.current) {
          const navChildren = Array.from(navElementRef.current.querySelectorAll('button, a'));
          staggerTargets.push(...(navChildren.length > 0 ? navChildren : [navElementRef.current]));
        }
        if (headlineElementRef.current) staggerTargets.push(headlineElementRef.current);
        if (bottomElementRef.current) staggerTargets.push(bottomElementRef.current);

        if (staggerTargets.length > 0) {
          tl.fromTo(
            staggerTargets,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.08 },
            '-=0.35'
          );
        }
      });
    }

    return () => {
      clearTimeout(fallbackTimer);
      document.body.style.overflow = '';
    };
  }, [isRepeatVisit]);

  if (isFinished) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-[#18122B] flex flex-col justify-between p-6 sm:p-10 pointer-events-none select-none will-change-[opacity,transform]"
    >
      {/* Top Header Branding */}
      <div className="flex justify-between items-center text-[#94A3B8] font-mono text-xs uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
          SYSTEM // INTRO REVEAL
        </span>
        <span>SHAFI &bull; CREATIVE DEV</span>
      </div>

      {/* Center Spacer */}
      <div className="flex-1" />

      {/* Bottom Progress UI: Thin Line + Monospace Percentage Counter */}
      {!isRepeatVisit && (
        <div ref={counterRef} className="w-full flex flex-col gap-3 font-mono">
          <div className="flex justify-between items-end text-xs uppercase tracking-widest text-[#94A3B8]">
            <span>LOADING ASSETS &amp; SHADERS</span>
            <span className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              {String(displayPercent).padStart(2, '0')}
              <span className="text-[#A855F7] ml-1">%</span>
            </span>
          </div>

          {/* Thin Animated Progress Line */}
          <div className="w-full h-[2px] bg-[#94A3B8]/20 rounded-full overflow-hidden relative">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#38BDF8] transition-all duration-150 ease-out rounded-full"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
