export interface ProjectItem {
  id: string;
  number: string;
  name: string;
  category: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
  html_url?: string;
  homepage?: string;
  description?: string;
  language?: string;
}

export interface ServiceItem {
  number: string;
  name: string;
  description: string;
}
