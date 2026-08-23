import Navbar from "./components/Navbar";
import PageNavigator from "./components/PageNavigator";
import HeroSection from "./components/HeroSection";
import { SECTIONS } from "./data/sections";
import { getExperiences } from "./lib/experience";
import { getProjects, getResearch } from "./lib/projects";

export default function Home() {
  const experiences = getExperiences();
  const projects = getProjects();
  const research = getResearch();

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Navbar />
      <PageNavigator />

      <div className="flex flex-col">
        {/* =====================================================
            PAGE 1 — HERO SPLIT LAYOUT

            Left (~35%):  Identity column (Intro + Career Path)
            Right (~65%): Projects grid

            On mobile: stacks vertically
        ===================================================== */}
        <section
          id="about"
          className="
            min-h-screen
            w-full
            flex
            items-start
            justify-start
            relative
            px-5
            sm:px-6
            md:px-8
            pb-24
          "
          style={{ paddingTop: "3rem" }}
        >
          <HeroSection
            experiences={experiences}
            projects={projects}
            research={research}
          />
        </section>

        {/* =====================================================
            OTHER SECTIONS
        ===================================================== */}

        {SECTIONS.slice(1).map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="
              min-h-screen
              w-full
              flex
              items-center
              justify-start
              relative
              px-6
              py-24
            "
          >
            <div
              className="w-full"
              style={{
                marginLeft: "64px",
                maxWidth: "720px",
              }}
            />
          </section>
        ))}
      </div>
    </main>
  );
}