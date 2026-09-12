import React, { useState } from 'react';
import { MATERIAL_SPECS } from '../data/mockData';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR, WireframeGlobe } from './SvgAssets';

export const MaterialScience: React.FC = () => {
  const [selectedMatId, setSelectedMatId] = useState(MATERIAL_SPECS[0].id);

  const activeMaterial =
    MATERIAL_SPECS.find((m) => m.id === selectedMatId) || MATERIAL_SPECS[0];

  return (
    <section className="relative z-10 w-full py-16 border-t border-gray-200 bg-white">
      <div
        className="mx-auto w-full flex flex-col gap-10"
        style={{ paddingInline: 'var(--pad-x)' }}
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <span className="font-jakarta text-[var(--micro)] font-semibold uppercase tracking-[0.2em] text-gray-400 block mb-2">
              Advanced Textile Research
            </span>
            <h2
              className="font-orbitron font-extrabold uppercase tracking-[0.08em] text-black"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
            >
              MATERIAL ARCHITECTURE
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-jakarta text-gray-500 uppercase tracking-widest">
            <WireframeGlobe className="w-5 h-5 text-black" />
            <span>ISO 9001 Hydro-Thermic Certified</span>
          </div>
        </div>

        {/* Material Selector & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Spec Selector Buttons (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {MATERIAL_SPECS.map((mat) => (
              <button
                key={mat.id}
                onClick={() => setSelectedMatId(mat.id)}
                className={`text-left p-4 border transition-all rounded cursor-pointer relative ${
                  selectedMatId === mat.id
                    ? 'border-black bg-black text-white shadow-md'
                    : 'border-gray-200 text-black hover:border-gray-400 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-jakarta text-[10px] font-semibold uppercase tracking-widest ${
                      selectedMatId === mat.id ? 'text-gray-300' : 'text-gray-400'
                    }`}
                  >
                    {mat.code}
                  </span>
                  <span
                    className={`font-orbitron text-xs font-bold ${
                      selectedMatId === mat.id ? 'text-white' : 'text-black'
                    }`}
                  >
                    {mat.waterproofRating}
                  </span>
                </div>
                <h3 className="font-orbitron font-bold text-sm tracking-wide mt-2">
                  {mat.name}
                </h3>
              </button>
            ))}
          </div>

          {/* Right: Active Material Details & Texture Macro Preview (8 cols) */}
          <div className="lg:col-span-8 relative border border-gray-200 p-6 md:p-8 bg-gray-50/60 rounded flex flex-col md:flex-row gap-8">
            <div className="absolute top-2 left-2 text-black">
              <CornerBracketTL />
            </div>
            <div className="absolute top-2 right-2 text-black">
              <CornerBracketTR />
            </div>
            <div className="absolute bottom-2 left-2 text-black">
              <CornerBracketBL />
            </div>
            <div className="absolute bottom-2 right-2 text-black">
              <CornerBracketBR />
            </div>

            {/* Micro Texture Visual */}
            <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded overflow-hidden relative border border-gray-200">
              <img
                src={activeMaterial.image}
                alt={activeMaterial.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-black/80 text-white font-jakarta text-[10px] uppercase tracking-widest px-2.5 py-1 rounded">
                Macro Textile Scan 800X
              </div>
            </div>

            {/* Spec Readout */}
            <div className="w-full md:w-1/2 flex flex-col justify-between gap-4">
              <div>
                <span className="font-jakarta text-[var(--micro)] font-semibold text-gray-400 uppercase tracking-widest">
                  SPECS CODE: {activeMaterial.code}
                </span>
                <h3 className="font-orbitron font-bold text-xl text-black tracking-wide mt-1">
                  {activeMaterial.name}
                </h3>
                <p className="font-jakarta text-xs text-gray-600 mt-3 leading-relaxed">
                  {activeMaterial.description}
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                <div>
                  <span className="text-[10px] font-jakarta text-gray-400 uppercase block">
                    Water Resistance
                  </span>
                  <span className="font-orbitron text-sm font-bold text-black">
                    {activeMaterial.waterproofRating}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-jakarta text-gray-400 uppercase block">
                    Breathability
                  </span>
                  <span className="font-orbitron text-sm font-bold text-black">
                    {activeMaterial.breathability}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-jakarta text-gray-400 uppercase block">
                    Fabric Density
                  </span>
                  <span className="font-orbitron text-sm font-bold text-black">
                    {activeMaterial.weight}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-jakarta text-gray-400 uppercase block">
                    Eco Certification
                  </span>
                  <span className="font-orbitron text-sm font-bold text-black">
                    100% Circular
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
