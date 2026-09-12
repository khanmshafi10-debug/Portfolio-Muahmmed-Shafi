import React from 'react';
import { ChevronRight, ShoppingBag, Trash2, X } from 'lucide-react';
import { CatalogItem, CollectionItem, DrawerType, JournalItem } from '../types';

export const CATALOG_ITEMS: CatalogItem[] = [
  { id: '1', title: 'CYBER-TEX OVERCOAT', price: 850, tag: 'LIMITED EDITION' },
  { id: '2', title: 'GEO-MESH TECH HOODIE', price: 320, tag: 'NEW DROP' },
  { id: '3', title: 'ORBITAL TAPERED TROUSERS', price: 290, tag: 'IN STOCK' },
  { id: '4', title: 'MODULAR ALL-WEATHER VEST', price: 410, tag: 'PRE-ORDER' },
];

export const COLLECTION_ITEMS: CollectionItem[] = [
  {
    id: 's01',
    title: 'SERIES 01 — SYNTHETIC HORIZONS',
    subtitle: 'Season Lineup',
    description:
      'Ultra-durable weather-sealed fabrics with minimalist silhouette architecture.',
  },
  {
    id: 's02',
    title: 'SERIES 02 — KINETIC FORM',
    subtitle: 'Season Lineup',
    description:
      'Ergonomic streetwear designed for maximum mobility and temperature equilibrium.',
  },
  {
    id: 's03',
    title: 'SERIES 03 — MONOCHROME ZERO',
    subtitle: 'Season Lineup',
    description:
      'Pure black and white structural tailoring crafted from 100% recycled polymers.',
  },
];

export const JOURNAL_ITEMS: JournalItem[] = [
  {
    id: 'j01',
    date: 'AUG 2026',
    title: 'THE ARCHITECTURE OF NEXT-GEN TEXTILES',
    readTime: '4 MIN READ',
  },
  {
    id: 'j02',
    date: 'JUL 2026',
    title: 'CIRCULAR DESIGN IN HIGH-END APPAREL',
    readTime: '6 MIN READ',
  },
  {
    id: 'j03',
    date: 'JUN 2026',
    title: 'MINIMALISM AS A FUNCTIONAL STATEMENT',
    readTime: '3 MIN READ',
  },
];

interface DrawersProps {
  openDrawer: DrawerType;
  onClose: () => void;
  cart: CatalogItem[];
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (index: number) => void;
  onCheckout: () => void;
}

export const Drawers: React.FC<DrawersProps> = ({
  openDrawer,
  onClose,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
}) => {
  if (!openDrawer) return null;

  const getDrawerHeaderTitle = () => {
    switch (openDrawer) {
      case 'shop':
        return 'Catalog';
      case 'collections':
        return 'Archive 2026';
      case 'journal':
        return 'Editorial';
      case 'cart':
        return 'Shopping Bag';
      default:
        return '';
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="h-full w-full bg-white text-black border-l border-gray-200 shadow-2xl flex flex-col justify-between z-50 overflow-y-auto transition-transform duration-300"
        style={{
          maxWidth: 'var(--drawer-max)',
          padding: 'var(--drawer-pad)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="font-orbitron font-bold uppercase tracking-wider text-black text-lg">
            {getDrawerHeaderTitle()}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-60 transition-opacity cursor-pointer text-black"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 py-6 overflow-y-auto">
          {/* SHOP DRAWER */}
          {openDrawer === 'shop' && (
            <div className="flex flex-col gap-6">
              <div className="font-jakarta text-[var(--micro)] text-gray-400 tracking-widest uppercase">
                Featured Garments
              </div>
              <div className="flex flex-col gap-4">
                {CATALOG_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col p-3.5 border border-gray-200 rounded-md hover:border-black transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-jakarta text-[var(--micro)] text-gray-400 font-semibold tracking-wider uppercase">
                        {item.tag}
                      </span>
                      <span className="font-jakarta text-sm font-semibold text-black">
                        ${item.price}
                      </span>
                    </div>
                    <div className="font-orbitron font-semibold text-sm tracking-wide text-black mt-1">
                      {item.title}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => onAddToCart(item)}
                        className="border border-gray-300 hover:border-black hover:bg-black hover:text-white px-3 py-1 rounded text-xs font-semibold tracking-wider transition-all cursor-pointer"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COLLECTIONS DRAWER */}
          {openDrawer === 'collections' && (
            <div className="flex flex-col gap-6">
              <div className="font-jakarta text-[var(--micro)] text-gray-400 tracking-widest uppercase">
                Season Lineup
              </div>
              <div className="flex flex-col gap-5">
                {COLLECTION_ITEMS.map((series) => (
                  <div
                    key={series.id}
                    className="flex flex-col p-4 border border-gray-200 rounded-md"
                  >
                    <h3 className="font-orbitron font-bold text-sm tracking-wide text-black">
                      {series.title}
                    </h3>
                    <p className="font-jakarta text-xs text-gray-600 mt-2 leading-relaxed">
                      {series.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JOURNAL DRAWER */}
          {openDrawer === 'journal' && (
            <div className="flex flex-col gap-6">
              <div className="font-jakarta text-[var(--micro)] text-gray-400 tracking-widest uppercase">
                Latest Dispatches
              </div>
              <div className="flex flex-col gap-4">
                {JOURNAL_ITEMS.map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col p-4 border border-gray-200 rounded-md hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between font-jakarta text-[var(--micro)] text-gray-400 font-medium tracking-wider">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="font-orbitron font-semibold text-sm tracking-wide text-black mt-2 leading-snug">
                      {article.title}
                    </h3>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* CART DRAWER */}
          {openDrawer === 'cart' && (
            <div className="flex flex-col h-full justify-between">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 gap-3">
                  <ShoppingBag className="w-10 h-10 stroke-1 text-gray-300" />
                  <p className="font-jakarta text-sm">
                    Your shopping bag is empty.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between p-3.5 border border-gray-200 rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="font-orbitron font-semibold text-xs tracking-wide text-black">
                          {item.title}
                        </span>
                        <span className="font-jakarta text-xs text-gray-500 mt-0.5">
                          ${item.price}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(index)}
                        className="text-gray-400 hover:text-black p-1 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200 font-jakarta">
                    <span className="font-semibold text-xs tracking-wider uppercase text-gray-600">
                      Subtotal
                    </span>
                    <span className="font-orbitron font-bold text-base text-black">
                      ${cartTotal}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          {openDrawer === 'cart' && cart.length > 0 && (
            <button
              onClick={onCheckout}
              className="w-full bg-black text-white font-jakarta font-semibold uppercase tracking-[0.18em] text-xs py-3.5 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <span>CHECKOUT NOW</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div className="font-jakarta text-[var(--micro)] text-gray-400 tracking-widest text-center uppercase select-none">
            LGPSM © 2026 — FUTURE FORWARD FASHION
          </div>
        </div>
      </div>
    </div>
  );
};
