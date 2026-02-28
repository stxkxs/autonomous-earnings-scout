"use client";

import { Stock, getScoreBgColor } from "@/types/stock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, getEarningsTimeLabel } from "@/lib/stocks";
import { ExternalLink, TrendingUp, AlertCircle, X, Heart } from "lucide-react";
import {
  FundamentalsRadar,
  AnalystDonut,
  PriceTargetRange,
  EarningsSurprise,
  ValuationBars,
  PriceGauge,
} from "@/components/charts";
import { StockNotes } from "@/components/stock-notes";
import { useUserData } from "@/contexts/user-data-context";

interface StockDetailProps {
  stock: Stock | null;
  onClose?: () => void;
}

export function StockDetail({ stock, onClose }: StockDetailProps) {
  const { isWatchlisted, toggleWatchlist } = useUserData();

  if (!stock) {
    return null;
  }

  const scoreBg = getScoreBgColor(stock.match_score);
  const watchlisted = isWatchlisted(stock.ticker);

  return (
    <Card className="h-full overflow-hidden flex flex-col border shadow-none">
      <CardHeader className="border-b p-4 relative">
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleWatchlist(stock.ticker)}
            className="rounded-md h-8 w-8"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                watchlisted ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400"
              }`}
            />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-bold font-mono-num">{stock.ticker}</CardTitle>
              <Badge className={scoreBg + " text-white font-bold px-2 py-1 font-mono-num"}>{stock.match_score}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{stock.company}</p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">{stock.sector}</Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {stock.market_cap_category} cap
              </Badge>
            </div>
          </div>
          <div className="text-right mr-16">
            <p className="text-xl font-bold font-mono-num">{stock.price_current}</p>
            <p className="text-sm text-muted-foreground mt-1">{stock.market_cap}</p>
          </div>
        </div>

        {/* Earnings Info */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="p-2 bg-muted/50 rounded">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Earnings Date</p>
            <p className="font-semibold text-sm font-mono-num">{formatDate(stock.earnings_date)}</p>
            <p className="text-xs text-muted-foreground mt-1">{getEarningsTimeLabel(stock.earnings_time)}</p>
          </div>
          <div className="p-2 bg-muted/50 rounded col-span-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Analyst Consensus</p>
            <p className="text-xs font-semibold capitalize">
              {stock.analyst_sentiment.consensus.replace("_", " ")}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-mono-num">Target: {stock.analyst_sentiment.average_price_target}</p>
          </div>
        </div>

        {/* 52-Week Price Gauge */}
        <div className="mt-3 p-2 bg-muted/30 rounded">
          <PriceGauge stock={stock} />
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b p-0 h-auto">
            <TabsTrigger value="overview" className="rounded-none">
              Overview
            </TabsTrigger>
            <TabsTrigger value="fundamentals" className="rounded-none">
              Fundamentals
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="rounded-none">
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="valuation" className="rounded-none">
              Valuation
            </TabsTrigger>
            <TabsTrigger value="notes" className="rounded-none">
              Notes
            </TabsTrigger>
          </TabsList>

          <div className="p-4">
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-5">
                {/* Investment Thesis */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Investment Thesis
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stock.investment_thesis}</p>
                </div>

                {/* Catalysts */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-emerald-500 dark:text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Catalysts
                  </h3>
                  <ul className="space-y-2">
                    {stock.catalysts.map((catalyst, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-emerald-500 font-bold">+</span>
                        <span>{catalyst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Risks
                  </h3>
                  <ul className="space-y-2">
                    {stock.risks.map((risk, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-red-500 font-bold">-</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent News */}
                {stock.recent_news && stock.recent_news.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Recent News</h3>
                    <div className="space-y-3">
                      {stock.recent_news.slice(0, 3).map((news, idx) => (
                        <div key={idx} className="border-l-2 border-border pl-3">
                          <p className="text-xs text-muted-foreground">{formatDate(news.date)} • {news.source}</p>
                          <p className="text-sm font-medium mt-1">{news.headline}</p>
                          <p className="text-xs text-muted-foreground mt-1">{news.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="fundamentals" className="mt-0">
              <div className="space-y-4">
                {/* Fundamentals Radar Chart */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Fundamentals Overview</h3>
                  <div className="bg-muted/30 rounded p-2">
                    <FundamentalsRadar stock={stock} />
                  </div>
                </div>

                {/* Core Metrics */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Core Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricRow label="Revenue Growth (YoY)" value={stock.fundamentals.revenue_growth_yoy} positive />
                    <MetricRow label="Gross Margin" value={stock.fundamentals.gross_margin} />
                    <MetricRow label="FCF Margin" value={stock.fundamentals.fcf_margin} />
                    <MetricRow label="ROIC" value={stock.fundamentals.roic} positive />
                    <MetricRow label="Debt-to-Equity" value={stock.fundamentals.debt_to_equity} />
                    <MetricRow label="Moat Strength" value={stock.fundamentals.moat_strength} className="capitalize" />
                  </div>
                </div>

                {/* Growth Signals */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Growth Signals</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {stock.growth_signals.ai_mentions_trend && (
                      <MetricRow label="AI Mentions Trend" value={stock.growth_signals.ai_mentions_trend} className="capitalize" />
                    )}
                    {stock.growth_signals.cloud_revenue_growth && (
                      <MetricRow label="Cloud Revenue Growth" value={stock.growth_signals.cloud_revenue_growth} />
                    )}
                    <MetricRow label="Margin Expansion" value={stock.growth_signals.margin_expansion} />
                    <MetricRow label="TAM Expansion" value={stock.growth_signals.tam_expansion} />
                  </div>
                </div>

                {/* Earnings History */}
                {stock.earnings_expectations && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Earnings Expectations</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <MetricRow label="Consensus EPS" value={stock.earnings_expectations.consensus_eps} />
                      <MetricRow label="Consensus Revenue" value={stock.earnings_expectations.consensus_revenue} />
                      <MetricRow label="Beat Streak" value={`${stock.earnings_expectations.beat_streak} quarters`} />
                    </div>
                    {stock.earnings_expectations.earnings_surprise_history.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Earnings Surprise History</p>
                        <div className="bg-muted/30 rounded p-2">
                          <EarningsSurprise stock={stock} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="mt-0">
              <div className="space-y-4">
                {/* Analyst Ratings Donut */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Analyst Ratings</h3>
                  <div className="bg-muted/30 rounded p-2">
                    <AnalystDonut stock={stock} />
                  </div>
                </div>

                {/* Price Target Range */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Price Targets</h3>
                  <div className="bg-muted/30 rounded p-3">
                    <PriceTargetRange stock={stock} />
                  </div>
                </div>

                {/* Insider Activity */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Insider Activity</h3>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <MetricRow label="Recent Buys" value={stock.insider_activity.recent_buys.toString()} />
                    <MetricRow label="Recent Sells" value={stock.insider_activity.recent_sells.toString()} />
                    <MetricRow label="Net Shares Change" value={stock.insider_activity.net_shares_change} className="col-span-2" />
                  </div>
                  {stock.insider_activity.notable_transactions.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Notable Transactions</p>
                      <ul className="space-y-1">
                        {stock.insider_activity.notable_transactions.map((txn, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground">• {txn}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 italic">{stock.insider_activity.insider_sentiment}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="valuation" className="mt-0">
              <div className="space-y-4">
                {/* Valuation Bars Chart */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Valuation vs Benchmarks</h3>
                  <div className="bg-muted/30 rounded p-2">
                    <ValuationBars stock={stock} />
                  </div>
                </div>

                {/* Relative Valuation Assessment */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Assessment</h3>
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-sm font-medium mb-2">{stock.valuation_metrics.valuation_vs_sector}</p>
                    <p className="text-sm">
                      <span className={stock.valuation_metrics.growth_justifies_premium ? "text-emerald-500" : "text-red-500"}>
                        {stock.valuation_metrics.growth_justifies_premium ? "✓ Growth justifies premium" : "⚠ Growth may not justify premium"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Research Sources */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Research Sources</h3>
                  <div className="space-y-1">
                    {stock.research_sources.slice(0, 5).map((source, idx) => (
                      <a
                        key={idx}
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {new URL(source).hostname}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Your Notes</h3>
                <StockNotes ticker={stock.ticker} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </ScrollArea>
    </Card>
  );
}

function MetricRow({ label, value, positive, className }: { label: string; value: string; positive?: boolean; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold font-mono-num ${positive ? "text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
