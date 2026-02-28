"use client";

import { Stock, getScoreBgColor } from "@/types/stock";
import { Badge } from "@/components/ui/badge";
import { ComparisonRadar } from "@/components/charts/comparison-radar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StockComparisonProps {
  stocks: Stock[];
}

const metricRows: { label: string; getValue: (s: Stock) => string }[] = [
  { label: "Score", getValue: (s) => String(s.match_score) },
  { label: "Sector", getValue: (s) => s.sector },
  { label: "Market Cap", getValue: (s) => s.market_cap },
  { label: "Price", getValue: (s) => s.price_current },
  { label: "Earnings Date", getValue: (s) => s.earnings_date },
  { label: "Rev Growth", getValue: (s) => s.fundamentals.revenue_growth_yoy },
  { label: "Gross Margin", getValue: (s) => s.fundamentals.gross_margin },
  { label: "FCF Margin", getValue: (s) => s.fundamentals.fcf_margin },
  { label: "ROIC", getValue: (s) => s.fundamentals.roic },
  { label: "Moat", getValue: (s) => s.fundamentals.moat_strength },
  { label: "P/E", getValue: (s) => String(s.valuation_metrics.pe_ratio) },
  { label: "Fwd P/E", getValue: (s) => String(s.valuation_metrics.forward_pe) },
  { label: "PEG", getValue: (s) => String(s.valuation_metrics.peg_ratio) },
  { label: "P/S", getValue: (s) => String(s.valuation_metrics.price_to_sales) },
  { label: "EV/EBITDA", getValue: (s) => String(s.valuation_metrics.ev_to_ebitda) },
  { label: "Consensus", getValue: (s) => s.analyst_sentiment.consensus.replace("_", " ") },
  { label: "Target Price", getValue: (s) => s.analyst_sentiment.average_price_target },
];

export function StockComparison({ stocks }: StockComparisonProps) {
  if (stocks.length < 2) return null;

  return (
    <ScrollArea className="max-h-[70vh]">
      <div className="space-y-6">
        {/* Header with stock names */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `140px repeat(${stocks.length}, 1fr)` }}>
          <div />
          {stocks.map((stock) => (
            <div key={stock.ticker} className="text-center">
              <p className="font-bold text-base font-mono-num">{stock.ticker}</p>
              <p className="text-xs text-muted-foreground truncate">{stock.company}</p>
              <Badge className={`mt-1 ${getScoreBgColor(stock.match_score)} text-white text-xs`}>
                {stock.match_score}
              </Badge>
            </div>
          ))}
        </div>

        {/* Radar Chart Overlay */}
        <div className="bg-muted/30 rounded-lg p-2">
          <ComparisonRadar stocks={stocks} />
        </div>

        {/* Comparison Table */}
        <div className="rounded-lg border overflow-hidden">
          {metricRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid items-center ${i % 2 === 0 ? "bg-muted/30" : ""}`}
              style={{ gridTemplateColumns: `140px repeat(${stocks.length}, 1fr)` }}
            >
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {row.label}
              </div>
              {stocks.map((stock) => (
                <div key={stock.ticker} className="px-2 py-1.5 text-xs font-medium font-mono-num text-center capitalize">
                  {row.getValue(stock)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
