import { useCallback, useEffect, useState } from "react";

const FAVORITES_STORAGE_KEY = "favoriteIds";

let favoriteIdsInMemory: string[] = [];

function safeParseFavoriteIds(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids: string[]) {
  favoriteIdsInMemory = ids;
}

export function loadFavoriteIds() {
  if (typeof globalThis === "undefined") return favoriteIdsInMemory;

  try {
    const rawValue = globalThis.localStorage?.getItem(FAVORITES_STORAGE_KEY) ?? null;
    const parsed = safeParseFavoriteIds(rawValue);
    favoriteIdsInMemory = parsed;
    return parsed;
  } catch {
    return favoriteIdsInMemory;
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavoriteIds());

  useEffect(() => {
    setFavoriteIds(loadFavoriteIds());
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      saveFavoriteIds(next);
      return next;
    });
  }, []);

  return { favoriteIds, toggleFavorite };
}
