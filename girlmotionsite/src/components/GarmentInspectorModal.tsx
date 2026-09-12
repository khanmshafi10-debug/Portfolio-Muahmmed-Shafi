import React, { useState } from 'react';
import { ArrowUpRight, Check, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { CatalogItem } from '../types';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR } from './SvgAssets';

interface GarmentInspectorModalProps {
  item: CatalogItem | null;
  onClose: () => void;
  onAddToCart: (item: CatalogItem) => void;
}

export const GarmentInspectorModal: React.FC<GarmentInspectorModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [added, setAdded] = useState<boolean>(false);

  if (!item) return null;

  const images = item.galleryImages && item.galleryImages.length > 0
    ? item.galleryImages
    : item.image ? [item.image] : [];

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAdd = () => {
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white text-black border border-gray-200 rounded-lg max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Four Corner Brackets */}
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

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-black transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Gallery View (Left) */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              {images[activeImageIndex] && (
                <img
                  src={images[activeImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                {item.tag}
              </div>
            </div>

            {/* Thumbnail Selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-2">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 rounded overflow-hidden border transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-black ring-2 ring-black/10'
                        : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Interactive Controls (Right) */}
          <div className="flex flex-col justify-between h-full gap-6">
            <div>
              <div className="flex items-center justify-between font-jakarta text-xs text-gray-400 font-semibold uppercase tracking-widest">
                <span>{item.category || 'FUTURE FASHION'}</span>
                <span className="font-orbitron font-bold text-xl text-black">
                  ${item.price}
                </span>
              </div>

              <h2 className="font-orbitron font-extrabold text-2xl text-black tracking-wide uppercase mt-2">
                {item.title}
              </h2>

              <p className="font-jakarta text-xs text-gray-600 mt-4 leading-relaxed">
                {item.description}
              </p>

              {/* Size Selector */}
              <div className="mt-6 flex flex-col gap-2">
                <span className="font-jakarta text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
                  SELECT SIZE
                </span>
                <div className="flex items-center gap-2">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-10 h-10 rounded font-orbitron text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-black text-white border border-black'
                          : 'bg-white text-black border border-gray-200 hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              {item.specs && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200 flex flex-col gap-2">
                  <div className="font-jakarta text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-black" />
                    <span>SPECIFICATION BREAKDOWN</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-jakarta text-gray-700 pt-1">
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase">
                        Material
                      </span>
                      <span className="font-semibold text-black">
                        {item.specs.material}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase">
                        Water Resistance
                      </span>
                      <span className="font-semibold text-black">
                        {item.specs.waterResistance}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase">
                        Weight
                      </span>
                      <span className="font-semibold text-black">
                        {item.specs.weight}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase">
                        Recycled Fiber
                      </span>
                      <span className="font-semibold text-black">
                        {item.specs.recycledContent}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleAdd}
                className="w-full bg-black text-white py-3.5 px-6 rounded-md font-jakarta font-semibold uppercase tracking-[0.18em] text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO BAG — ${item.price}</span>
                  </>
                )}
              </button>

              <div className="font-jakarta text-[10px] text-gray-400 tracking-wider text-center uppercase">
                FREE GLOBAL COMPLIMENTARY COURIER SHIPPING & 30-DAY RETURNS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
