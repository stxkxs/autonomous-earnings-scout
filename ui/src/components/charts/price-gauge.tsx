"use client";

import { motion } from "framer-motion";
import { parseCurrency, chartColors } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface PriceGaugeProps {
  stock: Stock;
}

export function PriceGauge({ stock }: PriceGaugeProps) {
  const current = parseCurrency(stock.price_current);
  const low = parseCurrency(stock.price_52w_low);
  const high = parseCurrency(stock.price_52w_high);

  if (high === low || current === 0) {
    return null;
  }

  // Calculate position percentage (0-100)
  const position = Math.min(100, Math.max(0, ((current - low) / (high - low)) * 100));

  // Determine color based on position
  const getColor = (pos: number) => {
    if (pos <= 30) return chartColors.positive; // Near 52w low (bullish)
    if (pos >= 70) return chartColors.negative; // Near 52w high (caution)
    return chartColors.primary;
  };

  const color = getColor(position);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>52W Low</span>
        <span>52W High</span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(to right, ${chartColors.positive}30, ${chartColors.medium}30, ${chartColors.negative}30)`,
          }}
        />
        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${position}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Current price indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background shadow-sm"
          style={{ backgroundColor: color }}
          initial={{ left: 0 }}
          animate={{ left: `calc(${position}% - 6px)` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="font-medium">{stock.price_52w_low}</span>
        <motion.span
          className="font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {stock.price_current}
        </motion.span>
        <span className="font-medium">{stock.price_52w_high}</span>
      </div>
    </div>
  );
}
