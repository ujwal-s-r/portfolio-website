---
title: "LLM Transformer Architecture from Scratch"
tag: "Deep Learning"
techStack: "PyTorch, BPE, RoPE, RMSNorm, MHA, GQA, MLA"
order: 2
featured: false
github: ""
linkedin: ""
link: ""
---

- **Built** a decoder-only Transformer language model from scratch in PyTorch using the **Tiny Shakespeare** dataset, implementing the complete pipeline from tokenization to autoregressive language-model training.

- **Implemented** a custom **BPE tokenizer** and integrated token embeddings, **RoPE positional embeddings**, RMSNorm, feed-forward networks, residual connections, and output projection as independent model components.

- **Implemented and compared** **Multi-Head Attention (MHA), Grouped-Query Attention (GQA), and Multi-Head Latent Attention (MLA)**, evaluating their accuracy and performance under the same model and training setup.

- **Investigated weight initialization** by comparing **random initialization against Xavier initialization**, analyzing their effect on early training behavior and optimization stability.

- **Analyzed normalization strategies** through **Pre-Norm vs Post-Norm** Transformer configurations, tracking gradient behavior across layers to understand differences in gradient propagation and training stability.

- **Visualized attention patterns** using attention heatmaps to inspect how different attention heads learned token-to-token relationships within the decoder.

- **Trained** the final Transformer on **Tiny Shakespeare** using autoregressive next-token prediction and monitored model convergence through training-loss curves.

- **Selected MLA for the final architecture** based on the comparative experiments, integrating it with RoPE, RMSNorm, feed-forward layers, residual connections, and the remaining Transformer components.

- **Tech Stack:** **PyTorch · BPE · RoPE · RMSNorm · MHA · GQA · MLA · Tiny Shakespeare**