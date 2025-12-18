"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StockFiltersProps {
  onSearchChange: (query: string) => void;
  onScoreChange: (minScore: number) => void;
  onSectorChange: (sectors: string[]) => void;
  onTimeframeChange: (days: number) => void;
  availableSectors: string[];
}

export function StockFilters({
  onSearchChange,
  onScoreChange,
  onSectorChange,
  onTimeframeChange,
  availableSectors,
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
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search ticker, company, sector..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Score Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center justify-between">
            <span>Min Score</span>
            <span className="text-violet-600 font-bold">{minScore}</span>
          </label>
          <input
            type="range"
            min="70"
            max="100"
            value={minScore}
            onChange={(e) => handleScoreChange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-600"
          />
        </div>

        {/* Timeframe Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Earnings Timeframe</label>
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
            <label className="text-sm font-medium mb-2 block">Sectors</label>
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
