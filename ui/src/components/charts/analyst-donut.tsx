"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { ChartTooltip } from "./chart-tooltip";
import { chartColors } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface AnalystDonutProps {
  stock: Stock;
}

export function AnalystDonut({ stock }: AnalystDonutProps) {
  const { buy_ratings, hold_ratings, sell_ratings } = stock.analyst_sentiment;
  const total = buy_ratings + hold_ratings + sell_ratings;

  if (total === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
        No analyst ratings available
      </div>
    );
  }

  const data = [
    { name: "Buy", value: buy_ratings, color: chartColors.positive },
    { name: "Hold", value: hold_ratings, color: chartColors.neutral },
    { name: "Sell", value: sell_ratings, color: chartColors.negative },
  ].filter(d => d.value > 0);

  return (
    <ChartWrapper height={180}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={65}
          paddingAngle={3}
          dataKey="value"
          animationDuration={500}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => (
            <ChartTooltip
              active={active}
              payload={payload?.map(p => ({
                name: String(p.name),
                value: p.value as number,
                color: p.payload?.color,
              }))}
              valueFormatter={(v) => `${v} analysts (${((Number(v) / total) * 100).toFixed(0)}%)`}
            />
          )}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        />
        {/* Center text */}
        <text
          x="50%"
          y="45%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-xl font-bold"
        >
          {total}
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Analysts
        </text>
      </PieChart>
    </ChartWrapper>
  );
}
