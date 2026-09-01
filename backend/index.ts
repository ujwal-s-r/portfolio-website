import { asc, eq, or } from "drizzle-orm";
import {
  db,
  projects,
  experiences,
  nowItems,
  skillGroups,
  linkedInPosts,
  siteSettings,
} from "./db";
import type { ExperienceItem } from "@/app/lib/experience";
import type { ProjectItem } from "@/app/lib/projects";
import type { NowItem, SkillGroup } from "@/app/lib/now";
import type { LinkedInPostItem } from "@/app/lib/linkedin";
import { runMigrations } from "./db/seed";

// Auto-run schema migrations on first startup if needed
let initialized = false;
async function ensureInit() {
  if (!initialized) {
    try {
      await runMigrations();
      initialized = true;
    } catch {
      // ignore if already created
    }
  }
}

// 1. EXPERIENCES
export async function getExperiences(): Promise<ExperienceItem[]> {
  await ensureInit();
  try {
    const rows = await db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.orderIndex));

    return rows.map((r) => ({
      id: r.slug,
      company: r.company,
      role: r.role,
      location: r.location,
      period: r.period,
      order: r.orderIndex,
      points: JSON.parse(r.points || "[]"),
    }));
  } catch (err) {
    console.error("Error loading experiences from DB:", err);
    return [];
  }
}

export async function getExperienceBySlug(slug: string): Promise<ExperienceItem | null> {
  await ensureInit();
  try {
    const decoded = decodeURIComponent(slug);
    const rows = await db
      .select()
      .from(experiences)
      .where(
        or(
          eq(experiences.slug, slug),
          eq(experiences.id, slug),
          eq(experiences.slug, decoded),
          eq(experiences.id, decoded)
        )
      )
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.slug,
      company: r.company,
      role: r.role,
      location: r.location,
      period: r.period,
      order: r.orderIndex,
      points: JSON.parse(r.points || "[]"),
    };
  } catch (err) {
    console.error("Error in getExperienceBySlug:", err);
    return null;
  }
}

// 2. PROJECTS & RESEARCH
export async function getProjects(): Promise<ProjectItem[]> {
  await ensureInit();
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.category, "projects"))
      .orderBy(asc(projects.orderIndex));

    return rows.map((r) => ({
      id: r.slug,
      title: r.title,
      tag: r.tag,
      description: r.description,
      techStack: JSON.parse(r.techStack || "[]"),
      order: r.orderIndex,
      featured: r.featured === 1,
      ongoing: r.ongoing === 1,
      status: r.status,
      github: r.github,
      linkedin: r.linkedin,
      link: r.link,
      event: r.event,
      points: JSON.parse(r.points || "[]"),
      image: r.image,
    }));
  } catch (err) {
    console.error("Error loading projects from DB:", err);
    return [];
  }
}

export async function getResearch(): Promise<ProjectItem[]> {
  await ensureInit();
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.category, "research"))
      .orderBy(asc(projects.orderIndex));

    return rows.map((r) => ({
      id: r.slug,
      title: r.title,
      tag: r.tag,
      description: r.description,
      techStack: JSON.parse(r.techStack || "[]"),
      order: r.orderIndex,
      featured: r.featured === 1,
      ongoing: r.ongoing === 1,
      status: r.status,
      github: r.github,
      linkedin: r.linkedin,
      link: r.link,
      event: r.event,
      points: JSON.parse(r.points || "[]"),
      image: r.image,
    }));
  } catch (err) {
    console.error("Error loading research from DB:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  await ensureInit();
  try {
    const decoded = decodeURIComponent(slug);
    const rows = await db
      .select()
      .from(projects)
      .where(
        or(
          eq(projects.slug, slug),
          eq(projects.id, slug),
          eq(projects.slug, decoded),
          eq(projects.id, decoded),
          eq(projects.id, `projects-${slug}`),
          eq(projects.id, `research-${slug}`),
          eq(projects.id, `projects-${decoded}`),
          eq(projects.id, `research-${decoded}`)
        )
      )
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.slug,
      title: r.title,
      tag: r.tag,
      description: r.description,
      techStack: JSON.parse(r.techStack || "[]"),
      order: r.orderIndex,
      featured: r.featured === 1,
      ongoing: r.ongoing === 1,
      status: r.status,
      github: r.github,
      linkedin: r.linkedin,
      link: r.link,
      event: r.event,
      points: JSON.parse(r.points || "[]"),
      image: r.image,
    };
  } catch (err) {
    console.error("Error in getProjectBySlug:", err);
    return null;
  }
}

export async function getResearchBySlug(slug: string): Promise<ProjectItem | null> {
  return getProjectBySlug(slug);
}

// 3. NOW ITEMS (BUILDING & LEARNING)
export async function getNowBuilding(): Promise<NowItem[]> {
  await ensureInit();
  try {
    const rows = await db
      .select()
      .from(nowItems)
      .where(eq(nowItems.category, "BUILDING"))
      .orderBy(asc(nowItems.orderIndex));

    return rows.map((r) => ({
      id: r.slug,
      title: r.title,
      category: "BUILDING",
      status: r.status,
      techStack: JSON.parse(r.techStack || "[]"),
      github: r.github,
      order: r.orderIndex,
      description: r.description,
    }));
  } catch (err) {
    console.error("Error loading now building from DB:", err);
    return [];
  }
}

export async function getNowLearning(): Promise<NowItem[]> {
  await ensureInit();
  try {
    const rows = await db
      .select()
      .from(nowItems)
      .where(eq(nowItems.category, "LEARNING"))
      .orderBy(asc(nowItems.orderIndex));

    return rows.map((r) => ({
      id: r.slug,
      title: r.title,
      category: "LEARNING",
      status: r.status,
      techStack: JSON.parse(r.techStack || "[]"),
      github: r.github,
      order: r.orderIndex,
      description: r.description,
    }));
  } catch (err) {
    console.error("Error loading now learning from DB:", err);
    return [];
  }
}

// 4. SKILLS
export async function getNowSkills(): Promise<SkillGroup[]> {
  await ensureInit();
  try {
    const rows = await db
      .select()
      .from(skillGroups)
      .orderBy(asc(skillGroups.orderIndex));

    return rows.map((r) => ({
      id: r.id,
      category: r.category,
      skills: JSON.parse(r.skills || "[]"),
    }));
  } catch (err) {
    console.error("Error loading skills from DB:", err);
    return [];
  }
}

// 5. LINKEDIN POSTS
export async function getLinkedInPosts(): Promise<LinkedInPostItem[]> {
  await ensureInit();
  try {
    const rows = await db
      .select()
      .from(linkedInPosts)
      .orderBy(asc(linkedInPosts.orderIndex));

    return rows.map((r) => ({
      id: r.slug,
      title: r.title,
      image: r.image,
      link: r.link,
      order: r.orderIndex,
      text: r.text,
    }));
  } catch (err) {
    console.error("Error loading linkedin posts from DB:", err);
    return [];
  }
}

import { getBlobUrl } from "@/app/lib/blob";
import { count, sql } from "drizzle-orm";
import { visitors } from "./db";

// 6. SITE SETTINGS (RESUME)
export async function getResumeUrl(): Promise<string> {
  await ensureInit();
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "resume_url"))
      .limit(1);

    if (rows.length > 0 && rows[0].value) {
      return getBlobUrl(rows[0].value);
    }
  } catch (err) {
    console.error("Error loading resume URL from DB:", err);
  }
  return getBlobUrl("/resume.pdf");
}

export async function setResumeUrl(url: string): Promise<void> {
  await ensureInit();
  await db
    .insert(siteSettings)
    .values({
      key: "resume_url",
      value: url,
      updatedAt: Date.now(),
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        value: url,
        updatedAt: Date.now(),
      },
    });
}

// 7. VISITORS TRACKING
export async function recordVisitor(deviceHash: string): Promise<number> {
  await ensureInit();
  const now = new Date().toISOString();
  try {
    await db
      .insert(visitors)
      .values({
        deviceHash,
        firstVisitedAt: now,
        lastVisitedAt: now,
        totalVisits: 1,
      })
      .onConflictDoUpdate({
        target: visitors.deviceHash,
        set: {
          lastVisitedAt: now,
          totalVisits: sql`${visitors.totalVisits} + 1`,
        },
      });
  } catch (err) {
    console.error("Error recording visitor:", err);
  }
  return getUniqueVisitorCount();
}

export async function getUniqueVisitorCount(): Promise<number> {
  await ensureInit();
  try {
    const res = await db.select({ total: count() }).from(visitors);
    return res[0]?.total ?? 0;
  } catch (err) {
    console.error("Error getting visitor count:", err);
    return 0;
  }
}

export * from "./db";
