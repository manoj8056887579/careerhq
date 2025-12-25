"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

interface AnnouncementItem {
  id: string;
  text: string;
  link: string;
  icon?: string;
}

interface AnnouncementScrollerProps {
  items: AnnouncementItem[];
  className?: string;
  speed?: number;
}

export function AnnouncementScroller({
  items,
  className,
  speed = 80,
}: AnnouncementScrollerProps) {
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items, ...items];
  
  // Calculate dynamic speed based on content length
  // Lower duration = faster scroll
  const calculatedSpeed = Math.max(speed / items.length, 15);

  return (
    <div
      className={cn(
        "relative overflow-hidden py-4 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 shadow-lg",
        className
      )}
    >
      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative flex items-center">
        {/* News Icon Badge */}
        <div className="absolute left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
          <Icon
            icon="lucide:newspaper"
            className="w-5 h-5 text-primary-600 animate-pulse"
          />
          <span className="text-sm font-bold text-primary-600 hidden sm:inline">
            Latest Updates
          </span>
        </div>

        {/* Scrolling content with padding for the badge */}
        <div className="pl-32 sm:pl-48">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{
              x: [0, -100 * items.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: calculatedSpeed,
                ease: "linear",
              },
            }}
          >
            {duplicatedItems.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={item.link}
                className="inline-flex items-center gap-3 px-4 py-1 rounded-lg hover:bg-white/20 transition-all duration-200 font-semibold text-white group"
              >
                <Icon
                  icon="lucide:sparkles"
                  className="w-4 h-4 text-yellow-300 group-hover:scale-125 transition-transform"
                />
                <span className="group-hover:underline">{item.text}</span>
                <span className="text-white/60">•</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
