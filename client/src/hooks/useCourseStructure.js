import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

// mode: 'student' (read-only, published only) | 'admin' (full tree + mutations)
export const useCourseStructure = (courseId, mode = 'student') => {
  const [subCourses, setSubCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  const endpoint =
    mode === 'admin'
      ? `/courses/${courseId}/structure/admin`
      : `/courses/${courseId}/structure`;

  const fetchStructure = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get(endpoint);
      if (mode === 'admin') {
        setSubCourses(data.data);
      } else {
        setSubCourses(data.data.subCourses);
        setFiles(data.data.files);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحميل هيكل الدورة');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, mode]);

  useEffect(() => {
    if (courseId) fetchStructure();
  }, [courseId, fetchStructure]);

  // ── SubCourse mutations (admin only, but harmless if called elsewhere) ──
  const addSubCourse = async (title) => {
    await api.post(`/courses/${courseId}/subcourses`, { title });
    await fetchStructure();
  };

  const editSubCourse = async (id, payload) => {
    await api.patch(`/subcourses/${id}`, payload);
    await fetchStructure();
  };

  const removeSubCourse = async (id) => {
    await api.delete(`/subcourses/${id}`);
    await fetchStructure();
  };

  const moveSubCourse = async (id, direction) => {
    await api.patch(`/subcourses/${id}/move`, { direction });
    await fetchStructure();
  };

  // ── Theme mutations ──
  const addTheme = async (subCourseId, title) => {
    await api.post(`/subcourses/${subCourseId}/themes`, { title });
    await fetchStructure();
  };

  const editTheme = async (id, title) => {
    await api.patch(`/themes/${id}`, { title });
    await fetchStructure();
  };

  const removeTheme = async (id) => {
    await api.delete(`/themes/${id}`);
    await fetchStructure();
  };

  const moveTheme = async (id, direction) => {
    await api.patch(`/themes/${id}/move`, { direction });
    await fetchStructure();
  };

  // ── ContentBlock mutations ──
  const addContentBlock = async (themeId, { title, body }) => {
    await api.post(`/themes/${themeId}/contents`, { title, body });
    await fetchStructure();
  };

  const editContentBlock = async (id, { title, body }) => {
    await api.patch(`/contents/${id}`, { title, body });
    await fetchStructure();
  };

  const removeContentBlock = async (id) => {
    await api.delete(`/contents/${id}`);
    await fetchStructure();
  };

  const moveContentBlock = async (id, direction) => {
    await api.patch(`/contents/${id}/move`, { direction });
    await fetchStructure();
  };

  const reorderSubCourses = async (orderedIds) => {
    await api.patch(`/courses/${courseId}/subcourses/reorder`, { orderedIds });
    await fetchStructure();
  };

  const reorderThemes = async (subCourseId, orderedIds) => {
    await api.patch(`/subcourses/${subCourseId}/themes/reorder`, { orderedIds });
    await fetchStructure();
  };

  const reorderContentBlocks = async (themeId, orderedIds) => {
    await api.patch(`/themes/${themeId}/contents/reorder`, { orderedIds });
    await fetchStructure();
  };

  return {
    subCourses,
    files,
    isLoading,
    error,
    refetch: fetchStructure,
    addSubCourse,
    editSubCourse,
    removeSubCourse,
    moveSubCourse,
    addTheme,
    editTheme,
    removeTheme,
    moveTheme,
    addContentBlock,
    editContentBlock,
    removeContentBlock,
    moveContentBlock,
    reorderSubCourses,
    reorderThemes,
    reorderContentBlocks,
  };
};


