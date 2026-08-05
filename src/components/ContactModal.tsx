import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Send, Sparkles, Mail, MessageSquare } from 'lucide-react';
import { ContactButton } from './ContactButton';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const email = 'hello@jack3d.design';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-[#121214] border border-[#22252A] rounded-3xl p-6 sm:p-8 md:p-10 text-[#D7E2EA] shadow-2xl z-10 overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#1C1F26] text-[#D7E2EA]/70 hover:text-white hover:bg-[#282C36] transition-colors"
              aria-label="Close contact modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/60 font-medium">
                Let&apos;s Work Together
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight hero-heading mb-4">
              Get In Touch
            </h2>

            <p className="text-sm sm:text-base text-[#D7E2EA]/80 font-light leading-relaxed mb-6">
              Have an exciting 3D design, motion project, or brand visual request? Drop me a message or copy my email directly.
            </p>

            {/* Email Copy Card */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 bg-[#181B22] border border-[#262A35] rounded-2xl mb-8">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-sm sm:text-base text-white">{email}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#252934] text-xs font-medium text-[#D7E2EA] hover:bg-purple-600 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Form or Success State */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-purple-900/20 border border-purple-500/30 rounded-2xl text-center"
              >
                <div className="inline-flex p-3 rounded-full bg-purple-500/20 text-purple-300 mb-3">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-1 text-white">Message Sent!</h3>
                <p className="text-xs sm:text-sm text-[#D7E2EA]/80">
                  Thanks for reaching out! Jack will get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D7E2EA]/60 font-medium mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-3 bg-[#181B22] border border-[#262A35] rounded-xl text-sm text-white placeholder-[#D7E2EA]/30 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D7E2EA]/60 font-medium mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 bg-[#181B22] border border-[#262A35] rounded-xl text-sm text-white placeholder-[#D7E2EA]/30 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D7E2EA]/60 font-medium mb-1.5">
                    Project Brief / Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project goals, scope, and timeline..."
                    className="w-full px-4 py-3 bg-[#181B22] border border-[#262A35] rounded-xl text-sm text-white placeholder-[#D7E2EA]/30 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <ContactButton label="Send Message" className="w-full sm:w-auto" />
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
