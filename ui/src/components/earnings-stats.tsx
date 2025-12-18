"use client";

import { motion } from "framer-motion";
import { Stock, calculateStats } from "@/types/stock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Layers, Award, ArrowUp } from "lucide-react";

interface EarningsStatsProps {
  stocks: Stock[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function EarningsStats({ stocks }: EarningsStatsProps) {
  const stats = calculateStats(stocks);
  const avgScore = stocks.length > 0
    ? (stocks.reduce((sum, s) => sum + s.match_score, 0) / stocks.length).toFixed(1)
    : "0";

  const cards = [
    {
      title: "Total Opportunities",
      value: stats.total,
      icon: Layers,
      gradient: "from-slate-500 to-slate-600",
      badge: null,
    },
    {
      title: "Priority Picks",
      value: stats.priority,
      icon: Target,
      gradient: "from-emerald-500 to-teal-600",
      badge: "90+ Score",
    },
    {
      title: "High Quality",
      value: stats.highScore,
      icon: Award,
      gradient: "from-blue-500 to-cyan-600",
      badge: "80-89",
    },
    {
      title: "Average Score",
      value: avgScore,
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-600",
      badge: null,
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={item}>
          <Card className="relative overflow-hidden border bg-card hover:shadow-lg transition-all group">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
            <CardContent className="relative p-5">
              <div className="flex items-start justify-between mb-4">
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
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                  <card.icon className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight">{card.value}</p>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                  <ArrowUp className="h-3 w-3" />
                  <span>Live</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
