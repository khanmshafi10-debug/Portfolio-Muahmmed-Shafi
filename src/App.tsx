import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactModal } from './components/ContactModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectItem } from './types';
import { ArrowUp, Sparkles } from 'lucide-react';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#0C0C0C] text-[#D7E2EA] font-['Kanit',sans-serif] min-h-screen overflow-x-clip selection:bg-purple-600 selection:text-white">
      {/* Main Sections in Required Order */}
      <HeroSection onOpenContact={() => setIsContactOpen(true)} />
      <MarqueeSection />
      <AboutSection onOpenContact={() => setIsContactOpen(true)} />
      <ServicesSection />
      <ProjectsSection
        onOpenProjectModal={(project) => setSelectedProject(project)}
      />

      {/* Footer */}
      <footer className="bg-[#0C0C0C] border-t border-[#D7E2EA]/10 py-12 px-6 md:px-10 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-purple-500/10 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="font-bold text-lg uppercase tracking-tight text-white block">
                JACK &bull; 3D CREATOR
              </span>
              <p className="text-xs text-[#D7E2EA]/60 font-light">
                &copy; {new Date().getFullYear()} All rights reserved. Crafted with passion &amp; precision.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-xs uppercase tracking-widest text-[#D7E2EA]/70 hover:text-white transition-colors"
            >
              Contact
            </button>
            <button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-[#181B22] border border-[#262A35] text-[#D7E2EA] hover:text-white hover:bg-purple-600 transition-all duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={() => setIsContactOpen(true)}
      />
    </div>
  );
}
