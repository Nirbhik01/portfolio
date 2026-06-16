import type { PortfolioConfig } from './types';

/**
 * Single source of truth for all content rendered on the site.
 *
 * Edit this file to update the portfolio — no component changes required.
 * The shape is validated at runtime by `validateConfig` (see ./validate.ts)
 * and asserted in the test-suite.
 */
export const portfolioConfig: PortfolioConfig = {
  profile: {
    name: 'Nirbhik Dhakal',
    title: 'Associate Data Engineer · ML / NLP Engineer',
    location: 'Kathmandu, Nepal',
    summary:
      'Data engineer and ML/NLP practitioner building fault-tolerant data ' +
      'pipelines and applied deep-learning systems — from multimodal medical ' +
      'RAG to gradient-based machine unlearning.',
    email: 'nirbhikdhakal8@gmail.com',
    phone: '+977-9810114211',
    social: [
      { label: 'GitHub', url: 'https://github.com/Nirbhik01', icon: 'github' },
      { label: 'Email', url: 'mailto:nirbhikdhakal8@gmail.com', icon: 'mail' },
    ],
  },

  experience: [
    {
      role: 'Associate Data Engineer',
      company: 'PMSquare Nepal',
      period: 'October 2025 – Present',
      project: 'SmartShift — Data Migration Platform for Ticket Management Systems',
      stack: ['Python', 'Temporal.io', 'REST APIs', 'ETL'],
      highlights: [
        'Built Python ETL pipelines for cross-platform ticket data migration, including transformation and schema mapping.',
        'Orchestrated fault-tolerant migration workflows with Temporal.io using retries and state persistence.',
        'Integrated multiple TMS REST APIs (pagination, rate limiting) to migrate large datasets while reducing manual data cleansing by ~60%.',
        'Implemented structured logging for monitoring and debugging.',
      ],
    },
  ],

  projects: [
    {
      name: 'Machine Unlearning',
      tagline: 'Gradient-based data influence removal',
      description:
        'Developing a gradient-based machine unlearning framework to selectively ' +
        'erase training-data influence from neural networks via gradient ascent and ' +
        'influence functions, enabling targeted data removal without full retraining.',
      stack: ['Python', 'PyTorch', 'Gradient-Based Unlearning'],
      ongoing: true,
    },
    {
      name: 'Multimodal-RAG',
      tagline: 'Medical retrieval-augmented generation',
      description:
        'A multimodal medical RAG pipeline combining chest X-ray (Rad-DINO) and ' +
        'clinical text (PubMedBERT) embeddings with hybrid dense+sparse retrieval ' +
        '(BM25 + RRF), MedCPT cross-encoder reranking, and local LLM inference.',
      stack: ['Python', 'Django', 'PyTorch', 'RAG', 'PubMedBERT', 'Rad-DINO'],
    },
    {
      name: 'Intent-Classification Chatbot',
      tagline: 'NLP intent categorisation',
      description:
        'An NLP pipeline with preprocessing, Word2Vec & SBERT embeddings, class ' +
        'balancing, and classifier training to categorise user intents; compared raw ' +
        'vs. balanced model variants and serialised for deployment-ready inference.',
      stack: ['Python', 'NLP', 'Word2Vec', 'SBERT', 'Pandas'],
    },
    {
      name: 'Reportease',
      tagline: 'Crime reporting & case management',
      description:
        'An algorithmic investigator-recommendation engine using TF-IDF and cosine ' +
        'similarity to auto-assign cases; with real-time WebSocket messaging and ' +
        'multi-factor identity verification (OTP + document upload).',
      stack: ['Python', 'Django', 'TF-IDF', 'Cosine Similarity', 'WebSocket'],
    },
    {
      name: 'Bidbay',
      tagline: 'Online auction platform',
      description:
        'A real-time multi-user auction platform with live WebSocket bidding, PayPal ' +
        'payment integration, and server-side bid-validation logic enforcing auction ' +
        'business rules.',
      stack: ['Python', 'Django', 'WebSocket', 'PayPal API'],
    },
  ],

  skills: [
    {
      category: 'ML / NLP',
      items: [
        'TF-IDF',
        'Cosine Similarity',
        'SBERT',
        'RAG',
        'Multimodal Embeddings',
        'Intent Classification',
        'Neural Networks',
        'PyTorch',
      ],
    },
    {
      category: 'Backend',
      items: ['Python', 'Django', 'REST APIs', 'WebSockets', 'Temporal.io', 'Async Processing'],
    },
    {
      category: 'Data Engineering',
      items: [
        'ETL Pipelines',
        'Data Migration',
        'Schema Mapping',
        'Data Transformation',
        'Data Quality Validation',
      ],
    },
    {
      category: 'Databases & Tools',
      items: ['PostgreSQL', 'SQL', 'Upstash Vector DB', 'Git', 'GitHub', 'VS Code'],
    },
    {
      category: 'Languages',
      items: ['Python (Primary)', 'JavaScript (Basic)'],
    },
  ],

  education: [
    {
      degree: 'B.Sc. CSIT',
      institution: 'Deerwalk Institute of Technology, Kathmandu',
      period: '2021 – 2025',
    },
    {
      degree: '+2 Science',
      institution: "Trinity Int'l College",
      period: '2018 – 2021',
      detail: 'GPA: 3.36',
    },
  ],

  interests: [
    'Deep Learning & Neural Networks',
    'Natural Language Processing',
    'Computer Vision',
    'Data Engineering',
  ],

  footerNote: 'Nirbhik Dhakal',
};

export default portfolioConfig;
