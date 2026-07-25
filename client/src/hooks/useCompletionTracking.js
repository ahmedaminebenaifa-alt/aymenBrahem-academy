import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const fetchProgress = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/progress`);
  return new Set(data.data);
};

export function useCompletionTracking(courseId) {
  const queryClient = useQueryClient();
  const queryKey = ['completion', courseId];

  const { data: completedIds = new Set(), isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchProgress(courseId),
    enabled: !!courseId,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ contentId, wasCompleted }) =>
      wasCompleted ? api.delete(`/contents/${contentId}/progress`) : api.post(`/contents/${contentId}/progress`),
    onMutate: async ({ contentId, wasCompleted }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey) || new Set();

      const next = new Set(previous);
      wasCompleted ? next.delete(contentId) : next.add(contentId);
      queryClient.setQueryData(queryKey, next);

      return { previous };
    },
    onError: (err, _vars, context) => {
      queryClient.setQueryData(queryKey, context.previous);
    },
  });

  const isCompleted = (contentId) => completedIds.has(contentId);

  const toggleComplete = (contentId) => {
    const wasCompleted = completedIds.has(contentId);
    toggleMutation.mutate({ contentId, wasCompleted });
  };

  const isThemeCompleted = (theme) =>
    theme.contents.length > 0 && theme.contents.every((c) => completedIds.has(c.id));

  // Was per-id via a Set of pending ids; TanStack Query's mutation state is
  // one mutation object, not naturally per-id — track the currently in-flight
  // contentId via mutation variables instead of a separate Set.
  const isPending = (contentId) =>
    toggleMutation.isPending && toggleMutation.variables?.contentId === contentId;

  return { isCompleted, toggleComplete, isThemeCompleted, isPending, isLoading };
}