"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Stock } from "@/types/stock";

const POLL_INTERVAL = 15_000;

export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchStocks = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      else setIsRefreshing(true);

      const response = await fetch("/api/earnings");

      if (!response.ok) {
        throw new Error("Failed to fetch earnings data");
      }

      const data = await response.json();

      if (mountedRef.current) {
        setStocks(data.stocks ?? []);
        setLastUpdated(data.lastUpdated ?? null);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        // On background poll failure, silently keep stale data
        if (!isBackground) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setStocks([]);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  const refresh = useCallback(() => {
    fetchStocks(true);
  }, [fetchStocks]);

  useEffect(() => {
    mountedRef.current = true;
    fetchStocks(false);

    const interval = setInterval(() => {
      fetchStocks(true);
    }, POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchStocks]);

  return { stocks, loading, error, isRefreshing, lastUpdated, refresh };
}
