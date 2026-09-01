"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NumberOdometer from "./NumberOdometer";

export default function LiveVisitorBadge({
  initialCount = 0,
}: {
  initialCount?: number;
}) {
  const [count, setCount] = useState<number>(initialCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    fetch("/api/visitors", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          data &&
          typeof data.count === "number" &&
          data.count > 0
        ) {
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
      className="
        inline-flex
        items-center
        justify-center
        gap-1.5
        sm:gap-2
        px-2
        sm:px-3
        py-1
        bg-transparent
        max-w-full
      "
    >
      {/* Live dot */}
      <span className="flex items-center justify-center shrink-0">
        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-emerald-400
            shadow-[0_0_8px_rgba(52,211,153,0.9)]
            animate-pulse
            translate-y-[1px]
          "
        />
      </span>

      {/* Number + text */}
      <div
        className="
          font-mono
          text-[9.5px]
          xs:text-[11px]
          sm:text-[13px]
          uppercase
          tracking-[0.10em]
          sm:tracking-[0.16em]
          text-white/80
          inline-flex
          items-baseline
          gap-1.5
          sm:gap-2
          leading-none
          whitespace-nowrap
        "
      >
        {/* Number */}
        <span
          className="
            inline-flex
            items-baseline
            shrink-0
            font-mono
            font-bold
            text-emerald-400
            tracking-normal
            leading-none
            align-baseline
          "
        >
          {mounted && count > 0 ? (
            <NumberOdometer
              value={count}
              duration={1.5}
              digitStagger={0.06}
              spinLoops={2}
              numberColor="#34d399"
              fontSize={13}
            />
          ) : (
            <span className="leading-none">
              {count > 0 ? count.toLocaleString() : "..."}
            </span>
          )}
        </span>

        {/* Text */}
        <span className="shrink-0 leading-none">
          Unique Souls Stumbled on this page
        </span>
      </div>
    </motion.div>
  );
}