import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}
    </motion.span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.3'],
  });

  const words = text.split(' ');
  const totalChars = text.length;
  let charCounter = 0;

  return (
    <p
      ref={containerRef}
      className={`text-[#F8FAFC] font-medium text-center leading-relaxed max-w-3xl ${className}`}
      style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.4rem)' }}
    >
      {words.map((word, wordIdx) => {
        const wordChars = word.split('');
        const wordStartIdx = charCounter;
        
        const wordElements = wordChars.map((char) => {
          const start = charCounter / totalChars;
          const end = Math.min(1, (charCounter + 1) / totalChars);
          charCounter++;
          return (
            <Character key={charCounter} progress={scrollYProgress} range={[start, end]}>
              {char}
            </Character>
          );
        });

        // Account for the space between words in progress counter
        charCounter++;

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.32em]">
            {wordElements}
          </span>
        );
      })}
    </p>
  );
};

