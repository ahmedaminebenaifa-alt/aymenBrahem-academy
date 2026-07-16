import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export function useCompletionTracking(courseId) {
  const [completedIds, setCompletedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState(new Set()); // in-flight toggles, to disable double-clicks

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/courses/${courseId}/progress`);
        if (!cancelled) setCompletedIds(new Set(data.data));
      } catch {
        if (!cancelled) setCompletedIds(new Set());
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const isCompleted = useCallback((contentId) => completedIds.has(contentId), [completedIds]);

  const toggleComplete = useCallback(
    async (contentId) => {
      const wasCompleted = completedIds.has(contentId);

      // Optimistic update
      setCompletedIds((prev) => {
        const next = new Set(prev);
        wasCompleted ? next.delete(contentId) : next.add(contentId);
        return next;
      });
      setPendingIds((prev) => new Set(prev).add(contentId));

      try {
        if (wasCompleted) {
          await api.delete(`/contents/${contentId}/progress`);
        } else {
          await api.post(`/contents/${contentId}/progress`);
        }
      } catch {
        // Roll back on failure
        setCompletedIds((prev) => {
          const next = new Set(prev);
          wasCompleted ? next.add(contentId) : next.delete(contentId);
          return next;
        });
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(contentId);
          return next;
        });
      }
    },
    [completedIds]
  );

  const isThemeCompleted = useCallback(
    (theme) => theme.contents.length > 0 && theme.contents.every((c) => completedIds.has(c.id)),
    [completedIds]
  );

  const isPending = useCallback((contentId) => pendingIds.has(contentId), [pendingIds]);

  return { isCompleted, toggleComplete, isThemeCompleted, isPending, isLoading };
}