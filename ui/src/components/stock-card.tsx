"use client";

import { motion } from "framer-motion";
import { Stock, getScoreColor } from "@/types/stock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDaysUntil, getEarningsTimeLabel } from "@/lib/stocks";
import { Calendar, Clock, ChevronRight, Heart, Scale } from "lucide-react";
import { useUserData } from "@/contexts/user-data-context";

interface StockCardProps {
  stock: Stock;
  index: number;
  onSelect: (stock: Stock) => void;
  isSelected?: boolean;
}

function getScoreBadgeBg(score: number): string {
  if (score >= 90) return "bg-emerald-500/15 text-emerald-400";
  if (score >= 80) return "bg-sky-500/15 text-sky-400";
  if (score >= 75) return "bg-amber-500/15 text-amber-400";
  return "bg-zinc-500/15 text-zinc-400";
}

export function StockCard({ stock, index, onSelect, isSelected }: StockCardProps) {
  const scoreColor = getScoreColor(stock.match_score);
  const daysUntil = stock.days_until_earnings;
  const isUpcoming = daysUntil <= 7;

  const { isWatchlisted, toggleWatchlist, isInComparison, toggleComparison, canAddToComparison } = useUserData();
  const watchlisted = isWatchlisted(stock.ticker);
  const inComparison = isInComparison(stock.ticker);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileHover={{ scale: 1.005 }}
      className="group"
    >
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-sm ${
          isSelected
            ? "border-l-2 border-l-primary bg-primary/[0.04]"
            : "hover:border-primary/50"
        } ${!isSelected && stock.status === "priority" ? "border-l-2 border-l-emerald-500/50" : ""}`}
        onClick={() => onSelect(stock)}
      >
        {/* Action icons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(stock.ticker);
            }}
            className="p-1.5 rounded-lg hover:bg-muted/80 transition-colors"
            title={watchlisted ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                watchlisted ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400"
              }`}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!inComparison && !canAddToComparison()) return;
              toggleComparison(stock.ticker);
            }}
            className={`p-1.5 rounded-lg hover:bg-muted/80 transition-colors ${
              !inComparison && !canAddToComparison() ? "opacity-30 cursor-not-allowed" : ""
            }`}
            title={inComparison ? "Remove from comparison" : "Add to comparison"}
          >
            <Scale
              className={`h-4 w-4 transition-colors ${
                inComparison ? "text-blue-500" : "text-muted-foreground hover:text-blue-400"
              }`}
            />
          </button>
        </div>

        <CardContent className="p-3.5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-md ${getScoreBadgeBg(stock.match_score)}`}>
                <span className={`text-base font-bold font-mono-num ${scoreColor}`}>
                  {stock.match_score}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base tracking-tight mb-0.5 group-hover:text-primary transition-colors flex items-center gap-2">
                  {stock.ticker}
                  {stock.status === "priority" && (
                    <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 leading-none">
                      PRI
                    </span>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">
                  {stock.company}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-3" />
          </div>

          {/* Earnings Countdown */}
          <div className={`flex items-center justify-between px-2.5 py-1.5 rounded mb-2.5 ${
            isUpcoming
              ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-900"
              : "bg-muted/50"
          }`}>
            <div className="flex items-center gap-2">
              <Calendar className={`h-3.5 w-3.5 ${isUpcoming ? "text-amber-600" : "text-muted-foreground"}`} />
              <div>
                <p className="text-xs font-semibold font-mono-num">{formatDate(stock.earnings_date)}</p>
                <p className="text-[10px] text-muted-foreground">{getEarningsTimeLabel(stock.earnings_time)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className={`h-3.5 w-3.5 ${isUpcoming ? "text-amber-600" : "text-muted-foreground"}`} />
              <span className={`text-xs font-bold font-mono-num ${isUpcoming ? "text-amber-600" : "text-muted-foreground"}`}>
                {formatDaysUntil(daysUntil)} days
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-2.5">
            <div className="text-center py-1.5 px-1 rounded bg-muted/30">
              <p className="text-[10px] text-muted-foreground font-medium">REV GROWTH</p>
              <p className="text-xs font-bold font-mono-num text-emerald-500">{stock.fundamentals.revenue_growth_yoy}</p>
            </div>
            <div className="text-center py-1.5 px-1 rounded bg-muted/30">
              <p className="text-[10px] text-muted-foreground font-medium">MARGIN</p>
              <p className="text-xs font-bold font-mono-num">{stock.fundamentals.gross_margin}</p>
            </div>
            <div className="text-center py-1.5 px-1 rounded bg-muted/30">
              <p className="text-[10px] text-muted-foreground font-medium">ROIC</p>
              <p className="text-xs font-bold font-mono-num text-sky-500">{stock.fundamentals.roic}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            <Badge variant="secondary" className="text-[10px] px-2 py-0 font-medium">
              {stock.sector}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0 capitalize">
              {stock.market_cap_category}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0 font-mono-num">
              {stock.price_current}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
