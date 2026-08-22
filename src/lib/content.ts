import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  ProjectItem,
  ResearchItem,
  LearningItem,
  ExperienceItem,
  SkillItem,
  LabItem,
  LinkedInPostItem,
} from "./types";

const contentDirectory = path.join(process.cwd(), "content");
const dataDirectory = path.join(process.cwd(), "data");

export function getProjects(): ProjectItem[] {
  const dir = path.join(contentDirectory, "projects");
  if (!fs.existsSync(dir)) return [];
  const fileNames = fs.readdirSync(dir);
  
  return fileNames
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const fullPath = path.join(dir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        category: data.category || "Project",
        period: data.period || "",
        tech: data.tech || [],
        featured: Boolean(data.featured),
        github: data.github || "",
        demo: data.demo || "",
        metrics: data.metrics || "",
        content,
      };
    });
}

export function getResearch(): ResearchItem[] {
  const dir = path.join(contentDirectory, "research");
  if (!fs.existsSync(dir)) return [];
  const fileNames = fs.readdirSync(dir);

  return fileNames
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const fullPath = path.join(dir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        paper: data.paper || "",
        description: data.description || "",
        category: data.category || "Research",
        period: data.period || "",
        tech: data.tech || [],
        github: data.github || "",
        highlight: data.highlight || "",
        content,
      };
    });
}

export function getLearning(): LearningItem[] {
  const dir = path.join(contentDirectory, "learning");
  if (!fs.existsSync(dir)) return [];
  const fileNames = fs.readdirSync(dir);

  return fileNames
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const fullPath = path.join(dir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        status: data.status || "in progress",
        description: data.description || "",
        progress: data.progress || 0,
        resources: data.resources || [],
        github: data.github || "",
        content,
      };
    });
}

export function getExperiences(): ExperienceItem[] {
  const filePath = path.join(dataDirectory, "experience.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function getSkills(): SkillItem[] {
  const filePath = path.join(dataDirectory, "skills.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function getLabs(): LabItem[] {
  const filePath = path.join(dataDirectory, "labs.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function getLinkedInPosts(): LinkedInPostItem[] {
  const filePath = path.join(dataDirectory, "linkedin-posts.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
