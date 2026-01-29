"use client";

import { motion } from "framer-motion";

interface ActiveDotProps {
  cx?: number;
  cy?: number;
  fill?: string;
  r?: number;
}

export function ActiveDot({ cx, cy, fill = "#10b981", r = 6 }: ActiveDotProps) {
  if (cx === undefined || cy === undefined) return null;

  return (
    <g>
      <motion.circle
        cx={cx}
        cy={cy}
        r={r + 4}
        fill={fill}
        fillOpacity={0.2}
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke="white"
        strokeWidth={2}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    </g>
  );
}
