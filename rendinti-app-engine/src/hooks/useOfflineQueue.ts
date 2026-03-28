'use client';

import { useEffect, useState, useCallback } from 'react';
import { getQueue, clearQueue, OfflineAction } from '@/lib/db';

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  const syncQueue = useCallback(async () => {
    if (!isOnline) return;

    const queue = await getQueue();
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} offline actions...`);

    for (const action of queue) {
      try {
        if (action.type === 'UPDATE_ORDER') {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.payload),
          });
        }
        // Handle other action types (photo uploads would require blob storage in IDB)
      } catch (err) {
        console.error('Failed to sync action:', action, err);
      }
    }

    await clearQueue();
    setPendingActions([]);
  }, [isOnline]);

  useEffect(() => {
    if (isOnline) {
      syncQueue();
    }
  }, [isOnline, syncQueue]);

  return { isOnline, syncQueue };
}
