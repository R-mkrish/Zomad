import Constants from 'expo-constants';
import { getCacheItem, setCacheItem } from '../storage/cache';

const API_BASE_URL =
  // Prefer value from app config `extra` if available.
  (Constants.expoConfig?.extra as any)?.apiBaseUrl ??
  // Fallback to public env var for flexibility in CI.
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  // As a last resort, use a hard-coded URL. Replace with your real backend.
  'https://your-serverless-api.example.com';

type FetchOptions = RequestInit & {
  cacheKey?: string;
  maxAgeMs?: number;
  forceNetwork?: boolean;
};

/**
 * fetchJsonWithCache
 * ------------------
 * Generic helper for calling the serverless REST API with offline support.
 *
 * Behavior:
 * - Tries a network request first (unless `forceNetwork` is false and offline).
 * - On success, caches the JSON payload in AsyncStorage (if `cacheKey` is defined).
 * - On failure, falls back to cached data when available.
 *
 * This ensures the UI can still render when the device is offline.
 */
export async function fetchJsonWithCache<T>(
  path: string,
  { cacheKey, maxAgeMs, forceNetwork, ...init }: FetchOptions = {},
): Promise<{ data: T; fromCache: boolean }> {
  const url = `${API_BASE_URL}${path}`;
  const effectiveCacheKey = cacheKey ?? url;

  if (!forceNetwork) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(init.headers ?? {}),
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as T;

      if (cacheKey !== null) {
        await setCacheItem(effectiveCacheKey, data);
      }

      return { data, fromCache: false };
    } catch {
      // Fall through to cache
    }
  }

  const cached = await getCacheItem<T>(effectiveCacheKey);
  if (!cached) {
    throw new Error('Network error and no cached data available');
  }

  if (maxAgeMs != null && Date.now() - cached.timestamp > maxAgeMs) {
    // Data is stale, but we still return it to avoid data loss when offline.
  }

  return { data: cached.data, fromCache: true };
}

/**
 * Example higher-level API call for inventory items.
 * Adapt the return type and path to match your real backend.
 */
export async function fetchInventoryItems() {
  return fetchJsonWithCache<{ id: string; name: string; quantity: number }[]>('/items', {
    cacheKey: 'inventory-items',
    maxAgeMs: 5 * 60 * 1000,
  });
}

