import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const fetchSchedule = async () => {
  const { data } = await api.get('/live/schedule');
  return data.data;
};

export function useLiveSchedule() {
  const queryClient = useQueryClient();
  const queryKey = ['liveSchedule'];

  const { data: sessions = [], isLoading } = useQuery({
    queryKey,
    queryFn: fetchSchedule,
    refetchInterval: 60000, // check every minute — schedule doesn't need faster polling
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });
  const invalidateAll = () => {
    invalidate();
    queryClient.invalidateQueries({ queryKey: ['liveSession'] }); // keep the live widget in sync too
  };

  const scheduleMutation = useMutation({
    mutationFn: ({ title, courseId, scheduledAt }) =>
      api.post('/live/schedule', { title, courseId, scheduledAt }),
    onSuccess: invalidate,
  });

  const startMutation = useMutation({
    mutationFn: (id) => api.post(`/live/schedule/${id}/start`),
    onSuccess: invalidateAll,
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => api.delete(`/live/schedule/${id}`),
    onSuccess: invalidate,
  });

  return {
    sessions,
    isLoading,
    scheduleSession: (payload) => scheduleMutation.mutateAsync(payload),
    startSession: (id) => startMutation.mutateAsync(id),
    cancelSession: (id) => cancelMutation.mutateAsync(id),
    isScheduling: scheduleMutation.isPending,
    isStarting: startMutation.isPending,
  };
}