"use client";

import {
  ComposedChart,
  Bar,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { chartColors, parseCurrency } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface PriceTargetRangeProps {
  stock: Stock;
}

export function PriceTargetRange({ stock }: PriceTargetRangeProps) {
  const { average_price_target, high_target, low_target } = stock.analyst_sentiment;
  const currentPrice = parseCurrency(stock.price_current);
  const avgTarget = parseCurrency(average_price_target);
  const highTarget = parseCurrency(high_target);
  const lowTarget = parseCurrency(low_target);

  if (avgTarget === 0) {
    return (
      <div className="h-[120px] flex items-center justify-center text-muted-foreground text-sm">
        No price targets available
      </div>
    );
  }

  // Calculate upside/downside
  const upside = ((avgTarget - currentPrice) / currentPrice) * 100;

  const data = [
    { name: "Low", value: lowTarget, fill: chartColors.negative },
    { name: "Current", value: currentPrice, fill: chartColors.primary },
    { name: "Avg Target", value: avgTarget, fill: chartColors.positive },
    { name: "High", value: highTarget, fill: chartColors.quaternary },
  ];

  return (
    <div className="space-y-2">
      <ChartWrapper height={100}>
        <ComposedChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, bottom: 5, left: 60 }}
        >
          <XAxis
            type="number"
            domain={[lowTarget * 0.95, highTarget * 1.05]}
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            axisLine={{ stroke: "#52525b" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const item = payload[0].payload;
              return (
                <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg px-3 py-2 text-sm">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-muted-foreground">${item.value.toFixed(2)}</p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="value"
            barSize={12}
            radius={[0, 4, 4, 0]}
            animationDuration={500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
          <ReferenceLine
            x={currentPrice}
            stroke={chartColors.primary}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        </ComposedChart>
      </ChartWrapper>
      <div className="text-center">
        <span
          className={`text-sm font-semibold ${
            upside >= 0 ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {upside >= 0 ? "+" : ""}
          {upside.toFixed(1)}% to avg target
        </span>
      </div>
    </div>
  );
}
