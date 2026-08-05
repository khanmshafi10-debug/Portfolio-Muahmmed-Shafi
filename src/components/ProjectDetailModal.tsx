import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Sparkles, Layers, Box, CheckCircle2 } from 'lucide-react';
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
  if (!project) return null;

  const toolsList = ['Blender 4.2', 'Octane Render', 'Cinema 4D', 'After Effects', 'Spline 3D', 'Figma'];

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#121214] border border-[#22252A] rounded-3xl p-6 sm:p-8 md:p-10 text-[#D7E2EA] shadow-2xl z-10 overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#1C1F26] text-[#D7E2EA]/70 hover:text-white hover:bg-[#282C36] transition-colors z-20"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                <Box className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold">
                Project {project.number} &bull; {project.category} Showcase
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight hero-heading mb-4">
              {project.name}
            </h2>

            <p className="text-sm sm:text-base text-[#D7E2EA]/80 font-light leading-relaxed mb-8 max-w-2xl">
              An immersive 3D digital experience crafted with precision geometry, custom dynamic lighting, and photorealistic motion textures designed to elevate brand perception.
            </p>

            {/* Software & Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {toolsList.map((tool) => (
                <div
                  key={tool}
                  className="flex items-center gap-2 p-3 bg-[#181B22] border border-[#262A35] rounded-xl text-xs sm:text-sm text-[#D7E2EA]"
                >
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="font-medium">{tool}</span>
                </div>
              ))}
            </div>

            {/* Gallery Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl overflow-hidden bg-[#181B22] border border-[#262A35]">
                <img
                  src={project.col1Image1}
                  alt={`${project.name} shot 1`}
                  className="w-full h-56 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden bg-[#181B22] border border-[#262A35]">
                <img
                  src={project.col1Image2}
                  alt={`${project.name} shot 2`}
                  className="w-full h-56 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="md:col-span-2 rounded-2xl overflow-hidden bg-[#181B22] border border-[#262A35]">
                <img
                  src={project.col2Image}
                  alt={`${project.name} main render`}
                  className="w-full h-64 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#262A35]">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#D7E2EA]/60">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Interested in a similar 3D concept for your project?</span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <ContactButton
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  label="Inquire Project"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
