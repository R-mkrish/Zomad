import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

/**
 * useNetwork
 * ----------
 * Lightweight network state hook using Expo's `expo-network` API.
 * - Polls current network status on an interval (default: 10 seconds).
 * - Returns `isOnline` boolean and last-known network type.
 * - Designed to work on iOS, Android, and web (where supported).
 */
export function useNetwork(pollIntervalMs: number = 10000) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [type, setType] = useState<Network.NetworkStateType | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    const check = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (!isMounted) return;
        setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
        setType(state.type);
      } catch {
        if (!isMounted) return;
        setIsOnline(false);
      }
    };

    void check();
    timer = setInterval(check, pollIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [pollIntervalMs]);

  return { isOnline, type };
}

