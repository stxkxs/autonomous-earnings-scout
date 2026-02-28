"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { parsePercentage } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface ComparisonRadarProps {
  stocks: Stock[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

function normalizeValue(value: string | number, max: number): number {
  if (typeof value === "number") return Math.min((value / max) * 100, 100);
  const parsed = parsePercentage(value);
  return Math.min((parsed / max) * 100, 100);
}

function getMoatScore(moat: string): number {
  switch (moat) {
    case "wide": return 100;
    case "moderate": return 70;
    case "narrow": return 40;
    default: return 10;
  }
}

const METRICS = [
  { key: "revGrowth", label: "Revenue Growth" },
  { key: "grossMargin", label: "Gross Margin" },
  { key: "fcfMargin", label: "FCF Margin" },
  { key: "roic", label: "ROIC" },
  { key: "moat", label: "Moat" },
  { key: "lowDebt", label: "Low Debt" },
];

export function ComparisonRadar({ stocks }: ComparisonRadarProps) {
  const data = METRICS.map((m) => {
    const row: Record<string, string | number> = { metric: m.label };
    stocks.forEach((stock) => {
      switch (m.key) {
        case "revGrowth":
          row[stock.ticker] = normalizeValue(stock.fundamentals.revenue_growth_yoy, 50);
          break;
        case "grossMargin":
          row[stock.ticker] = normalizeValue(stock.fundamentals.gross_margin, 80);
          break;
        case "fcfMargin":
          row[stock.ticker] = normalizeValue(stock.fundamentals.fcf_margin, 40);
          break;
        case "roic":
          row[stock.ticker] = normalizeValue(stock.fundamentals.roic, 30);
          break;
        case "moat":
          row[stock.ticker] = getMoatScore(stock.fundamentals.moat_strength);
          break;
        case "lowDebt":
          row[stock.ticker] = Math.max(0, 100 - normalizeValue(stock.fundamentals.debt_to_equity, 200));
          break;
      }
    });
    return row;
  });

  return (
    <ChartWrapper height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
        <PolarGrid stroke="#52525b" strokeOpacity={0.5} />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          tickLine={false}
        />
        {stocks.map((stock, i) => (
          <Radar
            key={stock.ticker}
            name={stock.ticker}
            dataKey={stock.ticker}
            stroke={COLORS[i]}
            fill={COLORS[i]}
            fillOpacity={0.15}
            animationDuration={500}
          />
        ))}
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg px-3 py-2 text-sm">
                <p className="font-semibold mb-1">{label}</p>
                {payload.map((p, i) => (
                  <p key={i} className="text-muted-foreground">
                    <span style={{ color: COLORS[i] }} className="font-medium">{p.name}</span>:{" "}
                    {Math.round(Number(p.value))}/100
                  </p>
                ))}
              </div>
            );
          }}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{ fontSize: "11px" }}
        />
      </RadarChart>
    </ChartWrapper>
  );
}
