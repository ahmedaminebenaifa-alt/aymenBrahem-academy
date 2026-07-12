import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseBasicInfo from '../../../components/dashboard/admin/courses/CourseBasicInfo';
import CourseMedia from '../../../components/dashboard/admin/courses/CourseMedia';
import { useCreateCourse } from '../../../hooks/useCreateCourse';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  
  // 1. استدعاء هوك الـ API المعزول
  const { createCourse, isLoading, error, progress } = useCreateCourse();

  // 2. الحالات المحلية النظيفة (Local States)
  const [courseData, setCourseData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
  });

  const [mediaFiles, setMediaFiles] = useState({
    thumbnail: null,
    pdfs: [],
  });

  // 3. دوال التحديث النظيفة التي لا تؤثر على التوجيه (Pure Handlers)
  const handleCourseDataChange = (field, value) => {
    setCourseData((prev) => ({ 
      ...prev, 
      [field]: value // يقوم بتحديث النص محلياً فقط دون إعادة تحميل أي أغلفة حماية
    }));
  };

  const handleMediaChange = (field, value) => {
    setMediaFiles((prev) => ({ ...prev, [field]: value }));
  };

  // 4. دالة معالجة الإرسال عند الضغط على زر النشر فقط
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!courseData.title || !courseData.description || !courseData.category || !mediaFiles.thumbnail) {
      alert('يرجى تعبئة جميع الحقول الإلزامية (العنوان، الوصف، التصنيف، والغلاف).');
      return;
    }

    try {
      await createCourse(courseData, mediaFiles);
      setTimeout(() => {
        navigate('/dashboard/admin/courses'); // التوجيه للمسار الصحيح بعد النجاح
      }, 1500);
    } catch (err) {
      console.error('فشلت عملية إنشاء الدرس:', err);
    }
  };

  return (
    <div className="relative min-h-screen rtl font-sans bg-surface text-on-surface">
      <div className="max-w-[1000px] mx-auto py-12 px-8 relative z-10">
        
        {/* رأس الصفحة */}
        <div className="flex justify-between items-end mb-12 border-b border-outline-variant/20 pb-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-primary mb-2">
              إضافة درس جديد
            </h2>
            <p className="text-on-surface-variant text-sm max-w-lg">
              قم بتزويد تفاصيل الدرس والمنهج الدراسي الشرعي.
            </p>
          </div>
          
          <button 
            type="button" // مهم جداً لمنع أي إرسال بالخطأ
            disabled={isLoading}
            onClick={() => navigate('/dashboard/admin/courses')}
            className="px-6 py-2 border border-outline-variant/60 text-on-surface-variant bg-surface-container-lowest rounded-[4px] font-bold text-sm shadow-sm hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>

        {/* عرض الأخطاء إن وجدت */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-[4px] font-bold text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        {/* النموذج الرئيسي */}
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* المكونات الفرعية تستقبل البيانات والدوال بشكل نظيف */}
          <CourseBasicInfo data={courseData} onChange={handleCourseDataChange} />
          <CourseMedia media={mediaFiles} onChange={handleMediaChange} />

          {/* شريط التحميل وأزرار التحكم السفلى */}
          <div className="pt-12 pb-20 border-t border-outline-variant/20 mt-12">
            
            {isLoading && (
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold text-primary mb-2">
                  <span>{progress.step}</span>
                  <span>{progress.percentage}%</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300 ease-out"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button 
                type="button"
                disabled={isLoading}
                onClick={() => navigate('/dashboard/admin/courses')}
                className="px-8 py-3 text-on-surface-variant hover:text-error font-bold text-sm transition-all disabled:opacity-50"
              >
                إلغاء العملية
              </button>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="px-12 py-3 bg-primary text-on-primary rounded-[4px] font-bold text-sm shadow-xl shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-w-[200px]"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                )}
                {isLoading ? 'جاري الحفظ...' : 'نشر الدرس'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;