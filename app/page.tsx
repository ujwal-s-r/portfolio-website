import Navbar from "./components/Navbar";
import PageNavigator from "./components/PageNavigator";
import ExperienceChain from "./components/ExperienceChain";
import { SECTIONS } from "./data/sections";
import { getExperiences } from "./lib/experience";

export default function Home() {
  const experiences = getExperiences();

  return (
    <main className="bg-black min-h-screen text-white relative overflow-x-hidden">
      <Navbar />
      <PageNavigator />

      <div className="flex flex-col">
        <section
          id="about"
          className="
            min-h-screen
            w-full
            flex
            items-center
            relative
            py-24
          "
          style={{
            paddingLeft: "64px",
            paddingRight: "24px",
          }}
        >
          <div
            className="w-full"
            style={{
              maxWidth: "720px",
            }}
          >
            <ExperienceChain experiences={experiences} />
          </div>
        </section>

        {SECTIONS.slice(1).map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="
              min-h-screen
              w-full
              flex
              items-center
              relative
              py-24
            "
            style={{
              paddingLeft: "64px",
              paddingRight: "24px",
            }}
          >
            <div
              className="w-full"
              style={{
                maxWidth: "720px",
              }}
            />
          </section>
        ))}
      </div>
    </main>
  );
}