"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { ChartTooltip } from "./chart-tooltip";
import { chartColors, parsePercentage } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface FundamentalsRadarProps {
  stock: Stock;
}

export function FundamentalsRadar({ stock }: FundamentalsRadarProps) {
  // Normalize values to 0-100 scale for radar chart
  const normalizeValue = (value: string | number, max: number): number => {
    if (typeof value === "number") return Math.min((value / max) * 100, 100);
    const parsed = parsePercentage(value);
    return Math.min((parsed / max) * 100, 100);
  };

  const getMoatScore = (moat: string): number => {
    switch (moat) {
      case "wide": return 100;
      case "moderate": return 70;
      case "narrow": return 40;
      default: return 10;
    }
  };

  const data = [
    {
      metric: "Revenue Growth",
      value: normalizeValue(stock.fundamentals.revenue_growth_yoy, 50),
      fullMark: 100,
    },
    {
      metric: "Gross Margin",
      value: normalizeValue(stock.fundamentals.gross_margin, 80),
      fullMark: 100,
    },
    {
      metric: "FCF Margin",
      value: normalizeValue(stock.fundamentals.fcf_margin, 40),
      fullMark: 100,
    },
    {
      metric: "ROIC",
      value: normalizeValue(stock.fundamentals.roic, 30),
      fullMark: 100,
    },
    {
      metric: "Moat",
      value: getMoatScore(stock.fundamentals.moat_strength),
      fullMark: 100,
    },
    {
      metric: "Low Debt",
      value: Math.max(0, 100 - normalizeValue(stock.fundamentals.debt_to_equity, 200)),
      fullMark: 100,
    },
  ];

  return (
    <ChartWrapper height={220}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#52525b" strokeOpacity={0.5} />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          tickLine={false}
        />
        <Radar
          name="Fundamentals"
          dataKey="value"
          stroke={chartColors.primary}
          fill={chartColors.primary}
          fillOpacity={0.3}
          animationDuration={500}
          animationEasing="ease-out"
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltip
              active={active}
              payload={payload?.map(p => ({
                name: String(label),
                value: Math.round(Number(p.value)),
                color: chartColors.primary,
              }))}
              valueFormatter={(v) => `${v}/100`}
            />
          )}
        />
      </RadarChart>
    </ChartWrapper>
  );
}
