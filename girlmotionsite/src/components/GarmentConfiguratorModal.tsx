import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { CatalogItem } from '../types';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR } from './SvgAssets';

interface GarmentConfiguratorModalProps {
  item: CatalogItem | null;
  onClose: () => void;
  onAddToCart: (item: CatalogItem) => void;
}

export const GarmentConfiguratorModal: React.FC<GarmentConfiguratorModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<'Zero White' | 'Onyx Black' | 'Lunar Grey'>('Zero White');
  const [selectedFit, setSelectedFit] = useState<'Architectural Oversized' | 'Sculpted Kinetic' | 'Regular Tapered'>('Architectural Oversized');
  const [selectedAccent, setSelectedAccent] = useState<'Stealth Matte' | 'Reflective Cyber Grid' | 'Tactical High-Vis'>('Stealth Matte');

  if (!item) return null;

  // Price adjustment based on customizations
  let priceDelta = 0;
  if (selectedColor === 'Onyx Black') priceDelta += 20;
  if (selectedColor === 'Lunar Grey') priceDelta += 35;
  if (selectedAccent === 'Reflective Cyber Grid') priceDelta += 45;
  if (selectedAccent === 'Tactical High-Vis') priceDelta += 30;

  const finalPrice = item.price + priceDelta;

  const handleCustomAddToCart = () => {
    const customItem: CatalogItem = {
      ...item,
      title: `${item.title} [${selectedColor} / ${selectedFit.split(' ')[0]}]`,
      price: finalPrice,
    };
    onAddToCart(customItem);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white text-black border border-gray-200 shadow-2xl overflow-hidden rounded-md flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
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

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <span className="font-jakarta text-[var(--micro)] font-semibold uppercase tracking-widest text-gray-400">
              Interactive Lab
            </span>
            <h2 className="font-orbitron font-extrabold text-xl text-black uppercase tracking-wide">
              GARMENT CONFIGURATOR
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black hover:text-white rounded-full transition-colors border border-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded">
            <div>
              <span className="font-jakarta text-xs text-gray-500 block uppercase">Base Garment</span>
              <span className="font-orbitron font-bold text-base text-black">{item.title}</span>
            </div>
            <div className="text-right">
              <span className="font-jakarta text-xs text-gray-500 block uppercase">Configured Price</span>
              <span className="font-orbitron font-bold text-lg text-black">${finalPrice}</span>
            </div>
          </div>

          {/* Colorway Selection */}
          <div>
            <label className="font-jakarta text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-3">
              1. Select Palette / Colorway
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Zero White', 'Onyx Black', 'Lunar Grey'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`p-3 border rounded text-left transition-all cursor-pointer ${
                    selectedColor === color
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-black hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold">{color}</span>
                    {selectedColor === color && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Silhouette & Fit */}
          <div>
            <label className="font-jakarta text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-3">
              2. Structural Fit Architecture
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(
                [
                  'Architectural Oversized',
                  'Sculpted Kinetic',
                  'Regular Tapered',
                ] as const
              ).map((fit) => (
                <button
                  key={fit}
                  onClick={() => setSelectedFit(fit)}
                  className={`p-3 border rounded text-left transition-all cursor-pointer ${
                    selectedFit === fit
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-black hover:border-gray-400'
                  }`}
                >
                  <span className="font-orbitron text-xs font-bold block">{fit}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tech Accents */}
          <div>
            <label className="font-jakarta text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-3">
              3. Tech Accents & Trim Finish
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(
                [
                  'Stealth Matte',
                  'Reflective Cyber Grid',
                  'Tactical High-Vis',
                ] as const
              ).map((accent) => (
                <button
                  key={accent}
                  onClick={() => setSelectedAccent(accent)}
                  className={`p-3 border rounded text-left transition-all cursor-pointer ${
                    selectedAccent === accent
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-black hover:border-gray-400'
                  }`}
                >
                  <span className="font-orbitron text-xs font-bold block">{accent}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white">
          <div className="font-jakarta text-xs text-gray-500">
            Estimated Production: <span className="font-semibold text-black">3 Days</span>
          </div>

          <button
            onClick={handleCustomAddToCart}
            className="bg-black text-white font-jakarta font-semibold uppercase tracking-[0.18em] text-xs py-3 px-6 rounded hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>CONFIRM SPEC & ADD — ${finalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
