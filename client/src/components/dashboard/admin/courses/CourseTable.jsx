import React from 'react';
import CourseEmptyState from './CourseEmptyState';
import { useNavigate } from 'react-router-dom';

const CourseTable = ({ courses, isLoading, error, onDelete, onTogglePublish, onAddClick }) => {

  const navigate = useNavigate();
  // إذا لم تكن البيانات في حالة تحميل أو خطأ، والمصفوفة فارغة، نعرض شاشة الفراغ المخصصة
  if (!isLoading && !error && courses.length === 0) {
    return <CourseEmptyState onAddClick={onAddClick} />;
  }

  return (
    <div className="bg-surface-container-lowest rounded-[4px] border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant w-5/12">عنوان المادة العلمية</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant">التصنيف</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant">السعر</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant text-center">حالة العرض والطلب</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {isLoading && Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-4/5"></div></td>
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-1/4"></div></td>
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-1/3"></div></td>
                <td className="py-5 px-6"><div className="h-7 bg-outline-variant/20 rounded-[4px] w-24 mx-auto"></div></td>
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-12 mr-auto"></div></td>
              </tr>
            ))}

            {error && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-error font-bold text-sm bg-error-container/10">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && courses.map((course) => (
              <tr key={course.id} className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/5 border border-outline-variant/20 rounded-[4px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xl">auto_stories</span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                        {course.title}
                      </p>
                      <p className="text-xs text-on-surface-variant/60 max-w-xs truncate">
                        {course.description || 'لا يوجد وصف مضاف لهذه المادة.'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-[4px] text-xs font-bold">
                    {course.category || 'عام'}
                  </span>
                </td>
                <td className="py-4 px-6 font-mono font-bold text-xs text-on-surface-variant">
                  {course.isFree ? 'مجاني' : `${Number(course.price).toLocaleString('ar-EG')} ج.م`}
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => onTogglePublish(course.id, course.published)}
                    className={`px-4 py-1.5 rounded-[4px] font-bold text-xs transition-all border ${
                      course.published 
                        ? 'bg-primary text-on-primary border-primary hover:opacity-95' 
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
                    }`}
                  >
                    {course.published ? 'منشور للطلاب' : 'مسودة غامضة'}
                  </button>
                </td>
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/dashboard/admin/courses/${course.id}/edit`)}
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-[4px]"
                      title="تعديل"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => onDelete(course.id)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-[4px]" title="حذف">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;