import React from 'react';
import { FadeIn } from './FadeIn';
import { Sparkles } from 'lucide-react';
import { StickyCard_003, ServiceCardItem } from './Skiper34';

const servicesData: ServiceCardItem[] = [
  {
    id: 1,
    number: '01',
    name: '3D & WebGL Systems',
    category: 'Graphics & WebGL',
    description:
      'Crafting interactive 3D web graphics, custom shaders, and WebAssembly modules using Three.js and WebGL for immersive browser experiences.',
    tags: ['Three.js', 'WebGL', 'WASM', 'GLTF', 'Shaders'],
    imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    number: '02',
    name: 'Full-Stack Web Architecture',
    category: 'Full-Stack Engineering',
    description:
      'Architecting scalable web applications, enterprise platforms, and robust REST APIs using React, Next.js 14, and ASP.NET Core.',
    tags: ['React', 'Next.js 14', 'TypeScript', 'ASP.NET Core 8', 'MongoDB'],
    imgUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    number: '03',
    name: 'Cloud & Data Engineering',
    category: 'Azure Data & Analytics',
    description:
      'Designing enterprise ETL pipelines, Microsoft Azure cloud data architectures, analytics dashboards, and automated PySpark data processing.',
    tags: ['Azure Data Engineer', 'PySpark', 'SQL', 'Data Factory', 'Synapse'],
    imgUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 4,
    number: '04',
    name: 'Fintech & Security Workflows',
    category: 'Fintech & Microservices',
    description:
      'Developing secure digital-wallet and payment microservice architectures with money transfers, bill pay, deposits & MPIN security.',
    tags: ['ASP.NET Core 8', 'C#', 'Microservices', 'JWT Auth', 'MPIN'],
    imgUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 5,
    number: '05',
    name: 'WASM & Performance Optimization',
    category: 'Systems & WebAssembly',
    description:
      'Building high-throughput C++ WebAssembly modules and optimizing critical browser rendering pipelines for maximum speed and efficiency.',
    tags: ['WebAssembly', 'C++', 'NASM', 'WAT', 'High Performance'],
    imgUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="bg-[#18122B] text-[#F8FAFC] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-4 sm:px-6 md:px-10 py-20 sm:py-24 md:py-28 relative z-10 border-t border-[#94A3B8]/20"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <div className="w-full flex flex-col items-center justify-center text-center mb-16 sm:mb-20">
          <FadeIn delay={0} y={20}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#A855F7] text-xs font-semibold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-4 h-4" />
              <span>Core Services &amp; Architectural Expertise</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} y={30}>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight hero-heading mb-4">
              Services &amp; Capabilities
            </h2>
          </FadeIn>

          <FadeIn delay={0.2} y={20}>
            <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] font-light leading-relaxed max-w-2xl">
              Explore my software engineering specializations, 3D WebGL architectures, and enterprise cloud data solutions.
            </p>
          </FadeIn>
        </div>

        {/* Skiper 34 StickyCard_003 Stack Container */}
        <div className="w-full flex flex-col items-center gap-[12vh] pb-24">
          {servicesData.map((service, index) => (
            <StickyCard_003
              key={service.id}
              index={index}
              imgUrl={service.imgUrl}
              item={service}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

