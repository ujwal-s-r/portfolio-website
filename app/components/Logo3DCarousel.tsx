"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";

interface LogoItem {
  name: string;
  image: string;
}

interface Logo3DCarouselProps {
  logos?: LogoItem[];
  itemHeight?: number;
  gap?: number;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  enableDrag?: boolean;
}

import { getBlobUrl } from "@/app/lib/blob";

const LOCAL_LOGOS: LogoItem[] = [
  { name: "OpenAI", image: getBlobUrl("/info/logos/openai.svg") },
  { name: "Anthropic", image: getBlobUrl("/info/logos/anthropic.svg") },
  { name: "Google", image: getBlobUrl("/info/logos/google.svg") },
  { name: "DeepMind", image: getBlobUrl("/info/logos/deepmind.svg") },
  { name: "Meta", image: getBlobUrl("/info/logos/meta.svg") },
  { name: "Hugging Face", image: getBlobUrl("/info/logos/huggingface.svg") },
  { name: "NVIDIA", image: getBlobUrl("/info/logos/nvidia.svg") },
  { name: "AMD", image: getBlobUrl("/info/logos/amd.svg") },
  { name: "TSMC", image: getBlobUrl("/info/logos/tsmc.svg") },
  { name: "ASML", image: getBlobUrl("/info/logos/asml.svg") },
  { name: "Figure AI", image: getBlobUrl("/info/logos/figure.svg") },
  { name: "Databricks", image: getBlobUrl("/info/logos/databricks.svg") },
  { name: "Tesla", image: getBlobUrl("/info/logos/tesla.svg") },
  { name: "SpaceX", image: getBlobUrl("/info/logos/spacex.svg") },
  { name: "AWS", image: getBlobUrl("/info/logos/aws.svg") },
  { name: "Maersk", image: getBlobUrl("/info/logos/maersk.svg") },
];

export default function Logo3DCarousel({
  logos = LOCAL_LOGOS,
  itemHeight = 28,
  gap = 42,
  speed = 32,
  direction = "left",
  pauseOnHover = true,
  enableDrag = true,
}: Logo3DCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalOffsetRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastDragXRef = useRef(0);

  const [containerWidth, setContainerWidth] = useState(0);
  const [loadedImages, setLoadedImages] = useState<(HTMLImageElement | null)[]>([]);

  const baseItemWidth = itemHeight * 1.35;
  const containerHeight = itemHeight * 1.8;
  const unitWidth = baseItemWidth + gap;
  const singleSetWidth = logos.length * unitWidth;

  // Multiple sets to guarantee seamless loop with zero empty spaces
  const setsNeeded = Math.max(3, Math.ceil(3600 / (singleSetWidth || 1)) + 1);
  const totalItems = setsNeeded * logos.length;
  const wrapLength = setsNeeded * singleSetWidth;

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    const pendingImages: HTMLImageElement[] = [];

    Promise.all(
      logos.map(
        (logo) =>
          new Promise<HTMLImageElement | null>((resolve) => {
            const image = new Image();
            pendingImages.push(image);
            image.onload = () => resolve(image);
            image.onerror = () => resolve(null);
            image.src = logo.image;
          })
      )
    ).then((results) => {
      if (active) setLoadedImages(results);
    });

    return () => {
      active = false;
      pendingImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      });
    };
  }, [logos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || containerWidth === 0 || loadedImages.length === 0)
      return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let lastTime = performance.now();
    let isVisible = true;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;

    const screenCenter = containerWidth / 2;

    const render = (currentTime: number) => {
      if (!isVisible) return;

      const delta = currentTime - lastTime;
      lastTime = currentTime;
      const dt = Math.min(delta / 1000, 0.05);

      const targetSpeed =
        (pauseOnHover && isHoveredRef.current) || isDraggingRef.current
          ? 0
          : speed;

      const dirMultiplier = direction === "right" ? -1 : 1;
      globalOffsetRef.current += targetSpeed * dt * dirMultiplier;

      // Keep offset perfectly bounded in modulo [0, wrapLength)
      globalOffsetRef.current =
        ((globalOffsetRef.current % wrapLength) + wrapLength) % wrapLength;

      const currentOffset = globalOffsetRef.current;
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      for (let i = 0; i < totalItems; i++) {
        const logoIdx = i % logos.length;
        const img = loadedImages[logoIdx];
        const baseX = i * unitWidth;

        // Perfectly continuous positioning
        let x = (baseX - currentOffset) % wrapLength;
        if (x < -unitWidth) x += wrapLength;
        if (x > containerWidth + unitWidth) continue;

        const itemCenter = x + baseItemWidth / 2;
        const distFromCenter = Math.abs(itemCenter - screenCenter);
        const normDist = Math.min(distFromCenter / (containerWidth / 2), 1);

        // Smooth fisheye magnification
        const scale = 1.15 - normDist * 0.3;
        const opacity = 0.95 - normDist * 0.55;

        const drawW = baseItemWidth * scale;
        const drawH = itemHeight * scale;
        const drawX = itemCenter - drawW / 2;
        const drawY = (containerHeight - drawH) / 2;

        ctx.save();
        ctx.globalAlpha = Math.max(opacity, 0.18);

        if (img) {
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isVisible = true;
        lastTime = performance.now();
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      } else {
        isVisible = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [
    containerWidth,
    loadedImages,
    totalItems,
    unitWidth,
    wrapLength,
    baseItemWidth,
    itemHeight,
    containerHeight,
    speed,
    direction,
    pauseOnHover,
    logos.length,
  ]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableDrag) return;
    isDraggingRef.current = true;
    lastDragXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableDrag || !isDraggingRef.current) return;
    const deltaX = e.clientX - lastDragXRef.current;
    lastDragXRef.current = e.clientX;
    globalOffsetRef.current -= deltaX;
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableDrag) return;
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => (isHoveredRef.current = true)}
      onPointerLeave={() => (isHoveredRef.current = false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      className="relative w-full overflow-hidden select-none"
      style={{
        height: containerHeight,
        cursor: enableDrag ? "grab" : "default",
        touchAction: enableDrag ? "pan-y" : "auto",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: containerHeight,
          pointerEvents: "none",
          display: "block",
        }}
      />
    </div>
  );
}
