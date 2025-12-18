"use client";

import { Stock, getScoreColor, getScoreBgColor } from "@/types/stock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, getEarningsTimeLabel } from "@/lib/stocks";
import { ExternalLink, TrendingUp, AlertCircle, X } from "lucide-react";

interface StockDetailProps {
  stock: Stock | null;
  onClose?: () => void;
}

export function StockDetail({ stock, onClose }: StockDetailProps) {
  if (!stock) {
    return null;
  }

  const scoreBg = getScoreBgColor(stock.match_score);

  return (
    <Card className="h-full overflow-hidden flex flex-col border-0 shadow-sm">
      <CardHeader className="border-b p-6 relative">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-2xl font-bold">{stock.ticker}</CardTitle>
              <Badge className={scoreBg + " text-white font-bold px-2 py-1"}>{stock.match_score}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{stock.company}</p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">{stock.sector}</Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {stock.market_cap_category} cap
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{stock.price_current}</p>
            <p className="text-sm text-muted-foreground mt-1">{stock.market_cap}</p>
          </div>
        </div>

        {/* Earnings Info */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Earnings Date</p>
            <p className="font-semibold text-sm">{formatDate(stock.earnings_date)}</p>
            <p className="text-xs text-muted-foreground mt-1">{getEarningsTimeLabel(stock.earnings_time)}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">52-Week Range</p>
            <p className="text-xs font-semibold">
              {stock.price_52w_low} - {stock.price_52w_high}
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Analyst Consensus</p>
            <p className="text-xs font-semibold capitalize">
              {stock.analyst_sentiment.consensus.replace("_", " ")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Target: {stock.analyst_sentiment.average_price_target}</p>
          </div>
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
          </TabsList>

          <div className="p-6">
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-8">
                {/* Investment Thesis */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Investment Thesis
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{stock.investment_thesis}</p>
                </div>

                {/* Catalysts */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-emerald-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Catalysts
                  </h3>
                  <ul className="space-y-2">
                    {stock.catalysts.map((catalyst, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-emerald-500 font-bold">+</span>
                        <span>{catalyst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Risks
                  </h3>
                  <ul className="space-y-2">
                    {stock.risks.map((risk, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex gap-2">
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
                        <div key={idx} className="border-l-2 border-gray-200 pl-3">
                          <p className="text-xs text-gray-500">{formatDate(news.date)} • {news.source}</p>
                          <p className="text-sm font-medium mt-1">{news.headline}</p>
                          <p className="text-xs text-gray-600 mt-1">{news.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="fundamentals" className="mt-0">
              <div className="space-y-6">
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
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Surprise History</p>
                        <div className="flex gap-2">
                          {stock.earnings_expectations.earnings_surprise_history.map((surprise, idx) => (
                            <Badge key={idx} variant={surprise.startsWith('+') ? 'emerald' : 'gray'}>
                              {surprise}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="mt-0">
              <div className="space-y-6">
                {/* Analyst Ratings */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Analyst Ratings</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-emerald-50 rounded">
                      <p className="text-2xl font-bold text-emerald-700">{stock.analyst_sentiment.buy_ratings}</p>
                      <p className="text-xs text-gray-600">Buy</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-2xl font-bold text-gray-700">{stock.analyst_sentiment.hold_ratings}</p>
                      <p className="text-xs text-gray-600">Hold</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <p className="text-2xl font-bold text-red-700">{stock.analyst_sentiment.sell_ratings}</p>
                      <p className="text-xs text-gray-600">Sell</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <MetricRow label="Avg Target" value={stock.analyst_sentiment.average_price_target} />
                    <MetricRow label="High Target" value={stock.analyst_sentiment.high_target} />
                    <MetricRow label="Low Target" value={stock.analyst_sentiment.low_target} />
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
                      <p className="text-xs text-gray-500 mb-2">Notable Transactions</p>
                      <ul className="space-y-1">
                        {stock.insider_activity.notable_transactions.map((txn, idx) => (
                          <li key={idx} className="text-xs text-gray-700">• {txn}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mt-2 italic">{stock.insider_activity.insider_sentiment}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="valuation" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Valuation Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricRow label="P/E Ratio" value={stock.valuation_metrics.pe_ratio.toString()} />
                    <MetricRow label="Forward P/E" value={stock.valuation_metrics.forward_pe.toString()} />
                    <MetricRow label="PEG Ratio" value={stock.valuation_metrics.peg_ratio.toString()} />
                    <MetricRow label="Price-to-Sales" value={stock.valuation_metrics.price_to_sales.toString()} />
                    <MetricRow label="EV/EBITDA" value={stock.valuation_metrics.ev_to_ebitda.toString()} />
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600 mb-1">Relative Valuation</p>
                    <p className="text-sm font-medium">{stock.valuation_metrics.valuation_vs_sector}</p>
                    <p className="text-xs mt-2">
                      <span className={stock.valuation_metrics.growth_justifies_premium ? "text-emerald-600" : "text-red-600"}>
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
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {new URL(source).hostname}
                      </a>
                    ))}
                  </div>
                </div>
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
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-semibold ${positive ? "text-emerald-600" : ""}`}>{value}</p>
    </div>
  );
}
