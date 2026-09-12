import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';
import { Instagram, Linkedin } from 'lucide-react';

// Official X (formerly Twitter) Icon SVG
const XIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`fill-current ${className}`}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialItem {
  id: string;
  name: string;
  handle: string;
  href: string;
  icon: React.ReactNode;
  brandGradient: string;
  glowShadow: string;
  borderGlow: string;
  badgeBg: string;
}

interface Glass3DSocialCardProps {
  social: SocialItem;
}

const Glass3DSocialCard: React.FC<Glass3DSocialCardProps> = ({ social }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  // Spring physics for buttery 3D tilt response
  const rotateX = useSpring(0, { stiffness: 300, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 20 });
  const scale = useSpring(1, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Calculate 3D tilt angles (±15 degrees max)
    const tiltX = (y - 0.5) * -28;
    const tiltY = (x - 0.5) * 28;

    rotateX.set(tiltX);
    rotateY.set(tiltY);
    setSpotlightPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.08);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    setSpotlightPos({ x: 50, y: 50 });
  };

  return (
    <div className="relative group perspective-1000">
      {/* 3D Holographic Ambient Neon Backlight Ring */}
      <div
        className={`absolute -inset-1.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r ${social.brandGradient} blur-xl -z-10`}
      />

      <motion.a
        ref={cardRef}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.name}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className={`relative flex items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#2D214F]/85 via-[#1E1738]/90 to-[#120D26]/95 backdrop-blur-2xl border border-white/20 hover:border-white/60 text-[#94A3B8] hover:text-white transition-all duration-300 ${social.glowShadow} cursor-pointer overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.65),inset_0_1px_2px_rgba(255,255,255,0.35)]`}
      >
        {/* Dynamic Specular Spotlight Glare Following Cursor */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(220px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255, 255, 255, 0.28), transparent 70%)`,
          }}
        />

        {/* Top Metallic Glass Mirror Highlight */}
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/25 via-white/8 to-transparent rounded-t-2xl pointer-events-none" />

        {/* Bottom Inner Bezel Reflection */}
        <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* 3D Floating Icon Chamber (Pops out in Z-space) */}
        <div
          className="relative z-10 flex items-center justify-center transition-transform duration-300"
          style={{ transform: isHovered ? 'translateZ(24px) scale(1.15)' : 'translateZ(0px)' }}
        >
          {social.icon}
        </div>

        {/* Ambient Brand Color Tint Overlay */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${social.brandGradient} pointer-events-none`}
        />
      </motion.a>

      {/* Floating 3D Tooltip Label Pill on Hover */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-top-11 transition-all duration-300 pointer-events-none z-30 whitespace-nowrap">
        <div className="px-3 py-1 rounded-full bg-[#18122B]/95 border border-white/20 text-[10px] font-mono font-bold uppercase tracking-wider text-[#F8FAFC] shadow-[0_10px_20px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${social.brandGradient}`} />
          <span>{social.name}</span>
        </div>
      </div>
    </div>
  );
};

export const SocialGlassButtons: React.FC<{ className?: string }> = ({ className = '' }) => {
  const socials: SocialItem[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@shafi',
      href: 'https://instagram.com/',
      icon: <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-[#F8FAFC] group-hover:text-[#FF758C] transition-colors" />,
      brandGradient: 'from-[#833AB4] via-[#FD1D1D] to-[#FCB045]',
      glowShadow: 'hover:shadow-[0_15px_35px_rgba(253,29,29,0.45)]',
      borderGlow: 'hover:border-[#FD1D1D]/80',
      badgeBg: 'bg-[#E1306C]',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'Muhammad Shafi',
      href: 'https://linkedin.com/',
      icon: <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors" />,
      brandGradient: 'from-[#0A66C2] via-[#0077B5] to-[#38BDF8]',
      glowShadow: 'hover:shadow-[0_15px_35px_rgba(10,102,194,0.45)]',
      borderGlow: 'hover:border-[#0A66C2]/80',
      badgeBg: 'bg-[#0A66C2]',
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      handle: '@shafi',
      href: 'https://x.com/',
      icon: <XIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#F8FAFC] group-hover:text-[#C084FC] transition-colors" />,
      brandGradient: 'from-[#FFFFFF] via-[#A855F7] to-[#7E22CE]',
      glowShadow: 'hover:shadow-[0_15px_35px_rgba(168,85,247,0.45)]',
      borderGlow: 'hover:border-[#A855F7]/80',
      badgeBg: 'bg-[#A855F7]',
    },
  ];

  return (
    <div className={`flex items-center gap-4 sm:gap-5 ${className}`}>
      {socials.map((social) => (
        <Glass3DSocialCard key={social.id} social={social} />
      ))}
    </div>
  );
};
