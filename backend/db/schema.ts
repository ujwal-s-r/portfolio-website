import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tag: text("tag").notNull().default("Project"),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("projects"), // 'projects' | 'research'
  techStack: text("tech_stack").notNull().default("[]"), // JSON string array
  points: text("points").notNull().default("[]"), // JSON string array
  image: text("image"),
  orderIndex: integer("order_index").notNull().default(99),
  featured: integer("featured").notNull().default(0), // 0 or 1
  ongoing: integer("ongoing").notNull().default(0), // 0 or 1
  status: text("status").notNull().default("completed"), // 'ongoing' | 'completed'
  github: text("github").notNull().default(""),
  linkedin: text("linkedin").notNull().default(""),
  link: text("link").notNull().default(""),
  event: text("event").notNull().default(""),
  createdAt: text("created_at").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(""),
});

export const experiences = sqliteTable("experiences", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull().default(""),
  period: text("period").notNull().default(""),
  orderIndex: integer("order_index").notNull().default(99),
  points: text("points").notNull().default("[]"), // JSON string array
  createdAt: text("created_at").notNull().default(""),
});

export const nowItems = sqliteTable("now_items", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull().default("BUILDING"), // 'BUILDING' | 'LEARNING'
  status: text("status").notNull().default("ACTIVE"),
  techStack: text("tech_stack").notNull().default("[]"), // JSON string array
  github: text("github").notNull().default(""),
  orderIndex: integer("order_index").notNull().default(99),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull().default(""),
});

export const skillGroups = sqliteTable("skill_groups", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  skills: text("skills").notNull().default("[]"), // JSON string array
  orderIndex: integer("order_index").notNull().default(99),
});

export const linkedInPosts = sqliteTable("linkedin_posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  image: text("image").notNull().default(""),
  link: text("link").notNull().default(""),
  orderIndex: integer("order_index").notNull().default(99),
  text: text("text").notNull().default(""),
  createdAt: text("created_at").notNull().default(""),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at").notNull().default(0),
});

export const visitors = sqliteTable("visitors", {
  visitorId: text("visitor_id").primaryKey(),
  fingerprintHash: text("fingerprint_hash").notNull(),
  firstVisitedAt: text("first_visited_at").notNull(),
  lastVisitedAt: text("last_visited_at").notNull(),
  visitCount: integer("visit_count").notNull().default(1),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

export type NowItemRecord = typeof nowItems.$inferSelect;
export type InsertNowItem = typeof nowItems.$inferInsert;

export type SkillGroupRecord = typeof skillGroups.$inferSelect;
export type InsertSkillGroup = typeof skillGroups.$inferInsert;

export type LinkedInPostRecord = typeof linkedInPosts.$inferSelect;
export type InsertLinkedInPost = typeof linkedInPosts.$inferInsert;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

export type Visitor = typeof visitors.$inferSelect;
export type InsertVisitor = typeof visitors.$inferInsert;

