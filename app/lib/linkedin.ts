import fs from "fs";
import path from "path";

export interface LinkedInPostItem {
  id: string;
  title: string;
  image: string;
  link: string;
  order: number;
  text: string;
}

export function getLinkedInPosts(): LinkedInPostItem[] {
  const dir = path.join(process.cwd(), "public", "info", "linkedin", "posts");
  if (!fs.existsSync(dir)) return [];

  const mdFiles = fs.readdirSync(dir).filter((file) => file.endsWith(".md"));

  const posts: LinkedInPostItem[] = mdFiles.map((filename) => {
    const fullPath = path.join(dir, filename);
    const fileContent = fs.readFileSync(fullPath, "utf-8");

    const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const frontmatterBlock = frontmatterMatch ? frontmatterMatch[1] : "";
    const text = frontmatterMatch
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

    return {
      id: filename.replace(/\.md$/, ""),
      title: data.title || "LinkedIn Post",
      image: data.image || "",
      link: data.link || "",
      order: data.order ? parseInt(data.order, 10) : 99,
      text,
    };
  });

  return posts.sort((a, b) => a.order - b.order);
}
