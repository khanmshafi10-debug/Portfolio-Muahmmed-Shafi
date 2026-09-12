import { CatalogItem, CollectionItem, JournalItem, MaterialSpec } from '../types';

export const EXPANDED_CATALOG: CatalogItem[] = [
  {
    id: '1',
    title: 'CYBER-TEX OVERCOAT',
    price: 850,
    tag: 'LIMITED EDITION',
    category: 'Outerwear',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85',
    galleryImages: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_075145_1b557479-775b-43af-8270-f45d79d97d5a.png&w=1920&q=85',
    ],
    description:
      'Engineered multi-layer structural trench with heat-bonded seams and dynamic weather protection membrane. Features magnetic quick-release collar closures and expandable interior pockets.',
    specs: {
      material: 'Polymer-09 Hydrophobic Weave',
      weight: '640g',
      waterResistance: '28,000mm HH',
      thermalEquilibrium: '-10°C to +22°C',
      recycledContent: '94% Certified Ocean Polymer',
    },
  },
  {
    id: '2',
    title: 'GEO-MESH TECH HOODIE',
    price: 320,
    tag: 'NEW DROP',
    category: 'Tech Tops',
    image:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'Ergonomic heavy-weight knit top integrated with targeted breathable ventilation zones and structured double-layered face cowl.',
    specs: {
      material: '3D Geometric Aero-Mesh',
      weight: '480g',
      waterResistance: 'DWR Coated Surface',
      thermalEquilibrium: '+5°C to +25°C',
      recycledContent: '88% Recycled Elastane Blend',
    },
  },
  {
    id: '3',
    title: 'ORBITAL TAPERED TROUSERS',
    price: 290,
    tag: 'IN STOCK',
    category: 'Bottoms',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'Sculpted architectural trousers featuring knee articulation darts, concealed waterproof zip compartments, and an adjustable fidlock waist system.',
    specs: {
      material: 'Kinetic Stretch Nylon Matrix',
      weight: '390g',
      waterResistance: '15,000mm HH',
      thermalEquilibrium: '0°C to +28°C',
      recycledContent: '100% Recycled Nylon',
    },
  },
  {
    id: '4',
    title: 'MODULAR ALL-WEATHER VEST',
    price: 410,
    tag: 'PRE-ORDER',
    category: 'Modular Gear',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'Attachable tactical utility vest with 8 modular storage units, magnetic dock points, and reinforced Kevlar thread reinforcement.',
    specs: {
      material: 'Ballistic Grid Weave',
      weight: '310g',
      waterResistance: '30,000mm HH',
      thermalEquilibrium: 'Universal Modular Layer',
      recycledContent: '90% Recycled Synthetics',
    },
  },
  {
    id: '5',
    title: 'KINETIC MONOLITH SHELL',
    price: 920,
    tag: 'NEW DROP',
    category: 'Outerwear',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'Seamless laser-cut storm jacket crafted for high-altitude wind resistance and zero-friction body mobility.',
    specs: {
      material: 'Monolith 3-Layer Membrane',
      weight: '520g',
      waterResistance: '32,000mm HH',
      thermalEquilibrium: '-15°C to +18°C',
      recycledContent: '96% Circular Polymer',
    },
  },
  {
    id: '6',
    title: 'AERO-TAPE URBAN CARGO',
    price: 340,
    tag: 'IN STOCK',
    category: 'Bottoms',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85',
    ],
    description:
      'Reflective geometric cargo trousers designed with taped seam construction and magnetic cuff cinch cords.',
    specs: {
      material: 'Aero-Nylon Grid',
      weight: '410g',
      waterResistance: '18,000mm HH',
      thermalEquilibrium: '-5°C to +25°C',
      recycledContent: '92% Recycled Ripstop',
    },
  },
];

export const MATERIAL_SPECS: MaterialSpec[] = [
  {
    id: 'mat-01',
    name: 'Polymer-09 Hydrophobic Weave',
    code: 'POL-09-HW',
    waterproofRating: '28,000mm',
    breathability: '20,000g/m²/24h',
    weight: '145g/m²',
    composition: '94% Recycled Polyester, 6% Fluorocarbon-Free DWR',
    description:
      'A bio-based polymer matrix engineered to reflect thermal infrared radiation while providing impervious wind and moisture defense.',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'mat-02',
    name: '3D Geometric Aero-Mesh',
    code: 'GAM-3D-PRO',
    waterproofRating: 'DWR Coated',
    breathability: '35,000g/m²/24h',
    weight: '210g/m²',
    composition: '88% Recycled Elastane, 12% Polyamide Monofilament',
    description:
      'Self-regulating knit structure that expands micro-apertures during movement to dissipate excess kinetic heat.',
    image:
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'mat-03',
    name: 'Kinetic Monolith Membrane',
    code: 'KMM-ULTRA-3',
    waterproofRating: '32,000mm',
    breathability: '25,000g/m²/24h',
    weight: '160g/m²',
    composition: '96% Circular Polyurethane, 4% Carbon Nanotube Mesh',
    description:
      'Ultralight tri-layer lamination incorporating carbon nanostructures to enhance tear resistance by 400%.',
    image:
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=85',
  },
];

export const LOOKBOOK_GALLERY = [
  {
    id: 'lb-1',
    title: 'SYNTHETIC HORIZONS 01',
    category: 'Campaign Outerwear',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85',
    details: 'Structured Cyber-Tex Trench in Zero White',
  },
  {
    id: 'lb-2',
    title: 'KINETIC FORM 02',
    category: 'Editorial Specimen',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_075145_1b557479-775b-43af-8270-f45d79d97d5a.png&w=1920&q=85',
    details: 'Thermal Equilibrium Layering System',
  },
  {
    id: 'lb-3',
    title: 'MONOCHROME ZERO 03',
    category: 'Streetwear Architecture',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    details: 'Ergonomic Tapered Trouser Matrix',
  },
  {
    id: 'lb-4',
    title: 'MODULAR ALL-WEATHER 04',
    category: 'Technical Gear',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    details: 'Fidlock Tactical Docking Harness',
  },
];
