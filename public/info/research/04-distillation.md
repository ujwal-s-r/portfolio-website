---
title: "Distilling LLMs: A Reverse-KL Implementation"
tag: "LLM Research"
techStack: "PyTorch, Reverse KL, Qwen2.5, On-Policy Distillation"
order: 5
featured: false
status: "ongoing"
github: "https://github.com/ujwal-s-r/research-paper-imlementations"
linkedin: ""
link: ""
---

- **Implemented** the MiniLLM on-policy distillation framework to transfer language-model behavior from a **1.5B-parameter Qwen2.5 teacher to a 0.5B-parameter student**, targeting a 3× reduction in model size while preserving generation quality.

- **Implemented reverse-KL distillation** to encourage mode-seeking behavior, allowing the student to focus on high-quality regions of the teacher distribution instead of spreading probability mass across low-quality “void” regions.

![KL Strategies|large](/info/research/distillation-sub/distillation-1.png)

- **Built teacher-mixed on-policy sampling**, combining teacher and student distributions during rollout generation and using **importance sampling weights** to correct the resulting policy-gradient estimates.

- **Implemented the Single-Step reverse-KL objective** using an exact **Top-K vocabulary approximation**, reducing gradient variance while transferring token-level distribution knowledge from the teacher.

- **Implemented the length-normalized Long-Term policy loss**, using future token rewards and advantage normalization to prevent short-response exploitation and encourage complete generations.

- **Added EOS-aware loss masking and gradient-stability checks**, ensuring completed sequences do not contribute unnecessary gradients and preventing invalid training updates from NaN/Inf activations.

- **Trained and evaluated** the student using reward trajectories, Single-Step loss, Long-Term loss, and teacher–student token-level divergence to analyze convergence and knowledge transfer during on-policy training.

- **Compared teacher and distilled student generations**, examining whether the smaller model retained coherent, professional outputs while reducing the computational footprint from **1.5B to 0.5B parameters**.

- **Tech Stack:** **PyTorch · Reverse KL · On-Policy Distillation · Qwen2.5 · Importance Sampling · AdamW**