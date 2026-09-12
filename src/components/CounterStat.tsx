import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface CounterStatProps {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}

export const CounterStat: React.FC<CounterStatProps> = ({
  end,
  prefix = '',
  suffix = '',
  label,
  decimals = 0,
}) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!numberRef.current || !containerRef.current) return;

      const obj = { val: 0 };

      gsap.to(obj, {
        val: end,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          if (numberRef.current) {
            const formatted = decimals > 0 ? obj.val.toFixed(decimals) : Math.floor(obj.val).toLocaleString();
            numberRef.current.innerText = `${prefix}${formatted}${suffix}`;
          }
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center p-6 bg-[#251B3E] border border-[#94A3B8]/20 rounded-3xl text-center shadow-lg">
      <span ref={numberRef} className="text-4xl sm:text-5xl md:text-6xl font-black text-[#F8FAFC] tracking-tight mb-2">
        {prefix}0{suffix}
      </span>
      <span className="text-xs sm:text-sm uppercase tracking-widest text-[#94A3B8] font-medium">
        {label}
      </span>
    </div>
  );
};
