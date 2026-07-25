import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const fetchEnrollments = async () => {
  const { data } = await api.get('/enrollments/me');
  return data.data;
};

export const useMyEnrollments = () => {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['myEnrollments'],
    queryFn: fetchEnrollments,
  });

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
    error: error ? (error.response?.data?.error || 'فشل في جلب دوراتك المسجلة') : null,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['myEnrollments'] }),
  };
};