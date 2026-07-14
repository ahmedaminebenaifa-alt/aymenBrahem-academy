import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseBasicInfo from '../../../components/dashboard/admin/courses/CourseBasicInfo';
import CourseMedia from '../../../components/dashboard/admin/courses/CourseMedia';
import { useEditCourse } from '../../../hooks/useEditCourse';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    courseData, 
    existingFiles,         
    deleteExistingFile,   
    isFetching, 
    isSaving, 
    error, 
    progress, 
    updateCourse 
  } = useEditCourse(id);

  const [formData, setFormData] = useState(null);
  const [mediaFiles, setMediaFiles] = useState({ thumbnail: null, pdfs: [] });

  useEffect(() => {
    if (courseData) setFormData(courseData);
  }, [courseData]);

  const handleCourseDataChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMediaChange = (field, value) => {
    setMediaFiles((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      alert('يرجى تعبئة جميع الحقول الإلزامية (العنوان، الوصف، والتصنيف).');
      return;
    }

    try {
      await updateCourse(formData, mediaFiles.thumbnail, mediaFiles.pdfs);
      setTimeout(() => navigate('/dashboard/admin/courses'), 1200);
    } catch (err) {
      console.error('فشل تعديل الدرس:', err);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-error font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen rtl font-sans bg-surface text-on-surface">
      <div className="max-w-[1000px] mx-auto py-12 px-8 relative z-10">
        <div className="flex justify-between items-end mb-12 border-b border-outline-variant/20 pb-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-primary mb-2">
              تعديل الدرس
            </h2>
            <p className="text-on-surface-variant text-sm max-w-lg">
              قم بتحديث تفاصيل الدرس والمنهج الدراسي الشرعي.
            </p>
          </div>
          <div className="flex items-center gap-3">
            
            <button
              type="button"
              onClick={() => navigate(`/dashboard/admin/courses/${id}/structure`)}
              className="px-5 py-2 bg-tertiary/10 text-tertiary rounded-[4px] font-bold text-sm hover:bg-tertiary/20 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
              تعديل الهيكل والوحدات
            </button>
          
            <button
              type="button"
              disabled={isSaving}
              onClick={() => navigate('/dashboard/admin/courses')}
              className="px-6 py-2 border border-outline-variant/60 text-on-surface-variant bg-surface-container-lowest rounded-[4px] font-bold text-sm shadow-sm hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-[4px] font-bold text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {formData && (
          <form onSubmit={handleSubmit} className="space-y-10">
            <CourseBasicInfo 
              data={formData} 
              onChange={handleCourseDataChange} 
              courseId={id}
            />
            <CourseMedia
              media={mediaFiles}
              onChange={handleMediaChange}
              existingImageUrl={courseData?.coverImage}
              existingFiles={existingFiles}
              onDeleteExisting={deleteExistingFile}
            />

            <div className="pt-12 pb-20 border-t border-outline-variant/20 mt-12">
              {isSaving && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold text-primary mb-2">
                    <span>{progress.step}</span>
                    <span>{progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => navigate('/dashboard/admin/courses')}
                  className="px-8 py-3 text-on-surface-variant hover:text-error font-bold text-sm transition-all disabled:opacity-50"
                >
                  إلغاء العملية
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-12 py-3 bg-primary text-on-primary rounded-[4px] font-bold text-sm shadow-xl shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-w-[200px]"
                >
                  {isSaving ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">save</span>
                  )}
                  {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditCoursePage;