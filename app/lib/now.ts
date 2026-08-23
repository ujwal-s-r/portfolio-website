import fs from "fs";
import path from "path";

export interface NowItem {
  id: string;
  title: string;
  category: "BUILDING" | "LEARNING";
  status: string;
  techStack: string[];
  github: string;
  order: number;
  description: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

function loadNowItemsFrom(subfolder: "building" | "learning"): NowItem[] {
  const dir = path.join(process.cwd(), "public", "info", "now", subfolder);
  if (!fs.existsSync(dir)) return [];

  const mdFiles = fs.readdirSync(dir).filter((file) => file.endsWith(".md"));

  const items: NowItem[] = mdFiles.map((filename) => {
    const fullPath = path.join(dir, filename);
    const fileContent = fs.readFileSync(fullPath, "utf-8");

    const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const frontmatterBlock = frontmatterMatch ? frontmatterMatch[1] : "";
    const description = frontmatterMatch
      ? fileContent.slice(frontmatterMatch[0].length).trim()
      : fileContent.trim();

    const data: Record<string, string> = {};
    frontmatterBlock.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        data[key] = value;
      }
    });

    const techStack = data.techStack
      ? data.techStack.split(",").map((t) => t.trim())
      : [];

    return {
      id: filename.replace(/\.md$/, ""),
      title: data.title || "Topic",
      category: (data.category?.toUpperCase() || (subfolder === "building" ? "BUILDING" : "LEARNING")) as "BUILDING" | "LEARNING",
      status: data.status || "ACTIVE",
      techStack,
      github: data.github || "",
      order: data.order ? parseInt(data.order, 10) : 99,
      description,
    };
  });

  return items.sort((a, b) => a.order - b.order);
}

export function getNowBuilding(): NowItem[] {
  return loadNowItemsFrom("building");
}

export function getNowLearning(): NowItem[] {
  return loadNowItemsFrom("learning");
}

export function getNowSkills(): SkillGroup[] {
  const filePath = path.join(process.cwd(), "public", "info", "now", "skills.md");
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const groups: SkillGroup[] = [];
  let currentCategory = "";
  let currentSkills: string[] = [];

  const finalizeGroup = () => {
    if (currentCategory && currentSkills.length > 0) {
      groups.push({
        id: currentCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: currentCategory,
        skills: currentSkills,
      });
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("#")) {
      finalizeGroup();
      currentCategory = line.replace(/^#+\s*/, "").trim();
      currentSkills = [];
    } else {
      // Split by bullet · or comma or pipe
      const parts = line
        .split(/[·,|]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      currentSkills.push(...parts);
    }
  }

  finalizeGroup();
  return groups;
}
