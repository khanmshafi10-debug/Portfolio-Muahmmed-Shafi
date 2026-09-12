import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import ReactLenis from "lenis/react";
import { cn } from "../lib/utils";
import { Sparkles } from "lucide-react";

export interface ServiceCardItem {
  id: string | number;
  number: string;
  name: string;
  category?: string;
  description: string;
  tags?: string[];
  imgUrl: string;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
];

const Skiper34 = () => {
  return (
    <ReactLenis root>
      <section className="relative flex w-screen flex-col items-center gap-[10vh] px-4 pt-[50vh] bg-[#18122B]">
        <div className="absolute left-1/2 top-24 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            scroll down to see effect
          </span>
        </div>
        {defaultImages.map((img, idx) => (
          <StickyCard_003 key={idx} index={idx} imgUrl={img} />
        ))}
      </section>
    </ReactLenis>
  );
};

interface StickyCard003Props {
  imgUrl: string;
  item?: ServiceCardItem;
  className?: string;
  index?: number;
  key?: string | number;
}

const StickyCard_003 = ({ imgUrl, item, className, index = 0 }: StickyCard003Props) => {
  const vertMargin = 10;
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track static, non-sticky layout wrapper to guarantee 100% linear scroll progress in BOTH forward & reverse scroll
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 80%", "end start"],
  });

  // Apply spring physics solver to absorb discrete scroll ticks and prevent reverse lag stutter
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.08,
    stiffness: 180,
    damping: 22,
    restDelta: 0.001,
  });

  // Smooth GPU-accelerated transforms
  const scale = useTransform(smoothProgress, [0, 0.55], [1, 0.85]);
  const rotate = useTransform(smoothProgress, [0, 0.55], [0, 7]);
  const imgScale = useTransform(smoothProgress, [0, 0.55], [1.05, 1.15]);

  const stickyTop = 10 + index * 1.5;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-5xl flex justify-center">
      <motion.div
        className={cn(
          "rounded-[28px] sm:rounded-[36px] sticky w-full max-w-5xl overflow-hidden bg-[#251B3E] border border-[#94A3B8]/35 shadow-[0_25px_65px_rgba(0,0,0,0.85)] will-change-transform transform-gpu",
          className
        )}
        style={{
          scale,
          rotate,
          height: `${100 - 2 * vertMargin}vh`,
          maxHeight: "620px",
          top: `${stickyTop}vh`,
          zIndex: index + 1,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* Card Canvas — 100% seamless fill with zero edge gaps or double-border artifacts */}
        <div className="relative h-full w-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#251B3E]">
          <motion.img
            src={imgUrl}
            alt={item?.name || imgUrl}
            style={{ scale: imgScale }}
            className="h-full w-full object-cover transform-gpu"
            sizes="(max-width: 768px) 95vw, 1200px"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";
            }}
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#18122B] via-[#18122B]/75 to-[#18122B]/30 pointer-events-none" />

          {/* Content Box */}
          <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-between z-10 select-none">
            {/* Top Header Row */}
            <div className="flex items-center justify-between gap-4">
              {item?.number && (
                <span className="font-black text-4xl sm:text-6xl text-[#F8FAFC]/90 tracking-tight">
                  {item.number}
                </span>
              )}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A855F7]/25 border border-[#A855F7]/40 text-[#F8FAFC] text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>{item?.category || "Specialized Service"}</span>
              </div>
            </div>

            {/* Bottom Info Row */}
            <div className="flex flex-col gap-3 max-w-3xl">
              {item?.name && (
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase text-[#F8FAFC] tracking-tight leading-tight hero-heading">
                  {item.name}
                </h3>
              )}

              {item?.description && (
                <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] font-light leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              )}

              {/* Tags Pills */}
              {item?.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-[#251B3E]/90 border border-[#94A3B8]/25 text-xs font-medium text-[#E2E8F0] backdrop-blur-md shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export { Skiper34, StickyCard_003 };


