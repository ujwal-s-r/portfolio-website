import type { Metadata } from "next";
import { checkAuthStatus } from "@/app/actions/admin";
import {
  getProjects,
  getResearch,
  getExperiences,
  getNowBuilding,
  getNowLearning,
  getNowSkills,
  getLinkedInPosts,
  getResumeUrl,
} from "@/backend";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | Ujwal S R",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const isAuthenticated = await checkAuthStatus();
  const projects = await getProjects();
  const research = await getResearch();
  const experiences = await getExperiences();
  const nowBuilding = await getNowBuilding();
  const nowLearning = await getNowLearning();
  const skillGroups = await getNowSkills();
  const linkedInPosts = await getLinkedInPosts();
  const resumeUrl = await getResumeUrl();

  return (
    <AdminDashboardClient
      initialAuthenticated={isAuthenticated}
      projects={projects}
      research={research}
      experiences={experiences}
      nowBuilding={nowBuilding}
      nowLearning={nowLearning}
      skillGroups={skillGroups}
      linkedInPosts={linkedInPosts}
      initialResumeUrl={resumeUrl}
    />
  );
}
