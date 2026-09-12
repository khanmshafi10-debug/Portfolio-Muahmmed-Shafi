import React, { useState } from 'react';
import { Cpu, ShieldCheck, Thermometer, Wind, Zap } from 'lucide-react';
import { MATERIAL_SPECS } from '../data/fashionData';
import { MaterialSpec } from '../types';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR, WireframeGlobe } from './SvgAssets';

export const TechLabSection: React.FC = () => {
  const [activeSpec, setActiveSpec] = useState<MaterialSpec>(MATERIAL_SPECS[0]);

  return (
    <section id="tech-lab" className="relative z-10 w-full bg-white py-16 border-t border-gray-200">
      <div
        className="mx-auto w-full flex flex-col gap-10"
        style={{ paddingInline: 'var(--pad-x)' }}
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-gray-400 font-jakarta text-[var(--micro)] font-semibold uppercase tracking-[0.2em] mb-2">
              <CornerBracketTL className="w-3 h-3 text-black inline-block" />
              <span>TEXTILE ARCHITECTURE / TOKYO & BERLIN LABS</span>
            </div>
            <h2
              className="font-orbitron font-extrabold uppercase tracking-[0.08em] text-black"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.75rem)' }}
            >
              NANO-WEAVE TECH LAB
            </h2>
          </div>
          <div className="font-jakarta text-xs text-gray-500 max-w-md leading-relaxed">
            Every fiber is engineered at the molecular scale for extreme weather resistance, dynamic tensile strength, and 100% closed-loop circular recyclability.
          </div>
        </div>

        {/* Interactive Lab Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Spec Selector List (Left Col - 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
            {MATERIAL_SPECS.map((spec) => {
              const isActive = spec.id === activeSpec.id;
              return (
                <button
                  key={spec.id}
                  onClick={() => setActiveSpec(spec)}
                  className={`p-4 rounded-lg border text-left transition-all cursor-pointer flex flex-col gap-2 relative ${
                    isActive
                      ? 'border-black bg-black text-white shadow-md'
                      : 'border-gray-200 bg-white text-black hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-jakarta text-[10px] tracking-widest uppercase font-bold ${
                        isActive ? 'text-gray-300' : 'text-gray-400'
                      }`}
                    >
                      {spec.code}
                    </span>
                    {isActive && (
                      <span className="bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                        ACTIVE SPEC
                      </span>
                    )}
                  </div>
                  <div className="font-orbitron font-bold text-sm tracking-wide">
                    {spec.name}
                  </div>
                  <div
                    className={`font-jakarta text-xs ${
                      isActive ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {spec.composition}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Blueprint Detail & Visualizer (Right Col - 8 cols) */}
          <div className="lg:col-span-8 border border-gray-200 rounded-lg p-6 lg:p-8 bg-gray-50 flex flex-col justify-between relative overflow-hidden">
            {/* Corner Bracket SVGs */}
            <div className="absolute top-3 left-3 text-black">
              <CornerBracketTL />
            </div>
            <div className="absolute top-3 right-3 text-black">
              <CornerBracketTR />
            </div>
            <div className="absolute bottom-3 left-3 text-black">
              <CornerBracketBL />
            </div>
            <div className="absolute bottom-3 right-3 text-black">
              <CornerBracketBR />
            </div>

            {/* Spec Visual Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-6">
              {/* Image & Micro Texture */}
              <div className="relative aspect-[4/3] rounded-md overflow-hidden border border-gray-200 shadow-sm bg-white">
                <img
                  src={activeSpec.image}
                  alt={activeSpec.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 text-white">
                  <div>
                    <div className="font-orbitron font-bold text-sm tracking-wider">
                      {activeSpec.name}
                    </div>
                    <div className="font-jakarta text-[11px] text-gray-300">
                      High-Magnification Surface Scan
                    </div>
                  </div>
                </div>
              </div>

              {/* Readouts & Metrics */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                  <Cpu className="w-5 h-5 text-black" />
                  <div>
                    <span className="font-jakarta text-[10px] text-gray-400 uppercase tracking-widest block">
                      SPECIFICATION CODE
                    </span>
                    <span className="font-orbitron font-bold text-base text-black">
                      {activeSpec.code}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-semibold tracking-wider uppercase">
                      <ShieldCheck className="w-3.5 h-3.5 text-black" />
                      <span>Waterproof</span>
                    </div>
                    <div className="font-orbitron font-bold text-sm text-black mt-1">
                      {activeSpec.waterproofRating}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border border-gray-200">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-semibold tracking-wider uppercase">
                      <Wind className="w-3.5 h-3.5 text-black" />
                      <span>Breathability</span>
                    </div>
                    <div className="font-orbitron font-bold text-sm text-black mt-1">
                      {activeSpec.breathability}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border border-gray-200">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-semibold tracking-wider uppercase">
                      <Zap className="w-3.5 h-3.5 text-black" />
                      <span>Fabric Weight</span>
                    </div>
                    <div className="font-orbitron font-bold text-sm text-black mt-1">
                      {activeSpec.weight}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border border-gray-200">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-semibold tracking-wider uppercase">
                      <Thermometer className="w-3.5 h-3.5 text-black" />
                      <span>Thermal Mode</span>
                    </div>
                    <div className="font-orbitron font-bold text-sm text-black mt-1 truncate">
                      Dynamic Adaptive
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spec Narrative */}
            <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="font-jakarta text-xs text-gray-600 leading-relaxed max-w-xl">
                {activeSpec.description}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <WireframeGlobe className="text-black opacity-80" />
                <span className="font-orbitron text-[10px] font-bold text-black uppercase tracking-widest">
                  LAB ISO-9001 VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
