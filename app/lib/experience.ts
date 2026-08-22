import fs from "fs";
import path from "path";

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  order: number;
  points: string[];
}

export function getExperiences(): ExperienceItem[] {
  // Check standard and potential typo directories
  const candidateDirs = [
    path.join(process.cwd(), "public", "info", "experience"),
    path.join(process.cwd(), "public", "info", "experince"),
  ];

  let expDir = candidateDirs.find((dir) => fs.existsSync(dir));

  if (!expDir) {
    return [];
  }

  const files = fs.readdirSync(expDir).filter((file) => file.endsWith(".md"));

  const experiences: ExperienceItem[] = files.map((filename) => {
    const fullPath = path.join(expDir!, filename);
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
    const rawPoints = bodyContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const points: string[] = [];
    let currentPoint = "";

    rawPoints.forEach((line) => {
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

    return {
      id: filename.replace(/\.md$/, ""),
      company: data.company || "Company",
      role: data.role || "Role",
      location: data.location || "Location",
      period: data.period || "Period",
      order: data.order ? parseInt(data.order, 10) : 99,
      points,
    };
  });

  return experiences.sort((a, b) => a.order - b.order);
}
