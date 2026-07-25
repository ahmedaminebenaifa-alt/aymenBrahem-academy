import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const fetchStructure = async (courseId, mode) => {
  const endpoint = mode === 'admin' ? `/courses/${courseId}/structure/admin` : `/courses/${courseId}/structure`;
  const { data } = await api.get(endpoint);
  return mode === 'admin' ? { subCourses: data.data, files: [] } : data.data;
};

export const useCourseStructure = (courseId, mode = 'student') => {
  const queryClient = useQueryClient();
  const queryKey = ['courseStructure', courseId, mode];

  const {
    data = { subCourses: [], files: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchStructure(courseId, mode),
    enabled: !!courseId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  // Each hook is called directly at the top level (Rules of Hooks compliant) —
  // all share the same onSuccess behavior (refetch the whole tree).
  const addSubCourseMutation = useMutation({
    mutationFn: (title) => api.post(`/courses/${courseId}/subcourses`, { title }),
    onSuccess: invalidate,
  });
  const editSubCourseMutation = useMutation({
    mutationFn: ({ id, payload }) => api.patch(`/subcourses/${id}`, payload),
    onSuccess: invalidate,
  });
  const removeSubCourseMutation = useMutation({
    mutationFn: (id) => api.delete(`/subcourses/${id}`),
    onSuccess: invalidate,
  });
  const reorderSubCoursesMutation = useMutation({
    mutationFn: (orderedIds) => api.patch(`/courses/${courseId}/subcourses/reorder`, { orderedIds }),
    onSuccess: invalidate,
  });

  const addThemeMutation = useMutation({
    mutationFn: ({ subCourseId, title }) => api.post(`/subcourses/${subCourseId}/themes`, { title }),
    onSuccess: invalidate,
  });
  const editThemeMutation = useMutation({
    mutationFn: ({ id, title }) => api.patch(`/themes/${id}`, { title }),
    onSuccess: invalidate,
  });
  const removeThemeMutation = useMutation({
    mutationFn: (id) => api.delete(`/themes/${id}`),
    onSuccess: invalidate,
  });
  const reorderThemesMutation = useMutation({
    mutationFn: ({ subCourseId, orderedIds }) => api.patch(`/subcourses/${subCourseId}/themes/reorder`, { orderedIds }),
    onSuccess: invalidate,
  });

  const addContentBlockMutation = useMutation({
    mutationFn: ({ themeId, title, body }) => api.post(`/themes/${themeId}/contents`, { title, body }),
    onSuccess: invalidate,
  });
  const editContentBlockMutation = useMutation({
    mutationFn: ({ id, title, body }) => api.patch(`/contents/${id}`, { title, body }),
    onSuccess: invalidate,
  });
  const removeContentBlockMutation = useMutation({
    mutationFn: (id) => api.delete(`/contents/${id}`),
    onSuccess: invalidate,
  });
  const reorderContentBlocksMutation = useMutation({
    mutationFn: ({ themeId, orderedIds }) => api.patch(`/themes/${themeId}/contents/reorder`, { orderedIds }),
    onSuccess: invalidate,
  });

  return {
    subCourses: data.subCourses,
    files: data.files,
    isLoading,
    error: error ? (error.response?.data?.message || 'فشل تحميل هيكل الدورة') : null,
    refetch: invalidate,

    addSubCourse: (title) => addSubCourseMutation.mutateAsync(title),
    editSubCourse: (id, payload) => editSubCourseMutation.mutateAsync({ id, payload }),
    removeSubCourse: (id) => removeSubCourseMutation.mutateAsync(id),
    reorderSubCourses: (orderedIds) => reorderSubCoursesMutation.mutateAsync(orderedIds),

    addTheme: (subCourseId, title) => addThemeMutation.mutateAsync({ subCourseId, title }),
    editTheme: (id, title) => editThemeMutation.mutateAsync({ id, title }),
    removeTheme: (id) => removeThemeMutation.mutateAsync(id),
    reorderThemes: (subCourseId, orderedIds) => reorderThemesMutation.mutateAsync({ subCourseId, orderedIds }),

    addContentBlock: (themeId, { title, body }) => addContentBlockMutation.mutateAsync({ themeId, title, body }),
    editContentBlock: (id, { title, body }) => editContentBlockMutation.mutateAsync({ id, title, body }),
    removeContentBlock: (id) => removeContentBlockMutation.mutateAsync(id),
    reorderContentBlocks: (themeId, orderedIds) => reorderContentBlocksMutation.mutateAsync({ themeId, orderedIds }),
  };
};