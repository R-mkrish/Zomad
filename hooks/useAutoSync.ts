import { useEffect, useRef } from 'react';
import { useNetwork } from './useNetwork';

/**
 * useAutoSync
 * -----------
 * Calls the provided `sync` function whenever the app transitions from
 * offline -> online.
 *
 * This hook is used to automatically refresh cached data when the network
 * connection is restored, without requiring an app restart.
 */
export function useAutoSync(sync: () => Promise<void> | void) {
  const { isOnline } = useNetwork();
  const wasOnlineRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (isOnline == null) return;

    if (wasOnlineRef.current === false && isOnline === true) {
      // Device just went from offline to online.
      void sync();
    }

    wasOnlineRef.current = isOnline;
  }, [isOnline, sync]);
}

