import React, { useState } from 'react';
import { ArrowUpRight, Check, Send } from 'lucide-react';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR, WireframeGlobe } from './SvgAssets';

interface FooterSectionProps {
  onOpenDrawer: (drawer: 'shop' | 'collections' | 'journal') => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenDrawer }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative z-10 w-full bg-white text-black border-t border-gray-200 py-16">
      <div
        className="mx-auto w-full flex flex-col gap-12"
        style={{ paddingInline: 'var(--pad-x)' }}
      >
        {/* Top Newsletter & Brand Manifesto Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-200 items-start">
          {/* Brand Manifesto (Left 6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-black text-2xl tracking-[0.15em] text-black">
                LGPSM
              </span>
              <span className="font-orbitron text-xs font-normal text-black -mt-2">
                ˚
              </span>
            </div>
            <p className="font-jakarta text-xs text-gray-600 max-w-md leading-relaxed">
              Future Forward Fashion operates at the boundary of structural tailoring, hyper-durable polymers, and zero-waste circular production. Designed for the cities of tomorrow.
            </p>
            <div className="flex items-center gap-4 text-xs font-jakarta text-gray-400 uppercase tracking-widest pt-2">
              <span>TOKYO</span>
              <span>•</span>
              <span>PARIS</span>
              <span>•</span>
              <span>BERLIN</span>
              <span>•</span>
              <span>NEW YORK</span>
            </div>
          </div>

          {/* Newsletter Dispatch Form (Right 6 cols) */}
          <div className="lg:col-span-6 border border-gray-200 rounded-lg p-6 bg-gray-50 relative">
            <div className="absolute top-2 left-2 text-black">
              <CornerBracketTL />
            </div>
            <div className="absolute top-2 right-2 text-black">
              <CornerBracketTR />
            </div>

            <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black">
              JOIN THE FUTURE DISPATCH
            </h3>
            <p className="font-jakarta text-xs text-gray-500 mt-1 mb-4">
              Receive confidential drop alerts, early series access, and textile lab research.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL ADDRESS..."
                className="flex-1 bg-white border border-gray-300 rounded px-3.5 py-2.5 font-jakarta text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
                required
              />
              <button
                type="submit"
                className="bg-black text-white px-5 py-2.5 rounded font-jakarta text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>SUBSCRIBED</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Middle Navigation Links & Coordinates */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-jakarta text-xs">
          {/* Col 1 */}
          <div className="flex flex-col gap-3">
            <span className="font-orbitron font-bold text-black uppercase tracking-wider text-[11px]">
              COLLECTIONS
            </span>
            <button
              onClick={() => onOpenDrawer('shop')}
              className="text-gray-500 hover:text-black transition-colors text-left cursor-pointer"
            >
              SERIES 01 — SYNTHETIC
            </button>
            <button
              onClick={() => onOpenDrawer('shop')}
              className="text-gray-500 hover:text-black transition-colors text-left cursor-pointer"
            >
              SERIES 02 — KINETIC FORM
            </button>
            <button
              onClick={() => onOpenDrawer('shop')}
              className="text-gray-500 hover:text-black transition-colors text-left cursor-pointer"
            >
              SERIES 03 — MONOCHROME ZERO
            </button>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <span className="font-orbitron font-bold text-black uppercase tracking-wider text-[11px]">
              RESEARCH & LAB
            </span>
            <a
              href="#tech-lab"
              className="text-gray-500 hover:text-black transition-colors"
            >
              CYBER-MEMBRANE LAB
            </a>
            <a
              href="#tech-lab"
              className="text-gray-500 hover:text-black transition-colors"
            >
              CIRCULAR RECYCLING
            </a>
            <a
              href="#tech-lab"
              className="text-gray-500 hover:text-black transition-colors"
            >
              HYDROSTATIC TESTING
            </a>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-3">
            <span className="font-orbitron font-bold text-black uppercase tracking-wider text-[11px]">
              EDITORIAL
            </span>
            <button
              onClick={() => onOpenDrawer('journal')}
              className="text-gray-500 hover:text-black transition-colors text-left cursor-pointer"
            >
              DISPATCH ISSUE 04
            </button>
            <button
              onClick={() => onOpenDrawer('journal')}
              className="text-gray-500 hover:text-black transition-colors text-left cursor-pointer"
            >
              ARCHITECTURE OF TEXTILES
            </button>
            <button
              onClick={() => onOpenDrawer('journal')}
              className="text-gray-500 hover:text-black transition-colors text-left cursor-pointer"
            >
              MINIMALIST MANIFESTO
            </button>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-3">
            <span className="font-orbitron font-bold text-black uppercase tracking-wider text-[11px]">
              SYSTEM & LEGAL
            </span>
            <span className="text-gray-500">TERMS OF TRAVERSAL</span>
            <span className="text-gray-500">PRIVACY PROTOCOLS</span>
            <span className="text-gray-500">GLOBAL LOGISTICS</span>
          </div>
        </div>

        {/* Bottom System Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 font-jakarta text-[var(--micro)] text-gray-400 tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM ONLINE // LGPSM OS v4.2</span>
          </div>

          <div>LGPSM © 2026 — FUTURE FORWARD FASHION</div>

          <div className="flex items-center gap-1 text-black font-semibold">
            <WireframeGlobe className="w-3.5 h-3.5 text-black" />
            <span>GLOBAL STANDARDS ISO-14001</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
