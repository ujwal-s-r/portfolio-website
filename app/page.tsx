import Navbar from "./components/Navbar";
import PageNavigator from "./components/PageNavigator";
import { SECTIONS } from "./data/sections";

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white relative">
      {/* Top Floating Dynamic Island Navbar */}
      <Navbar />

      {/* Left Vertical Page Navigator */}
      <PageNavigator />

      {/* Section Placeholders (ready for content as page grows) */}
      <div className="flex flex-col">
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="min-h-screen w-full flex items-center justify-center relative"
          >
            {/* Clean section container */}
          </section>
        ))}
      </div>
    </main>
  );
}
