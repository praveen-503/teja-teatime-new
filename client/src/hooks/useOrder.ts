import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!id) return;
    orderService
      .getById(id)
      .then(setOrder)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    orderService
      .getById(id)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateStatus = useCallback(
    (status: string, estimatedTime?: number) => {
      setOrder((prev) => (prev ? { ...prev, status: status as Order['status'], estimatedTime: estimatedTime ?? prev.estimatedTime } : prev));
    },
    []
  );

  return { order, loading, error, refetch, updateStatus };
}
