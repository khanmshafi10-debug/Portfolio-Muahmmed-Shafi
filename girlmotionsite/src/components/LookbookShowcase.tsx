import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { LOOKBOOK_GALLERY } from '../data/mockData';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR } from './SvgAssets';

export const LookbookShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const activeItem = LOOKBOOK_GALLERY[activeIdx];

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
              Visual Campaign Archives
            </span>
            <h2
              className="font-orbitron font-extrabold uppercase tracking-[0.08em] text-black"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
            >
              LOOKBOOK EXHIBITION
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-orbitron font-bold text-sm text-black">
              0{activeIdx + 1} / 0{LOOKBOOK_GALLERY.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() =>
                  setActiveIdx((prev) => (prev > 0 ? prev - 1 : LOOKBOOK_GALLERY.length - 1))
                }
                className="p-2 border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors rounded cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveIdx((prev) => (prev < LOOKBOOK_GALLERY.length - 1 ? prev + 1 : 0))
                }
                className="p-2 border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors rounded cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Featured Lookbook View */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center group">
          <img
            src={activeItem.image}
            alt={activeItem.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            referrerPolicy="no-referrer"
          />

          {/* Corner Brackets Overlay */}
          <div className="absolute top-4 left-4 text-black">
            <CornerBracketTL />
          </div>
          <div className="absolute top-4 right-4 text-black">
            <CornerBracketTR />
          </div>
          <div className="absolute bottom-4 left-4 text-black">
            <CornerBracketBL />
          </div>
          <div className="absolute bottom-4 right-4 text-black">
            <CornerBracketBR />
          </div>

          {/* Info Banner at bottom */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-jakarta text-[var(--micro)] uppercase tracking-widest text-gray-300 font-semibold block">
                {activeItem.category}
              </span>
              <h3 className="font-orbitron font-extrabold text-xl md:text-2xl tracking-wider uppercase mt-1">
                {activeItem.title}
              </h3>
              <p className="font-jakarta text-xs text-gray-200 mt-1">
                {activeItem.details}
              </p>
            </div>

            <button
              onClick={() => setLightboxImg(activeItem.image)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/40 hover:border-white bg-black/40 hover:bg-black text-white text-xs font-jakarta uppercase tracking-wider rounded transition-colors cursor-pointer self-start md:self-auto"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>EXPAND EXHIBIT</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {LOOKBOOK_GALLERY.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-[3/2] border rounded overflow-hidden text-left transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'border-black ring-2 ring-black opacity-100'
                  : 'border-gray-200 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30 p-2 flex flex-col justify-end text-white">
                <span className="font-orbitron text-[10px] font-bold tracking-wider uppercase line-clamp-1">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 p-3 bg-white text-black hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImg}
            alt="Expanded Lookbook"
            className="max-w-full max-h-[90vh] object-contain border border-gray-700"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </section>
  );
};
