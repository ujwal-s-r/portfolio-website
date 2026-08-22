"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  isInteractive = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={
        isInteractive
          ? {
              scale: 1.025,
              borderColor: "rgba(224, 160, 60, 0.4)",
              transition: { duration: 0.18, ease: "easeOut" },
            }
          : undefined
      }
      whileTap={isInteractive ? { scale: 0.99 } : undefined}
      className={twMerge(
        clsx(
          "bg-surface border border-border rounded-lg p-5 transition-colors relative overflow-hidden",
          isInteractive && "cursor-pointer hover:bg-surface-hover hover:border-border-hover",
          className
        )
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
