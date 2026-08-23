import Navbar from "./components/Navbar";
import PageNavigator from "./components/PageNavigator";
import HeroSection from "./components/HeroSection";
import NowSection from "./components/NowSection";
import { getExperiences } from "./lib/experience";
import { getProjects, getResearch } from "./lib/projects";
import { getNowBuilding, getNowLearning } from "./lib/now";

export default function Home() {
  const experiences = getExperiences();
  const projects = getProjects();
  const research = getResearch();
  const buildingItems = getNowBuilding();
  const learningItems = getNowLearning();

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Navbar />
      <PageNavigator />

      <div className="flex flex-col">
        {/* =====================================================
            PAGE 1 — HERO SPLIT LAYOUT
            Left (~35%):  Identity column (Intro + Career Path)
            Right (~65%): Projects grid + Expand More
        ===================================================== */}
        <section
          id="about"
          className="
            w-full
            flex
            items-start
            justify-start
            relative
            px-5
            sm:px-6
            md:px-8
            pt-12
            pb-2
          "
        >
          <HeroSection
            experiences={experiences}
            projects={projects}
            research={research}
          />
        </section>

        {/* =====================================================
            PAGE 2 — NOW (BUILDING & LEARNING)
            
            GAP CONFIGURATION:
            Adjust `pt-6` / `pt-8` / `pt-12` below to control the gap
            between the Expand More button and the Now section!
        ===================================================== */}
        <section
          id="now"
          className="
            w-full
            flex
            items-start
            justify-start
            relative
            px-5
            sm:px-6
            md:px-8
            pt-0
            pb-28
          "
        >
          <NowSection
            buildingItems={buildingItems}
            learningItems={learningItems}
          />
        </section>
      </div>
    </main>
  );
}