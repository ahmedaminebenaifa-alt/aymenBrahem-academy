import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/axios';

const fetchCourse = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}`);
  return {
    title: data.title || '',
    description: data.description || '',
    category: data.category || '',
    price: data.price ? String(data.price) : '',
    coverImage: data.coverImage || null,
    subCourses: data.subCourses || [],
    files: data.files || [],
  };
};

export const useEditCourse = (courseId) => {
  const queryClient = useQueryClient();
  const queryKey = ['course', courseId];
  const [progress, setProgress] = useState({ step: '', percentage: 0 });

  const { data: courseData, isLoading: isFetching, error: fetchError } = useQuery({
    queryKey,
    queryFn: () => fetchCourse(courseId),
    enabled: !!courseId,
  });

  const existingFiles = courseData?.files || [];

  const deleteFileMutation = useMutation({
    mutationFn: (fileId) => api.delete(`/courses/${courseId}/files/${fileId}`),
    onMutate: async (fileId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) => ({
        ...old,
        files: old.files.filter((f) => f.id !== fileId),
      }));
      return { previous };
    },
    onError: (err, _fileId, context) => {
      queryClient.setQueryData(queryKey, context.previous);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ updatedData, newThumbnail, newPdfs }) => {
      let coverImageUrl;

      if (newThumbnail) {
        setProgress({ step: 'جاري رفع صورة الغلاف الجديدة...', percentage: 25 });
        const imageFormData = new FormData();
        imageFormData.append('image', newThumbnail);
        const { data: imageData } = await api.post('/courses/upload-cover', imageFormData, {
          headers: { 'Content-Type': undefined },
        });
        coverImageUrl = imageData.imageUrl;
      }

      setProgress({ step: 'جاري حفظ التعديلات...', percentage: 45 });
      const isFree = !updatedData.price || parseFloat(updatedData.price) === 0;

      const payload = {
        title: updatedData.title.trim(),
        description: updatedData.description.trim(),
        category: updatedData.category,
        price: isFree ? null : parseFloat(updatedData.price),
        isFree,
        ...(coverImageUrl && { coverImage: coverImageUrl }),
      };

      const { data: updated } = await api.patch(`/courses/${courseId}`, payload);

      if (newPdfs.length > 0) {
        setProgress({ step: 'جاري رفع الملفات الجديدة...', percentage: 60 });
        const total = newPdfs.length;
        for (let i = 0; i < total; i++) {
          const file = newPdfs[i];
          const pdfFormData = new FormData();
          pdfFormData.append('file', file);
          pdfFormData.append('order', existingFiles.length + i + 1);

          await api.post(`/courses/${courseId}/files`, pdfFormData, {
            headers: { 'Content-Type': undefined },
          });

          const currentProgress = 60 + Math.floor(((i + 1) / total) * 40);
          setProgress({ step: `تم رفع ${i + 1} من ${total} ملفات...`, percentage: currentProgress });
        }
      }

      setProgress({ step: 'تم الحفظ بنجاح!', percentage: 100 });
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      setProgress({ step: 'حدث خطأ أثناء الحفظ', percentage: 0 });
    },
  });

  const updateCourse = (updatedData, newThumbnail, newPdfs = []) => {
    setProgress({ step: 'جاري التحضير...', percentage: 10 });
    return updateMutation.mutateAsync({ updatedData, newThumbnail, newPdfs });
  };

  const errorMessage =
    (fetchError && (fetchError.response?.data?.error || 'فشل في جلب بيانات الدرس')) ||
    (updateMutation.error &&
      (updateMutation.error.response?.data?.error ||
        updateMutation.error.response?.data?.message ||
        'فشل في حفظ التعديلات')) ||
    null;

  return {
    courseData,
    existingFiles,
    isFetching,
    isSaving: updateMutation.isPending,
    error: errorMessage,
    progress,
    deleteExistingFile: (fileId) => deleteFileMutation.mutateAsync(fileId),
    updateCourse,
  };
};