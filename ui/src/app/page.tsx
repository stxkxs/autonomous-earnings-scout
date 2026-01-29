"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { EarningsStats } from "@/components/earnings-stats";
import { StockCard } from "@/components/stock-card";
import { StockDetail } from "@/components/stock-detail";
import { StockFilters } from "@/components/stock-filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchStocks, filterByScore, filterBySector, filterByEarningsTimeframe, sortStocks, getUniqueValues } from "@/lib/stocks";
import { useStocks } from "@/hooks/use-stocks";
import { Stock } from "@/types/stock";
import { LayoutGrid, Loader2 } from "lucide-react";

export default function HomePage() {
  const { stocks, loading, error } = useStocks();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minScore, setMinScore] = useState(75);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [timeframeDays, setTimeframeDays] = useState(0);

  // Get available sectors
  const availableSectors = useMemo(() => {
    if (!stocks) return [];
    return getUniqueValues(stocks.map((s) => s.sector)).sort();
  }, [stocks]);

  // Apply filters
  const filteredStocks = useMemo(() => {
    if (!stocks) return [];

    let filtered = stocks;

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

    // Sort by score (highest first)
    return sortStocks(filtered, "score", "desc");
  }, [stocks, searchQuery, minScore, selectedSectors, timeframeDays]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-medium">Error loading stocks: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Title */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <h2 className="text-3xl font-bold tracking-tight">
                Investment Opportunities
              </h2>
              <Badge variant="outline" className="text-xs">
                {loading ? "Loading..." : `${filteredStocks.length} stocks`}
              </Badge>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground"
            >
              High-quality earnings opportunities with strong fundamentals and growth potential
            </motion.p>
          </div>

          {/* Stats Dashboard */}
          <EarningsStats stocks={filteredStocks} onSelectStock={setSelectedStock} />

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StockFilters
              onSearchChange={setSearchQuery}
              onScoreChange={setMinScore}
              onSectorChange={setSelectedSectors}
              onTimeframeChange={setTimeframeDays}
              availableSectors={availableSectors}
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Stock List */}
            <div className="lg:col-span-7">
              <ScrollArea className="h-[calc(100vh-32rem)]">
                <div className="space-y-3 pr-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
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
                      className="text-center py-20"
                    >
                      <div className="p-4 bg-muted rounded-2xl w-fit mx-auto mb-4">
                        <LayoutGrid className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-semibold mb-2">No matches found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filters to see more opportunities
                      </p>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Stock Detail Panel */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="sticky top-28">
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
                    <CardContent className="text-center py-12">
                      <div className="p-6 bg-muted/50 rounded-2xl w-fit mx-auto mb-4">
                        <LayoutGrid className="h-12 w-12 text-muted-foreground/50" />
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
    </div>
  );
}
