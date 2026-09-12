import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FadeIn } from './FadeIn';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ShowcaseItem {
  id: number;
  code: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  src: string;
  alt: string;
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 1,
    code: '#01',
    category: '3D & WebGL Graphics',
    title: 'NEXUS 3D & Drone Control',
    description: 'Procedurally generated 3D traffic simulator & interactive drone mission planner built with WebGL & WASM.',
    tags: ['Three.js', 'WebGL', 'WASM', 'GLTF'],
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    alt: '3D WebGL Traffic & Drone Station',
  },
  {
    id: 2,
    code: '#02',
    category: 'Full-Stack Platforms',
    title: 'Luxe Estate & E-Commerce',
    description: 'Production-grade real estate rental platform & auto-parts store with JWT auth, booking & admin dashboard.',
    tags: ['Next.js 14', 'React', 'Node.js', 'MongoDB'],
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    alt: 'Luxe Estate Real Estate Platform',
  },
  {
    id: 3,
    code: '#03',
    category: 'Fintech & Enterprise APIs',
    title: 'Cashup Digital Wallet',
    description: 'Digital-wallet & payments architecture supporting transfers, bill pay, deposits & MPIN security workflow.',
    tags: ['ASP.NET Core 8', 'C#', 'EF Core', 'Docker'],
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    alt: 'Cashup Digital Wallet Architecture',
  },
  {
    id: 4,
    code: '#04',
    category: 'Cloud & Azure Data',
    title: 'Azure Data Engineering',
    description: 'Enterprise data pipelines, analytics & cloud infrastructure optimization as a Certified Azure Data Engineer.',
    tags: ['Azure Data Engineer', 'SQL', 'PySpark', 'ETL'],
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    alt: 'Azure Cloud Data Engineering',
  },
  {
    id: 5,
    code: '#05',
    category: 'Systems & WebAssembly',
    title: 'WASM C++ Engine Integration',
    description: 'Low-level C++ & WebAssembly traffic-light engine compiled directly for high-performance browser execution.',
    tags: ['WebAssembly', 'C++', 'NASM', 'WAT'],
    src: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop',
    alt: 'WASM C++ Engine Integration',
  },
  {
    id: 6,
    code: '#06',
    category: 'Enterprise Infrastructure',
    title: 'Cisco Multi-Site Network',
    description: 'Country-level enterprise network with VLAN segmentation, inter-VLAN routing & secure network services.',
    tags: ['Cisco Packet Tracer', 'VLAN', 'Routing', 'Security'],
    src: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop',
    alt: 'Cisco Enterprise Networking Infrastructure',
  },
];

interface ShowcaseSectionProps {
  onOpenContact?: () => void;
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({ onOpenContact }) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const touchStartX = useRef<number | null>(null);

  const handleNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % showcaseItems.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
  };

  const handleSelect = (index: number) => {
    setDirection(index > activeIdx ? 1 : -1);
    setActiveIdx(index);
  };

  // Auto advance carousel on mobile every 4s unless paused
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIdx((prev) => (prev + 1) % showcaseItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const slideVariants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 70 : -70,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(6px)',
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -70 : 70,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(6px)',
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    }),
  };

  return (
    <section
      id="engineering-pillars"
      className="bg-[#18122B] text-[#F8FAFC] py-20 sm:py-28 px-4 sm:px-6 md:px-10 relative overflow-hidden border-t border-[#94A3B8]/20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <FadeIn delay={0} y={20}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#A855F7] text-xs font-semibold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-4 h-4" />
              <span>Engineering Pillars &amp; Technical Capabilities</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} y={30}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight hero-heading mb-4">
              Specialized Expertise
            </h2>
          </FadeIn>

          <FadeIn delay={0.2} y={20}>
            <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] font-light leading-relaxed max-w-2xl">
              Tap or swipe through the dynamic cards below to inspect my software engineering specializations, 3D WebGL systems, and cloud infrastructure.
            </p>
          </FadeIn>
        </div>

        {/* Skiper 52 HoverExpand_001 Deck - Ultra Smooth & High-Motion */}
        <FadeIn delay={0.3} y={30}>
          <div className="w-full relative">
            {/* Desktop / Tablet Fluid Deck (md and up) */}
            <div className="hidden md:flex w-full items-center justify-center gap-3 h-[28rem] select-none">
              {showcaseItems.map((item, index) => {
                const isActive = activeIdx === index;
                return (
                  <motion.div
                    key={item.id}
                    className={cn(
                      'relative cursor-pointer overflow-hidden rounded-[32px] border transition-colors duration-300 flex-shrink-0 h-full',
                      isActive
                        ? 'border-[#A855F7] shadow-[0_0_35px_rgba(168,85,247,0.4)]'
                        : 'border-[#94A3B8]/20 opacity-75 hover:opacity-100 hover:border-[#94A3B8]/40'
                    )}
                    animate={{
                      flexGrow: isActive ? 3.5 : 0.8,
                      width: isActive ? '26rem' : '5.5rem',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 24,
                      mass: 0.8,
                    }}
                    onClick={() => setActiveIdx(index)}
                    onHoverStart={() => setActiveIdx(index)}
                  >
                    {/* Background Image with Scale Parallax */}
                    <motion.img
                      src={item.src}
                      alt={item.alt}
                      animate={{ scale: isActive ? 1.06 : 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute inset-0 size-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-t transition-opacity duration-400',
                        isActive
                          ? 'from-[#18122B] via-[#18122B]/75 to-transparent opacity-100'
                          : 'from-[#18122B]/95 via-[#18122B]/60 to-[#18122B]/40 opacity-90'
                      )}
                    />

                    {/* Top Code Badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                      <span className="px-3 py-1 rounded-full bg-[#18122B]/80 backdrop-blur-md border border-[#94A3B8]/30 text-xs font-mono text-[#E2E8F0] shadow-sm">
                        {item.code}
                      </span>

                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25 }}
                          className="px-3 py-1 rounded-full bg-[#A855F7]/25 backdrop-blur-md border border-[#A855F7]/50 text-[10px] uppercase font-bold tracking-widest text-[#F8FAFC]"
                        >
                          {item.category}
                        </motion.span>
                      )}
                    </div>

                    {/* Expanded Content View */}
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          key={`content-${item.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end z-10"
                        >
                          <span className="text-xs uppercase tracking-widest font-semibold text-[#A855F7] mb-1">
                            {item.category}
                          </span>
                          <h3 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-[#F8FAFC] mb-2 leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed mb-4 line-clamp-3">
                            {item.description}
                          </p>

                          {/* Tech Stack Pills */}
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded-lg bg-[#251B3E]/90 backdrop-blur-md border border-[#94A3B8]/30 text-xs font-medium text-[#E2E8F0] shadow-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Collapsed Vertical Title View */}
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center p-3 z-10 pointer-events-none">
                        <span className="text-xs uppercase font-medium tracking-widest text-[#94A3B8] rotate-90 whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile / Compact Screen High-Motion Animated Carousel View (sm and below) */}
            <div
              className="flex md:hidden flex-col gap-4 w-full pb-14 sm:pb-0"
              onTouchStart={() => setIsAutoPlaying(false)}
            >
              <div className="relative w-full min-h-[25rem] h-auto rounded-3xl overflow-hidden border border-[#A855F7]/60 shadow-[0_0_30px_rgba(168,85,247,0.35)] bg-[#251B3E]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`mobile-card-${showcaseItems[activeIdx].id}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onTouchStart={(e) => {
                      touchStartX.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                      if (touchStartX.current !== null) {
                        const diffX = e.changedTouches[0].clientX - touchStartX.current;
                        if (diffX > 40) handlePrev();
                        else if (diffX < -40) handleNext();
                        touchStartX.current = null;
                      }
                    }}
                    className="relative w-full min-h-[25rem] flex flex-col justify-between p-5 select-none overflow-hidden"
                  >
                    {/* Background Image with Parallax Entrance */}
                    <motion.img
                      src={showcaseItems[activeIdx].src}
                      alt={showcaseItems[activeIdx].alt}
                      initial={{ scale: 1.12 }}
                      animate={{ scale: 1.0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute inset-0 size-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18122B] via-[#18122B]/85 to-[#18122B]/35 pointer-events-none" />

                    {/* Top Row Badges with Downward Motion */}
                    <motion.div
                      initial={{ y: -15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.35 }}
                      className="relative z-10 flex items-center justify-between"
                    >
                      <span className="px-3 py-1 rounded-full bg-[#18122B]/85 backdrop-blur-md border border-[#94A3B8]/30 text-xs font-mono text-[#E2E8F0] shadow-md">
                        {showcaseItems[activeIdx].code}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#A855F7]/30 backdrop-blur-md border border-[#A855F7]/60 text-[10px] uppercase font-bold tracking-widest text-[#F8FAFC] shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                        {showcaseItems[activeIdx].category}
                      </span>
                    </motion.div>

                    {/* Bottom Info Content with Upward Stagger */}
                    <div className="relative z-10 flex flex-col pt-16">
                      <motion.span
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.35 }}
                        className="text-xs uppercase tracking-widest font-semibold text-[#A855F7] mb-1"
                      >
                        {showcaseItems[activeIdx].category}
                      </motion.span>

                      <motion.h3
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.35 }}
                        className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#F8FAFC] mb-2 leading-tight"
                      >
                        {showcaseItems[activeIdx].title}
                      </motion.h3>

                      <motion.p
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.35 }}
                        className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed mb-3"
                      >
                        {showcaseItems[activeIdx].description}
                      </motion.p>

                      {/* Tech Stack Pills Staggered Pop In */}
                      <motion.div
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.35 }}
                        className="flex flex-wrap gap-1.5"
                      >
                        {showcaseItems[activeIdx].tags.map((tag, tagIdx) => (
                          <motion.span
                            key={tag}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 + tagIdx * 0.05, duration: 0.25 }}
                            className="px-2.5 py-1 rounded-lg bg-[#251B3E]/95 backdrop-blur-md border border-[#94A3B8]/30 text-[10px] font-medium text-[#E2E8F0] shadow-sm"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls & Glowing Thumbnail Bar (Zero collision with floating widget) */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full bg-[#251B3E] border border-[#94A3B8]/30 text-[#F8FAFC] hover:bg-[#A855F7] hover:border-[#A855F7] active:scale-90 transition-all cursor-pointer flex-shrink-0 shadow-md"
                  aria-label="Previous capability"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex gap-1.5 overflow-x-auto py-1 no-scrollbar flex-1 justify-center">
                  {showcaseItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex-shrink-0',
                        activeIdx === idx
                          ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_18px_rgba(168,85,247,0.8)] border border-[#A855F7] scale-105'
                          : 'bg-[#251B3E] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#94A3B8]/20'
                      )}
                    >
                      {item.code}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full bg-[#251B3E] border border-[#94A3B8]/30 text-[#F8FAFC] hover:bg-[#A855F7] hover:border-[#A855F7] active:scale-90 transition-all cursor-pointer flex-shrink-0 shadow-md"
                  aria-label="Next capability"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

