import { useState, useEffect } from 'react';
import api from '../api/axios';

export function usePublicCourseOverview(courseId) {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/courses/${courseId}/overview`);
        if (!cancelled) setCourse(data.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'تعذر تحميل الدورة');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return { course, isLoading, error };
}