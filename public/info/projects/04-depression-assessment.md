---
title: "Multi Neural Network Mental Health Assessment"
tag: "Computer Vision"
techStack: "Python, TensorFlow, PyTorch, OpenCV, FastAPI, DeepFace, MediaPipe, L2CS-Net, ViT, Gemini"
order: 4
featured: false
github: "https://github.com/ujwal-s-r/ML_Xai_major_project"
linkedin: "https://www.linkedin.com/posts/ujwal-s-r_advaya-national-level-hackathon-bgscet-2025-activity-7344391614569566211-BnMG?utm_source=share&utm_medium=member_desktop&rcm=ACoAADiIsXsBNBsFrLNboWTH9QZPP6E2zjEsS3E"
link: ""
---

- **Built** a multi-stage mental health assessment system combining **PHQ-8 screening, cognitive reaction testing, and real-time facial/video analysis** into a unified session-based pipeline.

- **Implemented** parallel visual analysis modules for **facial emotion recognition, blink detection, pupil dilation, and gaze estimation**, extracting time-series behavioral features from webcam video.

- **Designed** a 60-second cognitive assessment game with visual and auditory distractions, measuring **reaction time, accuracy, impulsivity, errors, and distraction impact** as additional behavioral signals.

- **Integrated** multiple computer-vision models including **ViT-based emotion recognition, MediaPipe facial/iris tracking, and L2CS-Net gaze estimation**, with frame sampling to support near real-time analysis.

- **Added Explainable AI (XAI)** using **attention maps** to visualize the facial regions contributing to model predictions, providing a way to inspect and validate whether the model was focusing on meaningful visual features rather than irrelevant regions.

- **Built** an interactive dashboard combining questionnaire scores, cognitive-test metrics, emotion timelines, blink activity, pupil dilation, gaze direction, and model outputs for session-level analysis.

- **Used** a **Gemini-based reporting layer** to organize the collected multimodal results into a structured, human-readable assessment report rather than exposing raw model outputs.

- **Developed** the end-to-end application with a **FastAPI backend, browser-based webcam processing, session tracking, JSONL data storage, and Chart.js visualizations** for complete assessment-to-report workflow.

- **Tech Stack:** **Python · PyTorch · TensorFlow · OpenCV · FastAPI · ViT · MediaPipe · L2CS-Net · DeepFace · Gemini · Chart.js**