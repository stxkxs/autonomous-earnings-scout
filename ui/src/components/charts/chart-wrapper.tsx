"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer } from "recharts";

interface ChartWrapperProps {
  children: ReactNode;
  height?: number;
  className?: string;
  delay?: number;
}

export function ChartWrapper({
  children,
  height = 200,
  className = "",
  delay = 0,
}: ChartWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </motion.div>
  );
}
