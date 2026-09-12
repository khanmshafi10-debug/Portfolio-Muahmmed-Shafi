"use client";

import { motion } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";

import { cn } from "../lib/utils";

export interface CarouselImageItem {
  src: string;
  alt: string;
  id?: string | number;
  title?: string;
  category?: string;
  number?: string;
  description?: string;
  homepage?: string;
  html_url?: string;
  col1Image1?: string;
  col1Image2?: string;
  col2Image?: string;
  language?: string;
  onOpenProjectModal?: (project: any) => void;
}

const Skiper48 = () => {
  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop",
      alt: "Motionsiteboy 3D Portfolio",
      title: "Motionsiteboy 3D Portfolio",
      category: "3D & WebGL Systems",
    },
    {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      alt: "NEXUS 3D Drone Control Station",
      title: "NEXUS 3D Drone Control Station",
      category: "3D & WebGL Graphics",
    },
    {
      src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop",
      alt: "Luxe Estate Real Estate Platform",
      title: "Luxe Estate Real Estate Platform",
      category: "Full-Stack Web",
    },
    {
      src: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
      alt: "Cashup Digital Wallet Architecture",
      title: "Cashup Digital Wallet Architecture",
      category: "Fintech & ASP.NET",
    },
    {
      src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
      alt: "Azure Synapse Data Engineering",
      title: "Azure Synapse Data Engineering",
      category: "Cloud & Azure Data",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#18122B] py-10">
      <Carousel_002 images={defaultImages} loop showNavigation showPagination />
    </div>
  );
};

interface Carousel_002Props {
  images: CarouselImageItem[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
  onOpenProjectModal?: (project: any) => void;
}

const Carousel_002 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 40,
  onOpenProjectModal,
}: Carousel_002Props) => {
  const css = `
  .Carousal_002 {
    padding-bottom: 50px !important;
  }
  .swiper-3d {
    perspective: 1200px !important;
  }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.2,
      }}
      className={cn("relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 2500,
                disableOnInteraction: false,
              }
            : false
        }
        effect="cards"
        grabCursor={true}
        loop={loop}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="Carousal_002 h-[420px] sm:h-[480px] w-[300px] sm:w-[380px] md:w-[480px] lg:w-[560px]"
        modules={[EffectCards, Autoplay, Pagination, Navigation]}
      >
        {images.map((item, index) => (
          <SwiperSlide
            key={item.id || index}
            className="rounded-3xl border border-[#94A3B8]/30 bg-[#251B3E] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer group"
            onClick={() => onOpenProjectModal?.(item)}
          >
            <div className="relative h-full w-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
              <img
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={item.src || item.col2Image || item.col1Image1}
                alt={item.alt || item.title || ""}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = "true";
                    target.src = "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop";
                  } else {
                    target.style.display = "none";
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18122B] via-[#18122B]/60 to-[#18122B]/20 pointer-events-none" />

              {/* Top Row Badges */}
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                {item.number && (
                  <span className="font-black text-2xl sm:text-4xl text-[#F8FAFC]">
                    {item.number}
                  </span>
                )}
                {item.category && (
                  <span className="px-3 py-1 rounded-full bg-[#A855F7]/30 border border-[#A855F7]/50 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Bottom Row Details */}
              <div className="relative z-10 flex flex-col justify-end pt-20 pointer-events-none">
                <h3 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white mb-1.5 drop-shadow-md">
                  {item.title || item.alt}
                </h3>
                {item.description && (
                  <p className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed line-clamp-2 mb-3">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#A855F7] font-semibold pt-2 border-t border-[#94A3B8]/20">
                  <span>TAP CARD TO EXPLORE</span>
                  <span>VIEW DETAILS &rarr;</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {showNavigation && (
          <div>
            <div className="swiper-button-next after:hidden !w-10 !h-10 !rounded-full !bg-[#251B3E]/90 !border !border-[#94A3B8]/30 !text-white flex items-center justify-center hover:!bg-[#A855F7] hover:!border-[#A855F7] transition-all cursor-pointer shadow-lg">
              <ChevronRightIcon className="h-5 w-5 text-white" />
            </div>
            <div className="swiper-button-prev after:hidden !w-10 !h-10 !rounded-full !bg-[#251B3E]/90 !border !border-[#94A3B8]/30 !text-white flex items-center justify-center hover:!bg-[#A855F7] hover:!border-[#A855F7] transition-all cursor-pointer shadow-lg">
              <ChevronLeftIcon className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};

export { Carousel_002, Skiper48 };
