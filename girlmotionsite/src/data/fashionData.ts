import { CatalogItem, CollectionItem, JournalItem, MaterialSpec } from '../types';

export const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85';

export const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_075145_1b557479-775b-43af-8270-f45d79d97d5a.png&w=1920&q=85';

export const EXTENDED_CATALOG: CatalogItem[] = [
  {
    id: '1',
    title: 'CYBER-TEX OVERCOAT',
    price: 850,
    tag: 'LIMITED EDITION',
    category: 'OUTERWEAR',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      BG_IMAGE_1,
      BG_IMAGE_2,
    ],
    description:
      'Engineered multi-layer weather shield with concealed magnetic closures, high-standing collar, and laser-sealed seams designed for extreme metropolitan conditions.',
    specs: {
      material: '100% Recycled Cyber-Polymer',
      weight: '640g',
      waterResistance: '35,000mm Hydrostatic',
      thermalEquilibrium: '-10°C to +25°C',
      recycledContent: '100% Closed Loop',
    },
  },
  {
    id: '2',
    title: 'GEO-MESH TECH HOODIE',
    price: 320,
    tag: 'NEW DROP',
    category: 'KINETIC',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'Sculptural geometric hoodie with bonded chest ventilation grilles and articulated sleeves built for fluid bodily movement.',
    specs: {
      material: 'Nano-Grid Double Fleece',
      weight: '480g',
      waterResistance: 'DWR Coated 10,000mm',
      thermalEquilibrium: '0°C to +20°C',
      recycledContent: '85% Recycled Nylon',
    },
  },
  {
    id: '3',
    title: 'ORBITAL TAPERED TROUSERS',
    price: 290,
    tag: 'IN STOCK',
    category: 'BOTTOMS',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'Ergonomic multi-pocket trousers crafted from abrasion-resistant stretch poly-twill with adjustable ankle cuffs.',
    specs: {
      material: '4-Way Stretch Poly-Twill',
      weight: '390g',
      waterResistance: 'Hydrophobic Nanotech',
      thermalEquilibrium: 'All-Season Adaptive',
      recycledContent: '92% Repreve Eco-Fiber',
    },
  },
  {
    id: '4',
    title: 'MODULAR ALL-WEATHER VEST',
    price: 410,
    tag: 'PRE-ORDER',
    category: 'OUTERWEAR',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
      BG_IMAGE_2,
    ],
    description:
      'Detachable utility vest featuring quick-release Fidlock magnetic buckles, expanding cargo pouches, and integrated modular clip points.',
    specs: {
      material: 'Kevlar Reinforced Ripstop',
      weight: '520g',
      waterResistance: '40,000mm Waterproof',
      thermalEquilibrium: 'Modular Layering',
      recycledContent: '100% Recycled Polyamide',
    },
  },
  {
    id: '5',
    title: 'KINETIC SHELL TRENCH',
    price: 920,
    tag: 'LIMITED EDITION',
    category: 'OUTERWEAR',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'Full-length architectural trench with asymmetrical lapel closures, expandable spine gusset, and internal harness straps for hands-free carry.',
    specs: {
      material: 'Tri-Laminate Membrane',
      weight: '710g',
      waterResistance: '50,000mm Extreme',
      thermalEquilibrium: '-15°C to +18°C',
      recycledContent: '100% Recycled PET',
    },
  },
  {
    id: '6',
    title: 'MONOCHROME ZERO BLAZER',
    price: 550,
    tag: 'NEW DROP',
    category: 'TAILORING',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'Seamless laser-cut structured blazer with lapel-free neckline, hidden chest zip compartments, and unlined ultra-light internal geometry.',
    specs: {
      material: 'Bonded Elastane Poly-Blend',
      weight: '430g',
      waterResistance: 'Spill & Stain Resistant',
      thermalEquilibrium: '+5°C to +30°C',
      recycledContent: '95% Recycled Fibers',
    },
  },
];

export const SERIES_COLLECTIONS: CollectionItem[] = [
  {
    id: 's01',
    title: 'SERIES 01 — SYNTHETIC HORIZONS',
    subtitle: 'Fall / Winter 2026',
    description:
      'Ultra-durable weather-sealed fabrics with minimalist silhouette architecture. Designed for brutalist weather conditions and modern urban traversal.',
    season: 'FW 2026',
    image: BG_IMAGE_1,
    pieceCount: 12,
  },
  {
    id: 's02',
    title: 'SERIES 02 — KINETIC FORM',
    subtitle: 'Spring / Summer 2026',
    description:
      'Ergonomic streetwear designed for maximum mobility, dynamic stretch, and micro-climate temperature equilibrium.',
    season: 'SS 2026',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    pieceCount: 16,
  },
  {
    id: 's03',
    title: 'SERIES 03 — MONOCHROME ZERO',
    subtitle: 'Capsule Edition',
    description:
      'Pure black and white structural tailoring crafted from 100% recycled polymers, featuring stitchless bonding and hidden utility architecture.',
    season: 'PERMANENT CAPSULE',
    image: BG_IMAGE_2,
    pieceCount: 8,
  },
];

export const MATERIAL_SPECS: MaterialSpec[] = [
  {
    id: 'm1',
    name: 'CYBER-MEMBRANE-X9',
    code: 'SPEC-9921',
    waterproofRating: '35,000mm',
    breathability: '25,000 g/m²/24h',
    weight: '120 gsm',
    composition: '100% Recycled Polyolefin',
    description:
      'Engineered microscopic pore structure permitting thermal moisture dispersion while arresting wind pressure up to 90 km/h.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'm2',
    name: 'KINETIC-GRID NYLON',
    code: 'SPEC-4402',
    waterproofRating: '20,000mm',
    breathability: '30,000 g/m²/24h',
    weight: '95 gsm',
    composition: '88% Nylon 12% Elastane',
    description:
      'Bidirectional mechanical stretch woven with high-tenacity ripstop grid threads to stop tears under high stress.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'm3',
    name: 'MONO-SHELL KEVLAR',
    code: 'SPEC-7710',
    waterproofRating: '50,000mm',
    breathability: '18,000 g/m²/24h',
    weight: '180 gsm',
    composition: 'Aramid Poly-Weave',
    description:
      'Extreme abrasion resistance crafted for industrial urban exploration and high-velocity travel environments.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'm4',
    name: 'THERMO-EQUILIBRIUM FLEECE',
    code: 'SPEC-1105',
    waterproofRating: 'DWR Coated',
    breathability: '40,000 g/m²/24h',
    weight: '210 gsm',
    composition: '100% Closed Loop Polyester',
    description:
      'Honeycomb air-trapping channels regulate core body heat across fluctuating ambient temperature zones.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=85',
  },
];

export const EDITORIAL_ARTICLES: JournalItem[] = [
  {
    id: 'j01',
    date: 'AUG 2026',
    title: 'THE ARCHITECTURE OF NEXT-GEN TEXTILES',
    readTime: '4 MIN READ',
    author: 'LGPSM TECH LAB',
    summary:
      'Exploring how polymer recycling and zero-stitch ultrasonic bonding are reshaping high-fashion outerwear.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    content: [
      'Modern garment construction has reached a pivotal junction where aesthetics and performance must coexist without compromise. At LGPSM, our Tokyo lab explores the convergence of high-molecular polymers and architectural geometry.',
      'By utilizing zero-stitch ultrasonic welding, seams are fused at the molecular level, creating complete imperviousness to wind and rain while reducing total garment weight by 35%.',
      'The future of luxury is not decorative volume — it is silent, flawless functionality.',
    ],
  },
  {
    id: 'j02',
    date: 'JUL 2026',
    title: 'CIRCULAR DESIGN IN HIGH-END APPAREL',
    readTime: '6 MIN READ',
    author: 'SUSTAINABILITY RESEARCH',
    summary:
      'How 100% closed-loop manufacturing ensures that zero apparel end up in landfills, creating timeless garments.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85',
    content: [
      'Circular design begins long before the first pattern piece is cut. It requires selecting mono-materials that can be infinitely depolymerized and re-extruded into pristine fibers.',
      'Every LGPSM piece includes a embedded digital trace QR permit, allowing owners to return garments at end-of-life for 100% store credit towards future iterations.',
    ],
  },
  {
    id: 'j03',
    date: 'JUN 2026',
    title: 'MINIMALISM AS A FUNCTIONAL STATEMENT',
    readTime: '3 MIN READ',
    author: 'CREATIVE DIRECTION',
    summary:
      'Stripping away superficial trims to elevate raw form, precise proportions, and ergonomic comfort.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85',
    content: [
      'In a visual ecosystem saturated with loud logos and temporary trends, true distinction comes from geometric restraint. Black and white monochrome allows pure line work and silhouette volume to dominate.',
    ],
  },
  {
    id: 'j04',
    date: 'MAY 2026',
    title: 'KINETIC SILHOUETTES & BODY ERGONOMICS',
    readTime: '5 MIN READ',
    author: 'BIOMECHANICS STUDIO',
    summary:
      'Mapping human muscle flex lines during rapid motion to design seam placement that moves organically with the body.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85',
    content: [
      'Traditional tailoring treats the body as a static mannequin. Kinetic tailoring maps 3D motion sensors across athletes and city commuters to place dynamic stretch gussets exactly where joints flex.',
    ],
  },
];
