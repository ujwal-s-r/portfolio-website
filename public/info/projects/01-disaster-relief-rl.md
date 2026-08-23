---
title: "Multi Agent RL Env for Disaster Relief (Meta Hackathon)"
tag: "Multi-Agent RL"
techStack: "OpenEnv, FastAPI, Docker, Python"
order: 1
featured: true
github: "https://github.com/ujwal-s-r/Meta-RL-hack"
linkedin: ""
link: ""
event: "Meta RL Hackathon"
---

- **Architected an OpenEnv-compatible multi-agent RL benchmark** for disaster-response coordination, simulating concurrent triage, resource allocation, terrain constraints, communication failures, false alarms, and time-critical incidents under dynamic world states.

- **Designed a hierarchical multi-agent system** with an LLM coordinator delegating tasks to specialized **Intake, Dispatch, and Monitor agents** through structured JSON tool calls for adaptive decision-making.

- **Engineered dense reward shaping and a counterfactual multi-axis grader** evaluating resolution rate, critical-deadline adherence, false-alarm F1, resource matching, monitoring quality, and preventable resource-idle failures to reduce reward hacking.

- **Modeled dynamic disaster physics** including flood-dependent resource accessibility, blocked routes, communication blackouts, resource travel/availability, report deadlines, and mid-episode events through a deterministic seeded simulation engine.

- **Built a deterministic heuristic baseline** for flood-aware and capability-matched resource allocation, achieving benchmark calibration scores of **0.46 / 0.79 / 0.48** across Easy, Medium, and Hard scenarios.

- **Deployed the benchmark as a Dockerized FastAPI service** with standardized OpenEnv-style `/reset`, `/step`, `/grade`, and `/state` APIs for integration with RL training and agent evaluation workflows.

- **Tech Stack:** **Python · OpenEnv · FastAPI · Docker · Multi-Agent RL · LLM Agents · Tool Calling · Structured JSON · Reward Shaping · Counterfactual Grading · Deterministic Simulation · REST APIs · Seeded Evaluation · Heuristic Baselines**