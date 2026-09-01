import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectDetailHeader from "@/app/components/ProjectDetailHeader";
import ProjectDetailView from "@/app/components/ProjectDetailView";
import { getProjectBySlug, getProjects } from "@/backend";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

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
      <ProjectDetailHeader backHref="/" />
      <div className="flex justify-center w-full min-h-screen">
        <ProjectDetailView project={project} backHref="/" isOverlay={false} />
      </div>
    </main>
  );
}
