"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function BlurText({
  text,
  className,
  delay = 0,
  duration: _duration = 1,
}: BlurTextProps) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (_i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
  };

  return (
    <motion.h1
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.25em",
        justifyContent: "center",
      }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("", className)}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
