import React, { useState } from 'react';
import { ArrowUpRight, Eye, Plus } from 'lucide-react';
import { CatalogItem } from '../types';
import { EXPANDED_CATALOG } from '../data/mockData';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR } from './SvgAssets';

interface ProductCatalogSectionProps {
  onAddToCart: (item: CatalogItem) => void;
  onQuickView: (item: CatalogItem) => void;
}

export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({
  onAddToCart,
  onQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Outerwear', 'Tech Tops', 'Bottoms', 'Modular Gear'];

  const filteredItems = selectedCategory === 'All'
    ? EXPANDED_CATALOG
    : EXPANDED_CATALOG.filter((item) => item.category === selectedCategory);

  return (
    <section className="relative z-10 w-full py-16 border-t border-gray-200 bg-white">
      <div
        className="mx-auto w-full flex flex-col gap-10"
        style={{ paddingInline: 'var(--pad-x)' }}
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
              <span className="font-jakarta text-[var(--micro)] font-semibold uppercase tracking-[0.2em] text-gray-400">
                2026 Collection Matrix
              </span>
            </div>
            <h2
              className="font-orbitron font-extrabold uppercase tracking-[0.08em] text-black"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
            >
              GARMENT CATALOGUE
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-jakarta font-semibold tracking-wider uppercase transition-all rounded cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-black hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between border border-gray-200 hover:border-black p-5 transition-all duration-300 bg-white"
            >
              {/* Corner brackets */}
              <div className="absolute top-1 left-1 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <CornerBracketTL />
              </div>
              <div className="absolute top-1 right-1 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <CornerBracketTR />
              </div>
              <div className="absolute bottom-1 left-1 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <CornerBracketBL />
              </div>
              <div className="absolute bottom-1 right-1 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <CornerBracketBR />
              </div>

              {/* Tag & Price Header */}
              <div className="flex items-center justify-between pb-3">
                <span className="font-jakarta text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  {item.tag}
                </span>
                <span className="font-orbitron font-bold text-sm text-black">
                  ${item.price}
                </span>
              </div>

              {/* Garment Image Container */}
              <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden flex items-center justify-center my-3 border border-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Hover Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => onQuickView(item)}
                    className="p-3 bg-white text-black hover:bg-black hover:text-white rounded-full transition-colors shadow-lg cursor-pointer"
                    title="Quick Inspect"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToCart(item)}
                    className="p-3 bg-black text-white hover:bg-gray-800 rounded-full transition-colors shadow-lg cursor-pointer"
                    title="Quick Add"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Garment Details & Action */}
              <div className="pt-2">
                <h3 className="font-orbitron font-bold text-sm tracking-wide text-black group-hover:underline">
                  {item.title}
                </h3>
                <p className="font-jakarta text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => onQuickView(item)}
                    className="font-jakarta text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                  >
                    <span>INSPECT SPECS</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onAddToCart(item)}
                    className="border border-black px-3 py-1 text-xs font-jakarta font-semibold uppercase tracking-wider hover:bg-black hover:text-white transition-colors cursor-pointer"
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
