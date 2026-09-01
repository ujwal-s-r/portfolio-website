import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { getExperienceBySlug, getExperiences } from "@/backend";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allExp = await getExperiences();
  return allExp.map((e) => ({ slug: e.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);

  if (!exp) {
    return {
      title: "Experience Not Found",
    };
  }

  return {
    title: `${exp.role} at ${exp.company} | Ujwal S R`,
    description: `${exp.role} at ${exp.company} (${exp.period}, ${exp.location})`,
  };
}

function renderMarkdownText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default async function ExperiencePage({ params }: PageProps) {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);

  if (!exp) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Navbar />
      <div className="pt-24 pb-20 flex justify-center w-full min-h-screen px-6">
        <article className="w-full max-w-2xl flex flex-col items-start select-none">
          {/* Header */}
          <div className="w-full flex flex-col gap-2 pb-6 border-b border-white/10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400">
              Career Experience
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
              {exp.company}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
              <span className="text-white/90 font-medium">{exp.role}</span>
              <span className="text-white/30">•</span>
              <span>{exp.period}</span>
              <span className="text-white/30">•</span>
              <span>{exp.location}</span>
            </div>
          </div>

          {/* Key Deliverables & Points */}
          <section className="w-full mt-8">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-white/40 mb-4">
              Key Contributions & Impact
            </h2>
            <ul className="space-y-4">
              {exp.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-white/75">
                  <span className="text-emerald-400 mt-1 shrink-0">•</span>
                  <span>{renderMarkdownText(pt)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Back Button */}
          <div className="mt-14 w-full text-center">
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 hover:text-white transition-colors"
            >
              ← Back to Overview
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
