import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import ProjectDetailView from "@/app/components/ProjectDetailView";
import { getResearchBySlug, getResearch } from "@/backend";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allResearch = await getResearch();
  return allResearch.map((r) => ({ slug: r.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const research = await getResearchBySlug(slug);

  if (!research) {
    return {
      title: "Research Implementation Not Found",
    };
  }

  return {
    title: `${research.title} | Ujwal S R`,
    description: research.description.slice(0, 160),
    openGraph: {
      title: research.title,
      description: research.description.slice(0, 160),
      images: research.image ? [research.image] : [],
    },
  };
}

export default async function ResearchPage({ params }: PageProps) {
  const { slug } = await params;
  const research = await getResearchBySlug(slug);

  if (!research) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Navbar />
      <div className="pt-20 flex justify-center w-full min-h-screen">
        <ProjectDetailView project={research} backHref="/" />
      </div>
    </main>
  );
}
