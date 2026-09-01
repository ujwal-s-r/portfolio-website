"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NumberOdometer from "./NumberOdometer";

export default function LiveVisitorBadge({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState<number>(initialCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Record visit with server-managed httpOnly cookie and 30-day fingerprint deduplication
    fetch("/api/visitors", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count === "number" && data.count > 0) {
          setCount(data.count);
        }
      })
      .catch((err) => {
        console.error("Error fetching visitor count:", err);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="inline-flex items-center gap-2 px-3 py-1 bg-transparent"
    >
      {/* Matching Green Dot */}
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse shrink-0 relative top-[0.5px]" />

      {/* Vibrant Large Emerald Count & Legible Text */}
      <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.16em] text-white/80 flex items-center gap-2">
        <span className="text-sm sm:text-[15px] font-bold text-emerald-400 tracking-normal [text-shadow:0_0_12px_rgba(52,211,153,0.75)] inline-flex items-center">
          {mounted && count > 0 ? (
            <NumberOdometer
              value={count}
              duration={1.5}
              digitStagger={0.06}
              spinLoops={2}
              numberColor="#34d399"
              fontSize={15}
            />
          ) : (
            <span>{count > 0 ? count.toLocaleString() : "..."}</span>
          )}
        </span>
        <span>Unique Souls Stumbled on this page</span>
      </span>
    </motion.div>
  );
}
