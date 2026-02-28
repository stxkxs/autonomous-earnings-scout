"use client";

import { motion } from "framer-motion";
import { Stock, calculateStats, ChartFilter } from "@/types/stock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Layers, Award, BarChart3, PieChart, Calendar, Crosshair, X } from "lucide-react";
import {
  ScoreDistribution,
  SectorPie,
  EarningsTimeline,
  UrgencyScatter,
} from "@/components/charts";

interface EarningsStatsProps {
  stocks: Stock[];
  onSelectStock?: (stock: Stock) => void;
  onSectorClick?: (sector: string) => void;
  onScoreRangeClick?: (range: { min: number; max: number; label: string }) => void;
  chartFilter?: ChartFilter;
  onClearChartFilter?: (key: "sectorFromChart" | "scoreRangeFromChart") => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export function EarningsStats({
  stocks,
  onSelectStock,
  onSectorClick,
  onScoreRangeClick,
  chartFilter,
  onClearChartFilter,
}: EarningsStatsProps) {
  const stats = calculateStats(stocks);
  const avgScore = stocks.length > 0
    ? (stocks.reduce((sum, s) => sum + s.match_score, 0) / stocks.length).toFixed(1)
    : "0";

  const cards = [
    {
      title: "Total Opportunities",
      value: stats.total,
      icon: Layers,
      badge: null,
    },
    {
      title: "Priority Picks",
      value: stats.priority,
      icon: Target,
      badge: "90+ Score",
    },
    {
      title: "High Quality",
      value: stats.highScore,
      icon: Award,
      badge: "80-89",
    },
    {
      title: "Average Score",
      value: avgScore,
      icon: TrendingUp,
      badge: null,
    },
  ];

  const chartCards = [
    {
      title: "Score Distribution",
      icon: BarChart3,
      chart: (
        <ScoreDistribution
          stocks={stocks}
          onRangeClick={onScoreRangeClick}
          activeRange={chartFilter?.scoreRangeFromChart}
        />
      ),
    },
    {
      title: "Sector Breakdown",
      icon: PieChart,
      chart: (
        <SectorPie
          stocks={stocks}
          onSectorClick={onSectorClick}
          activeSector={chartFilter?.sectorFromChart}
        />
      ),
    },
    {
      title: "Earnings Timeline",
      icon: Calendar,
      chart: <EarningsTimeline stocks={stocks} />,
    },
    {
      title: "Urgency Matrix",
      icon: Crosshair,
      chart: <UrgencyScatter stocks={stocks} onSelectStock={onSelectStock} />,
    },
  ];

  const hasActiveChartFilter =
    chartFilter?.sectorFromChart || chartFilter?.scoreRangeFromChart;

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {cards.map((card) => (
          <motion.div key={card.title} variants={item}>
            <Card className="relative overflow-hidden border bg-card transition-all">
              <CardContent className="relative p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {card.title}
                    </p>
                    {card.badge && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                        {card.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="p-1.5 rounded bg-muted/50">
                    <card.icon className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                  </div>
                </div>
                <p className="text-2xl font-bold tracking-tight font-mono-num">{card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {chartCards.map((chart, index) => (
          <motion.div key={chart.title} variants={item} custom={index}>
            <Card className="border bg-card transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-muted">
                    <chart.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold">{chart.title}</h3>
                </div>
                {chart.chart}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Chart Filter Badges */}
      {hasActiveChartFilter && (
        <div className="flex flex-wrap gap-2">
          {chartFilter?.sectorFromChart && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Sector: {chartFilter.sectorFromChart}
              <button
                onClick={() => onClearChartFilter?.("sectorFromChart")}
                className="ml-1 p-0.5 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {chartFilter?.scoreRangeFromChart && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Score: {chartFilter.scoreRangeFromChart.label}
              <button
                onClick={() => onClearChartFilter?.("scoreRangeFromChart")}
                className="ml-1 p-0.5 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
