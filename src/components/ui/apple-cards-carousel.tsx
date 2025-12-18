"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Card {
  title: string;
  description: string;
  icon: string;
}

export function AppleCardsCarousel({ cards }: { cards: Card[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
      checkScrollability();
    }
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!carouselRef.current || isPaused) return;

    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        // If we've reached the end, scroll back to the beginning
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // On mobile, scroll by full viewport width; on desktop, scroll by 400px
          const isMobile = window.innerWidth < 768;
          const scrollAmount = isMobile ? clientWidth : 400;
          carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const isMobile = window.innerWidth < 768;
      const scrollAmount = isMobile ? carouselRef.current.clientWidth : 400;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const isMobile = window.innerWidth < 768;
      const scrollAmount = isMobile ? carouselRef.current.clientWidth : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      <div
        className="flex w-full overflow-x-scroll overscroll-x-auto py-6 md:py-10 scroll-smooth [scrollbar-width:none] snap-x snap-mandatory md:snap-none"
        ref={carouselRef}
        onScroll={checkScrollability}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="flex flex-row justify-start gap-0 md:gap-6 px-4 md:px-4 md:max-w-7xl md:mx-auto w-full">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full md:w-auto snap-center md:snap-align-none px-2 md:px-0"
            >
              <Card card={card} index={index} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center md:justify-end gap-2 mt-4 md:mr-10">
        <button
          className="relative z-40 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <Icon icon="lucide:arrow-left" className="h-6 w-6 text-gray-500" />
        </button>
        <button
          className="relative z-40 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={scrollRight}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <Icon icon="lucide:arrow-right" className="h-6 w-6 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

const Card = ({ card, index }: { card: Card; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-blue-500",
  ];

  const images = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  ];

  const gradient = gradients[index % gradients.length];
  const imageUrl = images[index % images.length];

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "rounded-2xl md:rounded-3xl bg-white dark:bg-gray-900 h-[450px] w-full md:h-[550px] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10 border border-gray-200 dark:border-gray-700",
        "transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={card.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 384px"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
      <motion.div
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 bg-gradient-to-br ${gradient} z-20`}
      />

      <div className="relative z-40 p-6 md:p-8 h-full flex flex-col">
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 360 : 0,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="mb-4 md:mb-6"
        >
          <div
            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl backdrop-blur-sm`}
          >
            <Icon icon={card.icon} className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col justify-end">
          <motion.h3
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg"
          >
            {card.title}
          </motion.h3>
          <motion.p
            animate={{
              opacity: isHovered ? 1 : 0.9,
            }}
            transition={{ duration: 0.3 }}
            className="text-sm md:text-lg text-white/90 leading-relaxed drop-shadow-md"
          >
            {card.description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};
