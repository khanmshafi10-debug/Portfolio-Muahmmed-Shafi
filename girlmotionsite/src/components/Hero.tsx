import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  CheckerboardGrid,
  CornerBracketBL,
  CornerBracketBR,
  CornerBracketTL,
  CornerBracketTR,
  WireframeGlobe,
} from './SvgAssets';
import { BG_IMAGE_1 } from './ImageRevealBackground';
import { DrawerType } from '../types';

interface HeroProps {
  setOpenDrawer: (drawer: DrawerType) => void;
}

export const Hero: React.FC<HeroProps> = ({ setOpenDrawer }) => {
  return (
    <section
      className="relative z-10 flex-1 flex flex-col justify-between w-full"
      style={{
        paddingInline: 'var(--pad-x)',
        paddingBlock: 'var(--main-py)',
      }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full gap-8 lg:gap-0 flex-1">
        {/* Left Block (Headline & CTA) */}
        <div className="flex flex-col items-start justify-center max-w-4xl my-auto">
          {/* Top-Left Corner Bracket */}
          <div className="mb-2 text-black">
            <CornerBracketTL />
          </div>

          {/* Headline */}
          <h1
            className="font-orbitron font-extrabold uppercase tracking-[0.08em] leading-[1.05] text-black select-none"
            style={{ fontSize: 'var(--headline)' }}
          >
            <div>FUTURE</div>
            <div>FORWARD</div>
            <div className="flex items-center flex-wrap">
              <span>FASHION</span>
              <CheckerboardGrid className="inline-block ml-3 md:ml-4 align-middle translate-y-[2px]" />
            </div>
          </h1>

          {/* Bottom-Left Corner Bracket */}
          <div className="mt-2 mb-6 text-black">
            <CornerBracketBL />
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setOpenDrawer('shop')}
            className="group inline-flex items-center border border-gray-400 rounded-md uppercase tracking-[0.18em] font-jakarta font-semibold text-black hover:bg-black hover:text-white hover:border-black transition-all duration-300 cursor-pointer"
            style={{
              paddingInline: 'var(--btn-px)',
              paddingBlock: 'var(--btn-py)',
              gap: 'var(--btn-gap)',
              fontSize: 'var(--body)',
            }}
          >
            <span>SHOP NOW</span>
            <ArrowUpRight
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              style={{ width: 'var(--icon)', height: 'var(--icon)' }}
            />
          </button>
        </div>

        {/* Right Lower Feature Block (Desktop bottom-aligned, Mobile self-start) */}
        <div
          className="relative flex flex-col justify-between self-start lg:self-end text-black"
          style={{
            minWidth: 'var(--feature-min)',
            padding: 'var(--feature-pad)',
          }}
        >
          {/* Four Corner Brackets at absolute corners */}
          <div className="absolute top-0 left-0 text-black">
            <CornerBracketTL />
          </div>
          <div className="absolute top-0 right-0 text-black">
            <CornerBracketTR />
          </div>
          <div className="absolute bottom-0 left-0 text-black">
            <CornerBracketBL />
          </div>
          <div className="absolute bottom-0 right-0 text-black">
            <CornerBracketBR />
          </div>

          {/* Globe & Tagline */}
          <div className="flex flex-col gap-4">
            <WireframeGlobe className="text-black" />
            <div
              className="font-jakarta font-semibold uppercase tracking-[0.18em] leading-snug text-black"
              style={{ fontSize: 'var(--body)' }}
            >
              <div>BEYOND TRENDS.</div>
              <div>BUILT FOR TOMORROW.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Static Background Image (Visible only below lg) */}
      <div className="mt-8 lg:hidden w-full overflow-hidden rounded-lg border border-gray-200 aspect-[4/5] sm:aspect-[16/9] relative z-10 shadow-sm">
        <img
          src={BG_IMAGE_1}
          alt="LGPSM Future Forward Fashion"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};
