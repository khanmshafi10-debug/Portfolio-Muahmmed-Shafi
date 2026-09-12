export interface CatalogItem {
  id: string;
  title: string;
  price: number;
  tag: string;
  category?: string;
  image?: string;
  galleryImages?: string[];
  description?: string;
  specs?: {
    material: string;
    weight: string;
    waterResistance: string;
    thermalEquilibrium: string;
    recycledContent: string;
  };
}

export interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  season?: string;
  image?: string;
  pieceCount?: number;
}

export interface JournalItem {
  id: string;
  date: string;
  title: string;
  readTime: string;
  author?: string;
  summary?: string;
  image?: string;
  content?: string[];
}

export interface MaterialSpec {
  id: string;
  name: string;
  code: string;
  waterproofRating: string;
  breathability: string;
  weight: string;
  composition: string;
  description: string;
  image: string;
}

export type DrawerType = 'shop' | 'collections' | 'journal' | 'cart' | null;

export interface ToastMessage {
  id: string;
  text: string;
}

