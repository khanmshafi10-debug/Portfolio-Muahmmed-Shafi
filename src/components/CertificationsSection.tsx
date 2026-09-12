import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Award, Sparkles, ShieldCheck } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { FadeIn } from './FadeIn';
import { cn } from '../lib/utils';

interface CertificationCard {
  id: number;
  code: string;
  badge: string;
  title: string;
  issuer: string;
  description: string;
  skills: string[];
  image: string;
}

const certificationData: CertificationCard[] = [
  {
    id: 1,
    code: '#01 CERTIFIED',
    badge: 'Microsoft Official',
    title: 'Azure Data Engineer Associate',
    issuer: 'Microsoft Corporation',
    description: 'Enterprise data engineering certification validating expertise in Azure Synapse, Data Factory, SQL Server & PySpark ETL analytics.',
    skills: ['Azure Data Factory', 'PySpark', 'Synapse', 'SQL Server'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 2,
    code: '#02 CERTIFIED',
    badge: 'Industry Professional',
    title: 'Arch Tech Professional Certification',
    issuer: 'Arch Technologies',
    description: 'Professional certification for full-stack software development, REST API engineering, Git workflows, and client application delivery.',
    skills: ['Full-Stack React', 'Node.js', 'REST APIs', 'Git Workflows'],
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
  },
  {
    id: 3,
    code: '#03 HONORS',
    badge: 'CGPA 3.71 / 4.00',
    title: 'Air University Academic Distinction',
    issuer: 'Air University Multan Campus',
    description: 'High academic standing in B.Sc. Computer Science focusing on Software Engineering, Data Structures, OOP, and WebGL graphics.',
    skills: ['Algorithms & Data Structs', 'C# / C++', 'Database Design', 'OOP'],
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 4,
    code: '#04 RESIDENCY',
    badge: 'SPS Enterprise',
    title: 'Software Engineering Residency',
    issuer: 'Software Productivity Strategists (SPS)',
    description: 'Enterprise engineering residency delivering production-grade productivity tools under agile industry practices and review standards.',
    skills: ['Agile Engineering', 'Enterprise Tools', 'Quality Standards', 'Code Review'],
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
  },
  {
    id: 5,
    code: '#05 FOUNDER',
    badge: 'BlogWithShafi',
    title: 'Tech Founder & Lead Writer',
    issuer: 'BlogWithShafi Publication',
    description: 'Founded tech publication simplifying Python, C++, and web development topics, driving organic readership through SEO & analytics.',
    skills: ['Technical Writing', 'SEO Analytics', 'Python & C++', 'Content Strategy'],
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 6,
    code: '#06 NETWORK',
    badge: 'Cisco Systems',
    title: 'Enterprise Multi-Site Architecture',
    issuer: 'Cisco Networking Architecture',
    description: 'Country-level enterprise network design with VLAN segmentation, inter-VLAN routing & secure network services (DHCP/FTP/Email).',
    skills: ['VLAN Segmentation', 'Inter-VLAN Routing', 'Packet Tracer', 'Network Security'],
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 7,
    code: '#07 SYSTEMS',
    badge: 'WASM & 3D WebGL',
    title: 'NEXUS WebAssembly Traffic Engine',
    issuer: 'WebGL & WASM Systems Lab',
    description: 'Procedurally generated 3D city driven by C++ / NASM WebAssembly compiled traffic-light engine with live HUD & emergency modes.',
    skills: ['Three.js', 'WebAssembly', 'C++ Compilers', 'GLTF Renders'],
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
];

export const CertificationsSection: React.FC = () => {
  const swiperStyles = `
    .cert-swiper {
      width: 100%;
      padding-top: 15px;
      padding-bottom: 55px !important;
    }
    .cert-swiper .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 245px;
      height: 380px;
      border-radius: 24px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @media (min-width: 380px) {
      .cert-swiper .swiper-slide {
        width: 280px;
        height: 410px;
        border-radius: 32px;
      }
    }
    @media (min-width: 480px) {
      .cert-swiper .swiper-slide {
        width: 330px;
        height: 440px;
      }
    }
    @media (min-width: 640px) {
      .cert-swiper .swiper-slide {
        width: 380px;
        height: 470px;
      }
    }
    .cert-swiper .swiper-slide-active {
      border-color: #A855F7 !important;
      box-shadow: 0 0 35px rgba(168, 85, 247, 0.45);
    }
    .cert-swiper .swiper-pagination-bullet {
      background-color: #94A3B8 !important;
      opacity: 0.4;
      transition: all 0.3s ease;
    }
    .cert-swiper .swiper-pagination-bullet-active {
      background-color: #A855F7 !important;
      opacity: 1;
      width: 28px !important;
      border-radius: 6px !important;
      box-shadow: 0 0 12px rgba(168, 85, 247, 0.7);
    }
  `;

  return (
    <section
      id="certifications"
      className="bg-[#18122B] text-[#F8FAFC] py-20 sm:py-28 px-4 sm:px-6 md:px-10 relative overflow-hidden border-t border-[#94A3B8]/20"
    >
      <style>{swiperStyles}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <FadeIn delay={0} y={20}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#A855F7] text-xs font-semibold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <ShieldCheck className="w-4 h-4" />
              <span>Credentials &amp; Recognized Milestones</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} y={30}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight hero-heading mb-4">
              Certifications &amp; Honors
            </h2>
          </FadeIn>

          <FadeIn delay={0.2} y={20}>
            <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] font-light leading-relaxed max-w-2xl">
              Explore my verified industry certifications, academic distinction, enterprise engineering residencies, and publication milestones.
            </p>
          </FadeIn>
        </div>

        {/* Skiper 49 (Carousel_003) 3D Swiper Coverflow Showcase */}
        <FadeIn delay={0.3} y={30}>
          <div className="relative w-full">
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              loop={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              coverflowEffect={{
                rotate: typeof window !== 'undefined' && window.innerWidth < 640 ? 20 : 35,
                stretch: 0,
                depth: typeof window !== 'undefined' && window.innerWidth < 640 ? 70 : 130,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={{
                nextEl: '.cert-next',
                prevEl: '.cert-prev',
              }}
              className="cert-swiper"
              modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
            >
              {certificationData.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="relative size-full rounded-[32px] overflow-hidden border border-[#94A3B8]/30 bg-[#251B3E] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between p-6 select-none group">
                    {/* Background Image with Overlay */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18122B] via-[#18122B]/85 to-[#18122B]/40" />

                    {/* Top Row Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#18122B]/80 backdrop-blur-md border border-[#94A3B8]/30 text-xs font-mono text-[#E2E8F0]">
                        {item.code}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#A855F7]/25 backdrop-blur-md border border-[#A855F7]/50 text-[10px] uppercase font-bold tracking-widest text-[#F8FAFC]">
                        {item.badge}
                      </span>
                    </div>

                    {/* Bottom Info Content */}
                    <div className="relative z-10 flex flex-col">
                      <span className="text-xs uppercase tracking-widest font-semibold text-[#A855F7] mb-1">
                        {item.issuer}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#F8FAFC] mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>

                      {/* Skill Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md bg-[#251B3E]/90 backdrop-blur-md border border-[#94A3B8]/30 text-[10px] font-medium text-[#E2E8F0]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between w-full absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 pointer-events-none px-2 sm:px-6">
                <button
                  className="cert-prev pointer-events-auto p-3 rounded-full bg-[#251B3E]/90 backdrop-blur-md border border-[#94A3B8]/30 text-[#F8FAFC] hover:bg-[#A855F7] hover:border-[#A855F7] shadow-xl transition-all cursor-pointer"
                  aria-label="Previous Certification"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className="cert-next pointer-events-auto p-3 rounded-full bg-[#251B3E]/90 backdrop-blur-md border border-[#94A3B8]/30 text-[#F8FAFC] hover:bg-[#A855F7] hover:border-[#A855F7] shadow-xl transition-all cursor-pointer"
                  aria-label="Next Certification"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </Swiper>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
