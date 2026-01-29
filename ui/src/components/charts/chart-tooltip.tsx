"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number | string, name: string) => string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label || "") : label;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg px-3 py-2 text-sm"
      >
        {formattedLabel && (
          <p className="font-semibold text-foreground mb-1">{formattedLabel}</p>
        )}
        <div className="space-y-0.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">
                {valueFormatter
                  ? valueFormatter(entry.value, entry.name)
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
