import fs from "fs";
import path from "path";

export interface ProjectItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  techStack: string[];
  order: number;
  featured: boolean;
  ongoing: boolean;
  status: string;
  github: string;
  linkedin: string;
  link: string;
  event: string;
  points: string[];
  image: string | null; // path to image in /info/projects/ or null
}

function loadProjectsFrom(folder: string): ProjectItem[] {
  const projDir = path.join(process.cwd(), "public", "info", folder);

  if (!fs.existsSync(projDir)) {
    return [];
  }

  const mdFiles = fs
    .readdirSync(projDir)
    .filter((file) => file.endsWith(".md"));

  const projects: ProjectItem[] = mdFiles.map((filename) => {
    const fullPath = path.join(projDir, filename);
    const fileContent = fs.readFileSync(fullPath, "utf-8");

    // Simple robust frontmatter parser
    const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const frontmatterBlock = frontmatterMatch ? frontmatterMatch[1] : "";
    const bodyContent = frontmatterMatch
      ? fileContent.slice(frontmatterMatch[0].length).trim()
      : fileContent.trim();

    const data: Record<string, string> = {};
    frontmatterBlock.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        // Remove surrounding quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        data[key] = value;
      }
    });

    // Extract bullet points & inline images from markdown body
    const rawLines = bodyContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const points: string[] = [];
    let currentPoint = "";

    rawLines.forEach((line) => {
      if (line.startsWith("![") || line.startsWith("<img") || line.startsWith("<image")) {
        if (currentPoint) {
          points.push(currentPoint);
          currentPoint = "";
        }
        points.push(line);
      } else if (
        line.startsWith("- ") ||
        line.startsWith("* ") ||
        line.startsWith("• ")
      ) {
        if (currentPoint) {
          points.push(currentPoint);
        }
        currentPoint = line.replace(/^[-*•]\s+/, "");
      } else if (currentPoint) {
        currentPoint += " " + line;
      } else {
        points.push(line);
      }
    });

    if (currentPoint) {
      points.push(currentPoint);
    }

    // Look for a corresponding thumbnail image file
    const baseName = filename.replace(/\.md$/, "");
    const imageExts = [".png", ".jpg", ".jpeg", ".webp"];
    let imagePath: string | null = null;

    for (const ext of imageExts) {
      const imgFile = path.join(projDir, baseName + ext);
      if (fs.existsSync(imgFile)) {
        imagePath = `/info/${folder}/${baseName}${ext}`;
        break;
      }
    }

    // Parse techStack as comma-separated list
    const techStack = data.techStack
      ? data.techStack.split(",").map((t) => t.trim())
      : [];

    const firstTextPoint = points.find((p) => !p.startsWith("![") && !p.startsWith("<")) || "";
    const description = data.description || firstTextPoint;

    const statusVal = (data.status || "").toLowerCase();
    const isOngoing =
      statusVal === "ongoing" ||
      statusVal === "active" ||
      data.ongoing === "true" ||
      data.ongoing === "yes";

    return {
      id: baseName,
      title: data.title || "Project",
      tag: data.tag || "Project",
      description,
      techStack,
      order: data.order ? parseInt(data.order, 10) : 99,
      featured: data.featured === "true",
      ongoing: isOngoing,
      status: data.status || (isOngoing ? "ongoing" : "completed"),
      github: data.github || "",
      linkedin: data.linkedin || "",
      link: data.link || "",
      event: data.event || "",
      points,
      image: imagePath,
    };
  });

  return projects.sort((a, b) => a.order - b.order);
}

export function getProjects(): ProjectItem[] {
  return loadProjectsFrom("projects");
}

export function getResearch(): ProjectItem[] {
  return loadProjectsFrom("research");
}
