"use client";

import { useState, useEffect } from "react";
import { Stock } from "@/types/stock";

export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStocks() {
      try {
        setLoading(true);
        const response = await fetch("/data/earnings.json");

        if (!response.ok) {
          throw new Error("Failed to fetch earnings data");
        }

        const data = await response.json();
        setStocks(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setStocks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, []);

  return { stocks, loading, error };
}
