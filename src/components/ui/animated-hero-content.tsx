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
    title: "Transform Future with",
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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroContents.length);
    }, 5000); // Increased to 5 seconds for better readability

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentContent = heroContents[currentIndex];

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <div className="relative min-h-[280px] md:min-h-[320px] pb-12">
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

      {/* Dot Navigation */}
      <div className="flex gap-3 mt-6">
        {heroContents.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className="group relative cursor-pointer focus:outline-none p-2"
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Dot */}
            <motion.div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125"
                  : "bg-neutral-300 dark:bg-neutral-600 group-hover:bg-neutral-400 dark:group-hover:bg-neutral-500"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            
            {/* Progress ring for active dot */}
            {currentIndex === index && !isPaused && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-500"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 5,
                  ease: "linear",
                  repeat: 0,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
