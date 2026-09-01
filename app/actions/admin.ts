"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import {
  db,
  projects,
  experiences,
  nowItems,
  skillGroups,
  linkedInPosts,
} from "@/backend/db";

const COOKIE_NAME = "admin_session";

async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === "authenticated";
}

// 1. AUTHENTICATION ACTIONS
export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid admin passcode" };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function checkAuthStatus(): Promise<boolean> {
  return await verifyAuth();
}

// 2. PROJECT & RESEARCH CRUD
export async function saveProject(data: {
  id?: string;
  slug: string;
  title: string;
  tag: string;
  description: string;
  category: "projects" | "research";
  techStack: string[];
  points: string[];
  image: string | null;
  orderIndex: number;
  featured: boolean;
  ongoing: boolean;
  status: string;
  github: string;
  linkedin: string;
  link: string;
  event: string;
}) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  const id = data.id || `${data.category}-${data.slug}`;

  await db
    .insert(projects)
    .values({
      id,
      slug: data.slug,
      title: data.title,
      tag: data.tag || "Project",
      description: data.description || "",
      category: data.category,
      techStack: JSON.stringify(data.techStack || []),
      points: JSON.stringify(data.points || []),
      image: data.image,
      orderIndex: data.orderIndex || 99,
      featured: data.featured ? 1 : 0,
      ongoing: data.ongoing ? 1 : 0,
      status: data.status || (data.ongoing ? "ongoing" : "completed"),
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
        slug: data.slug,
        title: data.title,
        tag: data.tag || "Project",
        description: data.description || "",
        category: data.category,
        techStack: JSON.stringify(data.techStack || []),
        points: JSON.stringify(data.points || []),
        image: data.image,
        orderIndex: data.orderIndex || 99,
        featured: data.featured ? 1 : 0,
        ongoing: data.ongoing ? 1 : 0,
        status: data.status || (data.ongoing ? "ongoing" : "completed"),
        github: data.github || "",
        linkedin: data.linkedin || "",
        link: data.link || "",
        event: data.event || "",
        updatedAt: new Date().toISOString(),
      },
    });

  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/research/[slug]", "page");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteProject(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/research/[slug]", "page");
  revalidatePath("/admin");
  return { success: true };
}

export async function reorderProjects(items: { id: string; orderIndex: number }[]) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  for (const item of items) {
    await db
      .update(projects)
      .set({ orderIndex: item.orderIndex })
      .where(eq(projects.id, item.id));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// 3. EXPERIENCE CRUD
export async function saveExperience(data: {
  id?: string;
  slug: string;
  company: string;
  role: string;
  location: string;
  period: string;
  orderIndex: number;
  points: string[];
}) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  const id = data.id || data.slug;

  await db
    .insert(experiences)
    .values({
      id,
      slug: data.slug,
      company: data.company,
      role: data.role,
      location: data.location || "",
      period: data.period || "",
      orderIndex: data.orderIndex || 99,
      points: JSON.stringify(data.points || []),
      createdAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: experiences.id,
      set: {
        slug: data.slug,
        company: data.company,
        role: data.role,
        location: data.location || "",
        period: data.period || "",
        orderIndex: data.orderIndex || 99,
        points: JSON.stringify(data.points || []),
      },
    });

  revalidatePath("/");
  revalidatePath("/experience/[slug]", "page");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteExperience(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  await db.delete(experiences).where(eq(experiences.id, id));

  revalidatePath("/");
  revalidatePath("/experience/[slug]", "page");
  revalidatePath("/admin");
  return { success: true };
}

export async function reorderExperiences(items: { id: string; orderIndex: number }[]) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  for (const item of items) {
    await db
      .update(experiences)
      .set({ orderIndex: item.orderIndex })
      .where(eq(experiences.id, item.id));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// 4. NOW ITEMS CRUD
export async function saveNowItem(data: {
  id?: string;
  slug: string;
  title: string;
  category: "BUILDING" | "LEARNING";
  status: string;
  techStack: string[];
  github: string;
  orderIndex: number;
  description: string;
}) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  const id = data.id || `${data.category.toLowerCase()}-${data.slug}`;

  await db
    .insert(nowItems)
    .values({
      id,
      slug: data.slug,
      title: data.title,
      category: data.category,
      status: data.status || "ACTIVE",
      techStack: JSON.stringify(data.techStack || []),
      github: data.github || "",
      orderIndex: data.orderIndex || 99,
      description: data.description || "",
      createdAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: nowItems.id,
      set: {
        slug: data.slug,
        title: data.title,
        category: data.category,
        status: data.status || "ACTIVE",
        techStack: JSON.stringify(data.techStack || []),
        github: data.github || "",
        orderIndex: data.orderIndex || 99,
        description: data.description || "",
      },
    });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteNowItem(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  await db.delete(nowItems).where(eq(nowItems.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function reorderNowItems(items: { id: string; orderIndex: number }[]) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  for (const item of items) {
    await db
      .update(nowItems)
      .set({ orderIndex: item.orderIndex })
      .where(eq(nowItems.id, item.id));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// 5. SKILLS CRUD
export async function saveSkillGroup(data: {
  id?: string;
  category: string;
  skills: string[];
  orderIndex: number;
}) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  const id = data.id || data.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  await db
    .insert(skillGroups)
    .values({
      id,
      category: data.category,
      skills: JSON.stringify(data.skills || []),
      orderIndex: data.orderIndex || 99,
    })
    .onConflictDoUpdate({
      target: skillGroups.id,
      set: {
        category: data.category,
        skills: JSON.stringify(data.skills || []),
        orderIndex: data.orderIndex || 99,
      },
    });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteSkillGroup(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  await db.delete(skillGroups).where(eq(skillGroups.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// 6. LINKEDIN POSTS CRUD
export async function saveLinkedInPost(data: {
  id?: string;
  slug: string;
  title: string;
  image: string;
  link: string;
  orderIndex: number;
  text: string;
}) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  const id = data.id || data.slug;

  await db
    .insert(linkedInPosts)
    .values({
      id,
      slug: data.slug,
      title: data.title,
      image: data.image || "",
      link: data.link || "",
      orderIndex: data.orderIndex || 99,
      text: data.text || "",
      createdAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: linkedInPosts.id,
      set: {
        slug: data.slug,
        title: data.title,
        image: data.image || "",
        link: data.link || "",
        orderIndex: data.orderIndex || 99,
        text: data.text || "",
      },
    });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function reorderSkillGroups(items: { id: string; orderIndex: number }[]) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  for (const item of items) {
    await db
      .update(skillGroups)
      .set({ orderIndex: item.orderIndex })
      .where(eq(skillGroups.id, item.id));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteLinkedInPost(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  await db.delete(linkedInPosts).where(eq(linkedInPosts.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function reorderLinkedInPosts(items: { id: string; orderIndex: number }[]) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  for (const item of items) {
    await db
      .update(linkedInPosts)
      .set({ orderIndex: item.orderIndex })
      .where(eq(linkedInPosts.id, item.id));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
