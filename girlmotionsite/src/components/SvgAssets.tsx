import React from 'react';

// Checkerboard grid SVG: viewBox 0 0 36 18, 4 rows of 3.8x3.8 black squares; even rows shifted by 2.25
export const CheckerboardGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  // 4 rows of 3.8x3.8 squares
  // Row 0: y=0, x = 0, 8, 16, 24, 32
  // Row 1: y=4.5, x = 2.25, 10.25, 18.25, 26.25, 34.25
  // Row 2: y=9, x = 0, 8, 16, 24, 32
  // Row 3: y=13.5, x = 2.25, 10.25, 18.25, 26.25, 34.25
  const size = 3.8;
  const row0123Y = [0, 4.5, 9, 13.5];
  
  return (
    <svg
      viewBox="0 0 36 18"
      className={`inline-block fill-current ${className}`}
      style={{ width: 'var(--checker-w)', height: 'var(--checker-h)' }}
      aria-hidden="true"
    >
      {row0123Y.map((y, rowIdx) => {
        const isShifted = rowIdx % 2 === 1;
        const xOffsets = isShifted
          ? [2.25, 10.25, 18.25, 26.25, 34.25]
          : [0, 8, 16, 24, 32];
        return xOffsets.map((x, i) => (
          <rect key={`${rowIdx}-${i}`} x={x} y={y} width={size} height={size} />
        ));
      })}
    </svg>
  );
};

// Wireframe globe SVG: viewBox 0 0 64 64, stroke 1.2
export const WireframeGlobe: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`fill-none stroke-current ${className}`}
      style={{ width: 'var(--globe)', height: 'var(--globe)' }}
      strokeWidth="1.2"
      aria-hidden="true"
    >
      {/* Outer Circle */}
      <circle cx="32" cy="32" r="28" />
      {/* Equator */}
      <line x1="4" y1="32" x2="60" y2="32" />
      {/* Horizontal Ellipses */}
      <ellipse cx="32" cy="32" rx="28" ry="14" />
      <ellipse cx="32" cy="32" rx="28" ry="7" />
      {/* Meridian Line */}
      <line x1="32" y1="4" x2="32" y2="60" />
      {/* Vertical Ellipses */}
      <ellipse cx="32" cy="32" rx="14" ry="28" />
      <ellipse cx="32" cy="32" rx="7" ry="28" />
    </svg>
  );
};

// Corner Brackets (viewBox 0 0 12 12, stroke 1.5, size var(--corner))
export const CornerBracketTL: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 12 12"
    className={`fill-none stroke-current ${className}`}
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M0 11.5V0.5H11.5" />
  </svg>
);

export const CornerBracketTR: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 12 12"
    className={`fill-none stroke-current ${className}`}
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M0.5 0.5H11.5V11.5" />
  </svg>
);

export const CornerBracketBL: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 12 12"
    className={`fill-none stroke-current ${className}`}
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M0 0.5V11.5H11.5" />
  </svg>
);

export const CornerBracketBR: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 12 12"
    className={`fill-none stroke-current ${className}`}
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M0.5 11.5H11.5V0.5" />
  </svg>
);
