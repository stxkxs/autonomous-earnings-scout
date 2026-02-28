"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { EarningsStats } from "@/components/earnings-stats";
import { StockCard } from "@/components/stock-card";
import { StockDetail } from "@/components/stock-detail";
import { StockFilters } from "@/components/stock-filters";
import { StockComparison } from "@/components/stock-comparison";
import { EarningsCalendar } from "@/components/earnings-calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { searchStocks, filterByScore, filterBySector, filterByEarningsTimeframe, sortStocks, getUniqueValues } from "@/lib/stocks";
import { exportStocksCsv } from "@/lib/csv-export";
import { useStocks } from "@/hooks/use-stocks";
import { useUserData } from "@/contexts/user-data-context";
import { Stock, ChartFilter, emptyChartFilter } from "@/types/stock";
import { LayoutGrid, Loader2, CalendarDays } from "lucide-react";

export default function HomePage() {
  const { stocks, loading, error, isRefreshing, lastUpdated, refresh } = useStocks();
  const { watchlist, comparison } = useUserData();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minScore, setMinScore] = useState(75);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [timeframeDays, setTimeframeDays] = useState(0);
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [chartFilter, setChartFilter] = useState<ChartFilter>(emptyChartFilter);
  const [viewMode, setViewMode] = useState<"cards" | "calendar">("cards");

  // Get available sectors
  const availableSectors = useMemo(() => {
    if (!stocks) return [];
    return getUniqueValues(stocks.map((s) => s.sector)).sort();
  }, [stocks]);

  // Stage 1: widget-only filters (used for chart rendering)
  const regularFilteredStocks = useMemo(() => {
    if (!stocks) return [];

    let filtered = stocks;

    // Watchlist filter
    if (showWatchlistOnly) {
      filtered = filtered.filter((s) => watchlist.has(s.ticker));
    }

    // Search
    if (searchQuery) {
      filtered = searchStocks(filtered, searchQuery);
    }

    // Score filter
    filtered = filterByScore(filtered, minScore);

    // Sector filter
    if (selectedSectors.length > 0) {
      filtered = filterBySector(filtered, selectedSectors);
    }

    // Timeframe filter
    if (timeframeDays > 0) {
      filtered = filterByEarningsTimeframe(filtered, timeframeDays);
    }

    return sortStocks(filtered, "score", "desc");
  }, [stocks, searchQuery, minScore, selectedSectors, timeframeDays, showWatchlistOnly, watchlist]);

  // Stage 2: widget + chart filters (used for stock list)
  const filteredStocks = useMemo(() => {
    let filtered = regularFilteredStocks;

    if (chartFilter.sectorFromChart) {
      filtered = filtered.filter((s) => s.sector === chartFilter.sectorFromChart);
    }

    if (chartFilter.scoreRangeFromChart) {
      const { min, max } = chartFilter.scoreRangeFromChart;
      filtered = filtered.filter((s) => s.match_score >= min && s.match_score <= max);
    }

    return filtered;
  }, [regularFilteredStocks, chartFilter]);

  // Chart click handlers (toggle on re-click)
  const handleChartSectorClick = useCallback((sector: string) => {
    setChartFilter((prev) => ({
      ...prev,
      sectorFromChart: prev.sectorFromChart === sector ? null : sector,
    }));
  }, []);

  const handleChartScoreClick = useCallback((range: { min: number; max: number; label: string }) => {
    setChartFilter((prev) => ({
      ...prev,
      scoreRangeFromChart:
        prev.scoreRangeFromChart?.min === range.min && prev.scoreRangeFromChart?.max === range.max
          ? null
          : range,
    }));
  }, []);

  const handleClearChartFilter = useCallback((key: "sectorFromChart" | "scoreRangeFromChart") => {
    setChartFilter((prev) => ({ ...prev, [key]: null }));
  }, []);

  // Get comparison stocks
  const comparisonStocks = useMemo(() => {
    if (!stocks) return [];
    return comparison
      .map((ticker) => stocks.find((s) => s.ticker === ticker))
      .filter((s): s is Stock => s != null);
  }, [stocks, comparison]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border">
          <CardContent className="p-6 text-center">
            <p className="text-destructive font-medium">Error loading stocks: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header lastUpdated={lastUpdated} isRefreshing={isRefreshing} onRefresh={refresh} />

      <main className="container mx-auto px-3 py-5">
        <div className="space-y-4">
          {/* Page Title */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <h2 className="text-2xl font-bold tracking-tight font-display">
                Investment Opportunities
              </h2>
              <Badge variant="outline" className="text-xs">
                {loading ? "Loading..." : `${filteredStocks.length} stocks`}
              </Badge>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground"
            >
              High-quality earnings opportunities with strong fundamentals and growth potential
            </motion.p>
          </div>

          {/* Stats Dashboard — uses regularFilteredStocks so charts show full widget-filtered data */}
          <EarningsStats
            stocks={regularFilteredStocks}
            onSelectStock={setSelectedStock}
            onSectorClick={handleChartSectorClick}
            onScoreRangeClick={handleChartScoreClick}
            chartFilter={chartFilter}
            onClearChartFilter={handleClearChartFilter}
          />

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StockFilters
              onSearchChange={setSearchQuery}
              onScoreChange={setMinScore}
              onSectorChange={setSelectedSectors}
              onTimeframeChange={setTimeframeDays}
              availableSectors={availableSectors}
              showWatchlistOnly={showWatchlistOnly}
              onWatchlistToggle={() => setShowWatchlistOnly((v) => !v)}
              watchlistCount={watchlist.size}
              comparisonCount={comparison.length}
              onOpenComparison={() => setComparisonOpen(true)}
              onExportCsv={() => exportStocksCsv(filteredStocks)}
            />
          </motion.div>

          {/* View Toggle */}
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="gap-1.5"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Cards
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="gap-1.5"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Calendar
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Stock List or Calendar */}
            <div className="lg:col-span-7">
              {viewMode === "calendar" ? (
                <EarningsCalendar
                  stocks={filteredStocks}
                  selectedStock={selectedStock}
                  onSelectStock={setSelectedStock}
                />
              ) : (
                <ScrollArea className="h-[calc(100vh-32rem)]">
                  <div className="space-y-3 pr-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">Analyzing opportunities...</p>
                        </div>
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {filteredStocks.map((stock, index) => (
                          <StockCard
                            key={stock.id}
                            stock={stock}
                            index={index}
                            onSelect={setSelectedStock}
                            isSelected={selectedStock?.id === stock.id}
                          />
                        ))}
                      </AnimatePresence>
                    )}
                    {!loading && filteredStocks.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                      >
                        <div className="p-3 bg-muted rounded-md w-fit mx-auto mb-4">
                          <LayoutGrid className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <p className="text-base font-semibold mb-2">No matches found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your filters to see more opportunities
                        </p>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Stock Detail Panel */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="sticky top-20">
                {selectedStock ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StockDetail stock={selectedStock} onClose={() => setSelectedStock(null)} />
                  </motion.div>
                ) : (
                  <Card className="h-[calc(100vh-32rem)] border-2 border-dashed flex items-center justify-center bg-muted/20">
                    <CardContent className="text-center py-10">
                      <div className="p-4 bg-muted/50 rounded-md w-fit mx-auto mb-4">
                        <LayoutGrid className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <p className="text-base font-semibold mb-2">No stock selected</p>
                      <p className="text-sm text-muted-foreground max-w-[200px]">
                        Click on any stock card to view detailed analysis
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Detail Sheet */}
          {selectedStock && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <StockDetail stock={selectedStock} onClose={() => setSelectedStock(null)} />
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </main>

      {/* Comparison Dialog */}
      <Dialog open={comparisonOpen} onOpenChange={setComparisonOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Stock Comparison</DialogTitle>
            <DialogDescription>
              Side-by-side comparison of {comparisonStocks.map((s) => s.ticker).join(", ")}
            </DialogDescription>
          </DialogHeader>
          <StockComparison stocks={comparisonStocks} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
