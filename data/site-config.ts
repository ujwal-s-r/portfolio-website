export interface SiteConfig {
  name: string;
  role: string;
  subRole: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  githubUsername: string;
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
    email: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Ujwal",
  role: "AI/ML Engineer & Data Engineer",
  subRole: "Applied AI ➔ High-Performance Systems & Kernel Engineering",
  bio: "Building high-throughput data infrastructure, distributed ML pipelines, and custom CUDA/C++ kernels. Focused on bridging the gap between deep learning theory and low-level hardware performance.",
  location: "India / Remote",
  email: "ujwal.dev@example.com",
  resumeUrl: "/resume.pdf",
  githubUsername: "ujwal-s-r",
  socials: {
    github: "https://github.com/ujwal-s-r",
    linkedin: "https://linkedin.com/in/ujwal",
    twitter: "https://x.com/ujwal_dev",
    email: "mailto:ujwal.dev@example.com",
  },
};
