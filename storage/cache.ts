import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'cache:';

export type CachedEntry<T> = {
  data: T;
  timestamp: number; // epoch ms
};

/**
 * Persist a JSON-serializable value in AsyncStorage under a namespaced key.
 * This is used for caching API responses for offline usage.
 */
export async function setCacheItem<T>(key: string, data: T): Promise<void> {
  const entry: CachedEntry<T> = { data, timestamp: Date.now() };
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry));
}

/**
 * Retrieve a cached entry for the given key.
 * Returns null if no cache is present or if the cache is corrupted.
 */
export async function getCacheItem<T>(key: string): Promise<CachedEntry<T> | null> {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedEntry<T>;
  } catch {
    // If the cache is corrupted, clear it to avoid repeated errors.
    await AsyncStorage.removeItem(PREFIX + key);
    return null;
  }
}

/**
 * Clear a specific cached key.
 */
export async function clearCacheKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(PREFIX + key);
}

