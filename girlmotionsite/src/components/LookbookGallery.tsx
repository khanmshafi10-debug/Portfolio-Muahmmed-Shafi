import React, { useState } from 'react';
import { ArrowUpRight, Eye, Plus, SlidersHorizontal } from 'lucide-react';
import { CatalogItem } from '../types';
import { EXTENDED_CATALOG } from '../data/fashionData';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR } from './SvgAssets';

interface LookbookGalleryProps {
  onAddToCart: (item: CatalogItem) => void;
  onInspectItem: (item: CatalogItem) => void;
}

export const LookbookGallery: React.FC<LookbookGalleryProps> = ({
  onAddToCart,
  onInspectItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'OUTERWEAR', 'KINETIC', 'BOTTOMS', 'TAILORING'];

  const filteredItems =
    selectedCategory === 'ALL'
      ? EXTENDED_CATALOG
      : EXTENDED_CATALOG.filter((item) => item.category === selectedCategory);

  return (
    <section id="shop-section" className="relative z-10 w-full bg-white py-16 border-t border-gray-200">
      <div
        className="mx-auto w-full flex flex-col gap-10"
        style={{ paddingInline: 'var(--pad-x)' }}
      >
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-gray-400 font-jakarta text-[var(--micro)] font-semibold uppercase tracking-[0.2em] mb-2">
              <CornerBracketTL className="w-3 h-3 text-black inline-block" />
              <span>GARMENT CATALOG / ARCHIVE 2026</span>
            </div>
            <h2
              className="font-orbitron font-extrabold uppercase tracking-[0.08em] text-black"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.75rem)' }}
            >
              FUTURE FORM LOOKBOOK
            </h2>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-gray-400 text-xs font-jakarta tracking-wider uppercase mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-jakarta font-semibold tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white border border-black'
                    : 'bg-gray-50 text-black border border-gray-200 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lookbook Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-black transition-all duration-300 hover:shadow-lg"
            >
              {/* Image Container with Hover Zoom & Actions */}
              <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onInspectItem(item)}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                )}

                {/* Tag Badge */}
                <div className="absolute top-3 left-3 bg-black/90 text-white font-jakarta text-[10px] font-semibold tracking-widest px-2.5 py-1 uppercase rounded backdrop-blur-xs">
                  {item.tag}
                </div>

                {/* Corner Brackets on Hover */}
                <div className="absolute top-2 left-2 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <CornerBracketTL />
                </div>
                <div className="absolute top-2 right-2 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <CornerBracketTR />
                </div>
                <div className="absolute bottom-2 left-2 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <CornerBracketBL />
                </div>
                <div className="absolute bottom-2 right-2 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <CornerBracketBR />
                </div>

                {/* Hover Overlay Quick Actions */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectItem(item);
                    }}
                    className="bg-white text-black px-4 py-2 rounded font-jakarta text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 hover:bg-gray-100 transition-colors cursor-pointer shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="bg-black text-white px-4 py-2 rounded font-jakarta text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>

              {/* Garment Details & Footer */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4 border-t border-gray-100">
                <div>
                  <div className="flex items-center justify-between font-jakarta text-[var(--micro)] text-gray-400 font-semibold tracking-wider uppercase">
                    <span>{item.category}</span>
                    <span className="font-orbitron text-black font-bold text-sm">
                      ${item.price}
                    </span>
                  </div>

                  <h3 className="font-orbitron font-bold text-base tracking-wide text-black mt-1.5 group-hover:text-gray-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-jakarta text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Spec Highlights */}
                {item.specs && (
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-[11px] font-jakarta text-gray-600">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                        Hydro Rating
                      </span>
                      <span className="font-medium text-black">
                        {item.specs.waterResistance}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                        Material
                      </span>
                      <span className="font-medium text-black truncate block">
                        {item.specs.material}
                      </span>
                    </div>
                  </div>
                )}

                {/* Bottom CTA Button */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => onInspectItem(item)}
                    className="flex-1 py-2 px-3 border border-gray-300 hover:border-black rounded text-xs font-jakarta font-semibold tracking-wider uppercase text-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>DETAILS</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onAddToCart(item)}
                    className="py-2 px-4 bg-black text-white hover:bg-gray-800 rounded text-xs font-jakarta font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
