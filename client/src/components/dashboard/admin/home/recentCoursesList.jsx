import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';
// Points directly to your existing base course route
const API_BASE_URL = 'http://localhost:5000/api/courses';

const RecentCoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch courses using your existing public list endpoint
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('تعذر تحميل النشاطات الأخيرة. يرجى المحاولة لاحقاً.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleTogglePublish = async (courseId, currentPublishedStatus) => {
    const newPublishedStatus = !currentPublishedStatus;
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, published: newPublishedStatus } : c)));

    try {
      await api.patch(`/courses/${courseId}`, { published: newPublishedStatus });
    } catch (err) {
      console.error('Update failed:', err);
      alert(err.response?.data?.error || 'حدث خطأ أثناء الاتصال بالخادم، تم التراجع عن التعديل.');
      setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, published: currentPublishedStatus } : c)));
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[4px] shadow-sm overflow-hidden flex flex-col">
      
      {/* Table Header Section */}
      <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface/50">
        <h3 className="font-display font-bold text-xl text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">local_library</span>
          الدورات التعليمية الحالية
        </h3>
        <button className="text-sm font-bold text-primary hover:underline transition-all font-label">
          View All &larr;
        </button>
      </div>

      {/* Responsive Structural Layout */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant w-5/12">عنوان الدورة</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant">نوع الدورة / السعر</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant">تاريخ الإضافة</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant text-center">حالة العرض</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-outline-variant/10">
            {/* Soft-Shape Skeleton Loaders */}
            {isLoading && Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-4/5"></div></td>
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-1/4"></div></td>
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-1/3"></div></td>
                <td className="py-5 px-6 flex justify-center"><div className="h-7 bg-outline-variant/20 rounded-[4px] w-24"></div></td>
              </tr>
            ))}

            {/* Empty State Fallback */}
            {!isLoading && !error && courses.length === 0 && (
              <tr>
                <td colSpan="4" className="py-14 text-center text-on-surface-variant/70 font-sans text-sm">
                  <span className="material-symbols-outlined text-4xl opacity-30 mb-2 block">inventory_2</span>
                  لا توجد دورات متوفرة في قاعدة البيانات حالياً.
                </td>
              </tr>
            )}

            {/* Error View Banner */}
            {!isLoading && error && (
              <tr>
                <td colSpan="4" className="py-10 text-center text-red-700 font-bold text-sm bg-red-50/50">
                  {error}
                </td>
              </tr>
            )}

            {/* Live Data Stream Layer */}
            {!isLoading && courses.map((course) => (
              <tr key={course.id} className="hover:bg-surface-container-low/30 transition-colors group">
                
                {/* Course Title */}
                <td className="py-4 px-6">
                  <p className="font-display font-bold text-sm text-on-surface leading-normal">
                    {course.title}
                  </p>
                </td>
                
                {/* Price Label (Evaluates your exact Model Fields) */}
                <td className="py-4 px-6">
                  {course.isFree ? (
                    <span className="px-2.5 py-1 bg-primary-fixed text-on-primary-fixed rounded-[4px] text-xs font-bold">
                      مجاني
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-surface-container-high rounded-[4px] text-xs font-mono font-bold text-on-surface-variant">
                      {Number(course.price).toLocaleString('ar-EG')} د.ت
                    </span>
                  )}
                </td>
                
                {/* Localized Time Data */}
                <td className="py-4 px-6">
                  <span className="text-xs font-label text-on-surface-variant/80">
                    {new Date(course.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                </td>
                
                {/* Direct Component Interaction Hook */}
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => handleTogglePublish(course.id, course.published)}
                    className={`px-4 py-1.5 rounded-[4px] font-bold text-xs transition-all border ${
                      course.published 
                        ? 'bg-primary-container text-white border-primary hover:bg-primary' 
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
                    }`}
                  >
                    {course.published ? 'منشور للطلاب' : 'مسودة غامضة'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCoursesList;