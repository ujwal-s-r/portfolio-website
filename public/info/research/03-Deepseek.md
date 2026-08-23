---
title: "Training LLM to Reason with Reinforcement Learning(GRPO)"
tag: "LLM Research"
techStack: "PyTorch, GRPO, SymPy, SmolLM2-135M, Hugging Face"
order: 4
featured: false
github: "https://github.com/ujwal-s-r/research-paper-imlementations"
linkedin: "https://www.linkedin.com/posts/ujwal-s-r_llm-reinforcementlearning-deepseek-activity-7489592879292506113-jH0c?utm_source=share&utm_medium=member_desktop&rcm=ACoAADiIsXsBNBsFrLNboWTH9QZPP6E2zjEsS3E"
link: ""
---

- **Reimplemented** the core **DeepSeek-R1-Zero pure reinforcement learning approach**, training a 135M-parameter SmolLM2 model to develop structured mathematical reasoning without relying on a large supervised reasoning dataset.

- **Built** a deterministic **rule-based reward engine** combining mathematical accuracy and reasoning-format compliance, using SymPy-based verification to evaluate generated answers and reduce opportunities for reward hacking.

- **Implemented GRPO from scratch**, including intra-group advantage normalization, PPO-style clipped policy updates, token-level KL regularization, completion masking, gradient clipping, and periodic reference-policy synchronization.

- **Designed** the RL training pipeline around grouped rollouts, generating multiple candidate solutions per problem and using their relative rewards to optimize the policy without requiring a separate critic/value model.

- **Extended** the reward system with a **language-consistency objective**, encouraging coherent English reasoning while preventing the model from exploiting mixed-language or low-quality reasoning patterns.

- **Implemented** a **rejection-sampling pipeline** that generates multiple reasoning trajectories, scores them for correctness, formatting, and language consistency, and filters high-quality outputs into an SFT-ready JSONL dataset.

- **Tracked** training behavior through reward progression, GRPO loss, KL divergence, clipping fraction, reasoning length, and language-purity metrics to analyze policy learning and stability across training stages.

- **Observed** emergent reasoning behavior during training, including improved `<think>/<answer>` format compliance, longer reasoning traces, increasing mathematical accuracy, and improved language consistency.

![Reward plot|small](/info/research/deepseek-sub/deepseek-1.png)

- **Tech Stack:** **PyTorch · GRPO · SymPy · SmolLM2-135M · Hugging Face · Python**