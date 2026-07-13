import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export function usePendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders/admin/pending');
      setOrders(data.data);
    } catch (err) {
      console.error('Failed to fetch pending orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const approve = async (orderId) => {
    await api.post(`/orders/${orderId}/approve`);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const reject = async (orderId) => {
    await api.post(`/orders/${orderId}/reject`);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return { orders, loading, approve, reject, refetch: fetchOrders };
}