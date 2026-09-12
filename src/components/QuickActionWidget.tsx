import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileDown, Mail, Check, Sparkles, MessageSquare } from 'lucide-react';
import { InquiriesInboxModal } from './InquiriesInboxModal';

export const QuickActionWidget: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('khanmshafi10@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      {/* Floating Action Pill */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-full bg-[#251B3E]/95 backdrop-blur-xl border border-[#A855F7]/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] select-none">
        {/* Inquiries Inbox Button */}
        <button
          onClick={() => setIsInboxOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#A855F7]/25 hover:bg-[#A855F7] text-[#F8FAFC] border border-[#A855F7]/60 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md group cursor-pointer"
          title="Open Client Inquiries Inbox"
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C084FC] group-hover:text-white transition-colors" />
          <span className="hidden sm:inline">Inquiries</span>
          <span className="sm:hidden">Inbox</span>
        </button>

        {/* Download Resume PDF Button */}
        <a
          href="/Muhammad_Shafi_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download="Muhammad_Shafi_Resume.pdf"
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#18122B] hover:bg-[#A855F7] text-[#F8FAFC] text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md group cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7] group-hover:text-white transition-colors" />
          <span className="hidden sm:inline">Resume PDF</span>
          <span className="sm:hidden">Resume</span>
        </a>

        {/* Copy Email Button */}
        <button
          onClick={handleCopyEmail}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#A855F7]/20 hover:bg-[#A855F7] text-[#F8FAFC] border border-[#A855F7]/50 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md group cursor-pointer"
          aria-label="Copy Email"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 group-hover:text-white" />
          ) : (
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7] group-hover:text-white transition-colors" />
          )}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Email'}</span>
          <span className="sm:hidden">{copied ? 'Copied!' : 'Email'}</span>
        </button>
      </div>

      {/* Copy Email Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#251B3E] border border-[#A855F7] text-[#F8FAFC] shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-xl max-w-[calc(100vw-32px)]"
          >
            <span className="p-1.5 rounded-full bg-[#A855F7]/20 text-[#A855F7]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider truncate">
                Email Copied to Clipboard!
              </span>
              <span className="text-[11px] text-[#94A3B8] font-mono truncate">
                khanmshafi10@gmail.com
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Inquiries Inbox Modal */}
      <InquiriesInboxModal isOpen={isInboxOpen} onClose={() => setIsInboxOpen(false)} />
    </>
  );
};
