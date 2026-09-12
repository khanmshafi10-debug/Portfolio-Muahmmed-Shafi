import React, { useEffect, useRef, useState } from 'react';

export const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85';

export const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_075145_1b557479-775b-43af-8270-f45d79d97d5a.png&w=1920&q=85';

export const ImageRevealBackground: React.FC = () => {
  const revealRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500,
  });
  const smoothRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500,
  });
  const gridOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [gridCellSize, setGridCellSize] = useState<number>(48);
  const [gridOffset, setGridOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    // Canvas for mask generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cell = Math.round(Math.min(64, Math.max(36, window.innerWidth * 0.028)));
      setGridCellSize(cell);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;

    const animate = () => {
      const mouse = mouseRef.current;
      const smooth = smoothRef.current;

      // Ease smoothed mouse position toward raw mouse with factor 0.1
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;

      // Spotlight radius (fluid): Math.round(Math.min(420, Math.max(160, window.innerWidth * 0.16)))
      const radius = Math.round(Math.min(420, Math.max(160, window.innerWidth * 0.16)));

      if (ctx && canvas.width > 0 && canvas.height > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const grad = ctx.createRadialGradient(
          smooth.x,
          smooth.y,
          0,
          smooth.x,
          smooth.y,
          radius
        );

        // Stops exact: 0 -> 1, 0.4 -> 1, 0.6 -> 0.75, 0.75 -> 0.4, 0.88 -> 0.12, 1 -> 0
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
        grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
        grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(smooth.x, smooth.y, radius, 0, Math.PI * 2);
        ctx.fill();

        const dataUrl = canvas.toDataURL();
        if (revealRef.current) {
          revealRef.current.style.maskImage = `url(${dataUrl})`;
          revealRef.current.style.webkitMaskImage = `url(${dataUrl})`;
          revealRef.current.style.maskSize = '100% 100%';
          revealRef.current.style.webkitMaskSize = '100% 100%';
        }
      }

      // Parallax Grid Easing: normalize smoothed cursor (-0.5 to 0.5)
      const cx = smooth.x / (window.innerWidth || 1) - 0.5;
      const cy = smooth.y / (window.innerHeight || 1) - 0.5;
      const targetGridX = cx * 16;
      const targetGridY = cy * 16;

      gridOffsetRef.current.x += (targetGridX - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (targetGridY - gridOffsetRef.current.y) * 0.06;

      setGridOffset({
        x: gridOffsetRef.current.x,
        y: gridOffsetRef.current.y,
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Base Layer: BG_IMAGE_1 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />

      {/* 2. Reveal Layer: BG_IMAGE_2 with canvas mask */}
      <div
        ref={revealRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG_IMAGE_2})` }}
      />

      {/* 3. Parallax SVG Grid Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        <defs>
          <pattern
            id="bg-grid-pattern"
            width={gridCellSize}
            height={gridCellSize}
            patternUnits="userSpaceOnUse"
            x={gridOffset.x}
            y={gridOffset.y}
          >
            <path
              d={`M ${gridCellSize} 0 L 0 0 0 ${gridCellSize}`}
              fill="none"
              stroke="#64748b"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid-pattern)" />
      </svg>
    </div>
  );
};
