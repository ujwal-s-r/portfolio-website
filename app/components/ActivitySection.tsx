import GithubActivity from "./GithubActivity";
import LinkedinCarousel from "./LinkedinCarousel";
import type { LinkedInPostItem } from "../lib/linkedin";

interface ActivitySectionProps {
  linkedInPosts: LinkedInPostItem[];
}


export default function ActivitySection({
  linkedInPosts,
}: ActivitySectionProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl">
        {/* =======================================================
            SECTION MAIN HEADING: ACTIVITY
        ======================================================= */}
        <div className="mb-10 flex items-center gap-4">
          <h2 className="font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl">
            Activity
          </h2>
          <div className="h-px flex-1 bg-white/15" aria-hidden="true" />
        </div>

        {/* =======================================================
            SPLIT LAYOUT: GITHUB (LEFT) | LINKEDIN (RIGHT)
            Evenly spaced 2-column grid
        ======================================================= */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14 items-start w-full">
          {/* LEFT: GITHUB */}
          <div className="w-full">
            <GithubActivity />
          </div>

          {/* RIGHT: LINKEDIN */}
          <div className="w-full">
            <LinkedinCarousel posts={linkedInPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
