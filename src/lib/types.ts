export interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  period: string;
  tech: string[];
  featured?: boolean;
  github?: string;
  demo?: string;
  metrics?: string;
  content: string;
}

export interface ResearchItem {
  slug: string;
  title: string;
  paper: string;
  description: string;
  category: string;
  period: string;
  tech: string[];
  github?: string;
  highlight?: string;
  content: string;
}

export interface LearningItem {
  slug: string;
  title: string;
  status: "in progress" | "actively building" | "not started yet";
  description: string;
  progress?: number;
  resources?: string[];
  github?: string;
  content: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  tech: string[];
  markdown: string;
}

export interface SkillItem {
  name: string;
  category: string;
}

export interface LabItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  embedPath: string;
  fullPath: string;
  tech: string[];
  highlights: string[];
}

export interface LinkedInPostItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  url: string;
  tags: string[];
  metrics: string;
}
