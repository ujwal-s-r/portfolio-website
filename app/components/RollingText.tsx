"use client";

import { motion } from "framer-motion";

interface RollingTextProps {
  text: string;
  duplicateCount?: number;
  rollDuration?: number;
  staggerDelay?: number;
  blurIntensity?: number;
  textColor?: string;
  className?: string;
}

interface CharacterColumnProps {
  character: string;
  duplicateCount: number;
  rollDuration: number;
  delay: number;
  blurIntensity: number;
  textColor: string;
}

function CharacterColumn({
  character,
  duplicateCount,
  rollDuration,
  delay,
  blurIntensity,
  textColor,
}: CharacterColumnProps) {
  // If it's a whitespace character, return a preserved spacing gap
  if (character === " ") {
    return <span className="inline-block w-[0.35em]">&nbsp;</span>;
  }

  // Create array of duplicate characters for the vertical rolling column
  const duplicates = Array(duplicateCount).fill(character);

  return (
    <div className="relative inline-flex items-start justify-center overflow-hidden h-[1.15em]">
      <motion.div
        className="flex flex-col items-center"
        initial={{ y: "0%" }}
        animate={{ y: `-${((duplicateCount - 1) / duplicateCount) * 100}%` }}
        transition={{
          duration: rollDuration,
          delay: delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "tween",
        }}
      >
        {duplicates.map((char, i) => (
          <motion.span
            key={i}
            className="inline-flex items-center justify-center leading-none h-[1.15em]"
            style={{ color: textColor }}
            initial={{ filter: "blur(0px)" }}
            animate={{
              filter: [
                "blur(0px)",
                `blur(${blurIntensity}px)`,
                `blur(${blurIntensity}px)`,
                "blur(0px)",
              ],
            }}
            transition={{
              duration: rollDuration,
              delay: delay,
              times: [0, 0.2, 0.8, 1],
              ease: "easeOut",
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export default function RollingText({
  text,
  duplicateCount = 7,
  rollDuration = 1.4,
  staggerDelay = 0.04,
  blurIntensity = 5,
  textColor = "rgb(5, 150, 105)",
  className = "",
}: RollingTextProps) {
  const characters = text.split("");

  return (
    <div
      key={text}
      className={`inline-flex items-center flex-wrap select-none ${className}`}
      style={{ lineHeight: 1.15 }}
    >
      {characters.map((char, index) => (
        <CharacterColumn
          key={`${text}-${index}-${char}`}
          character={char}
          duplicateCount={duplicateCount}
          rollDuration={rollDuration}
          delay={index * staggerDelay}
          blurIntensity={blurIntensity}
          textColor={textColor}
        />
      ))}
    </div>
  );
}
