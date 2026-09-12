import React from 'react';
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { transitionManager } from '../lib/transitionManager';

interface FooterSectionProps {
  onOpenContact: () => void;
}

const navLinks = [
  { label: 'About', id: 'about' },
  { label: 'Capabilities', id: 'engineering-pillars' },
  { label: 'Services', id: 'services' },
  { label: 'Honors', id: 'certifications' },
  { label: 'Projects', id: 'projects' },
];

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenContact }) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  // Use Barba.js-style curtain transition for footer nav links
  const scrollToSection = (id: string) => transitionManager.navigateTo(id);

  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#100B1D] text-[#F8FAFC]">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:gap-12 md:px-10 md:py-16">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
              <Sparkles className="h-4 w-4" />
              Available for meaningful work
            </div>
            <h2 className="max-w-xl text-3xl font-black uppercase leading-[0.95] sm:text-5xl">Let&apos;s make the next thing count.</h2>
          </div>
          <button
            onClick={onOpenContact}
            className="inline-flex w-fit items-center gap-3 border border-[#C084FC] bg-[#A855F7] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_24px_rgba(168,85,247,0.25)] transition-colors hover:bg-[#9333EA] active:scale-95"
          >
            Start a conversation <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:grid-cols-2 sm:px-8 md:grid-cols-[1.4fr_0.8fr_0.8fr] md:gap-12 md:px-10 md:py-14">
        <div>
          <button onClick={scrollToTop} className="group flex items-center gap-3 text-left" aria-label="Back to top">
            <span className="grid h-9 w-9 place-items-center border border-[#A855F7]/50 bg-[#A855F7]/10 text-[#C084FC] transition-transform group-hover:-translate-y-0.5">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-lg font-extrabold uppercase tracking-wider text-white">Shafi</span>
              <span className="block text-[10px] uppercase tracking-wider text-[#94A3B8]">Software Engineer</span>
            </span>
          </button>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#94A3B8]">
            Building deliberate web products, immersive visual systems, and dependable cloud experiences.
          </p>
        </div>

        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Explore</p>
          <nav className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollToSection(link.id)} className="w-fit text-left text-xs font-medium uppercase tracking-wider text-[#CBD5E1] transition-colors hover:text-[#C084FC]">
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Connect</p>
          <div className="flex items-center gap-2">
            <button onClick={onOpenContact} className="grid h-10 w-10 place-items-center border border-white/10 bg-white/5 text-[#F8FAFC] transition-colors hover:border-[#C084FC] hover:text-[#C084FC]" aria-label="Contact Shafi" title="Contact">
              <Mail className="h-4 w-4" />
            </button>
            <a href="https://github.com/khanmshafi10-debug" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center border border-white/10 bg-white/5 text-[#F8FAFC] transition-colors hover:border-[#C084FC] hover:text-[#C084FC]" aria-label="GitHub profile" title="GitHub">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center border border-white/10 bg-white/5 text-[#F8FAFC] transition-colors hover:border-[#C084FC] hover:text-[#C084FC]" aria-label="LinkedIn profile" title="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 text-[10px] font-medium uppercase tracking-wider text-[#64748B] sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-10">
          <span>© {new Date().getFullYear()} Muhammad Shafi</span>
          <button onClick={scrollToTop} className="inline-flex w-fit items-center gap-2 text-[#CBD5E1] transition-colors hover:text-[#C084FC]" aria-label="Scroll to top">
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
