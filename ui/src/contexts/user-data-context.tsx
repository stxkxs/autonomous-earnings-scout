"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const STORAGE_KEY = "earnings-scout-user-data";
const MAX_COMPARISON = 3;

interface UserData {
  version: number;
  watchlist: string[];
  notes: Record<string, string>;
  comparison: string[];
}

const defaultData: UserData = {
  version: 1,
  watchlist: [],
  notes: {},
  comparison: [],
};

interface UserDataContextValue {
  watchlist: Set<string>;
  notes: Record<string, string>;
  comparison: string[];
  toggleWatchlist: (ticker: string) => void;
  isWatchlisted: (ticker: string) => boolean;
  setNote: (ticker: string, note: string) => void;
  getNote: (ticker: string) => string;
  deleteNote: (ticker: string) => void;
  toggleComparison: (ticker: string) => void;
  isInComparison: (ticker: string) => boolean;
  canAddToComparison: () => boolean;
  clearComparison: () => void;
}

const UserDataContext = createContext<UserDataContextValue | null>(null);

function loadFromStorage(): UserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return defaultData;
    return {
      ...defaultData,
      ...parsed,
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
      notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
      comparison: Array.isArray(parsed.comparison) ? parsed.comparison : [],
    };
  } catch {
    return defaultData;
  }
}

function saveToStorage(data: UserData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [comparison, setComparison] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount (SSR-safe)
  useEffect(() => {
    const data = loadFromStorage();
    setWatchlist(new Set(data.watchlist));
    setNotes(data.notes);
    setComparison(data.comparison);
    setLoaded(true);
  }, []);

  // Persist whenever state changes (after initial load)
  useEffect(() => {
    if (!loaded) return;
    saveToStorage({
      version: 1,
      watchlist: Array.from(watchlist),
      notes,
      comparison,
    });
  }, [watchlist, notes, comparison, loaded]);

  const toggleWatchlist = useCallback((ticker: string) => {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(ticker)) next.delete(ticker);
      else next.add(ticker);
      return next;
    });
  }, []);

  const isWatchlisted = useCallback(
    (ticker: string) => watchlist.has(ticker),
    [watchlist]
  );

  const setNote = useCallback((ticker: string, note: string) => {
    setNotes((prev) => ({ ...prev, [ticker]: note }));
  }, []);

  const getNote = useCallback(
    (ticker: string) => notes[ticker] ?? "",
    [notes]
  );

  const deleteNote = useCallback((ticker: string) => {
    setNotes((prev) => {
      const next = { ...prev };
      delete next[ticker];
      return next;
    });
  }, []);

  const toggleComparison = useCallback((ticker: string) => {
    setComparison((prev) => {
      if (prev.includes(ticker)) return prev.filter((t) => t !== ticker);
      if (prev.length >= MAX_COMPARISON) return prev;
      return [...prev, ticker];
    });
  }, []);

  const isInComparison = useCallback(
    (ticker: string) => comparison.includes(ticker),
    [comparison]
  );

  const canAddToComparison = useCallback(
    () => comparison.length < MAX_COMPARISON,
    [comparison]
  );

  const clearComparison = useCallback(() => {
    setComparison([]);
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        watchlist,
        notes,
        comparison,
        toggleWatchlist,
        isWatchlisted,
        setNote,
        getNote,
        deleteNote,
        toggleComparison,
        isInComparison,
        canAddToComparison,
        clearComparison,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider");
  return ctx;
}
