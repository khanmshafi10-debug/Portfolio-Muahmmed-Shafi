import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles } from 'lucide-react';
import { ContactButton } from './ContactButton';
import { Magnet } from './Magnet';
import { TypewriterHeading } from './TypewriterHeading';
import { transitionManager } from '../lib/transitionManager';

interface HeroSectionProps {
  onOpenContact: () => void;
  isIntroComplete?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenContact,
  isIntroComplete = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    // Barba.js-style cinematic curtain transition to section
    transitionManager.navigateTo(id);
  };

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Journey', id: 'journey', href: 'http://localhost:5173' },
    { label: 'Capabilities', id: 'engineering-pillars' },
    { label: 'Services', id: 'services' },
    { label: 'Honors', id: 'certifications' },
    { label: 'Projects', id: 'projects' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0.05, 0.2] }
    );

    navItems.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-transparent z-10 pb-16 md:pb-6">
      {/* Top Header Bar */}
      <motion.header
        initial={{ opacity: 0, y: -35 }}
        animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -35 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="sticky top-0 z-40 w-full px-3 sm:px-6 md:px-10 pt-3 sm:pt-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto rounded-2xl border border-white/10 bg-[#18122B]/70 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-4">
          {/* Mobile Brand Badge */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="p-1.5 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#A855F7]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm tracking-tight uppercase text-[#F8FAFC]">
              SHAFI
            </span>
          </div>

          {/* Desktop Nav Links (Laptop / Desktop View) */}
          <nav className="hidden lg:flex items-center justify-between w-full">
            {/* Left Brand Badge */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="p-2 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#A855F7] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-base tracking-wider uppercase text-[#F8FAFC] group-hover:text-[#A855F7] transition-colors">
                SHAFI
              </span>
            </div>

            {/* Center Floating Glassmorphism Pill Navigation */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/10 p-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.href ? window.open(item.href, '_blank') : scrollToSection(item.id)}
                  className={`rounded-lg px-3 py-2 text-[#94A3B8] font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer whitespace-nowrap ${activeSection === item.id ? 'bg-[#A855F7] text-white shadow-[0_5px_14px_rgba(168,85,247,0.32)]' : 'hover:bg-white/10 hover:text-[#F8FAFC]'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Contact CTA Button */}
            <button
              onClick={onOpenContact}
              className="rounded-lg border border-[#A855F7]/60 bg-[#A855F7] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_5px_16px_rgba(168,85,247,0.3)] transition-colors hover:bg-[#9333EA] cursor-pointer active:scale-95"
            >
              Get In Touch
            </button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-[#F8FAFC] hover:border-[#A855F7] transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-3 p-3 rounded-xl bg-[#18122B]/95 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl z-50 flex flex-col gap-1"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.href ? window.open(item.href, '_blank') : scrollToSection(item.id)}
                  className={`w-full text-left py-3 px-3 rounded-lg text-[#F8FAFC] font-medium uppercase tracking-wider text-xs transition-colors ${activeSection === item.id ? 'bg-[#A855F7] text-white' : 'hover:bg-white/10'}`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full text-center py-3.5 px-4 rounded-xl bg-[#A855F7] text-white font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform active:scale-95 mt-1"
              >
                Get In Touch
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* MOBILE HERO LAYOUT (< md): Seamless, Vertical Stack, 0 Collisions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="md:hidden flex flex-col items-center justify-center my-auto px-4 py-4 z-20 gap-3 text-center"
      >
        {/* Title */}
        <TypewriterHeading
          text="hi, i'm shafi"
          className="text-[11vw] sm:text-[13vw]"
          startTrigger={isIntroComplete}
        />

        {/* Avatar Image (Centered, No text overlap) */}
        <div className="w-[170px] xs:w-[200px] sm:w-[230px] my-1 max-w-[65vw]">
          <Magnet padding={80} strength={2}>
            <img
              src="/avatar.png"
              alt="Shafi 3D Creator Portrait"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto object-contain drop-shadow-[0_20px_45px_rgba(168,85,247,0.4)] select-none pointer-events-none block mx-auto"
            />
          </Magnet>
        </div>

        {/* Role Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/35 text-[#A855F7] text-[10px] font-semibold tracking-widest uppercase w-fit backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
          Software Engineer
        </div>

        {/* Subtitle Description */}
        <p className="text-[#94A3B8] font-light leading-relaxed text-xs max-w-xs mx-auto hyphens-none">
          Crafting <span className="text-[#F8FAFC] font-medium">high-performance web apps</span>, immersive <span className="text-[#38BDF8] font-medium">3D WebGL experiences</span> &amp; robust <span className="text-[#C084FC] font-medium">cloud data solutions</span>.
        </p>

        {/* Contact Me Button */}
        <div className="pt-1">
          <ContactButton onClick={onOpenContact} label="Contact Me" className="px-7 py-2.5 text-xs" />
        </div>
      </motion.div>

      {/* DESKTOP HERO LAYOUT (>= md): Full Agency Desktop Layout */}
      <div className="hidden md:flex flex-col justify-between flex-1 relative w-full">
        {/* Title Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={isIntroComplete ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="w-full flex justify-center items-center relative z-10 px-2 my-auto"
        >
          <TypewriterHeading
            text="hi, i'm shafi"
            className="text-[16vw] lg:text-[17.5vw]"
            startTrigger={isIntroComplete}
          />
        </motion.div>

        {/* 3D Avatar Image Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.93 }}
          animate={isIntroComplete ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 80, scale: 0.93 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 z-20 pointer-events-auto"
        >
          <Magnet padding={150} strength={3}>
            <div className="w-[clamp(280px,35vw,520px)] flex justify-center">
              <img
                src="/avatar.png"
                alt="Shafi 3D Creator Portrait"
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto object-contain drop-shadow-[0_25px_55px_rgba(168,85,247,0.45)] select-none pointer-events-none block"
              />
            </div>
          </Magnet>
        </motion.div>

        {/* Bottom Bar Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="relative z-30 w-full px-8 md:px-12 pb-6 flex items-end justify-between gap-4"
        >
          <div className="flex flex-col gap-3 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[10px] font-semibold tracking-widest uppercase w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
              Software Engineer
            </div>
            <p className="text-[#94A3B8] font-light leading-relaxed text-sm hyphens-none">
              Crafting <span className="text-[#F8FAFC] font-medium">high-performance web apps</span>, immersive <span className="text-[#38BDF8] font-medium">3D WebGL experiences</span> &amp; robust <span className="text-[#C084FC] font-medium">cloud data solutions</span>.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <ContactButton onClick={onOpenContact} label="Contact Me" className="px-6 py-2.5 text-xs sm:text-xs md:text-xs" />
              <button
                onClick={() => scrollToSection('projects')}
                className="px-5 py-2 rounded-full bg-[#251B3E]/80 border border-[#94A3B8]/25 text-[#E2E8F0] hover:text-white hover:border-[#A855F7] hover:bg-[#A855F7]/20 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md shadow-md"
              >
                View Projects &rarr;
              </button>
            </div>
          </div>

          {/* Right space kept clear to allow floating QuickActionWidget ([Resume PDF] [Copy Email]) zero collision */}
        </motion.div>
      </div>
    </section>
  );
};
