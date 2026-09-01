import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import ProjectDetailView from "@/app/components/ProjectDetailView";
import { getProjectBySlug, getProjects } from "@/backend";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allProjects = await getProjects();
  return allProjects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Ujwal S R`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.slice(0, 160),
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Navbar />
      <div className="pt-20 flex justify-center w-full min-h-screen">
        <ProjectDetailView project={project} backHref="/" />
      </div>
    </main>
  );
}
