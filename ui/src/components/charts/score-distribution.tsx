"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { chartColors } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface ScoreDistributionProps {
  stocks: Stock[];
  onRangeClick?: (range: { min: number; max: number; label: string }) => void;
  activeRange?: { min: number; max: number } | null;
}

export function ScoreDistribution({ stocks, onRangeClick, activeRange }: ScoreDistributionProps) {
  // Create score tiers based on filtered stocks
  const tiers = [
    { range: "90+", min: 90, max: 100, color: chartColors.priority, label: "Priority" },
    { range: "80-89", min: 80, max: 89, color: chartColors.high, label: "High" },
    { range: "75-79", min: 75, max: 79, color: chartColors.medium, label: "Medium" },
    { range: "<75", min: 0, max: 74, color: chartColors.low, label: "Low" },
  ];

  const data = tiers.map(tier => ({
    range: tier.range,
    count: stocks.filter(s => s.match_score >= tier.min && s.match_score <= tier.max).length,
    color: tier.color,
    label: tier.label,
    min: tier.min,
    max: tier.max,
  })).filter(d => d.count > 0); // Only show tiers with data

  const isActive = (item: { min: number; max: number }) =>
    activeRange && activeRange.min === item.min && activeRange.max === item.max;

  if (stocks.length === 0 || data.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
        No stocks to display
      </div>
    );
  }

  return (
    <ChartWrapper height={180}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, bottom: 25, left: 25 }}
      >
        <XAxis
          dataKey="range"
          tick={{ fill: "#a1a1aa", fontSize: 11 }}
          axisLine={{ stroke: "#52525b" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#a1a1aa", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const item = payload[0].payload;
            const pct = stocks.length > 0 ? ((item.count / stocks.length) * 100).toFixed(0) : 0;
            return (
              <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg px-3 py-2 text-sm">
                <p className="font-semibold">{item.label} ({item.range})</p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">{item.count}</span> stocks ({pct}%)
                </p>
              </div>
            );
          }}
        />
        <Bar
          dataKey="count"
          radius={[6, 6, 0, 0]}
          animationDuration={500}
          animationEasing="ease-out"
          cursor={onRangeClick ? "pointer" : undefined}
          onClick={onRangeClick ? (_: unknown, index: number) => {
            const item = data[index];
            if (item) onRangeClick({ min: item.min, max: item.max, label: `${item.label} (${item.range})` });
          } : undefined}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              fillOpacity={activeRange && !isActive(entry) ? 0.3 : 1}
              strokeWidth={isActive(entry) ? 2 : 0}
              stroke={isActive(entry) ? "#ffffff" : "none"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartWrapper>
  );
}
