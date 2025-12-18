export interface Stock {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  market_cap: string;
  market_cap_category: "small" | "mid" | "large" | "mega";

  earnings_date: string;
  earnings_time: "before_market_open" | "after_market_close" | "during_trading" | "unknown";
  days_until_earnings: number;
  found_date: string;

  match_score: number;
  price_current: string;
  price_52w_high: string;
  price_52w_low: string;

  investment_thesis: string;
  catalysts: string[];
  risks: string[];

  fundamentals: {
    revenue_growth_yoy: string;
    gross_margin: string;
    fcf_margin: string;
    roic: string;
    debt_to_equity: string;
    moat_strength: "wide" | "moderate" | "narrow" | "none";
  };

  growth_signals: {
    ai_mentions_trend?: string;
    cloud_revenue_growth?: string;
    margin_expansion: string;
    tam_expansion: string;
  };

  analyst_sentiment: {
    consensus: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
    buy_ratings: number;
    hold_ratings: number;
    sell_ratings: number;
    average_price_target: string;
    high_target: string;
    low_target: string;
  };

  insider_activity: {
    recent_buys: number;
    recent_sells: number;
    net_shares_change: string;
    notable_transactions: string[];
    insider_sentiment: string;
  };

  valuation_metrics: {
    pe_ratio: number;
    forward_pe: number;
    peg_ratio: number;
    price_to_sales: number;
    ev_to_ebitda: number;
    valuation_vs_sector: string;
    growth_justifies_premium: boolean;
  };

  technical_indicators?: {
    rsi: number;
    macd: string;
    moving_avg_50d: string;
    moving_avg_200d: string;
    trend: "uptrend" | "downtrend" | "sideways";
    support_level: string;
    resistance_level: string;
  };

  earnings_expectations?: {
    consensus_eps: string;
    consensus_revenue: string;
    earnings_surprise_history: string[];
    beat_streak: number;
    whisper_number?: string;
  };

  recent_news: Array<{
    date: string;
    headline: string;
    source: string;
    sentiment: "positive" | "negative" | "neutral";
    summary: string;
  }>;

  research_sources: string[];
  status: "priority" | "watchlist" | "researching" | "passed";
  tags: string[];
}

export interface StockStats {
  total: number;
  priority: number;
  highScore: number;
  mediumScore: number;
  sectorCounts: Record<string, number>;
  marketCapCounts: Record<string, number>;
  earningsByWeek: Record<string, number>;
}

export type ScoreCategory = "priority" | "high" | "medium" | "low";

export function getScoreCategory(score: number): ScoreCategory {
  if (score >= 90) return "priority";
  if (score >= 80) return "high";
  if (score >= 75) return "medium";
  return "low";
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-500";
  if (score >= 80) return "text-blue-500";
  if (score >= 75) return "text-amber-500";
  return "text-gray-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 80) return "bg-blue-500";
  if (score >= 75) return "bg-amber-500";
  return "bg-gray-500";
}

export function calculateStats(stocks: Stock[]): StockStats {
  const stats: StockStats = {
    total: stocks.length,
    priority: 0,
    highScore: 0,
    mediumScore: 0,
    sectorCounts: {},
    marketCapCounts: {},
    earningsByWeek: {},
  };

  stocks.forEach((stock) => {
    // Score categories
    if (stock.match_score >= 90) stats.priority++;
    else if (stock.match_score >= 80) stats.highScore++;
    else if (stock.match_score >= 75) stats.mediumScore++;

    // Sector distribution
    stats.sectorCounts[stock.sector] = (stats.sectorCounts[stock.sector] || 0) + 1;

    // Market cap distribution
    stats.marketCapCounts[stock.market_cap_category] =
      (stats.marketCapCounts[stock.market_cap_category] || 0) + 1;

    // Earnings by week
    const weekKey = getWeekKey(stock.earnings_date);
    stats.earningsByWeek[weekKey] = (stats.earningsByWeek[weekKey] || 0) + 1;
  });

  return stats;
}

function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr);
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay()); // Sunday
  return weekStart.toISOString().split("T")[0];
}
