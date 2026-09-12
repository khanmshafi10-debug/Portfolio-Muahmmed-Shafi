import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { DrawerType } from '../types';

interface HeaderProps {
  openDrawer: DrawerType;
  setOpenDrawer: (drawer: DrawerType) => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ setOpenDrawer, cartCount }) => {
  return (
    <header
      className="relative z-20 flex items-center justify-between w-full"
      style={{
        paddingInline: 'var(--pad-x)',
        paddingTop: 'var(--header-pt)',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      {/* Logo (left) */}
      <button
        onClick={() => setOpenDrawer(null)}
        className="font-orbitron font-black text-black tracking-[0.15em] hover:opacity-80 transition-opacity cursor-pointer flex items-baseline select-none"
        style={{ fontSize: 'var(--logo)' }}
        aria-label="LGPSM Home"
      >
        <span>LGPSM</span>
        <span
          className="inline-block font-normal text-black -mt-0.5 ml-0.5 leading-none"
          style={{ fontSize: 'var(--logo-deg)' }}
        >
          ˚
        </span>
      </button>

      {/* Nav (right) */}
      <nav
        className="font-jakarta font-medium uppercase tracking-[0.2em] flex items-center"
        style={{
          fontSize: 'var(--nav)',
          gap: 'var(--gap-nav)',
        }}
      >
        <button
          onClick={() => setOpenDrawer('shop')}
          className="hover:opacity-50 transition-opacity cursor-pointer text-black"
        >
          SHOP
        </button>

        <button
          onClick={() => setOpenDrawer('collections')}
          className="hover:opacity-50 transition-opacity cursor-pointer text-black"
        >
          COLLECTIONS
        </button>

        <button
          onClick={() => setOpenDrawer('journal')}
          className="hover:opacity-50 transition-opacity cursor-pointer text-black"
        >
          JOURNAL
        </button>

        <span className="text-gray-300 font-light select-none">|</span>

        <button
          onClick={() => setOpenDrawer('cart')}
          className="relative hover:opacity-50 transition-opacity cursor-pointer text-black flex items-center justify-center"
          aria-label="Shopping Bag"
        >
          <ShoppingBag
            strokeWidth={1.5}
            style={{ width: 'var(--icon)', height: 'var(--icon)' }}
          />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};
