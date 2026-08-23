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
  github: string;
  link: string;
  event: string;
  points: string[];
  image: string | null; // path to image in /info/projects/ or null
}

export function getProjects(): ProjectItem[] {
  const projDir = path.join(process.cwd(), "public", "info", "projects");

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

    // Extract bullet points from markdown body
    const rawLines = bodyContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const points: string[] = [];
    let currentPoint = "";

    rawLines.forEach((line) => {
      if (
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

    // Look for a corresponding image file
    const baseName = filename.replace(/\.md$/, "");
    const imageExts = [".png", ".jpg", ".jpeg", ".webp"];
    let imagePath: string | null = null;

    for (const ext of imageExts) {
      const imgFile = path.join(projDir, baseName + ext);
      if (fs.existsSync(imgFile)) {
        imagePath = `/info/projects/${baseName}${ext}`;
        break;
      }
    }

    // Parse techStack as comma-separated list
    const techStack = data.techStack
      ? data.techStack.split(",").map((t) => t.trim())
      : [];

    const description =
      data.description ||
      (points.length > 0 ? points[0] : "");

    return {
      id: baseName,
      title: data.title || "Project",
      tag: data.tag || "Project",
      description,
      techStack,
      order: data.order ? parseInt(data.order, 10) : 99,
      featured: data.featured === "true",
      github: data.github || "",
      link: data.link || "",
      event: data.event || "",
      points,
      image: imagePath,
    };
  });

  return projects.sort((a, b) => a.order - b.order);
}
