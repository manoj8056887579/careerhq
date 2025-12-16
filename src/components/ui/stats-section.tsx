"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface StatItem {
  value: string;
  label: string;
  icon: string;
}

interface StatsSectionProps {
  stats: StatItem[];
  className?: string;
}

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 80,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(
          Math.floor(latest)
        );
      }
    });
  }, [springValue]);

  return <span ref={ref} />;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  // Extract numeric value and suffix from the stat value
  const parseValue = (val: string) => {
    const match = val.match(/^([\d,]+)(.*)$/);
    if (match) {
      const numericPart = match[1].replace(/,/g, "");
      const suffix = match[2];
      return { numeric: parseInt(numericPart, 10), suffix };
    }
    return { numeric: 0, suffix: val };
  };

  const { numeric, suffix } = parseValue(stat.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center group"
    >
      {/* Icon with floating animation */}
      <motion.div
        className="relative mb-6"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {/* Glow effect behind icon */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-3xl blur-2xl opacity-40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Icon container */}
        <motion.div
          className="relative w-24 h-24  flex items-center justify-center "
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Icon icon={stat.icon} className="text-6xl text-black" />
        </motion.div>
      </motion.div>

      {/* Counter with enhanced animation */}
      <motion.div
        className="font-black text-6xl md:text-7xl mb-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent"
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{
          delay: index * 0.1 + 0.2,
          duration: 0.6,
          type: "spring",
          stiffness: 150,
        }}
        viewport={{ once: true }}
      >
        {numeric > 0 ? (
          <>
            <AnimatedCounter value={numeric} />
            {suffix}
          </>
        ) : (
          stat.value
        )}
      </motion.div>

      {/* Label with underline animation */}
      <div className="relative">
        <motion.p
          className="text-gray-700 dark:text-gray-300 font-bold text-xl tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {stat.label}
        </motion.p>
        
        {/* Animated underline */}
        <motion.div
          className="h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-3"
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          transition={{ delay: index * 0.1 + 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  );
}

export function StatsSection({ stats, className = "" }: StatsSectionProps) {
  return (
    <div className={className}>
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} index={index} />
      ))}
    </div>
  );
}
