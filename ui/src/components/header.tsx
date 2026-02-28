"use client";

import { motion } from "framer-motion";
import { Moon, Sun, LineChart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeaderProps {
  lastUpdated?: string | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

function formatTimeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function Header({ lastUpdated, isRefreshing, onRefresh }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  // Re-compute "Updated Xs ago" every 10s
  useEffect(() => {
    if (!lastUpdated) return;
    setTimeAgo(formatTimeAgo(lastUpdated));
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(lastUpdated));
    }, 10_000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl"
    >
      <div className="container mx-auto px-3 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-muted/50">
            <LineChart className="h-4 w-4 text-foreground" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-semibold tracking-tight">Earnings Scout</h1>
              <span className="text-[10px] px-1.5 py-px rounded border border-border text-muted-foreground font-medium">
                AI
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Autonomous research
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono-num">
              {lastUpdated && timeAgo ? `Updated ${timeAgo}` : "Live"}
            </span>
          </div>
          {onRefresh && (
            <Button variant="ghost" size="icon" onClick={onRefresh} className="rounded-md h-8 w-8" disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-md h-8 w-8">
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
