---
title: "Agentic AI Self-Healing CI/CD Pipeline"
tag: "Agentic AI"
techStack: "Qwen-2.5-Coder, MCP, GraphDB, GitHub Actions, WebSocket"
order: 2
featured: false
github: "https://github.com/ujwal-s-r/Agentic_devops_pipeline"
linkedin: "https://www.linkedin.com/posts/ujwal-s-r_agenticai-devops-selfhealing-activity-7397713913297068032-6068?utm_source=share&utm_medium=member_desktop&rcm=ACoAADiIsXsBNBsFrLNboWTH9QZPP6E2zjEsS3E"
link: ""
---

- **Built** an agentic AI-powered CI/CD pipeline with specialized **Build, Analysis, Fix, and Test agents** to automatically detect, analyze, remediate, and validate code issues within a **sandboxed execution environment**.
- **Implemented** an iterative **self-healing loop** where generated fixes are automatically tested and re-evaluated before the pipeline is considered successful, using a **fine-tuned Qwen-2.5-Coder** model for code reasoning and test-case generation.
- **Integrated** **MCP with GraphDB** to provide agents with structured, queryable codebase context for analysis and remediation.
- **Automated** GitHub PR/Push-triggered workflows using **GitHub Webhooks and GitHub Actions**, enabling end-to-end pipeline execution without manual intervention.
- **Added** **WebSocket-based real-time monitoring** for pipeline stages, terminal output, and execution results, alongside automated testing and validation.
- **Tech Stack:** **Qwen-2.5-Coder · MCP · GraphDB · FastAPI · GitHub Actions · WebSocket · Python**