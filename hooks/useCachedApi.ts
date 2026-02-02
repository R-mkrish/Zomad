import { useCallback, useEffect, useState } from 'react';
import { useNetwork } from './useNetwork';
import { fetchJsonWithCache } from '../services/apiClient';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseCachedApiOptions<T> {
  path: string;
  cacheKey?: string;
  maxAgeMs?: number;
  initialData?: T;
}

/**
 * useCachedApi
 * ------------
 * Reusable hook that wraps `fetchJsonWithCache` and provides:
 * - Status flags (`idle`, `loading`, `success`, `error`).
 * - Last error (if any).
 * - Online/offline awareness.
 * - `refetch` function for manual refresh or auto-sync.
 */
export function useCachedApi<T>({
  path,
  cacheKey,
  maxAgeMs,
  initialData,
}: UseCachedApiOptions<T>) {
  const { isOnline } = useNetwork();
  const [data, setData] = useState<T | undefined>(initialData);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(
    async (opts?: { forceNetwork?: boolean }) => {
      setStatus('loading');
      setError(null);
      try {
        const result = await fetchJsonWithCache<T>(path, {
          cacheKey,
          maxAgeMs,
          forceNetwork: opts?.forceNetwork,
        });
        setData(result.data);
        setStatus('success');
      } catch (err: any) {
        setError(err);
        setStatus('error');
      }
    },
    [path, cacheKey, maxAgeMs],
  );

  useEffect(() => {
    // Initial load on mount.
    void load();
  }, [load]);

  return { data, status, error, refetch: load, isOnline };
}

