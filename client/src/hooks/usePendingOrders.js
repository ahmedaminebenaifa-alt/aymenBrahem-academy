import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const fetchPendingOrders = async () => {
  const { data } = await api.get('/orders/admin/pending');
  return data.data;
};

export function usePendingOrders() {
  const queryClient = useQueryClient();
  const queryKey = ['pendingOrders'];

  const { data: orders = [], isLoading } = useQuery({
    queryKey,
    queryFn: fetchPendingOrders,
  });

  const removeFromCache = (orderId) => {
    queryClient.setQueryData(queryKey, (old = []) => old.filter((o) => o.id !== orderId));
  };

  const approveMutation = useMutation({
    mutationFn: (orderId) => api.post(`/orders/${orderId}/approve`),
    onSuccess: (_data, orderId) => removeFromCache(orderId),
  });

  const rejectMutation = useMutation({
    mutationFn: (orderId) => api.post(`/orders/${orderId}/reject`),
    onSuccess: (_data, orderId) => removeFromCache(orderId),
  });

  return {
    orders,
    loading: isLoading,
    approve: (orderId) => approveMutation.mutateAsync(orderId),
    reject: (orderId) => rejectMutation.mutateAsync(orderId),
    refetch: () => queryClient.invalidateQueries({ queryKey }),
  };
}