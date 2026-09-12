import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, X } from 'lucide-react';
import { JOURNAL_ITEMS } from './Drawers';
import { CornerBracketBL, CornerBracketBR, CornerBracketTL, CornerBracketTR } from './SvgAssets';

export const EditorialSection: React.FC = () => {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const selectedArticle = JOURNAL_ITEMS.find((a) => a.id === activeArticleId);

  return (
    <section className="relative z-10 w-full py-16 border-t border-gray-200 bg-white">
      <div
        className="mx-auto w-full flex flex-col gap-10"
        style={{ paddingInline: 'var(--pad-x)' }}
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <span className="font-jakarta text-[var(--micro)] font-semibold uppercase tracking-[0.2em] text-gray-400 block mb-2">
              Future Forward Philosophy
            </span>
            <h2
              className="font-orbitron font-extrabold uppercase tracking-[0.08em] text-black"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
            >
              EDITORIAL DISPATCHES
            </h2>
          </div>

          <div className="flex items-center gap-2 font-jakarta text-xs text-gray-500 uppercase tracking-widest">
            <BookOpen className="w-4 h-4 text-black" />
            <span>Quarterly Journal Issues</span>
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {JOURNAL_ITEMS.map((article) => (
            <div
              key={article.id}
              onClick={() => setActiveArticleId(article.id)}
              className="group relative border border-gray-200 hover:border-black p-6 transition-all duration-300 bg-white cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute top-1 left-1 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <CornerBracketTL />
              </div>
              <div className="absolute top-1 right-1 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <CornerBracketTR />
              </div>
              <div className="absolute bottom-1 left-1 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <CornerBracketBL />
              </div>
              <div className="absolute bottom-1 right-1 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <CornerBracketBR />
              </div>

              <div>
                <div className="flex items-center justify-between text-gray-400 font-jakarta text-[var(--micro)] font-semibold tracking-wider">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="font-orbitron font-bold text-base text-black tracking-wide mt-4 group-hover:underline leading-snug">
                  {article.title}
                </h3>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-black">
                <span className="font-jakarta text-xs font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  READ ARTICLE
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-8"
          onClick={() => setActiveArticleId(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white text-black border border-gray-200 shadow-2xl p-6 md:p-8 rounded-md flex flex-col gap-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="font-jakarta text-xs font-semibold uppercase tracking-widest text-gray-400">
                {selectedArticle.date} — {selectedArticle.readTime}
              </span>
              <button
                onClick={() => setActiveArticleId(null)}
                className="p-1 hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="font-orbitron font-bold text-xl md:text-2xl text-black tracking-wide">
              {selectedArticle.title}
            </h2>

            <div className="font-jakarta text-sm text-gray-700 leading-relaxed flex flex-col gap-4">
              <p>
                In an era dominated by transient fashion trends, LGPSM re-evaluates the role of technical textiles through structural minimalism. Clothing is no longer a static surface; it is an active environmental interface.
              </p>
              <p>
                By engineering garments from high-density recycled polymers, closed-loop nanostructures, and weather-sealed bonding, we eliminate redundant seams and unnecessary visual ornament. Function becomes the sole aesthetic driver.
              </p>
              <p>
                Each silhouette in our 2026 Archive is mathematically mapped to human kinetic range, ensuring zero resistance during high-mobility urban transits or extreme micro-climates.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveArticleId(null)}
                className="bg-black text-white font-jakarta text-xs font-semibold uppercase tracking-wider py-2.5 px-6 rounded hover:bg-gray-800 transition-colors cursor-pointer"
              >
                CLOSE DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
