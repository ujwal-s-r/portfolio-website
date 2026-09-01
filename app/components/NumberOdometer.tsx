"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const ROW_HEIGHT_EM = 1.15; // Row height ratio

function formatValue(value: number, groupingChar: string = ","): string {
  const rounded = Math.round(value);
  const withCommas = rounded.toLocaleString("en-US");
  return withCommas.split(",").join(groupingChar);
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
  const rowHeightPx = Math.round(fontSize * ROW_HEIGHT_EM);

  // Build the strip: `loops` full passes of 0-9, then climb to the target digit
  const sequence = useMemo(() => {
    const seq: number[] = [];
    for (let l = 0; l < loops; l++) {
      for (let d = 0; d <= 9; d++) seq.push(d);
    }
    for (let d = 0; d <= digit; d++) seq.push(d);
    return seq;
  }, [digit, loops]);

  useEffect(() => {
    if (!play) return;
    controls.set({ y: 0, filter: "blur(0px)" });
    controls.start({
      y: -(sequence.length - 1) * rowHeightPx,
      filter: ["blur(0px)", "blur(6px)", "blur(0px)"],
      transition: {
        y: { delay, duration, ease },
        filter: { delay, duration, times: [0, 0.35, 1], ease: "easeOut" },
      },
    });
  }, [play, sequence, delay, duration, ease, controls, rowHeightPx]);

  return (
    <div
      style={{
        position: "relative",
        height: rowHeightPx,
        width: Math.round(fontSize * 0.65),
        overflow: "hidden",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    >
      <motion.div
        animate={controls}
        initial={{ y: 0 }}
        style={{
          display: "flex",
          flexDirection: "column",
          willChange: "transform, filter",
        }}
      >
        {sequence.map((d, i) => (
          <span
            key={i}
            style={{
              height: rowHeightPx,
              lineHeight: `${rowHeightPx}px`,
              fontSize,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            {d}
          </span>
        ))}
      </motion.div>
    </div>
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
  const rowHeightPx = Math.round(fontSize * ROW_HEIGHT_EM);
  return (
    <span
      style={{
        fontSize,
        color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: rowHeightPx,
        lineHeight: `${rowHeightPx}px`,
        fontWeight: 700,
        verticalAlign: "middle",
        padding: "0 1px",
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
  digitStagger = 0.08,
  spinLoops = 2,
  numberColor = "#34d399",
  fontSize = 15,
}: NumberOdometerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const formatted = useMemo(() => formatValue(value, ","), [value]);
  const chars = useMemo(() => formatted.split(""), [formatted]);

  // Rightmost digit settles first: order counted from the right, digits only
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

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div
      ref={containerRef}
      className="inline-flex items-center select-none font-mono"
      style={{
        lineHeight: 1,
      }}
    >
      {chars.map((c, i) =>
        isDigitChar(c) ? (
          <DigitReel
            key={`${i}-${chars.length}`}
            digit={parseInt(c, 10)}
            play={isInView && value > 0}
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
    </div>
  );
}
