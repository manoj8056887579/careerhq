"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChromaGridProps {
  children?: React.ReactNode;
  className?: string;
  gridSize?: number;
  colors?: string[];
  animationDuration?: number;
}

export function ChromaGrid({
  children,
  className,
  gridSize = 40,
  colors = [
    "rgba(26, 115, 232, 0.1)",
    "rgba(86, 144, 248, 0.1)",
    "rgba(174, 203, 250, 0.1)",
  ],
  animationDuration = 20,
}: ChromaGridProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${colors[0]} 1px, transparent 1px),
            linear-gradient(to bottom, ${colors[0]} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          animation: `chromaShift ${animationDuration}s ease-in-out infinite`,
        }}
      />
      
      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors[1]}, transparent)`,
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors[2]}, transparent)`,
            animationDuration: "6s",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes chromaShift {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% {
            transform: translate(10px, 10px);
            opacity: 0.5;
          }
          50% {
            transform: translate(0, 20px);
            opacity: 0.3;
          }
          75% {
            transform: translate(-10px, 10px);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
