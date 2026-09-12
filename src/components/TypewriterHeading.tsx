import React, { useState, useEffect } from 'react';

interface TypewriterHeadingProps {
  text: string;
  className?: string;
  startTrigger?: boolean;
}

export const TypewriterHeading: React.FC<TypewriterHeadingProps> = ({
  text,
  className = '',
  startTrigger = true,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!startTrigger) {
      setDisplayText('');
      setIsTypingComplete(false);
      return;
    }

    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout | null = null;

    setDisplayText('');
    setIsTypingComplete(false);

    const startDelay = setTimeout(() => {
      typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          if (typingInterval) clearInterval(typingInterval);
          setIsTypingComplete(true);
        }
      }, 70);
    }, 250);

    return () => {
      clearTimeout(startDelay);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [text, startTrigger]);

  const charArray = (displayText || text).split('');

  return (
    <div className="w-full overflow-hidden flex justify-center items-center select-none bg-transparent px-2">
      <h1 className={`font-black uppercase tracking-tight leading-none flex flex-wrap sm:flex-nowrap justify-center items-center w-full text-center select-none cursor-pointer ${className}`}>
        {charArray.map((char, index) => {
          const isHovered = hoveredIndex === index;

          if (char === ' ') {
            return <span key={index} className="inline-block w-[0.25em]" />;
          }

          return (
            <span
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="inline-block cursor-pointer transition-all duration-300"
              style={{
                transform: isHovered ? 'translateY(-6px) scale(1.15)' : 'translateY(0) scale(1)',
                color: isHovered ? '#C084FC' : '#F8FAFC',
                textShadow: isHovered
                  ? '0 0 25px rgba(192, 132, 252, 0.95), 0 0 50px rgba(168, 85, 247, 0.8), 0 0 80px rgba(244, 114, 182, 0.6)'
                  : '0 10px 25px rgba(0, 0, 0, 0.4)',
              }}
            >
              {char}
            </span>
          );
        })}

        {!isTypingComplete && (
          <span className="inline-block w-[0.08em] h-[0.7em] bg-[#A855F7] ml-1 animate-pulse align-middle rounded-sm shadow-[0_0_20px_#A855F7]" />
        )}
      </h1>
    </div>
  );
};
