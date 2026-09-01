import fs from "fs";
import path from "path";
import { client, db, projects, experiences, nowItems, skillGroups, linkedInPosts } from "./index";

export async function runMigrations(drop = false) {
  if (drop) {
    await client.execute(`DROP TABLE IF EXISTS projects;`);
    await client.execute(`DROP TABLE IF EXISTS experiences;`);
    await client.execute(`DROP TABLE IF EXISTS now_items;`);
    await client.execute(`DROP TABLE IF EXISTS skill_groups;`);
    await client.execute(`DROP TABLE IF EXISTS linkedin_posts;`);
  }

  await client.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      tag TEXT NOT NULL DEFAULT 'Project',
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'projects',
      tech_stack TEXT NOT NULL DEFAULT '[]',
      points TEXT NOT NULL DEFAULT '[]',
      image TEXT,
      order_index INTEGER NOT NULL DEFAULT 99,
      featured INTEGER NOT NULL DEFAULT 0,
      ongoing INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'completed',
      github TEXT NOT NULL DEFAULT '',
      linkedin TEXT NOT NULL DEFAULT '',
      link TEXT NOT NULL DEFAULT '',
      event TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT ''
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      period TEXT NOT NULL DEFAULT '',
      order_index INTEGER NOT NULL DEFAULT 99,
      points TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT ''
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS now_items (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'BUILDING',
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      tech_stack TEXT NOT NULL DEFAULT '[]',
      github TEXT NOT NULL DEFAULT '',
      order_index INTEGER NOT NULL DEFAULT 99,
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT ''
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS skill_groups (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      skills TEXT NOT NULL DEFAULT '[]',
      order_index INTEGER NOT NULL DEFAULT 99
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS linkedin_posts (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      link TEXT NOT NULL DEFAULT '',
      order_index INTEGER NOT NULL DEFAULT 99,
      text TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT ''
    );
  `);
}

function parseMarkdownFile(fullPath: string) {
  const fileContent = fs.readFileSync(fullPath, "utf-8");
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
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });

  return { data, bodyContent };
}

function parseMarkdownPoints(bodyContent: string): string[] {
  const rawLines = bodyContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const points: string[] = [];
  let currentPoint = "";

  rawLines.forEach((line) => {
    if (
      line.startsWith("![") ||
      line.startsWith("<img") ||
      line.startsWith("<image")
    ) {
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

  return points;
}

export async function seedDatabase() {
  console.log("🌱 Starting Database Migration & Seeding...");
  await runMigrations();

  const publicInfoDir = path.join(process.cwd(), "public", "info");

  // 1. SEED PROJECTS & RESEARCH
  const categories: Array<"projects" | "research"> = ["projects", "research"];
  for (const category of categories) {
    const dir = path.join(publicInfoDir, category);
    if (!fs.existsSync(dir)) continue;

    const mdFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const filename of mdFiles) {
      const fullPath = path.join(dir, filename);
      const { data, bodyContent } = parseMarkdownFile(fullPath);
      const points = parseMarkdownPoints(bodyContent);

      const baseName = filename.replace(/\.md$/, "");
      const imageExts = [".png", ".jpg", ".jpeg", ".webp"];
      let imagePath: string | null = null;

      for (const ext of imageExts) {
        const imgFile = path.join(dir, baseName + ext);
        if (fs.existsSync(imgFile)) {
          imagePath = `/info/${category}/${baseName}${ext}`;
          break;
        }
      }

      const techStack = data.techStack
        ? data.techStack.split(",").map((t) => t.trim())
        : [];

      const firstTextPoint =
        points.find((p) => !p.startsWith("![") && !p.startsWith("<")) || "";
      const description = data.description || firstTextPoint;

      const statusVal = (data.status || "").toLowerCase();
      const isOngoing =
        statusVal === "ongoing" ||
        statusVal === "active" ||
        data.ongoing === "true" ||
        data.ongoing === "yes";

      const id = `${category}-${baseName}`;
      const slug = baseName;

      await db
        .insert(projects)
        .values({
          id,
          slug,
          title: data.title || "Project",
          tag: data.tag || "Project",
          description,
          category,
          techStack: JSON.stringify(techStack),
          points: JSON.stringify(points),
          image: imagePath,
          orderIndex: data.order ? parseInt(data.order, 10) : 99,
          featured: data.featured === "true" ? 1 : 0,
          ongoing: isOngoing ? 1 : 0,
          status: data.status || (isOngoing ? "ongoing" : "completed"),
          github: data.github || "",
          linkedin: data.linkedin || "",
          link: data.link || "",
          event: data.event || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: projects.id,
          set: {
            title: data.title || "Project",
            tag: data.tag || "Project",
            description,
            techStack: JSON.stringify(techStack),
            points: JSON.stringify(points),
            image: imagePath,
            orderIndex: data.order ? parseInt(data.order, 10) : 99,
            featured: data.featured === "true" ? 1 : 0,
            ongoing: isOngoing ? 1 : 0,
            status: data.status || (isOngoing ? "ongoing" : "completed"),
            github: data.github || "",
            linkedin: data.linkedin || "",
            link: data.link || "",
            event: data.event || "",
            updatedAt: new Date().toISOString(),
          },
        });
    }
  }

  // 2. SEED EXPERIENCES
  const candidateExpDirs = [
    path.join(publicInfoDir, "experience"),
    path.join(publicInfoDir, "experince"),
  ];
  const expDir = candidateExpDirs.find((d) => fs.existsSync(d));
  if (expDir) {
    const expFiles = fs.readdirSync(expDir).filter((f) => f.endsWith(".md"));
    for (const filename of expFiles) {
      const fullPath = path.join(expDir, filename);
      const { data, bodyContent } = parseMarkdownFile(fullPath);
      const points = parseMarkdownPoints(bodyContent);
      const baseName = filename.replace(/\.md$/, "");

      await db
        .insert(experiences)
        .values({
          id: baseName,
          slug: baseName,
          company: data.company || "Company",
          role: data.role || "Role",
          location: data.location || "Location",
          period: data.period || "Period",
          orderIndex: data.order ? parseInt(data.order, 10) : 99,
          points: JSON.stringify(points),
          createdAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: experiences.id,
          set: {
            company: data.company || "Company",
            role: data.role || "Role",
            location: data.location || "Location",
            period: data.period || "Period",
            orderIndex: data.order ? parseInt(data.order, 10) : 99,
            points: JSON.stringify(points),
          },
        });
    }
  }

  // 3. SEED NOW ITEMS (BUILDING & LEARNING)
  const nowCategories: Array<"building" | "learning"> = ["building", "learning"];
  for (const sub of nowCategories) {
    const dir = path.join(publicInfoDir, "now", sub);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const filename of files) {
      const fullPath = path.join(dir, filename);
      const { data, bodyContent } = parseMarkdownFile(fullPath);
      const baseName = filename.replace(/\.md$/, "");
      const techStack = data.techStack
        ? data.techStack.split(",").map((t) => t.trim())
        : [];

      await db
        .insert(nowItems)
        .values({
          id: `${sub}-${baseName}`,
          slug: baseName,
          title: data.title || "Topic",
          category: (data.category?.toUpperCase() ||
            (sub === "building" ? "BUILDING" : "LEARNING")) as
            | "BUILDING"
            | "LEARNING",
          status: data.status || "ACTIVE",
          techStack: JSON.stringify(techStack),
          github: data.github || "",
          orderIndex: data.order ? parseInt(data.order, 10) : 99,
          description: bodyContent,
          createdAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: nowItems.id,
          set: {
            title: data.title || "Topic",
            category: (data.category?.toUpperCase() ||
              (sub === "building" ? "BUILDING" : "LEARNING")) as
              | "BUILDING"
              | "LEARNING",
            status: data.status || "ACTIVE",
            techStack: JSON.stringify(techStack),
            github: data.github || "",
            orderIndex: data.order ? parseInt(data.order, 10) : 99,
            description: bodyContent,
          },
        });
    }
  }

  // 4. SEED SKILLS
  const skillsPath = path.join(publicInfoDir, "now", "skills.md");
  if (fs.existsSync(skillsPath)) {
    const content = fs.readFileSync(skillsPath, "utf-8");
    const lines = content.split("\n");

    let currentCategory = "";
    let currentSkills: string[] = [];
    let groupOrder = 1;

    const saveGroup = async () => {
      if (currentCategory && currentSkills.length > 0) {
        const id = currentCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        await db
          .insert(skillGroups)
          .values({
            id,
            category: currentCategory,
            skills: JSON.stringify(currentSkills),
            orderIndex: groupOrder++,
          })
          .onConflictDoUpdate({
            target: skillGroups.id,
            set: {
              category: currentCategory,
              skills: JSON.stringify(currentSkills),
            },
          });
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (line.startsWith("#")) {
        await saveGroup();
        currentCategory = line.replace(/^#+\s*/, "").trim();
        currentSkills = [];
      } else {
        const parts = line
          .split(/[·,|]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        currentSkills.push(...parts);
      }
    }
    await saveGroup();
  }

  // 5. SEED LINKEDIN POSTS
  const postDir = path.join(publicInfoDir, "linkedin", "posts");
  if (fs.existsSync(postDir)) {
    const files = fs.readdirSync(postDir).filter((f) => f.endsWith(".md"));
    for (const filename of files) {
      const fullPath = path.join(postDir, filename);
      const { data, bodyContent } = parseMarkdownFile(fullPath);
      const baseName = filename.replace(/\.md$/, "");

      await db
        .insert(linkedInPosts)
        .values({
          id: baseName,
          slug: baseName,
          title: data.title || "LinkedIn Post",
          image: data.image || "",
          link: data.link || "",
          orderIndex: data.order ? parseInt(data.order, 10) : 99,
          text: bodyContent,
          createdAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: linkedInPosts.id,
          set: {
            title: data.title || "LinkedIn Post",
            image: data.image || "",
            link: data.link || "",
            orderIndex: data.order ? parseInt(data.order, 10) : 99,
            text: bodyContent,
          },
        });
    }
  }

  console.log("✅ Database seeding complete!");
}
