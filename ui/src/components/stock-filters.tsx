"use client";

import { useState } from "react";
import { Search, Heart, Scale, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StockFiltersProps {
  onSearchChange: (query: string) => void;
  onScoreChange: (minScore: number) => void;
  onSectorChange: (sectors: string[]) => void;
  onTimeframeChange: (days: number) => void;
  availableSectors: string[];
  showWatchlistOnly?: boolean;
  onWatchlistToggle?: () => void;
  watchlistCount?: number;
  comparisonCount?: number;
  onOpenComparison?: () => void;
  onExportCsv?: () => void;
}

export function StockFilters({
  onSearchChange,
  onScoreChange,
  onSectorChange,
  onTimeframeChange,
  availableSectors,
  showWatchlistOnly,
  onWatchlistToggle,
  watchlistCount = 0,
  comparisonCount = 0,
  onOpenComparison,
  onExportCsv,
}: StockFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [minScore, setMinScore] = useState(75);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState(0); // 0 = all

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleScoreChange = (value: number) => {
    setMinScore(value);
    onScoreChange(value);
  };

  const handleSectorToggle = (sector: string) => {
    const newSectors = selectedSectors.includes(sector)
      ? selectedSectors.filter((s) => s !== sector)
      : [...selectedSectors, sector];
    setSelectedSectors(newSectors);
    onSectorChange(newSectors);
  };

  const handleTimeframeChange = (days: number) => {
    setTimeframe(days);
    onTimeframeChange(days);
  };

  return (
    <Card className="border shadow-none">
      <CardContent className="p-4 space-y-3">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {onWatchlistToggle && (
            <Button
              variant={showWatchlistOnly ? "default" : "outline"}
              size="sm"
              onClick={onWatchlistToggle}
              className="gap-1.5"
            >
              <Heart className={`h-3.5 w-3.5 ${showWatchlistOnly ? "fill-current" : ""}`} />
              Watchlist
              {watchlistCount > 0 && (
                <Badge variant={showWatchlistOnly ? "secondary" : "outline"} className="text-[10px] px-1.5 py-0 ml-0.5">
                  {watchlistCount}
                </Badge>
              )}
            </Button>
          )}
          {onOpenComparison && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenComparison}
              disabled={comparisonCount < 2}
              className="gap-1.5"
            >
              <Scale className="h-3.5 w-3.5" />
              Compare
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-0.5">
                {comparisonCount}/3
              </Badge>
            </Button>
          )}
          {onExportCsv && (
            <Button variant="outline" size="sm" onClick={onExportCsv} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search ticker, company, sector..."
            className="w-full pl-9 pr-4 py-1.5 border border-input bg-background text-foreground rounded text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Score Filter */}
        <div>
          <label className="text-xs font-medium mb-1.5 block flex items-center justify-between text-foreground">
            <span>Min Score</span>
            <span className="text-primary font-bold font-mono-num">{minScore}</span>
          </label>
          <input
            type="range"
            min="70"
            max="100"
            value={minScore}
            onChange={(e) => handleScoreChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Timeframe Filter */}
        <div>
          <label className="text-xs font-medium mb-1.5 block text-foreground">Earnings Timeframe</label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 7, 30, 60].map((days) => (
              <Button
                key={days}
                variant={timeframe === days ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeframeChange(days)}
              >
                {days === 0 ? "All" : `${days}d`}
              </Button>
            ))}
          </div>
        </div>

        {/* Sector Filter */}
        {availableSectors.length > 0 && (
          <div>
            <label className="text-xs font-medium mb-1.5 block text-foreground">Sectors</label>
            <div className="flex flex-wrap gap-2">
              {availableSectors.map((sector) => (
                <Button
                  key={sector}
                  variant={selectedSectors.includes(sector) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSectorToggle(sector)}
                  className="text-xs"
                >
                  {sector}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {(searchQuery || minScore > 75 || selectedSectors.length > 0 || timeframe > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setMinScore(75);
              setSelectedSectors([]);
              setTimeframe(0);
              onSearchChange("");
              onScoreChange(75);
              onSectorChange([]);
              onTimeframeChange(0);
            }}
            className="w-full text-destructive hover:text-destructive"
          >
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
