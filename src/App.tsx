import React, { useState } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import CursorFluid from './components/WebGLFluidCanvas';
import { HeroSection } from './components/HeroSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { StatsSection } from './components/StatsSection';
import { ServicesSection } from './components/ServicesSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { QuickActionWidget } from './components/QuickActionWidget';
import { ContactModal } from './components/ContactModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { FooterSection } from './components/FooterSection';
import { GommageIntroPreloader } from './components/GommageIntroPreloader';
import { PageTransitionOverlay } from './components/PageTransitionOverlay';
import { ProjectItem } from './types';

export default function App() {
  useSmoothScroll();

  const [showIntro, setShowIntro] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <div className="bg-[#18122B] text-[#F8FAFC] font-['Kanit',sans-serif] min-h-screen overflow-x-clip selection:bg-[#A855F7] selection:text-white relative">
      {/*
        Barba.js-Style Page Transition Overlay
        Fixed above all content — driven imperatively by TransitionManager
      */}
      <PageTransitionOverlay />

      {/* 
        WebGPU / WebGL Gommage Intro Preloader ("SHAFI")
      */}
      {showIntro && (
        <GommageIntroPreloader onComplete={() => setShowIntro(false)} />
      )}

      {/* 
        WebGL Fluid Canvas — positioned strictly behind all site content (z-index: 0)
        with dimmed, subtle liquid trail tones.
      */}
      <CursorFluid />

      {/* Main Page Content Layer — positioned above the canvas (z-index: 10) */}
      <div className="relative z-10 bg-transparent">
        <HeroSection
          onOpenContact={() => setIsContactOpen(true)}
          isIntroComplete={!showIntro}
        />
        <MarqueeSection />
        <AboutSection onOpenContact={() => setIsContactOpen(true)} />
        <ShowcaseSection onOpenContact={() => setIsContactOpen(true)} />
        <StatsSection />
        <ServicesSection />
        <CertificationsSection />
        <ProjectsSection
          onOpenProjectModal={(project) => setSelectedProject(project)}
        />

        {/* Ultra-Premium 3D Footer Section */}
        <FooterSection onOpenContact={() => setIsContactOpen(true)} />
      </div>

      {/* Floating Action Pill & Toast Widget */}
      <QuickActionWidget />

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
