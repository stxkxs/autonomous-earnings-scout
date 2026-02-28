"use client";

import { useState, useMemo } from "react";
import { Stock, getScoreBgColor } from "@/types/stock";
import { formatDateKey } from "@/lib/stocks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EarningsCalendarProps {
  stocks: Stock[];
  selectedStock: Stock | null;
  onSelectStock: (stock: Stock) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getHeatColor(avgScore: number): string {
  if (avgScore >= 90) return "bg-emerald-500/20 border-emerald-500/30";
  if (avgScore >= 80) return "bg-blue-500/20 border-blue-500/30";
  if (avgScore >= 75) return "bg-amber-500/20 border-amber-500/30";
  return "bg-muted/30";
}

function getTickerBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-500 text-white";
  if (score >= 80) return "bg-blue-500 text-white";
  if (score >= 75) return "bg-amber-500 text-white";
  return "bg-gray-500 text-white";
}

export function EarningsCalendar({ stocks, selectedStock, onSelectStock }: EarningsCalendarProps) {
  // Group stocks by date
  const stocksByDate = useMemo(() => {
    const map: Record<string, Stock[]> = {};
    stocks.forEach((stock) => {
      const key = stock.earnings_date;
      if (!map[key]) map[key] = [];
      map[key].push(stock);
    });
    return map;
  }, [stocks]);

  // Find month with most earnings for auto-nav
  const bestMonth = useMemo(() => {
    const monthCounts: Record<string, number> = {};
    stocks.forEach((stock) => {
      const d = new Date(stock.earnings_date + "T00:00:00");
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    });
    const best = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0];
    if (best) {
      const [y, m] = best[0].split("-").map(Number);
      return new Date(y, m, 1);
    }
    return new Date();
  }, [stocks]);

  const [currentMonth, setCurrentMonth] = useState(bestMonth);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay(); // 0=Sun
    const totalDays = lastDay.getDate();

    const days: Array<{
      date: Date;
      dateKey: string;
      isCurrentMonth: boolean;
      stocks: Stock[];
    }> = [];

    // Previous month padding
    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({
        date: d,
        dateKey: formatDateKey(d),
        isCurrentMonth: false,
        stocks: [],
      });
    }

    // Current month
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const key = formatDateKey(d);
      days.push({
        date: d,
        dateKey: key,
        isCurrentMonth: true,
        stocks: stocksByDate[key] || [],
      });
    }

    // Next month padding to fill last row
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({
          date: d,
          dateKey: formatDateKey(d),
          isCurrentMonth: false,
          stocks: [],
        });
      }
    }

    return days;
  }, [year, month, stocksByDate]);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthLabel = currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <Card className="p-4">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">{monthLabel}</h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px">
        {calendarDays.map((day, idx) => {
          const avgScore =
            day.stocks.length > 0
              ? day.stocks.reduce((s, st) => s + st.match_score, 0) / day.stocks.length
              : 0;
          const heat = day.stocks.length > 0 ? getHeatColor(avgScore) : "";
          const maxShow = 4;
          const overflow = day.stocks.length - maxShow;

          return (
            <div
              key={idx}
              className={`min-h-[64px] rounded border p-0.5 text-xs transition-colors ${
                day.isCurrentMonth ? heat || "border-border" : "opacity-30 border-transparent"
              }`}
            >
              <div className="text-right text-[10px] text-muted-foreground font-medium mb-0.5">
                {day.date.getDate()}
              </div>
              <div className="flex flex-wrap gap-0.5">
                {day.stocks.slice(0, maxShow).map((stock) => (
                  <button
                    key={stock.ticker}
                    onClick={() => onSelectStock(stock)}
                    className={`px-1 py-0.5 rounded text-[9px] font-bold leading-none transition-all hover:scale-105 ${getTickerBgColor(
                      stock.match_score
                    )} ${selectedStock?.ticker === stock.ticker ? "ring-2 ring-white ring-offset-1 ring-offset-background" : ""}`}
                  >
                    {stock.ticker}
                  </button>
                ))}
                {overflow > 0 && (
                  <span className="px-1 py-0.5 text-[9px] text-muted-foreground font-medium">
                    +{overflow}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500/40" />
          <span>90+ Priority</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500/40" />
          <span>80-89 High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-500/40" />
          <span>75-79 Medium</span>
        </div>
      </div>
    </Card>
  );
}
