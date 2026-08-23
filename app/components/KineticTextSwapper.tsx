"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type AnimationStyle =
  | "3dRoll"
  | "softBlur"
  | "springSlide"
  | "flipCard"
  | "scalePop"
  | "elasticDrop";

interface KineticTextSwapperProps {
  prefix?: string;
  rotatingWords: string[];
  wordSpacing?: number; // in em
  staticColor?: string;
  activeColor?: string;
  intervalTime?: number; // in seconds
  animationStyle?: AnimationStyle;
  className?: string;
}

export default function KineticTextSwapper({
  prefix,
  rotatingWords,
  wordSpacing = 0.25,
  staticColor = "#ffffff",
  activeColor = "rgb(5, 150, 105)",
  intervalTime = 2.8,
  animationStyle = "3dRoll",
  className = "",
}: KineticTextSwapperProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, intervalTime * 1000);

    return () => clearInterval(timer);
  }, [rotatingWords, intervalTime]);

  const getVariants = () => {
    switch (animationStyle) {
      case "3dRoll":
        return {
          initial: { opacity: 0, rotateX: -90, y: 40, z: -50 },
          animate: { opacity: 1, rotateX: 0, y: 0, z: 0 },
          exit: { opacity: 0, rotateX: 90, y: -40, z: -50 },
        };
      case "softBlur":
        return {
          initial: { opacity: 0, filter: "blur(12px)", y: 10 },
          animate: { opacity: 1, filter: "blur(0px)", y: 0 },
          exit: { opacity: 0, filter: "blur(12px)", y: -10 },
        };
      case "springSlide":
        return {
          initial: { opacity: 0, y: "100%" },
          animate: { opacity: 1, y: "0%" },
          exit: { opacity: 0, y: "-100%" },
        };
      case "flipCard":
        return {
          initial: { opacity: 0, rotateY: 90, scale: 0.9 },
          animate: { opacity: 1, rotateY: 0, scale: 1 },
          exit: { opacity: 0, rotateY: -90, scale: 0.9 },
        };
      case "scalePop":
        return {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 },
        };
      case "elasticDrop":
        return {
          initial: { opacity: 0, y: -60, scaleY: 1.5 },
          animate: { opacity: 1, y: 0, scaleY: 1 },
          exit: { opacity: 0, y: 60, scaleY: 0.5 },
        };
      default:
        return {
          initial: { opacity: 0, rotateX: -90, y: 40, z: -50 },
          animate: { opacity: 1, rotateX: 0, y: 0, z: 0 },
          exit: { opacity: 0, rotateX: 90, y: -40, z: -50 },
        };
    }
  };

  // Find the longest word to keep the container layout perfectly rock-solid
  const longestWord = rotatingWords.reduce(
    (a, b) => (a.length > b.length ? a : b),
    ""
  );

  return (
    <div
      className={`flex items-center select-none ${className}`}
      style={{
        gap: `${wordSpacing}em`,
        perspective: 1200,
      }}
    >
      {prefix && (
        <span
          className="font-bold tracking-tight whitespace-nowrap"
          style={{ color: staticColor }}
        >
          {prefix}
        </span>
      )}

      {/* 3D preserve container */}
      <div
        className="relative inline-flex items-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={index}
            variants={getVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 16,
              mass: 0.8,
            }}
            className="font-semibold tracking-tight whitespace-nowrap"
            style={{
              color: activeColor,
              transformOrigin: "center center",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            {rotatingWords[index]}
          </motion.span>
        </AnimatePresence>

        {/* Stable spacer placeholder */}
        <span
          className="font-semibold tracking-tight whitespace-nowrap opacity-0 pointer-events-none"
          aria-hidden="true"
        >
          {longestWord}
        </span>
      </div>
    </div>
  );
}
