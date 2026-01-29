"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { chartColors, getScoreTierColor } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface UrgencyScatterProps {
  stocks: Stock[];
  onSelectStock?: (stock: Stock) => void;
}

export function UrgencyScatter({ stocks, onSelectStock }: UrgencyScatterProps) {
  const data = stocks.map(stock => ({
    x: stock.days_until_earnings,
    y: stock.match_score,
    z: 100, // Fixed size for now
    ticker: stock.ticker,
    company: stock.company,
    color: getScoreTierColor(stock.match_score),
    stock,
  }));

  if (stocks.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
        No stocks to display
      </div>
    );
  }

  return (
    <ChartWrapper height={200}>
      <ScatterChart margin={{ top: 10, right: 10, bottom: 25, left: 35 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#52525b"
          strokeOpacity={0.5}
        />
        <XAxis
          type="number"
          dataKey="x"
          name="Days"
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          axisLine={{ stroke: "#52525b" }}
          tickLine={false}
          label={{
            value: "Days Until Earnings",
            position: "bottom",
            offset: 10,
            fontSize: 10,
            fill: "#a1a1aa",
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Score"
          domain={["dataMin - 5", "dataMax + 5"]}
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          label={{
            value: "Score",
            angle: -90,
            position: "insideLeft",
            offset: 15,
            fontSize: 10,
            fill: "#a1a1aa",
          }}
        />
        <ZAxis type="number" dataKey="z" range={[50, 150]} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const item = payload[0].payload;
            return (
              <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg px-3 py-2 text-sm">
                <p className="font-semibold">{item.ticker}</p>
                <p className="text-xs text-muted-foreground mb-1">{item.company}</p>
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">
                    Score: <span className="text-foreground font-medium">{item.y}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Days: <span className="text-foreground font-medium">{item.x}</span>
                  </p>
                </div>
              </div>
            );
          }}
        />
        <Scatter
          data={data}
          animationDuration={500}
          animationEasing="ease-out"
          onClick={(data) => onSelectStock?.(data.stock)}
          cursor="pointer"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              fillOpacity={0.7}
              stroke={entry.color}
              strokeWidth={2}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ChartWrapper>
  );
}
