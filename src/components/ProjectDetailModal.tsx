import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Sparkles, Box, CheckCircle2 } from 'lucide-react';
import { ProjectItem } from '../types';
import { ContactButton } from './ContactButton';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenContact,
}) => {
  // Lock body scroll when modal is active
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  const toolsList = ['Blender 4.2', 'Octane Render', 'Cinema 4D', 'After Effects', 'Spline 3D', 'Figma'];

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Container — overflow-hidden prevents scrollbar overlap on rounded corners */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 25 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] bg-[#251B3E] border border-[#94A3B8]/30 rounded-3xl text-[#F8FAFC] shadow-2xl z-10 overflow-hidden flex flex-col"
          >
            {/* Top Fixed Header Bar with Pinned Close Button */}
            <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 border-b border-[#94A3B8]/20 bg-[#251B3E]/95 backdrop-blur-md flex-shrink-0 z-20">
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                <span className="p-2 rounded-full bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] flex-shrink-0">
                  <Box className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <span className="text-xs uppercase tracking-widest text-[#94A3B8] font-semibold truncate">
                  Project {project.number} &bull; {project.category}
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#2F234B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#A855F7] transition-all cursor-pointer flex-shrink-0 shadow-md"
                aria-label="Close project modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Scrollable Body Area — isolated scrollbar inside modal content */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8 md:p-10 modal-scrollbar"
              data-lenis-prevent
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight hero-heading mb-3 leading-tight">
                {project.name}
              </h2>

              <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed mb-6 max-w-2xl">
                {project.description ||
                  'An immersive 3D digital experience crafted with precision geometry, custom dynamic lighting, and photorealistic motion textures designed to elevate brand perception.'}
              </p>

              {/* Tech Stack & Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-8">
                {(project.language ? [project.language, ...toolsList.slice(0, 5)] : toolsList).map((tool) => (
                  <div
                    key={tool}
                    className="flex items-center gap-2 p-3 bg-[#2F234B] border border-[#94A3B8]/20 rounded-xl text-xs sm:text-sm text-[#F8FAFC]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#A855F7] flex-shrink-0" />
                    <span className="font-medium truncate">{tool}</span>
                  </div>
                ))}
              </div>

              {/* Gallery Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="rounded-2xl overflow-hidden bg-[#2F234B] border border-[#94A3B8]/20 shadow-md">
                  <img
                    src={project.col1Image1}
                    alt={`${project.name} shot 1`}
                    className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="rounded-2xl overflow-hidden bg-[#2F234B] border border-[#94A3B8]/20 shadow-md">
                  <img
                    src={project.col1Image2}
                    alt={`${project.name} shot 2`}
                    className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="md:col-span-2 rounded-2xl overflow-hidden bg-[#2F234B] border border-[#94A3B8]/20 shadow-md">
                  <img
                    src={project.col2Image}
                    alt={`${project.name} main render`}
                    className="w-full h-56 sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#94A3B8]/20">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#94A3B8]">
                  <Sparkles className="w-4 h-4 text-[#A855F7]" />
                  <span>Interested in a similar 3D concept for your project?</span>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end">
                  {(project.homepage || project.html_url) && (
                    <a
                      href={project.homepage || project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E2E8F0]/15 border border-[#E2E8F0]/30 text-xs font-semibold text-[#E2E8F0] hover:bg-[#E2E8F0] hover:text-[#18122B] transition-colors"
                    >
                      <span>View Repository</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <ContactButton
                    onClick={() => {
                      onClose();
                      onOpenContact();
                    }}
                    label="Inquire Project"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

