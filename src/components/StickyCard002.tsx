"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import { useRef } from "react";

import { cn } from "../lib/utils";

export interface CardData {
  id: number | string;
  image: string;
  alt?: string;
  title?: string;
  category?: string;
  number?: string;
  description?: string;
  language?: string;
  homepage?: string;
  html_url?: string;
  col1Image1?: string;
  col1Image2?: string;
  col2Image?: string;
}

export interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
  onOpenProjectModal?: (project: any) => void;
}

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
  onOpenProjectModal,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const imageElements = imageRefs.current.filter(Boolean);
      const totalCards = imageElements.length;

      if (!imageElements[0] || totalCards === 0) return;

      gsap.set(imageElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const stickyCardsElement = container.current
        ? container.current.querySelector(".sticky-cards") || container.current
        : ".sticky-cards";

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stickyCardsElement,
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const position = i;
        if (!currentImage || !nextImage) continue;

        scrollTimeline.to(
          currentImage,
          {
            scale: 0.7,
            rotation: 5,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          nextImage,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === stickyCardsElement) {
            trigger.kill();
          }
        });
      };
    },
    { scope: container, dependencies: [cards] },
  );

  return (
    <div className={cn("relative h-full w-full", className)} ref={container}>
      <div className="sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden p-3 lg:p-8">
        <div
          className={cn(
            "relative h-[90%] w-full max-w-sm overflow-hidden rounded-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl",
            containerClassName,
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => onOpenProjectModal?.(card)}
            >
              <img
                src={card.image}
                alt={card.alt || card.title || ""}
                className={cn(
                  "rounded-4xl absolute h-full w-full object-cover",
                  imageClassName,
                )}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = "true";
                    const fallbacks = [
                      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
                    ];
                    target.src = fallbacks[i % fallbacks.length];
                  }
                }}
              />
              {card.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#18122B] via-[#18122B]/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                  {card.category && (
                    <span className="text-xs uppercase tracking-widest text-[#A855F7] font-semibold mb-1">
                      {card.category}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase text-white tracking-tight">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-xs sm:text-sm text-[#94A3B8] font-light mt-2 line-clamp-2">
                      {card.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage component with default data
const Skiper17 = () => {
  const defaultCards = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop",
      title: "Motionsiteboy 3D Portfolio",
      category: "3D & WebGL Systems",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      title: "NEXUS 3D Drone Control Station",
      category: "3D & WebGL Graphics",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop",
      title: "Luxe Estate Real Estate Platform",
      category: "Full-Stack Web",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
      title: "Cashup Digital Wallet Architecture",
      category: "Fintech & ASP.NET",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
      title: "Azure Synapse Data Engineering",
      category: "Cloud & Azure Data",
    },
  ];

  return (
    <ReactLenis root>
      <div className="h-full w-full">
        <StickyCard002 cards={defaultCards} />
      </div>
    </ReactLenis>
  );
};

export { Skiper17, StickyCard002 };

