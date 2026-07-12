import { useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

export const useCoursePlayer = (courseId) => {
  const [course, setCourse] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseDetails = useCallback(async (signal) => {
    if (!courseId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`/courses/${courseId}/content`, { signal });

      if (data.files && data.files.length > 0) {
        data.files.sort((a, b) => a.order - b.order);
        setCurrentFile(data.files[0]);
      }

      setCourse(data);
    } catch (err) {
      if (err.code === 'ERR_CANCELED') return;

      if (err.response?.status === 403) {
        setError('غير مصرح لك بالوصول. يرجى الاشتراك أولاً.');
      } else {
        setError(err.response?.data?.error || 'فشل في تحميل محتوى الدورة');
      }
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCourseDetails(controller.signal);
    return () => controller.abort();
  }, [fetchCourseDetails]);

  return {
    course,
    currentFile,
    setCurrentFile,
    isLoading,
    error,
    refreshCourse: () => fetchCourseDetails(),
  };
};