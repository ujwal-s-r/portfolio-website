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
