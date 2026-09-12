import React, { useRef, useState, useEffect } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 120,
  strength = 3,
  activeTransition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  inactiveTransition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

    if (isTouch) {
      // MOBILE MOTION: Ambient 3D floating + touch drag tracking
      let rafId: number;
      let startTime = performance.now();
      let touchPos = { x: 0, y: 0, active: false };

      const handleTouchMove = (e: TouchEvent) => {
        if (!ref.current || e.touches.length === 0) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.touches[0].clientX - centerX;
        const distanceY = e.touches[0].clientY - centerY;

        touchPos = {
          x: distanceX / (strength * 1.5),
          y: distanceY / (strength * 1.5),
          active: true,
        };
      };

      const handleTouchEnd = () => {
        touchPos.active = false;
      };

      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchstart', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);

      const animateMobile = () => {
        const t = (performance.now() - startTime) / 1000;
        // Ambient sine wave 3D floating & tilt rotation
        const floatY = Math.sin(t * 2.2) * 8;
        const tiltX = Math.cos(t * 1.8) * 6;
        const tiltY = Math.sin(t * 1.5) * 8;

        const offsetX = touchPos.active ? touchPos.x : 0;
        const offsetY = touchPos.active ? touchPos.y : 0;

        setTransformStyle(
          `translate3d(${offsetX}px, ${floatY + offsetY}px, 0px) rotateX(${tiltX - offsetY * 0.2}deg) rotateY(${tiltY + offsetX * 0.2}deg)`
        );

        rafId = requestAnimationFrame(animateMobile);
      };

      rafId = requestAnimationFrame(animateMobile);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchstart', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    } else {
      // DESKTOP MOUSE TRACKING
      const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.hypot(distanceX, distanceY);
        const threshold = Math.max(rect.width, rect.height) / 2 + padding;

        if (distance < threshold) {
          setIsHovered(true);
          const posX = distanceX / strength;
          const posY = distanceY / strength;
          const rotY = (distanceX / rect.width) * 14;
          const rotX = -(distanceY / rect.height) * 14;

          setTransformStyle(`translate3d(${posX}px, ${posY}px, 0px) rotateX(${rotX}deg) rotateY(${rotY}deg)`);
        } else {
          if (isHovered) {
            setIsHovered(false);
            setTransformStyle('translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)');
          }
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [padding, strength, isHovered]);

  return (
    <div
      ref={ref}
      className={`inline-block perspective-1000 ${className}`}
      style={{
        transform: transformStyle,
        transition: isHovered ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
