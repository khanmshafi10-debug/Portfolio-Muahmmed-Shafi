import React from 'react';

interface LiveProjectButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
  href?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  onClick,
  className = '',
  label = 'Live Project',
  href,
}) => {
  const content = (
    <span className="relative z-10 flex items-center gap-2">
      {label}
    </span>
  );

  const baseClasses = `inline-flex items-center justify-center rounded-full border border-sm sm:border-2 border-[#E2E8F0] text-[#E2E8F0] bg-transparent font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-[#E2E8F0] hover:border-[#E2E8F0] hover:text-[#18122B] hover:shadow-[0_0_20px_rgba(226,232,240,0.4)] hover:scale-105 active:scale-95 cursor-pointer px-3.5 py-1.5 sm:px-8 sm:py-3 text-[11px] sm:text-xs md:text-sm whitespace-nowrap flex-shrink-0 ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
};
