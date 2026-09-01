import {
  getProjects,
  getResearch,
  getExperiences,
  getNowBuilding,
  getNowLearning,
  getNowSkills,
  getLinkedInPosts,
} from "./index";

async function main() {
  const projects = await getProjects();
  const research = await getResearch();
  const exp = await getExperiences();
  const building = await getNowBuilding();
  const learning = await getNowLearning();
  const skills = await getNowSkills();
  const posts = await getLinkedInPosts();

  console.log("PROJECTS_COUNT:", projects.length);
  console.log("RESEARCH_COUNT:", research.length);
  console.log("EXP_COUNT:", exp.length);
  console.log("BUILDING_COUNT:", building.length);
  console.log("LEARNING_COUNT:", learning.length);
  console.log("SKILLS_COUNT:", skills.length);
  console.log("POSTS_COUNT:", posts.length);
  console.log("FIRST_PROJECT:", projects[0]?.title);
  console.log("FIRST_RESEARCH:", research[0]?.title);
}

main().catch(console.error);
