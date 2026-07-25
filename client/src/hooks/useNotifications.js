import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const POLL_INTERVAL = 20000;

const fetchNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data.data;
};

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: POLL_INTERVAL,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData(['notifications']);
      queryClient.setQueryData(['notifications'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      return { previous };
    },
    onError: (err, id, context) => {
      // rollback on failure — same safety net the old hook had
      queryClient.setQueryData(['notifications'], context.previous);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData(['notifications']);
      queryClient.setQueryData(['notifications'], (old = []) =>
        old.map((n) => ({ ...n, isRead: true }))
      );
      return { previous };
    },
    onError: (err, _vars, context) => {
      queryClient.setQueryData(['notifications'], context.previous);
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};