"use client";

import { motion } from "motion/react";

import { heroHotspots, type MapHotspot } from "@/lib/landing-data";

const severityColor: Record<MapHotspot["severity"], string> = {
  low: "var(--map-heat-low)",
  medium: "var(--map-heat-medium)",
  high: "var(--map-heat-high)",
};

/** Stylized, abstract Bangladesh silhouette (decorative, not to scale). */
const COUNTRY_PATH =
  "M40 8 L52 10 L54 16 L62 15 L66 22 L64 30 L72 30 L80 34 L78 44 L84 52 L80 62 L72 60 L76 70 L70 80 L60 82 L58 74 L50 82 L44 78 L46 68 L38 74 L32 68 L36 60 L28 62 L24 54 L30 46 L26 38 L32 34 L30 26 L36 22 L34 14 Z";

export function BangladeshMapVisual() {
  return (
    <div className="relative aspect-[4/5] w-full">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Live civic issue signals across Bangladesh"
      >
        <defs>
          <linearGradient id="beacon-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="color-mix(in oklch, var(--primary), transparent 78%)" />
            <stop offset="100%" stopColor="color-mix(in oklch, var(--accent), transparent 86%)" />
          </linearGradient>
        </defs>

        {/* connective route lines between hotspots */}
        <g
          stroke="color-mix(in oklch, var(--primary-foreground), transparent 82%)"
          strokeWidth="0.35"
          strokeDasharray="1.5 1.5"
          fill="none"
        >
          <line x1="52" y1="46" x2="74" y2="66" />
          <line x1="52" y1="46" x2="78" y2="32" />
          <line x1="52" y1="46" x2="30" y2="40" />
          <line x1="52" y1="46" x2="50" y2="74" />
        </g>

        <motion.path
          d={COUNTRY_PATH}
          fill="url(#beacon-land)"
          stroke="color-mix(in oklch, var(--primary), transparent 40%)"
          strokeWidth="0.6"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {heroHotspots.map((spot, i) => {
          const color = severityColor[spot.severity];
          return (
            <g key={spot.id}>
              <motion.circle
                cx={spot.x}
                cy={spot.y}
                r={3.5}
                fill={color}
                opacity={0.35}
                initial={{ scale: 0.6, opacity: 0.4 }}
                animate={{ scale: [0.6, 2.4], opacity: [0.4, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: "easeOut",
                }}
                style={{ transformOrigin: `${spot.x}px ${spot.y}px` }}
              />
              <motion.circle
                cx={spot.x}
                cy={spot.y}
                r={1.6}
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
