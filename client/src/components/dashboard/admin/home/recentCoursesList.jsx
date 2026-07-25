import React from 'react';
import { useCourses } from '../../../../hooks/useCourses';

const RecentCoursesList = () => {
  const { courses, isLoading, error, togglePublish, togglingId } = useCourses();

  // Dashboard only needs a preview — most recent 5
  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[4px] shadow-sm overflow-hidden flex flex-col">
      
      <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface/50">
        <h3 className="font-display font-bold text-xl text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">local_library</span>
          الدورات التعليمية الحالية
        </h3>
        <button className="text-sm font-bold text-primary hover:underline transition-all font-label">
          View All &larr;
        </button>
      </div>

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
            {isLoading && Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-4/5"></div></td>
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-1/4"></div></td>
                <td className="py-5 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-1/3"></div></td>
                <td className="py-5 px-6 flex justify-center"><div className="h-7 bg-outline-variant/20 rounded-[4px] w-24"></div></td>
              </tr>
            ))}

            {!isLoading && !error && recentCourses.length === 0 && (
              <tr>
                <td colSpan="4" className="py-14 text-center text-on-surface-variant/70 font-sans text-sm">
                  <span className="material-symbols-outlined text-4xl opacity-30 mb-2 block">inventory_2</span>
                  لا توجد دورات متوفرة في قاعدة البيانات حالياً.
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan="4" className="py-10 text-center text-error font-bold text-sm bg-error-container/10">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && recentCourses.map((course) => {
              const isToggling = togglingId === course.id;
              return (
                <tr key={course.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-display font-bold text-sm text-on-surface leading-normal">
                      {course.title}
                    </p>
                  </td>
                  
                  <td className="py-4 px-6">
                    {course.isFree ? (
                      <span className="px-2.5 py-1 bg-primary-fixed text-on-primary-fixed rounded-[4px] text-xs font-bold">
                        مجاني
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-surface-container-high rounded-[4px] text-xs font-mono font-bold text-on-surface-variant">
                        {Number(course.price).toLocaleString('en-US')} د.ت
                      </span>
                    )}
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className="text-xs font-label text-on-surface-variant/80">
                      {new Date(course.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => togglePublish(course.id, course.published)}
                      disabled={isToggling}
                      className={`px-4 py-1.5 rounded-[4px] font-bold text-xs transition-all border inline-flex items-center gap-1.5 disabled:opacity-60 ${
                        course.published 
                          ? 'bg-primary-container text-on-primary-container border-primary hover:bg-primary hover:text-on-primary' 
                          : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
                      }`}
                    >
                      {isToggling && (
                        <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                      )}
                      {course.published ? 'منشور للطلاب' : 'مسودة غامضة'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCoursesList;