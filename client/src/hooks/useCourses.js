import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const fetchCourses = async () => {
  const { data } = await api.get('/courses');
  return data;
};

export const useCourses = () => {
  const queryClient = useQueryClient();
  const queryKey = ['courses'];
  const [activeFilter, setActiveFilter] = useState('الكل');

  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: fetchCourses,
  });

  const stats = useMemo(
    () => ({
      total: courses.length,
      published: courses.filter((c) => c.published === true).length,
      drafts: courses.filter((c) => c.published === false || c.published === null).length,
      archived: courses.filter((c) => c.isArchived === true).length,
    }),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    if (activeFilter === 'الكل') return courses;
    return courses.filter((c) => c.category === activeFilter);
  }, [courses, activeFilter]);

  const deleteMutation = useMutation({
    mutationFn: (courseId) => api.delete(`/courses/${courseId}`),
    onSuccess: (_data, courseId) => {
      queryClient.setQueryData(queryKey, (old = []) => old.filter((c) => c.id !== courseId));
    },
    onError: () => {
      alert('فشل حذف الدرس');
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ courseId, currentStatus }) =>
      api.patch(`/courses/${courseId}`, { published: !currentStatus }),
    onSuccess: (_data, { courseId, currentStatus }) => {
      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((c) => (c.id === courseId ? { ...c, published: !currentStatus } : c))
      );
    },
    onError: () => {
      alert('فشل تغيير حالة النشر');
    },
  });

  const deleteCourse = (courseId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدرس نهائياً؟')) return;
    deleteMutation.mutate(courseId);
  };

  const togglePublish = (courseId, currentStatus) => {
    togglePublishMutation.mutate({ courseId, currentStatus });
  };

  return {
    courses: filteredCourses,
    isLoading,
    error: error ? (error.response?.data?.error || 'فشل في جلب الكورسات من الخادم') : null,
    stats,
    activeFilter,
    setActiveFilter,
    deleteCourse,
    togglePublish,
    togglingId: togglePublishMutation.isPending ? togglePublishMutation.variables?.courseId : null,
  };
};