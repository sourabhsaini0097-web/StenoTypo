export type ProjectCategory = 'all' | 'systems' | 'fintech' | 'industrial' | 'brand';

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: string;
  role: string;
  image: string;
  headlineMetric: string;
  headlineMetricContext: string;
  summary: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    description: string;
  }[];
  techStack: string[];
  deliverables: string[];
}

export interface Capability {
  index: string;
  title: string;
  lead: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  timeline: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  impactMetric: string;
}

export interface InsightArticle {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  summary: string;
}

export type ThemeMode = 'obsidian' | 'cream' | 'slate';
