"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { Stock } from "@/types/stock";

interface SectorPieProps {
  stocks: Stock[];
}

// Color palette for sectors
const sectorColors = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
  "#6366f1", // indigo
  "#14b8a6", // teal
];

export function SectorPie({ stocks }: SectorPieProps) {
  // Calculate sector distribution
  const sectorCounts: Record<string, number> = {};
  stocks.forEach(stock => {
    sectorCounts[stock.sector] = (sectorCounts[stock.sector] || 0) + 1;
  });

  const data = Object.entries(sectorCounts)
    .map(([name, value], index) => ({
      name,
      value,
      color: sectorColors[index % sectorColors.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Limit to top 8 sectors

  // Group remaining sectors as "Other"
  const otherCount = stocks.length - data.reduce((sum, d) => sum + d.value, 0);
  if (otherCount > 0) {
    data.push({ name: "Other", value: otherCount, color: "#6b7280" });
  }

  if (stocks.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
        No stocks to display
      </div>
    );
  }

  return (
    <ChartWrapper height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={35}
          outerRadius={60}
          paddingAngle={2}
          dataKey="value"
          animationDuration={500}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const item = payload[0].payload;
            const pct = ((item.value / stocks.length) * 100).toFixed(0);
            return (
              <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg px-3 py-2 text-sm">
                <p className="font-semibold">{item.name}</p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">{item.value}</span> stocks ({pct}%)
                </p>
              </div>
            );
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={50}
          wrapperStyle={{ fontSize: "10px" }}
          formatter={(value: string) => (
            <span className="text-muted-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ChartWrapper>
  );
}
