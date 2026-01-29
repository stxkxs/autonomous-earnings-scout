// Chart configuration for Recharts
// Using direct color values for compatibility with Recharts

export const chartColors = {
  // Primary chart colors
  primary: "#14b8a6", // teal-500
  secondary: "#06b6d4", // cyan-500
  tertiary: "#8b5cf6", // violet-500
  quaternary: "#84cc16", // lime-500
  quinary: "#f59e0b", // amber-500
  // Score tier colors
  priority: "#10b981", // emerald-500
  high: "#3b82f6", // blue-500
  medium: "#f59e0b", // amber-500
  low: "#6b7280", // gray-500
  // Sentiment colors
  positive: "#10b981", // emerald-500
  neutral: "#6b7280", // gray-500
  negative: "#ef4444", // red-500
  // UI colors
  muted: "#a1a1aa", // zinc-400 (more visible)
  background: "#ffffff",
  foreground: "#18181b", // zinc-900
  border: "#d4d4d8", // zinc-300 (more visible)
  // Dark mode variants
  mutedDark: "#a1a1aa", // zinc-400
  borderDark: "#52525b", // zinc-600
} as const;

// Helper to get theme-aware colors (call from component with isDark boolean)
export function getThemeColors(isDark: boolean) {
  return {
    muted: isDark ? chartColors.mutedDark : chartColors.muted,
    border: isDark ? chartColors.borderDark : chartColors.border,
  };
}

export const chartAnimation = {
  duration: 400,
  easing: "ease-out",
} as const;

export const chartMargins = {
  compact: { top: 5, right: 5, bottom: 5, left: 5 },
  default: { top: 10, right: 10, bottom: 10, left: 10 },
  withAxis: { top: 10, right: 10, bottom: 30, left: 40 },
  withLabels: { top: 20, right: 20, bottom: 20, left: 20 },
} as const;

// Responsive breakpoints
export const chartBreakpoints = {
  sm: 375,
  md: 640,
  lg: 1024,
} as const;

// Common chart styles
export const chartStyles = {
  tooltip: {
    contentStyle: {
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backdropFilter: "blur(8px)",
    },
    labelStyle: {
      fontWeight: 600,
      color: "hsl(var(--foreground))",
    },
  },
  axis: {
    tick: {
      fill: "hsl(var(--muted-foreground))",
      fontSize: 11,
    },
    axisLine: {
      stroke: "hsl(var(--border))",
    },
  },
  grid: {
    stroke: "hsl(var(--border))",
    strokeDasharray: "3 3",
    strokeOpacity: 0.5,
  },
  legend: {
    wrapperStyle: {
      paddingTop: "12px",
    },
  },
} as const;

// Helper to get score tier color
export function getScoreTierColor(score: number): string {
  if (score >= 90) return chartColors.priority;
  if (score >= 80) return chartColors.high;
  if (score >= 75) return chartColors.medium;
  return chartColors.low;
}

// Helper to format percentage strings for charts
export function parsePercentage(value: string): number {
  const match = value.match(/-?[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

// Helper to format currency strings for charts
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[$,]/g, "");
  const match = cleaned.match(/-?[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}
