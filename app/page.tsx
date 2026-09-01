import Navbar from "./components/Navbar";
import PageNavigator from "./components/PageNavigator";
import HeroSection from "./components/HeroSection";
import NowSection from "./components/NowSection";
import ActivitySection from "./components/ActivitySection";
import FooterSection from "./components/FooterSection";
import {
  getExperiences,
  getProjects,
  getResearch,
  getNowBuilding,
  getNowLearning,
  getNowSkills,
  getLinkedInPosts,
  getResumeUrl,
} from "@/backend";

export default async function Home() {
  const experiences = await getExperiences();
  const projects = await getProjects();
  const research = await getResearch();
  const buildingItems = await getNowBuilding();
  const learningItems = await getNowLearning();
  const skillGroups = await getNowSkills();
  const linkedInPosts = await getLinkedInPosts();
  const resumeUrl = await getResumeUrl();

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Navbar resumeUrl={resumeUrl} />
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
            PAGE 2 — NOW (SKILLS, BUILDING & LEARNING)
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
            pt-4
            pb-10
          "
        >
          <NowSection
            skillGroups={skillGroups}
            buildingItems={buildingItems}
            learningItems={learningItems}
          />
        </section>

        {/* =====================================================
            PAGE 3 — ACTIVITY (GITHUB & LINKEDIN)
        ===================================================== */}
        <section
          id="activity"
          className="
            w-full
            flex
            items-start
            justify-start
            relative
            px-5
            sm:px-6
            md:px-8
            pt-4
            pb-10
          "
        >
          <ActivitySection linkedInPosts={linkedInPosts} />
        </section>

        {/* =====================================================
            PAGE 4 — FOOTER & CONTACT
        ===================================================== */}
        <section
          id="contact"
          className="
            w-full
            flex
            items-center
            justify-center
            relative
            px-5
            sm:px-6
            md:px-8
            pt-2
            pb-6
          "
        >
          <FooterSection />
        </section>
      </div>
    </main>
  );
}