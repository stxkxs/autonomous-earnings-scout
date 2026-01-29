"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { chartColors } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface EarningsTimelineProps {
  stocks: Stock[];
}

export function EarningsTimeline({ stocks }: EarningsTimelineProps) {
  // Group stocks by day
  const dayGroups: Record<string, { date: Date; count: number; tickers: string[] }> = {};

  stocks.forEach(stock => {
    const date = new Date(stock.earnings_date);
    const key = date.toISOString().split("T")[0];
    if (!dayGroups[key]) {
      dayGroups[key] = { date, count: 0, tickers: [] };
    }
    dayGroups[key].count++;
    dayGroups[key].tickers.push(stock.ticker);
  });

  // Convert to sorted array and limit to next 14 days
  const data = Object.entries(dayGroups)
    .map(([key, value]) => ({
      date: key,
      displayDate: new Date(value.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: value.count,
      tickers: value.tickers,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 14);

  if (data.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
        No upcoming earnings
      </div>
    );
  }

  return (
    <ChartWrapper height={180}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, bottom: 25, left: 0 }}
      >
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
            <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#52525b"
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="displayDate"
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          axisLine={{ stroke: "#52525b" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={25}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const item = payload[0].payload;
            return (
              <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg px-3 py-2 text-sm max-w-[200px]">
                <p className="font-semibold">{item.displayDate}</p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">{item.count}</span> earnings
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {item.tickers.slice(0, 5).join(", ")}
                  {item.tickers.length > 5 && ` +${item.tickers.length - 5} more`}
                </p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={chartColors.primary}
          strokeWidth={2}
          fill="url(#colorCount)"
          animationDuration={500}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ChartWrapper>
  );
}
