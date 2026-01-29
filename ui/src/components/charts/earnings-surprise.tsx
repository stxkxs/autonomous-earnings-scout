"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { chartColors, parsePercentage } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface EarningsSurpriseProps {
  stock: Stock;
}

export function EarningsSurprise({ stock }: EarningsSurpriseProps) {
  const surprises = stock.earnings_expectations?.earnings_surprise_history || [];

  if (surprises.length === 0) {
    return (
      <div className="h-[140px] flex items-center justify-center text-muted-foreground text-sm">
        No earnings surprise history available
      </div>
    );
  }

  const data = surprises.slice(0, 6).map((surprise, index) => {
    const value = parsePercentage(surprise);
    return {
      quarter: `Q${surprises.length - index}`,
      surprise: value,
      fill: value >= 0 ? chartColors.positive : chartColors.negative,
    };
  }).reverse();

  return (
    <ChartWrapper height={140}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, bottom: 20, left: 25 }}
      >
        <XAxis
          dataKey="quarter"
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          axisLine={{ stroke: "#52525b" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
          width={30}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const item = payload[0].payload;
            return (
              <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg px-3 py-2 text-sm">
                <p className="font-semibold">{item.quarter}</p>
                <p className={item.surprise >= 0 ? "text-emerald-500" : "text-red-500"}>
                  {item.surprise >= 0 ? "+" : ""}{item.surprise.toFixed(1)}% surprise
                </p>
              </div>
            );
          }}
        />
        <ReferenceLine y={0} stroke="#52525b" />
        <Bar
          dataKey="surprise"
          radius={[4, 4, 0, 0]}
          animationDuration={500}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartWrapper>
  );
}
