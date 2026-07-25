import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const fetchCatalog = async () => {
  const { data } = await api.get('/courses/student/catalog');
  return data;
};

export const useStudentCourses = () => {
  const queryClient = useQueryClient();
  const queryKey = ['studentCatalog'];
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: fetchCatalog,
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId) => api.post('/enrollments', { courseId }),
    onSuccess: (_data, courseId) => {
      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((c) => (c.id === courseId ? { ...c, isEnrolled: true } : c))
      );
    },
  });

  const enrollInCourse = async (courseId) => {
    setEnrollingCourseId(courseId);
    try {
      await enrollMutation.mutateAsync(courseId);
      return { success: true, message: 'تم التسجيل بنجاح! يمكنك الآن بدء التعلم.' };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'حدث خطأ أثناء التسجيل' };
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return {
    courses,
    isLoading,
    error: error ? (error.response?.data?.error || 'فشل في جلب قائمة الدورات') : null,
    enrollingCourseId,
    enrollInCourse,
    refreshCatalog: () => queryClient.invalidateQueries({ queryKey }),
  };
};