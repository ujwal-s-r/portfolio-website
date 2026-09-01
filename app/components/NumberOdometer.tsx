"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const ROW_HEIGHT_RATIO = 1;

function formatValue(value: number, groupingChar = ","): string {
  const rounded = Math.round(value);
  return rounded.toLocaleString("en-US").split(",").join(groupingChar);
}

function isDigitChar(c: string): boolean {
  return /[0-9]/.test(c);
}

interface DigitReelProps {
  digit: number;
  play: boolean;
  delay: number;
  duration: number;
  loops: number;
  fontSize: number;
  color: string;
  ease: [number, number, number, number];
}

function DigitReel({
  digit,
  play,
  delay,
  duration,
  loops,
  fontSize,
  color,
  ease,
}: DigitReelProps) {
  const controls = useAnimation();

  const rowHeightPx = Math.round(fontSize * ROW_HEIGHT_RATIO);
  const digitWidthPx = Math.max(Math.round(fontSize * 0.62), 8);

  const sequence = useMemo(() => {
    const seq: number[] = [];

    for (let l = 0; l < loops; l++) {
      for (let d = 0; d <= 9; d++) {
        seq.push(d);
      }
    }

    for (let d = 0; d <= digit; d++) {
      seq.push(d);
    }

    return seq;
  }, [digit, loops]);

  useEffect(() => {
    if (!play) {
      controls.set({
        y: -(sequence.length - 1) * rowHeightPx,
      });
      return;
    }

    controls.set({ y: 0 });

    controls.start({
      y: -(sequence.length - 1) * rowHeightPx,
      transition: {
        y: {
          delay,
          duration,
          ease,
        },
      },
    });
  }, [
    play,
    sequence,
    delay,
    duration,
    ease,
    controls,
    rowHeightPx,
  ]);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",

        // Important: participate in the text baseline
        verticalAlign: "baseline",

        width: `${digitWidthPx}px`,
        height: `${rowHeightPx}px`,
        overflow: "hidden",

        lineHeight: `${rowHeightPx}px`,
        fontSize: `${fontSize}px`,

        flexShrink: 0,
      }}
    >
      <motion.span
        animate={controls}
        initial={{ y: 0 }}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          willChange: "transform",
        }}
      >
        {sequence.map((d, i) => (
          <span
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              height: `${rowHeightPx}px`,
              minHeight: `${rowHeightPx}px`,

              fontSize: `${fontSize}px`,
              lineHeight: `${rowHeightPx}px`,
              fontWeight: 700,
              color,

              userSelect: "none",
            }}
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function StaticChar({
  char,
  fontSize,
  color,
}: {
  char: string;
  fontSize: number;
  color: string;
}) {
  const rowHeightPx = Math.round(fontSize * ROW_HEIGHT_RATIO);

  return (
    <span
      style={{
        display: "inline-block",

        // Keep punctuation on exactly the same baseline
        verticalAlign: "baseline",

        height: `${rowHeightPx}px`,
        lineHeight: `${rowHeightPx}px`,

        fontSize: `${fontSize}px`,
        fontWeight: 700,
        color,

        padding: "0 1px",
        userSelect: "none",
      }}
    >
      {char}
    </span>
  );
}

interface NumberOdometerProps {
  value: number;
  duration?: number;
  digitStagger?: number;
  spinLoops?: number;
  numberColor?: string;
  fontSize?: number;
}

export default function NumberOdometer({
  value,
  duration = 1.5,
  digitStagger = 0.06,
  spinLoops = 2,
  numberColor = "#34d399",
  fontSize = 13,
}: NumberOdometerProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatted = useMemo(
    () => formatValue(value, ","),
    [value]
  );

  const chars = useMemo(
    () => formatted.split(""),
    [formatted]
  );

  const digitOrders = useMemo(() => {
    let order = 0;

    const orders = new Array(chars.length).fill(0);

    for (let i = chars.length - 1; i >= 0; i--) {
      if (isDigitChar(chars[i])) {
        orders[i] = order;
        order += 1;
      }
    }

    return orders;
  }, [chars]);

  const ease: [number, number, number, number] = [
    0.16,
    1,
    0.3,
    1,
  ];

  const shouldPlay =
    mounted &&
    (isInView || typeof window === "undefined");

  return (
    <span
      ref={containerRef}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        justifyContent: "flex-start",

        // Critical
        verticalAlign: "baseline",

        height: `${Math.round(fontSize)}px`,
        lineHeight: `${Math.round(fontSize)}px`,

        fontFamily: "inherit",
        fontWeight: 700,

        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      {chars.map((c, i) =>
        isDigitChar(c) ? (
          <DigitReel
            key={`${i}-${chars.length}-${value}`}
            digit={parseInt(c, 10)}
            play={shouldPlay}
            delay={digitOrders[i] * digitStagger}
            duration={duration}
            loops={spinLoops}
            fontSize={fontSize}
            color={numberColor}
            ease={ease}
          />
        ) : (
          <StaticChar
            key={`${i}-${chars.length}`}
            char={c}
            fontSize={fontSize}
            color={numberColor}
          />
        )
      )}
    </span>
  );
}