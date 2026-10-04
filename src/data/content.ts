import { CaseStudy, Capability, Testimonial, InsightArticle } from '../types';

import heroImg from '../assets/images/hero_studio_architecture_1791094733889.jpg';
import fintechImg from '../assets/images/case_study_fintech_1791094746629.jpg';
import industrialImg from '../assets/images/case_study_industrial_1791094758445.jpg';

export const ASSETS = {
  hero: heroImg,
  fintech: fintechImg,
  industrial: industrialImg,
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'aether-capital',
    title: 'Aether Capital Global Liquidity Engine',
    client: 'Aether Asset Management',
    category: 'fintech',
    categoryLabel: 'Fintech & Capital',
    year: '2026',
    role: 'Principal Digital Architecture & UI Systems',
    image: fintechImg,
    headlineMetric: '+182% Inbound Institutional Allocation',
    headlineMetricContext: 'within 90 days of platform launch',
    summary: 'A sub-50ms execution dashboard and asset allocation portal designed for Tier-1 multi-family offices managing $4.8B in combined assets.',
    challenge: 'Aether was operating on legacy portal infrastructure with high latency, fragile tabular layouts, and inconsistent client trust indicators during eight-figure liquidity transactions.',
    solution: 'Engineered an ultra-low-latency web console with tabular-numeric ledger components, zero-dependency data virtualization, and bank-grade authentication telemetry.',
    results: [
      { metric: '42ms', description: 'Average time-to-interactive on global mobile connections' },
      { metric: '$14.2M', description: 'Average daily volume cleared through the client interface' },
      { metric: '0', description: 'Critical transaction anomalies reported across 180 days' }
    ],
    techStack: ['TypeScript', 'React 19', 'Tailwind CSS', 'WebSockets', 'WebCrypto API'],
    deliverables: [
      'Institutional Liquidity Dashboard',
      'Design Token Hierarchy & Component Library',
      'High-Density Tabular Financial Grids',
      'Biometric Authorization Micro-flows'
    ]
  },
  {
    id: 'kinesis-audio',
    title: 'Kinesis Acoustic Lab Spatial Audio Suite',
    client: 'Kinesis Precision Dynamics',
    category: 'industrial',
    categoryLabel: 'Industrial Design & Hardware',
    year: '2026',
    role: 'Product Identity & Digital Flagship Experience',
    image: industrialImg,
    headlineMetric: '3.4x Direct Pre-Order Velocity',
    headlineMetricContext: 'surpassing Q1 hardware launch targets by $2.1M',
    summary: 'An interactive flagship digital storefront and acoustic calibration interface for precision-milled carbon studio monitors.',
    challenge: 'Bridging physical industrial craftsmanship with digital sales where audiophiles demand deep technical validation before making a $6,500 equipment commitment.',
    solution: 'Developed an interactive frequency-response visualizer, modular exploded assembly inspection tool, and clean narrative purchasing funnel.',
    results: [
      { metric: '$2.1M', description: 'Direct DTC pre-orders secured in first 4 weeks' },
      { metric: '4.8 min', description: 'Average session dwell time on interactive sound chamber' },
      { metric: '68%', description: 'Mobile checkout completion rate' }
    ],
    techStack: ['Web Audio API', 'React 19', 'Canvas 2D', 'Tailwind CSS', 'Vite'],
    deliverables: [
      'Direct-to-Consumer Flagship Experience',
      'Interactive Acoustic Simulation Model',
      'Hardware Spec Sheet Typography System',
      'Integrated Supply Chain Stock Allocator'
    ]
  },
  {
    id: 'meridian-platform',
    title: 'Meridian Global Infrastructure Console',
    client: 'Meridian Edge Networks',
    category: 'systems',
    categoryLabel: 'Enterprise Systems',
    year: '2026',
    role: 'Enterprise Design System & Dashboard',
    image: heroImg,
    headlineMetric: '64% Reduction in Configuration Errors',
    headlineMetricContext: 'measured across 1,200 DevOps operators',
    summary: 'Centralized edge routing interface and topology orchestrator handling distributed edge compute workloads across 48 worldwide regions.',
    challenge: 'Network engineers were navigating four fragmented dashboards to execute route changes, leading to human error and prolonged deployment windows.',
    solution: 'Designed and deployed a unified design system with keyboard-first navigation shortcuts, real-time node state telemetry, and defensive confirmation dialogs.',
    results: [
      { metric: '-72%', description: 'Mean time to resolve edge routing outages' },
      { metric: '100%', description: 'Accessibility compliance (WCAG 2.1 AA certified)' },
      { metric: '14 days', description: 'Time to onboard new engineering teams onto the system' }
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Edge Runtime', 'REST & GraphQL'],
    deliverables: [
      'Multi-region Topology Visualizer',
      'Keyboard-First Command Palette',
      'Comprehensive Design System Documentation',
      'Role-Based Authorization Architecture'
    ]
  }
];

export const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'Digital Systems & Architecture',
    lead: 'Bespoke web applications built for speed, architectural stability, and complex domain workflows.',
    description: 'We build high-performance client applications with resilient data flows, zero unnecessary bloat, and sub-100ms response targets. Every surface is engineered to withstand production scale.',
    deliverables: [
      'Full-Stack Web Applications (React, TypeScript)',
      'High-Density Data Interfaces & Telemetry',
      'API Integration & Edge Service Connectors',
      'Performance Optimization & Core Web Vitals Audits'
    ],
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node / Express'],
    timeline: '4–8 Weeks'
  },
  {
    index: '02',
    title: 'Design Systems & UI Engineering',
    lead: 'Scalable component architectures that unite product teams and eliminate design debt.',
    description: 'We craft comprehensive design token systems, atomic component libraries, and interactive documentation that allow engineering and product teams to ship cohesive interfaces at speed.',
    deliverables: [
      'Design Token Hierarchies (Figma to Code)',
      'Accessible Component Libraries (WCAG AA)',
      'Storybook / Interactive Documentation',
      'Cross-Platform Style Guides'
    ],
    technologies: ['CSS Architecture', 'Figma Tokens', 'Radix Primitives', 'Tailwind'],
    timeline: '3–6 Weeks'
  },
  {
    index: '03',
    title: 'Flagship Marketing & E-Commerce',
    lead: 'Distinctive digital storefronts and corporate sites with high-intent conversion architecture.',
    description: 'Transforming brand vision into compelling digital journeys that persuade discerning enterprise buyers and consumers. No generic templates, no cookie-cutter layouts.',
    deliverables: [
      'Custom Brand Flagships & Product Drops',
      'Interactive Product Configurator Experiences',
      'Optimized Checkout & Lead Qualification Flows',
      'SEO & OpenGraph Semantic Infrastructure'
    ],
    technologies: ['Next.js / Vite', 'Headless CMS', 'Stripe / Payment SDKs', 'Motion'],
    timeline: '3–5 Weeks'
  },
  {
    index: '04',
    title: 'Brand Identity & Visual Direction',
    lead: 'Disciplined typographic systems, editorial art direction, and spatial brand presence.',
    description: 'A brand identity is only as strong as its execution across digital touchpoints. We craft typographic hierarchies, color governance models, and visual guidelines tailored to your domain.',
    deliverables: [
      'Typographic Pairing & Grid Systems',
      'Color Palette & Dark-Mode Contrast Models',
      'Motion Guidelines & Micro-Interaction Timing',
      'Digital Asset Toolkits & Vector Systems'
    ],
    technologies: ['Vector Craft', 'Motion Choreography', 'Typography Systems'],
    timeline: '2–4 Weeks'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Vanguard replaced our fragmented client portal with a cohesive, ultra-responsive liquidity engine. In three months, institutional allocations grew by 182% because clients finally trusted the interface with high-value transactions.',
    author: 'Julian Sterling',
    role: 'Chief Investment Officer',
    company: 'Aether Asset Management',
    impactMetric: '+182% Inbound Allocations'
  },
  {
    quote: 'Their engineering discipline is unmatched. No boilerplate, no slop, no dead buttons. They delivered our hardware flagship two weeks ahead of schedule and the visual fidelity converted direct sales immediately.',
    author: 'Elena Rostova',
    role: 'Head of Product Engineering',
    company: 'Kinesis Precision Dynamics',
    impactMetric: '$2.1M DTC Pre-Orders'
  },
  {
    quote: 'The design system Vanguard delivered became the single source of truth for 40+ engineers. Our UI delivery cycle dropped from weeks to days, with zero regression in accessibility standards.',
    author: 'Marcus Vance',
    role: 'VP of Platform Infrastructure',
    company: 'Meridian Edge Networks',
    impactMetric: '-72% Resolution Time'
  }
];

export const INSIGHTS: InsightArticle[] = [
  {
    id: 'anti-slop-design',
    title: 'The Discipline of Restraint: Why Modern Digital Interfaces Must Abandon Decorative Clutter',
    date: 'October 2026',
    readTime: '5 min read',
    category: 'Design Philosophy',
    summary: 'Examining why generic AI templates fail institutional buyers, and how bespoke typographic math and single-elevation depth build enduring digital credibility.'
  },
  {
    id: 'performance-budget',
    title: 'Sub-50ms Time-to-Interactive: Engineering High-Density Financial Dashboards in React 19',
    date: 'September 2026',
    readTime: '8 min read',
    category: 'Engineering Architecture',
    summary: 'A deep architectural review on avoiding layout thrashing, virtualizing massive real-time ledgers, and maintaining strict 60fps frame rates.'
  },
  {
    id: 'design-tokens-reality',
    title: 'From Figma Primitives to Tailwind Utilities: Building Resilient Multi-Brand Token Hierarchies',
    date: 'August 2026',
    readTime: '6 min read',
    category: 'Design Systems',
    summary: 'How to structure semantic color budgets and optical weight compensations so light and dark modes deliver equal contrast compliance without visual distortion.'
  }
];
