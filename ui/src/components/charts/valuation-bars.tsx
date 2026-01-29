"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { chartColors } from "@/lib/chart-config";
import { Stock } from "@/types/stock";

interface ValuationBarsProps {
  stock: Stock;
}

// Industry average benchmarks
const benchmarks: Record<string, number> = {
  "P/E": 25,
  "Fwd P/E": 20,
  "PEG": 1.5,
  "P/S": 5,
  "EV/EBITDA": 15,
};

export function ValuationBars({ stock }: ValuationBarsProps) {
  const { pe_ratio, forward_pe, peg_ratio, price_to_sales, ev_to_ebitda } =
    stock.valuation_metrics;

  const data = [
    { name: "P/E", value: pe_ratio, benchmark: benchmarks["P/E"] },
    { name: "Fwd P/E", value: forward_pe, benchmark: benchmarks["Fwd P/E"] },
    { name: "PEG", value: peg_ratio, benchmark: benchmarks["PEG"] },
    { name: "P/S", value: price_to_sales, benchmark: benchmarks["P/S"] },
    { name: "EV/EBITDA", value: ev_to_ebitda, benchmark: benchmarks["EV/EBITDA"] },
  ].filter(d => d.value > 0 && d.value < 1000); // Filter out invalid values

  if (data.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
        No valuation metrics available
      </div>
    );
  }

  // Determine color based on whether value is better or worse than benchmark
  const getColor = (value: number, benchmark: number, metric: string) => {
    // For most metrics, lower is better
    if (metric === "PEG") {
      return value <= benchmark ? chartColors.positive : chartColors.negative;
    }
    return value <= benchmark * 1.2 ? chartColors.positive : value <= benchmark * 1.5 ? chartColors.medium : chartColors.negative;
  };

  return (
    <ChartWrapper height={180}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, bottom: 5, left: 60 }}
      >
        <XAxis
          type="number"
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
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
            const diff = ((item.value - item.benchmark) / item.benchmark) * 100;
            return (
              <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg px-3 py-2 text-sm">
                <p className="font-semibold">{item.name}</p>
                <p className="text-muted-foreground">
                  Value: <span className="text-foreground font-medium">{item.value.toFixed(1)}</span>
                </p>
                <p className="text-muted-foreground">
                  Benchmark: <span className="text-foreground font-medium">{item.benchmark}</span>
                </p>
                <p className={diff <= 0 ? "text-emerald-500" : "text-red-500"}>
                  {diff > 0 ? "+" : ""}{diff.toFixed(0)}% vs benchmark
                </p>
              </div>
            );
          }}
        />
        <Bar
          dataKey="value"
          barSize={16}
          radius={[0, 4, 4, 0]}
          animationDuration={500}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor(entry.value, entry.benchmark, entry.name)}
            />
          ))}
        </Bar>
        {/* Benchmark reference lines */}
        {data.map((entry, index) => (
          <ReferenceLine
            key={`ref-${index}`}
            x={entry.benchmark}
            stroke={chartColors.neutral}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />
        ))}
      </BarChart>
    </ChartWrapper>
  );
}
