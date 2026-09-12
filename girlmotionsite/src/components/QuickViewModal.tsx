import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CatalogItem } from '../types';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR } from './SvgAssets';

interface QuickViewModalProps {
  item: CatalogItem | null;
  onClose: () => void;
  onAddToCart: (item: CatalogItem) => void;
  onOpenConfigurator?: (item: CatalogItem) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  item,
  onClose,
  onAddToCart,
  onOpenConfigurator,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');

  if (!item) return null;

  const images = item.galleryImages && item.galleryImages.length > 0
    ? item.galleryImages
    : [item.image || ''];

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white text-black border border-gray-200 shadow-2xl overflow-hidden rounded-md flex flex-col lg:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 text-black z-20">
          <CornerBracketTL />
        </div>
        <div className="absolute top-2 right-2 text-black z-20">
          <CornerBracketTR />
        </div>
        <div className="absolute bottom-2 left-2 text-black z-20">
          <CornerBracketBL />
        </div>
        <div className="absolute bottom-2 right-2 text-black z-20">
          <CornerBracketBR />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-white/80 hover:bg-black hover:text-white rounded-full transition-colors border border-gray-200 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Carousel */}
        <div className="w-full lg:w-1/2 bg-gray-50 relative flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-gray-200 min-h-[300px] lg:min-h-[480px]">
          <img
            src={images[selectedImageIdx]}
            alt={item.title}
            className="max-h-[380px] w-auto object-contain transition-all duration-300"
            referrerPolicy="no-referrer"
          />

          {images.length > 1 && (
            <div className="absolute inset-x-4 flex justify-between pointer-events-none">
              <button
                onClick={() =>
                  setSelectedImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                }
                className="pointer-events-auto p-2 bg-white/90 hover:bg-black hover:text-white border border-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setSelectedImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                }
                className="pointer-events-auto p-2 bg-white/90 hover:bg-black hover:text-white border border-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-12 h-12 border rounded overflow-hidden cursor-pointer ${
                    selectedImageIdx === idx ? 'border-black ring-1 ring-black' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Garment Details & Actions */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-jakarta text-[var(--micro)] font-semibold tracking-widest text-gray-400 uppercase">
                {item.tag}
              </span>
              <span className="font-orbitron font-bold text-xl text-black">
                ${item.price}
              </span>
            </div>

            <h2 className="font-orbitron font-bold text-xl lg:text-2xl text-black tracking-wide mt-2">
              {item.title}
            </h2>

            <p className="font-jakarta text-xs text-gray-600 mt-4 leading-relaxed">
              {item.description}
            </p>

            {/* Technical Specs */}
            {item.specs && (
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
                <div className="font-jakarta text-[var(--micro)] font-semibold uppercase tracking-wider text-gray-400">
                  Technical Architecture
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="p-2 border border-gray-100 rounded bg-gray-50/50">
                    <span className="text-[10px] text-gray-400 uppercase block font-jakarta">Material</span>
                    <span className="text-xs font-semibold text-black font-jakarta">{item.specs.material}</span>
                  </div>
                  <div className="p-2 border border-gray-100 rounded bg-gray-50/50">
                    <span className="text-[10px] text-gray-400 uppercase block font-jakarta">Water Resistance</span>
                    <span className="text-xs font-semibold text-black font-jakarta">{item.specs.waterResistance}</span>
                  </div>
                  <div className="p-2 border border-gray-100 rounded bg-gray-50/50">
                    <span className="text-[10px] text-gray-400 uppercase block font-jakarta">Weight</span>
                    <span className="text-xs font-semibold text-black font-jakarta">{item.specs.weight}</span>
                  </div>
                  <div className="p-2 border border-gray-100 rounded bg-gray-50/50">
                    <span className="text-[10px] text-gray-400 uppercase block font-jakarta">Recycled Content</span>
                    <span className="text-xs font-semibold text-black font-jakarta">{item.specs.recycledContent}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="mt-6">
              <label className="font-jakarta text-[var(--micro)] font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Select Sizing Metric
              </label>
              <div className="flex gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 text-xs font-bold font-orbitron rounded border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-black hover:border-gray-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => {
                onAddToCart(item);
                onClose();
              }}
              className="w-full bg-black text-white font-jakarta font-semibold uppercase tracking-[0.18em] text-xs py-3.5 px-6 rounded hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>ADD TO SHOPPING BAG — ${item.price}</span>
            </button>

            {onOpenConfigurator && (
              <button
                onClick={() => {
                  onClose();
                  onOpenConfigurator(item);
                }}
                className="w-full border border-gray-300 text-black hover:border-black font-jakarta font-semibold uppercase tracking-[0.18em] text-xs py-2.5 px-6 rounded transition-colors cursor-pointer text-center"
              >
                OPEN GARMENT CUSTOMIZER LAB
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
