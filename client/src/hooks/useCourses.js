import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/axios';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('الكل');

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'فشل في جلب الكورسات من الخادم');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const stats = useMemo(() => ({
    total: courses.length,
    published: courses.filter((c) => c.published === true).length,
    drafts: courses.filter((c) => c.published === false || c.published === null).length,
    archived: courses.filter((c) => c.isArchived === true).length,
  }), [courses]);

  const filteredCourses = useMemo(() => {
    if (activeFilter === 'الكل') return courses;
    return courses.filter((c) => c.category === activeFilter);
  }, [courses, activeFilter]);

  const deleteCourse = async (courseId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدرس نهائياً؟')) return;

    try {
      await api.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      alert(err.response?.data?.error || 'فشل حذف الدرس');
    }
  };

  return {
    courses: filteredCourses,
    isLoading,
    error,
    stats,
    activeFilter,
    setActiveFilter,
    deleteCourse,
  };
};