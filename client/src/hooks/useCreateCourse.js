import { useState } from 'react';
import api from '../api/axios';

export const useCreateCourse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ step: '', percentage: 0 });

  const createCourse = async (courseData, mediaFiles) => {
    setIsLoading(true);
    setError(null);
    setProgress({ step: 'جاري تحضير البيانات...', percentage: 10 });

    try {
      let coverImageUrl = null;

      if (mediaFiles.thumbnail) {
        setProgress({ step: 'جاري رفع صورة الغلاف...', percentage: 20 });
        const imageFormData = new FormData();
        imageFormData.append('image', mediaFiles.thumbnail);

        const { data: imageData } = await api.post('/courses/upload-cover', imageFormData, {
          headers: { 'Content-Type': undefined },
        });
        coverImageUrl = imageData.imageUrl;
      }

      setProgress({ step: 'جاري إنشاء بيانات الدرس...', percentage: 40 });
      const isFree = !courseData.price || parseFloat(courseData.price) === 0;

      const payload = {
        title: courseData.title.trim(),
        description: courseData.description.trim(),
        category: courseData.category,
        price: isFree ? null : parseFloat(courseData.price),
        isFree,
        coverImage: coverImageUrl,
        published: true,
      };

      const { data: newCourse } = await api.post('/courses', payload);
      const courseId = newCourse.id;

      if (mediaFiles.pdfs?.length > 0) {
        setProgress({ step: 'جاري رفع المرفقات والملفات...', percentage: 60 });
        const totalPdfs = mediaFiles.pdfs.length;

        for (let i = 0; i < totalPdfs; i++) {
          const file = mediaFiles.pdfs[i];
          const pdfFormData = new FormData();
          pdfFormData.append('file', file);
          pdfFormData.append('order', i + 1);

          await api.post(`/courses/${courseId}/files`, pdfFormData, {
            headers: { 'Content-Type': undefined },
          });

          const currentProgress = 60 + Math.floor(((i + 1) / totalPdfs) * 40);
          setProgress({ step: `تم رفع ${i + 1} من ${totalPdfs} ملفات...`, percentage: currentProgress });
        }
      }

      setProgress({ step: 'تم النشر بنجاح!', percentage: 100 });
      return newCourse;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'حدث خطأ أثناء النشر';
      setError(message);
      setProgress({ step: 'حدث خطأ أثناء النشر', percentage: 0 });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCourse, isLoading, error, progress };
};