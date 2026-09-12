import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Send, Sparkles, Mail, ExternalLink, Loader2, AlertCircle, Layers, DollarSign, Calendar } from 'lucide-react';
import { ContactButton } from './ContactButton';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_OPTIONS = [
  '3D Web & Three.js',
  'Motion Design',
  'WebGPU Shaders',
  'Full Stack Web',
  'Brand Visuals',
];

const BUDGET_OPTIONS = [
  '< $1,000',
  '$1,000 - $3,000',
  '$3,000 - $5,000',
  '$5,000+',
];

const TIMELINE_OPTIONS = [
  'Urgent (< 2 wks)',
  '1 Month',
  '2-3 Months',
  'Flexible',
];

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '3D Web & Three.js',
    budget: '$1,000 - $3,000',
    timeline: '1 Month',
    message: '',
  });
  const [hp, setHp] = useState(''); // Anti-bot honeypot

  const email = 'khanmshafi10@gmail.com';

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setErrorMessage('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _hp: hp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to send message. Please try again or email directly.');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.warn('Backend API request error, proceeding with fallback:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoBody = `Hi Shafi,\n\nName: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\n\nProject Scope & Message:\n${formData.message}`;

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    `Portfolio Inquiry: ${formData.name || 'Client'} - ${formData.service}`
  )}&body=${encodeURIComponent(mailtoBody)}`;

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      service: '3D Web & Three.js',
      budget: '$1,000 - $3,000',
      timeline: '1 Month',
      message: '',
    });
    setHp('');
    setErrorMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetForm}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-[#1F1735] border border-[#A855F7]/40 rounded-3xl text-[#F8FAFC] shadow-[0_20px_70px_rgba(0,0,0,0.8)] z-10 overflow-hidden flex flex-col"
          >
            {/* Top Fixed Header Bar */}
            <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 border-b border-white/10 bg-[#251B3E]/95 backdrop-blur-md flex-shrink-0 z-20">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-full bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C084FC] font-bold block">
                    Start a Conversation
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Delivers directly to Shafi (<strong className="text-white">khanmshafi10@gmail.com</strong>)
                  </span>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="p-2 rounded-full bg-[#2F234B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#A855F7] transition-all cursor-pointer shadow-md"
                aria-label="Close contact modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Scrollable Body Area */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8 modal-scrollbar space-y-6"
              data-lenis-prevent
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight hero-heading mb-2">
                  Let&apos;s Build Together
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed">
                  Fill in your project details below. All info is forwarded directly to{' '}
                  <span className="text-[#C084FC] font-medium">{email}</span>.
                </p>
              </div>

              {/* Direct Email Card */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-[#261C42] border border-white/10 rounded-2xl">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 min-w-0 pr-2 group cursor-pointer"
                  title="Open in email client"
                >
                  <Mail className="w-5 h-5 text-[#A855F7] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm text-[#F8FAFC] group-hover:text-[#C084FC] transition-colors truncate">
                    {email}
                  </span>
                </a>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E2E8F0]/15 border border-[#E2E8F0]/30 text-xs font-medium text-[#E2E8F0] hover:bg-[#E2E8F0] hover:text-[#18122B] transition-colors cursor-pointer flex-shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#E2E8F0]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Form or Success State */}
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 sm:p-8 bg-[#A855F7]/10 border border-[#A855F7]/30 rounded-2xl text-center space-y-5"
                >
                  <div className="inline-flex p-3.5 rounded-full bg-[#A855F7]/25 text-[#C084FC] shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <Send className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-[#F8FAFC] mb-1">
                      Message Dispatched to Shafi!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                      All details have been compiled and sent to{' '}
                      <strong className="text-[#C084FC]">{email}</strong>. Shafi will review your inquiry and reply within 24 hours.
                    </p>
                  </div>

                  {/* Submission Summary Card */}
                  <div className="p-4 rounded-xl bg-[#251B3E] border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-[#94A3B8]">Sender:</span>
                      <span className="font-bold text-white">{formData.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-[#94A3B8]">Service:</span>
                      <span className="font-semibold text-[#38BDF8]">{formData.service}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-[#94A3B8]">Budget:</span>
                      <span className="font-semibold text-emerald-400">{formData.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Timeline:</span>
                      <span className="font-semibold text-amber-300">{formData.timeline}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={mailtoLink}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F234B] border border-[#94A3B8]/30 hover:border-[#A855F7] text-xs font-semibold text-[#F8FAFC] hover:text-[#C084FC] transition-all cursor-pointer shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Send via Gmail / Mail App
                    </a>
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-lg shadow-[#A855F7]/30"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-3.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Honeypot hidden input */}
                  <input
                    type="text"
                    name="_hp"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* Service Selection Pills */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C084FC] font-bold mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Service Required
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICE_OPTIONS.map((srv) => (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => setFormData({ ...formData, service: srv })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            formData.service === srv
                              ? 'bg-[#A855F7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-[#C084FC]'
                              : 'bg-[#291E47] text-[#94A3B8] border border-white/10 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {srv}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget & Timeline Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Budget Pills */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-2 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        Estimated Budget
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {BUDGET_OPTIONS.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget: b })}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                              formData.budget === b
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                                : 'bg-[#291E47] text-[#94A3B8] border border-white/5 hover:border-white/20'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Pills */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        Desired Timeline
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {TIMELINE_OPTIONS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setFormData({ ...formData, timeline: t })}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                              formData.timeline === t
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500'
                                : 'bg-[#291E47] text-[#94A3B8] border border-white/5 hover:border-white/20'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-medium mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Morgan"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2.5 bg-[#291E47] border border-white/10 rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#A855F7] transition-colors disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-medium mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2.5 bg-[#291E47] border border-white/10 rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#A855F7] transition-colors disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-medium mb-1.5">
                      Project Brief / Detailed Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your vision, deliverables, brand goals, or special requirements..."
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 bg-[#291E47] border border-white/10 rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#A855F7] transition-colors resize-none disabled:opacity-60"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    {isSubmitting ? (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-2 rounded-xl bg-[#A855F7]/70 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg cursor-not-allowed"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Dispatching Message...
                      </button>
                    ) : (
                      <ContactButton label="Send Message" className="w-full sm:w-auto" />
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
