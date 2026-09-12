import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

interface AboutSectionProps {
  onOpenContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenContact }) => {
  const aboutText =
    "As a Software Engineer with a B.Sc. in Computer Science (CGPA: 3.71 / 4.00) and Microsoft Azure Data Engineer certification, I build high-performance full-stack web applications, interactive 3D WebGL experiences, and scalable cloud data pipelines. Let's build something extraordinary together!";

  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden bg-[#18122B]"
    >
      {/* Corner Decorative 3D Assets */}
      {/* Top-Left Moon */}
      <div className="absolute top-[2%] sm:top-[4%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none z-0 opacity-25 sm:opacity-100">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="3D Moon Asset"
            loading="lazy"
            decoding="async"
            className="w-[45px] sm:w-[120px] md:w-[210px] h-auto object-contain drop-shadow-2xl"
          />
        </FadeIn>
      </div>

      {/* Bottom-Left 3D Object */}
      <div className="absolute bottom-[4%] sm:bottom-[8%] left-[2%] sm:left-[6%] md:left-[10%] pointer-events-none z-0 opacity-25 sm:opacity-100">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D Floating Shape"
            loading="lazy"
            decoding="async"
            className="w-[40px] sm:w-[100px] md:w-[180px] h-auto object-contain drop-shadow-2xl"
          />
        </FadeIn>
      </div>

      {/* Top-Right Lego */}
      <div className="absolute top-[2%] sm:top-[4%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none z-0 opacity-25 sm:opacity-100">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="3D Lego Icon Asset"
            loading="lazy"
            decoding="async"
            className="w-[45px] sm:w-[120px] md:w-[210px] h-auto object-contain drop-shadow-2xl"
          />
        </FadeIn>
      </div>

      {/* Bottom-Right 3D Group */}
      <div className="absolute bottom-[4%] sm:bottom-[8%] right-[2%] sm:right-[6%] md:right-[10%] pointer-events-none z-0 opacity-25 sm:opacity-100">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D Abstract Group Asset"
            loading="lazy"
            decoding="async"
            className="w-[50px] sm:w-[130px] md:w-[220px] h-auto object-contain drop-shadow-2xl"
          />
        </FadeIn>
      </div>

      {/* Center Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        {/* Heading */}
        <FadeIn delay={0} y={40} className="w-full flex justify-center">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center select-none mb-10 sm:mb-14 md:mb-16"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        {/* Scroll-Driven Animated Character Text */}
        <div className="mb-16 sm:mb-20 md:mb-24 flex justify-center px-2">
          <AnimatedText text={aboutText} />
        </div>

        {/* Contact Button */}
        <FadeIn delay={0.2} y={20}>
          <ContactButton onClick={onOpenContact} />
        </FadeIn>
      </div>
    </section>
  );
};
