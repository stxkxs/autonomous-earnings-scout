"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { Stock } from "@/types/stock";

interface SectorPieProps {
  stocks: Stock[];
  onSectorClick?: (sector: string) => void;
  activeSector?: string | null;
}

// Color palette for sectors
const sectorColors = [
  "#4ade80", // emerald-400
  "#38bdf8", // sky-400
  "#a78bfa", // violet-400
  "#fbbf24", // amber-400
  "#f472b6", // pink-400
  "#22d3ee", // cyan-400
  "#a3e635", // lime-400
  "#fb923c", // orange-400
  "#818cf8", // indigo-400
  "#2dd4bf", // teal-400
];

export function SectorPie({ stocks, onSectorClick, activeSector }: SectorPieProps) {
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
          cursor={onSectorClick ? "pointer" : undefined}
          onClick={onSectorClick ? (_: unknown, index: number) => {
            const sector = data[index]?.name;
            if (sector && sector !== "Other") onSectorClick(sector);
          } : undefined}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              strokeWidth={activeSector === entry.name ? 2 : 0}
              stroke={activeSector === entry.name ? "#ffffff" : "none"}
              fillOpacity={activeSector && activeSector !== entry.name ? 0.3 : 1}
            />
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
