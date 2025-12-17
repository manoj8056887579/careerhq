"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ColourfulText } from "./colourful-text";

interface HeroContent {
  title: string;
  highlight: string;
  description: string;
}

const heroContents: HeroContent[] = [
  {
    title: "Your Gateway to",
    highlight: "Global Career",
    description:
      "Your one-stop platform to explore global opportunities, build skills, and achieve success across borders.",
  },
  {
    title: "Transform Your Future with",
    highlight: "World-Class Education",
    description:
      "Access top universities worldwide, unlock scholarships, and shape your academic journey with expert guidance.",
  },
  {
    title: "Discover Endless",
    highlight: "Career Possibilities",
    description:
      "Connect with leading companies, secure dream placements, and accelerate your professional growth globally.",
  },
];

export function AnimatedHeroContent() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroContents.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentContent = heroContents[currentIndex];

  return (
    <div className="relative min-h-[280px] md:min-h-[320px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {currentContent.title}{" "}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                type: "spring",
                stiffness: 200,
              }}
              className="inline-block"
            >
              <ColourfulText text={currentContent.highlight} />
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl text-neutral-700 dark:text-neutral-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {currentContent.description}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="absolute -bottom-8 left-0 flex gap-2">
        {heroContents.map((_, index) => (
          <motion.div
            key={index}
            className="relative h-1 w-12 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: currentIndex === index ? 1 : 0,
              }}
              transition={{
                duration: currentIndex === index ? 2 : 0.3,
                ease: "linear",
              }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
