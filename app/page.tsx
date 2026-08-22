import Navbar from "./components/Navbar";
import PageNavigator from "./components/PageNavigator";
import HeroIntro from "./components/HeroIntro";
import ExperienceChain from "./components/ExperienceChain";
import { SECTIONS } from "./data/sections";
import { getExperiences } from "./lib/experience";

export default function Home() {
  const experiences = getExperiences();

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Navbar />
      <PageNavigator />

      <div className="flex flex-col">
        {/* =====================================================
            ABOUT / HERO

            Everything inside this wrapper is NORMAL FLOW.

            The wrapper is vertically centered as one unit:
              Hero
                ↓ gap
              Career Path

            If Career Path grows, the whole unit grows and
            naturally moves upward. Nothing overlaps.
        ===================================================== */}
        <section
          id="about"
          className="
            min-h-screen
            w-full
            flex
            items-center
            justify-start
            relative
            px-6
            py-24
            -translate-y-8
            "
        >
          <div
            className="
              w-full
              flex
              flex-col
              items-start
            "
            style={{
              marginLeft: "64px",
              maxWidth: "720px",
            }}
          >
            {/* ================= HERO BOUNDARY ================= */}

            <div className="w-full shrink-0">
              <HeroIntro />
            </div>

            {/* ================= SEPARATION ================= */}

            <div
              aria-hidden="true"
              style={{
                height: "32px",
                flexShrink: 0,
              }}
            />

            {/* ================= CAREER BOUNDARY ================= */}

            <div className="w-full shrink-0">
              <ExperienceChain experiences={experiences} />
            </div>
          </div>
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