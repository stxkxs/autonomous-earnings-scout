"use client";

import { motion } from "framer-motion";
import { Stock, getScoreColor, getScoreBgColor } from "@/types/stock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDaysUntil, getEarningsTimeLabel } from "@/lib/stocks";
import { Calendar, TrendingUp, TrendingDown, Clock, ChevronRight, Sparkles } from "lucide-react";

interface StockCardProps {
  stock: Stock;
  index: number;
  onSelect: (stock: Stock) => void;
  isSelected?: boolean;
}

export function StockCard({ stock, index, onSelect, isSelected }: StockCardProps) {
  const scoreColor = getScoreColor(stock.match_score);
  const scoreBgColor = getScoreBgColor(stock.match_score);
  const daysUntil = stock.days_until_earnings;
  const isUpcoming = daysUntil <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl ${
          isSelected
            ? "ring-2 ring-primary shadow-lg"
            : "hover:border-primary/50"
        }`}
        onClick={() => onSelect(stock)}
      >
        {stock.status === "priority" && (
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-2 right-[-32px] rotate-45 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-bold py-1 w-32 text-center shadow-lg">
              PRIORITY
            </div>
          </div>
        )}

        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`absolute inset-0 ${scoreBgColor} opacity-20 blur-md rounded-2xl`} />
                <div className={`relative flex items-center justify-center w-14 h-14 rounded-2xl ${scoreBgColor} shadow-lg`}>
                  <span className={`text-xl font-bold ${scoreColor}`}>
                    {stock.match_score}
                  </span>
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xl tracking-tight mb-0.5 group-hover:text-primary transition-colors">
                  {stock.ticker}
                </h3>
                <p className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">
                  {stock.company}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Earnings Countdown */}
          <div className={`flex items-center justify-between p-3 rounded-xl mb-3 ${
            isUpcoming
              ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-900"
              : "bg-muted/50"
          }`}>
            <div className="flex items-center gap-2">
              <Calendar className={`h-4 w-4 ${isUpcoming ? "text-amber-600" : "text-muted-foreground"}`} />
              <div>
                <p className="text-xs font-semibold">{formatDate(stock.earnings_date)}</p>
                <p className="text-[10px] text-muted-foreground">{getEarningsTimeLabel(stock.earnings_time)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className={`h-3.5 w-3.5 ${isUpcoming ? "text-amber-600" : "text-muted-foreground"}`} />
              <span className={`text-xs font-bold ${isUpcoming ? "text-amber-600" : "text-muted-foreground"}`}>
                {formatDaysUntil(daysUntil)} days
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground font-medium">REV GROWTH</p>
              <p className="text-sm font-bold text-emerald-600">{stock.fundamentals.revenue_growth_yoy}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground font-medium">MARGIN</p>
              <p className="text-sm font-bold">{stock.fundamentals.gross_margin}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground font-medium">ROIC</p>
              <p className="text-sm font-bold text-blue-600">{stock.fundamentals.roic}</p>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-[10px] px-2 py-0 font-medium">
              {stock.sector}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0 capitalize">
              {stock.market_cap_category}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0">
              {stock.price_current}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
