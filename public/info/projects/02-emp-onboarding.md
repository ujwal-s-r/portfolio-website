---
title: "AdaptIQ — Agentic Employee Onboarding(IISC hack)"
tag: "Agentic AI"
techStack: "Qwen, GPT-OSS, FastAPI, Next.js, Qdrant, Neo4j, Redis, NSGA-II"
order: 3
featured: false
github: "https://github.com/ujwal-s-r/IISC_emp_onboarding_proj"
linkedin: ""
link: ""
---

- Built an **agentic AI onboarding platform** that converts job descriptions, team context, and resumes into **personalized skill-gap analysis and learning paths** instead of generic training plans.

- Implemented **canonical skill normalization** using vector search, LLM-based validation, and O*NET grounding, resolving variations such as Kubernetes, K8s, and container orchestration into consistent skill representations.

- Built a **knowledge-graph-based dependency system** with Neo4j to identify prerequisite relationships between skills and generate a structured learning sequence.

- Developed **LLM-based evidence extraction and mastery scoring**, evaluating not just whether a skill appears on a resume, but the depth of experience supported by project evidence and ownership.

- Implemented **NSGA-II multi-objective optimization** to select courses across relevance, duration, quality, and difficulty-match, producing **Sprint, Balanced, and Quality** learning tracks from the Pareto front.

- Added **real-time pipeline observability** using Redis Pub/Sub and WebSockets, streaming processing stages, normalization decisions, and analysis results to the frontend as the system runs.

- Built the end-to-end system with **FastAPI + Next.js**, integrating vector search, knowledge graphs, LLM inference, async background processing, and persistent session data into a single workflow.

- **Tech Stack:** **Qwen · GPT-OSS · LLM APIs · FastAPI · Next.js · Python · Docker · Qdrant · Neo4j · Redis · WebSockets · REST APIs · Async Workers · Vector Search · Knowledge Graphs · NSGA-II**