import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useStudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const fetchCatalog = useCallback(async (signal) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/courses/student/catalog', { signal });
      setCourses(data);
    } catch (err) {
      if (err.code === 'ERR_CANCELED') return;
      setError(err.response?.data?.error || 'فشل في جلب قائمة الدورات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCatalog(controller.signal);
    return () => controller.abort();
  }, [fetchCatalog]);

  const enrollInCourse = async (courseId) => {
    setEnrollingCourseId(courseId);
    try {
      await api.post('/enrollments', { courseId });
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, isEnrolled: true } : c))
      );
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
    error,
    enrollingCourseId,
    enrollInCourse,
    refreshCatalog: () => fetchCatalog(),
  };
};