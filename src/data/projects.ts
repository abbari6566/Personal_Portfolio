import type { Project } from './types';

export const projects: Project[] = [
  {
    name: 'InterviewCraft',
    category: 'AI Integration',
    categoryIcon: 'smart_toy',
    description:
      'An AI-powered interview preparation platform. Simulates technical and behavioral interviews, providing real-time feedback using LLMs.',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=600&h=400',
    imageAlt:
      'A macro shot of a sleek, dark mechanical keyboard illuminated by subtle teal backlighting.',
    links: [
      { label: 'Source', href: 'https://github.com/abbari6566', icon: 'terminal' },
      { label: 'Live', href: '#', icon: 'open_in_new' },
    ],
  },
  {
    name: 'PaperPilot',
    category: 'RAG Architecture',
    categoryIcon: 'plagiarism',
    description:
      'A Retrieval-Augmented Generation (RAG) platform designed to ingest and query dense academic papers, accelerating research workflows.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600&h=400',
    imageAlt:
      'Abstract visualization of data nodes connecting in 3D space, resembling a neural network, in deep blacks and glowing teals.',
    links: [{ label: 'Source', href: 'https://github.com/abbari6566', icon: 'terminal' }],
  },
];
