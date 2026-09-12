/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CatalogItem, DrawerType, ToastMessage } from './types';
import { ImageRevealBackground } from './components/ImageRevealBackground';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalogSection } from './components/ProductCatalogSection';
import { LookbookShowcase } from './components/LookbookShowcase';
import { MaterialScience } from './components/MaterialScience';
import { EditorialSection } from './components/EditorialSection';
import { Drawers } from './components/Drawers';
import { QuickViewModal } from './components/QuickViewModal';
import { GarmentConfiguratorModal } from './components/GarmentConfiguratorModal';
import { Toast } from './components/Toast';

export default function App() {
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);
  const [cart, setCart] = useState<CatalogItem[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modal state
  const [quickViewItem, setQuickViewItem] = useState<CatalogItem | null>(null);
  const [configuratorItem, setConfiguratorItem] = useState<CatalogItem | null>(null);

  const handleAddToCart = (item: CatalogItem) => {
    setCart((prev) => [...prev, item]);
    setToast({
      id: Date.now().toString(),
      text: `Added "${item.title}" to your shopping bag.`,
    });
  };

  const handleRemoveFromCart = (indexToRemove: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCheckout = () => {
    setCart([]);
    setOpenDrawer(null);
    setToast({
      id: Date.now().toString(),
      text: 'Order submitted successfully!',
    });
  };

  return (
    <div className="min-h-screen bg-white text-black font-jakarta flex flex-col justify-between relative overflow-x-hidden selection:bg-black selection:text-white">
      {/* Interactive Desktop Canvas Reveal Background */}
      <ImageRevealBackground />

      {/* Main Hero Viewport Composition */}
      <div className="min-h-screen flex flex-col justify-between relative">
        <Header
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          cartCount={cart.length}
        />

        <Hero setOpenDrawer={setOpenDrawer} />
      </div>

      {/* Expanded Site Sections */}
      <ProductCatalogSection
        onAddToCart={handleAddToCart}
        onQuickView={(item) => setQuickViewItem(item)}
      />

      <LookbookShowcase />

      <MaterialScience />

      <EditorialSection />

      {/* Footer */}
      <footer
        className="relative z-20 text-center border-t border-gray-200 bg-white select-none"
        style={{
          paddingInline: 'var(--pad-x)',
          paddingBlock: 'var(--pad-y)',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-orbitron font-extrabold text-lg text-black tracking-widest">
            LGPSM˚
          </div>
          <div
            className="text-gray-400 font-medium uppercase font-jakarta tracking-[0.15em]"
            style={{ fontSize: 'var(--micro)' }}
          >
            LGPSM © 2026 — FUTURE FORWARD FASHION
          </div>
          <div className="flex gap-4 font-jakarta text-xs text-gray-500 uppercase tracking-widest">
            <button
              onClick={() => setOpenDrawer('shop')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              SHOP
            </button>
            <button
              onClick={() => setOpenDrawer('collections')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              COLLECTIONS
            </button>
            <button
              onClick={() => setOpenDrawer('journal')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              JOURNAL
            </button>
          </div>
        </div>
      </footer>

      {/* Side Drawers */}
      <Drawers
        openDrawer={openDrawer}
        onClose={() => setOpenDrawer(null)}
        cart={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Garment Inspection Quick View Modal */}
      <QuickViewModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onAddToCart={handleAddToCart}
        onOpenConfigurator={(item) => setConfiguratorItem(item)}
      />

      {/* Garment Customizer Lab Modal */}
      <GarmentConfiguratorModal
        item={configuratorItem}
        onClose={() => setConfiguratorItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
