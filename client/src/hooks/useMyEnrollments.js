import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';

export const useMyEnrollments = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const fetchEnrollments = useCallback(async (signal) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/enrollments/me', { signal });
      // Backend already returns fully-flattened course objects with
      // lessonsCount, completedLessons, resourcesCount, and enrolledAt included.
      setCourses(data.data);
    } catch (err) {
      if (err.code === 'ERR_CANCELED') return;
      setError(err.response?.data?.error || 'فشل في جلب دوراتك المسجلة');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchEnrollments(controller.signal);
    return () => controller.abort();
  }, [fetchEnrollments]);

  const visibleCourses = useMemo(() => {
    let list = [...courses];
    if (activeFilter !== 'all') {
      list = list.filter((c) => c.category === activeFilter);
    }
    if (sortOption === 'alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
    } else {
      list.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
    }
    return list;
  }, [courses, activeFilter, sortOption]);

  return {
    courses: visibleCourses,
    totalCount: courses.length,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    refresh: () => fetchEnrollments(),
  };
};