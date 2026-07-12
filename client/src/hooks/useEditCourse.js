import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useEditCourse = (courseId) => {
  const [courseData, setCourseData] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ step: '', percentage: 0 });

  const fetchCourse = useCallback(async () => {
    setIsFetching(true);
    try {
      const { data: course } = await api.get(`/courses/${courseId}`);
      setCourseData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        price: course.price ? String(course.price) : '',
        coverImage: course.coverImage || null,
      });
      setExistingFiles(course.files || []);
    } catch (err) {
      setError(err.response?.data?.error || 'فشل في جلب بيانات الدرس');
    } finally {
      setIsFetching(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId, fetchCourse]);

  const deleteExistingFile = async (fileId) => {
    const previous = existingFiles;
    setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));

    try {
      await api.delete(`/courses/${courseId}/files/${fileId}`);
    } catch (err) {
      setExistingFiles(previous);
      setError(err.response?.data?.error || 'فشل في حذف الملف');
    }
  };

  const updateCourse = async (updatedData, newThumbnail) => {
    setIsSaving(true);
    setError(null);
    setProgress({ step: 'جاري التحضير...', percentage: 20 });

    try {
      let coverImageUrl;

      if (newThumbnail) {
        setProgress({ step: 'جاري رفع صورة الغلاف الجديدة...', percentage: 40 });
        const imageFormData = new FormData();
        imageFormData.append('image', newThumbnail);

        const { data: imageData } = await api.post('/courses/upload-cover', imageFormData, {
          headers: { 'Content-Type': undefined },
        });
        coverImageUrl = imageData.imageUrl;
      }

      setProgress({ step: 'جاري حفظ التعديلات...', percentage: 70 });
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
      setProgress({ step: 'تم الحفظ بنجاح!', percentage: 100 });
      return updated;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'فشل في حفظ التعديلات';
      setError(message);
      setProgress({ step: 'حدث خطأ أثناء الحفظ', percentage: 0 });
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return { courseData, existingFiles, isFetching, isSaving, error, progress, deleteExistingFile, updateCourse };
};