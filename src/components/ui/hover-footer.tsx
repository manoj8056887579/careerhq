"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  // Split text to make "HQ" red
  const careerText = text.substring(0, 6); // "CAREER"
  const hqText = text.substring(6); // "HQ"

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#80eeb4" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* Background text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1.5"
        fontSize="140"
        fontWeight="bold"
        fontFamily="helvetica, arial, sans-serif"
        className="fill-transparent stroke-neutral-200 dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        <tspan>{careerText}</tspan>
        <tspan className="stroke-[#ef4444]">{hqText}</tspan>
      </text>

      {/* Animated stroke text */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1.5"
        fontSize="140"
        fontWeight="bold"
        fontFamily="helvetica, arial, sans-serif"
        className="fill-transparent"
        initial={{ strokeDashoffset: 2000, strokeDasharray: 2000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 2000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        <tspan className="stroke-[#3ca2fa] dark:stroke-[#3ca2fa99]">
          {careerText}
        </tspan>
        <tspan className="stroke-[#ef4444]">{hqText}</tspan>
      </motion.text>

      {/* Gradient masked text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="1.5"
        fontSize="140"
        fontWeight="bold"
        fontFamily="helvetica, arial, sans-serif"
        mask="url(#textMask)"
        className="fill-transparent"
      >
        <tspan>{careerText}</tspan>
        <tspan className="stroke-[#ef4444]">{hqText}</tspan>
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0"
      // style={{
      //   background:
      //     "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #3ca2fa33 100%)",
      // }}
    />
  );
};
