import React, { useState, useEffect } from 'react';
import { FadeIn } from './FadeIn';
import { ProjectItem } from '../types';
import { cn } from '../lib/utils';
import { Sparkles } from 'lucide-react';
import { Carousel_002, CarouselImageItem } from './Skiper48';

const visualCoverPool = [
  {
    col1Image2:
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop',
    col2Image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  },
  {
    col1Image2:
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop',
    col2Image:
      'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop',
  },
  {
    col1Image2:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    col2Image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  },
];

const fallbackProjects: ProjectItem[] = [
  {
    id: '1',
    number: '01',
    name: 'Motionsiteboy 3D Portfolio',
    category: '3D & WebGL Systems',
    col1Image1: 'https://opengraph.githubassets.com/1/khanmshafi10-debug/motionsiteboy',
    col1Image2: visualCoverPool[0].col1Image2,
    col2Image: visualCoverPool[0].col2Image,
    html_url: 'https://github.com/khanmshafi10-debug/motionsiteboy',
    homepage: 'https://github.com/khanmshafi10-debug/motionsiteboy',
    description: 'High-performance interactive 3D WebGL developer portfolio featuring liquid WebGL fluid simulations, Three.js shaders, and GSAP animations.',
    language: 'TypeScript / React / WebGL',
  },
  {
    id: '2',
    number: '02',
    name: 'NEXUS 3D Drone Control Station',
    category: '3D & WebGL Graphics',
    col1Image1: 'https://opengraph.githubassets.com/1/khanmshafi10-debug/nexus-3d-drone-control',
    col1Image2: visualCoverPool[1].col1Image2,
    col2Image: visualCoverPool[1].col2Image,
    html_url: 'https://github.com/khanmshafi10-debug',
    description: 'Procedurally generated 3D traffic simulator & interactive drone mission planner built with WebGL, Three.js & WASM.',
    language: 'Three.js / C++ WASM',
  },
  {
    id: '3',
    number: '03',
    name: 'Luxe Estate Real Estate Platform',
    category: 'Full-Stack Web',
    col1Image1: 'https://opengraph.githubassets.com/1/khanmshafi10-debug/luxe-estate-platform',
    col1Image2: visualCoverPool[2].col1Image2,
    col2Image: visualCoverPool[2].col2Image,
    html_url: 'https://github.com/khanmshafi10-debug',
    description: 'Production-grade real estate rental platform & auto-parts store with JWT auth, booking calendar & admin dashboard.',
    language: 'Next.js / Node.js / MongoDB',
  },
  {
    id: '4',
    number: '04',
    name: 'Cashup Digital Wallet Architecture',
    category: 'Fintech & ASP.NET',
    col1Image1: 'https://opengraph.githubassets.com/1/khanmshafi10-debug/cashup-digital-wallet',
    col1Image2: visualCoverPool[0].col1Image2,
    col2Image: visualCoverPool[0].col2Image,
    html_url: 'https://github.com/khanmshafi10-debug',
    description: 'Digital wallet & payments microservice architecture supporting money transfers, bill pay, deposits & MPIN security workflow.',
    language: 'ASP.NET Core 8 / C#',
  },
  {
    id: '5',
    number: '05',
    name: 'Azure Synapse Data Engineering Pipeline',
    category: 'Cloud & Azure Data',
    col1Image1: 'https://opengraph.githubassets.com/1/khanmshafi10-debug/azure-data-engineering-pipeline',
    col1Image2: visualCoverPool[1].col1Image2,
    col2Image: visualCoverPool[1].col2Image,
    html_url: 'https://github.com/khanmshafi10-debug',
    description: 'Enterprise ETL data pipeline analytics & Cloud Data Engineer pipeline integrating PySpark, Azure Data Factory & SQL Server.',
    language: 'PySpark / Azure / SQL',
  },
  {
    id: '6',
    number: '06',
    name: 'WASM C++ Engine Integration',
    category: 'Systems & WebAssembly',
    col1Image1: 'https://opengraph.githubassets.com/1/khanmshafi10-debug/wasm-cpp-engine',
    col1Image2: visualCoverPool[2].col1Image2,
    col2Image: visualCoverPool[2].col2Image,
    html_url: 'https://github.com/khanmshafi10-debug',
    description: 'Low-level C++ & WebAssembly traffic-light engine compiled directly for high-performance browser execution.',
    language: 'C++ / WebAssembly / NASM',
  },
];

function formatRepoTitle(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

interface ProjectsSectionProps {
  onOpenProjectModal: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenProjectModal }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(fallbackProjects);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);
    let mounted = true;

    async function fetchGitHubRepos() {
      try {
        const cached = localStorage.getItem('shafi_github_repos');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (mounted) setProjects(parsed);
          }
        }
      } catch (e) {
        // Fallback default
      }

      try {
        const response = await fetch(
          'https://api.github.com/users/khanmshafi10-debug/repos?sort=updated&per_page=100',
          { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } }
        );
        if (!response.ok) {
          throw new Error(`GitHub API error status: ${response.status}`);
        }
        const data = await response.json();

        const filteredRepos = Array.isArray(data)
          ? data.filter((repo: any) => repo.name.toLowerCase() !== 'khanmshafi10-debug')
          : [];

        if (filteredRepos.length > 0) {
          const mappedProjects: ProjectItem[] = filteredRepos.map((repo: any, idx: number) => {
            const visual = visualCoverPool[idx % visualCoverPool.length];
            const openGraphCard = `https://opengraph.githubassets.com/1/khanmshafi10-debug/${repo.name}`;

            return {
              id: String(repo.id || idx),
              number: String(idx + 1).padStart(2, '0'),
              name: formatRepoTitle(repo.name),
              category: repo.homepage ? 'Client & Full-Stack' : 'Personal & Systems',
              col1Image1: openGraphCard,
              col1Image2: visual.col1Image2,
              col2Image: visual.col2Image,
              html_url: repo.html_url,
              homepage: repo.homepage || undefined,
              description: repo.description || undefined,
              language: repo.language || undefined,
            };
          });

          if (mounted) setProjects(mappedProjects);
          try {
            localStorage.setItem('shafi_github_repos', JSON.stringify(mappedProjects));
          } catch (e) {
            // Ignore quota errors
          }
        }
      } catch (err) {
        console.warn('GitHub API rate limit or network issue. Engaged fallback dataset:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchGitHubRepos();
    return () => {
      mounted = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    const cat = (p.category + ' ' + (p.language || '') + ' ' + p.name).toUpperCase();
    if (selectedFilter === '3D') return cat.includes('3D') || cat.includes('WEBGL') || cat.includes('THREE');
    if (selectedFilter === 'FULLSTACK') return cat.includes('FULL-STACK') || cat.includes('WEB') || cat.includes('REACT') || cat.includes('NEXT') || cat.includes('CLIENT');
    if (selectedFilter === 'CLOUD') return cat.includes('AZURE') || cat.includes('CLOUD') || cat.includes('DATA') || cat.includes('SPARK') || cat.includes('SQL');
    if (selectedFilter === 'CSHARP') return cat.includes('ASP.NET') || cat.includes('C#') || cat.includes('FINTECH') || cat.includes('C++');
    return true;
  });

  const carouselImages: CarouselImageItem[] = filteredProjects.map((p) => ({
    id: p.id,
    src: p.col2Image || p.col1Image1 || visualCoverPool[0].col2Image,
    alt: p.name,
    title: p.name,
    category: p.category,
    number: p.number,
    description: p.description,
    homepage: p.homepage,
    html_url: p.html_url,
    col1Image1: p.col1Image1,
    col1Image2: p.col1Image2,
    col2Image: p.col2Image,
    language: p.language,
  }));

  return (
    <section
      id="projects"
      className="bg-[#18122B] text-[#F8FAFC] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] z-10 relative py-16 px-4 sm:px-6 md:px-10 border-t border-[#94A3B8]/20"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Heading & Category Filters */}
        <div className="w-full flex flex-col items-center justify-center text-center mb-8">
          <FadeIn delay={0} y={15} className="w-full flex flex-col items-center">
            <h2
              className="hero-heading font-black uppercase text-center leading-none tracking-tight select-none mb-3"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 76px)' }}
            >
              Projects
            </h2>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#A855F7] text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Systems &amp; Production Codebases ({filteredProjects.length} Repositories)</span>
            </div>
          </FadeIn>

          {/* Repository Category Filter Pills */}
          <div className="w-full max-w-4xl mx-auto px-2 mt-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap justify-start sm:justify-center py-1 px-1">
              {[
                { id: 'ALL', label: `All (${projects.length})` },
                { id: '3D', label: '3D & WebGL' },
                { id: 'FULLSTACK', label: 'Full-Stack' },
                { id: 'CLOUD', label: 'Cloud & Azure' },
                { id: 'CSHARP', label: 'ASP.NET & C#' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer flex-shrink-0 whitespace-nowrap shadow-sm',
                    selectedFilter === tab.id
                      ? 'bg-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-[#A855F7]'
                      : 'bg-[#251B3E] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#94A3B8]/30 hover:border-[#94A3B8]/60'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skiper 48 Swiper EffectCards Deck Container */}
        {loading && filteredProjects.length === 0 ? (
          <div className="flex justify-center items-center py-20 text-[#94A3B8] font-light uppercase tracking-widest text-sm">
            Loading GitHub Repositories...
          </div>
        ) : (
          <div className="w-full py-4 flex items-center justify-center">
            <Carousel_002
              images={carouselImages}
              showNavigation={true}
              showPagination={false}
              loop={filteredProjects.length > 1}
              onOpenProjectModal={(proj) => {
                const found = projects.find((p) => p.id === proj.id) || (proj as ProjectItem);
                onOpenProjectModal(found);
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

