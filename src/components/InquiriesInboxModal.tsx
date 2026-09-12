import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Sparkles, RefreshCw, Copy, Check, Clock, DollarSign, Calendar, MessageSquare, ShieldCheck, CheckCheck } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  timestamp: string;
  status?: string;
  cloudRelayStatus?: string;
}

interface InquiriesInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['All', '3D Web & Three.js', 'Motion Design', 'WebGPU Shaders', 'Full Stack Web', 'Brand Visuals'];

export const InquiriesInboxModal: React.FC<InquiriesInboxModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSummaryId, setCopiedSummaryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.warn('Could not fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInquiries();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopySummary = (item: ContactMessage) => {
    const summary = `Client: ${item.name} (${item.email})\nService: ${item.service || 'N/A'}\nBudget: ${item.budget || 'N/A'}\nTimeline: ${item.timeline || 'N/A'}\nDate: ${new Date(item.timestamp).toLocaleString()}\n\nMessage:\n${item.message}`;
    navigator.clipboard.writeText(summary);
    setCopiedSummaryId(item.id);
    setTimeout(() => setCopiedSummaryId(null), 2000);
  };

  const filtered = messages.filter((m) => {
    const q = searchTerm.toLowerCase();
    const matchesQuery =
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.service?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All' ||
      m.service?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesQuery && matchesCategory;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#19112E] border border-[#A855F7]/40 rounded-3xl text-[#F8FAFC] shadow-[0_25px_80px_rgba(0,0,0,0.85)] z-10 overflow-hidden flex flex-col"
          >
            {/* Top Fixed Header */}
            <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 border-b border-white/10 bg-[#251B3E]/95 backdrop-blur-md flex-shrink-0 z-20">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-full bg-[#A855F7]/20 text-[#C084FC] border border-[#A855F7]/40 shadow-[0_0_20px_rgba(168,85,247,0.35)]">
                  <Mail className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                      Client Inquiries Inbox
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#A855F7] text-[10px] font-bold text-white tracking-widest uppercase shadow-sm">
                      {messages.length} Total
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Inquiries received & routed to <strong className="text-[#C084FC]">khanmshafi10@gmail.com</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchInquiries}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-[#2F234B] text-[#94A3B8] hover:text-white hover:bg-[#A855F7]/40 transition-all cursor-pointer disabled:opacity-50"
                  title="Refresh messages"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C084FC]' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-[#2F234B] text-[#94A3B8] hover:text-white hover:bg-[#A855F7] transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="px-5 py-3 sm:px-8 bg-[#18122B] border-b border-white/5 space-y-2.5">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by client name, email, service, message..."
                className="w-full px-3.5 py-2 bg-[#251B3E] border border-white/10 rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#A855F7]"
              />

              {/* Category Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#A855F7] text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'bg-[#251B3E] text-[#94A3B8] hover:text-white hover:bg-[#2F234B]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Message List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 modal-scrollbar" data-lenis-prevent>
              {loading && messages.length === 0 ? (
                <div className="py-16 text-center text-[#94A3B8] space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#A855F7]" />
                  <p className="text-sm">Loading client inquiries...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-[#94A3B8] space-y-3">
                  <MessageSquare className="w-10 h-10 mx-auto text-[#A855F7]/40" />
                  <h3 className="text-base font-bold text-[#F8FAFC]">No Inquiries Found</h3>
                  <p className="text-xs max-w-sm mx-auto">
                    {searchTerm || selectedCategory !== 'All'
                      ? 'No messages match your search or filter.'
                      : 'Submitted client messages will appear here in real time.'}
                  </p>
                </div>
              ) : (
                filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-5 rounded-2xl bg-[#231A3D] border border-white/10 hover:border-[#A855F7]/60 transition-all shadow-lg space-y-3.5 group"
                  >
                    {/* Top Row: Client Avatar, Name, Email, Timestamp */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A855F7] to-[#6B21A8] grid place-items-center text-white font-black text-sm uppercase flex-shrink-0 shadow-md ring-2 ring-[#A855F7]/30">
                          {item.name ? item.name.charAt(0) : 'C'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm sm:text-base text-white truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                            <span className="truncate">{item.email}</span>
                            <button
                              onClick={() => handleCopyEmail(item.email, item.id)}
                              className="text-[#C084FC] hover:text-white transition-colors cursor-pointer"
                              title="Copy email address"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] sm:self-start">
                        <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Metadata Badges: Service, Budget, Timeline */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {item.service && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[11px] font-bold text-[#38BDF8]">
                          <Sparkles className="w-3 h-3" />
                          {item.service}
                        </span>
                      )}
                      {item.budget && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                          <DollarSign className="w-3 h-3" />
                          {item.budget}
                        </span>
                      )}
                      {item.timeline && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-300">
                          <Calendar className="w-3 h-3" />
                          {item.timeline}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#A855F7]/15 border border-[#A855F7]/30 text-[11px] font-semibold text-[#C084FC]">
                        <ShieldCheck className="w-3 h-3" />
                        khanmshafi10@gmail.com
                      </span>
                    </div>

                    {/* Message Body */}
                    <div className="p-4 rounded-xl bg-[#17102A] border border-white/5 text-sm text-[#F1F5F9] leading-relaxed whitespace-pre-wrap font-sans">
                      {item.message}
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#64748B] font-mono">
                        ID: {item.id}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopySummary(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2F234B] hover:bg-[#3D2E63] text-xs font-semibold text-[#CBD5E1] transition-colors cursor-pointer"
                        >
                          {copiedSummaryId === item.id ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-[#C084FC]" />
                          )}
                          <span>{copiedSummaryId === item.id ? 'Copied' : 'Copy Info'}</span>
                        </button>

                        <a
                          href={`mailto:${item.email}?subject=Re:%20${encodeURIComponent(item.service || 'Portfolio Inquiry')}%20-%20Shafi%20Portfolio&body=Hi%20${encodeURIComponent(item.name)}%2C%0A%0AThank%20you%20for%20reaching%20out%20regarding%20your%20project.`}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-md shadow-[#A855F7]/30 hover:scale-105 active:scale-95"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Reply in Gmail
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Bottom Footer Info */}
            <div className="px-5 py-3 sm:px-8 border-t border-white/10 bg-[#17102A] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#94A3B8] gap-2">
              <span>Saved locally in <code className="text-[#C084FC]">data/inquiries.json</code></span>
              <span className="text-[#A855F7]">Cloud Relay Active &rarr; khanmshafi10@gmail.com</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
