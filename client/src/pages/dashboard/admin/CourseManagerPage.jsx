import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../../hooks/useCourses';

// 💡 الاستيراد من المسار الصحيح المخصص والمحكم للمكونات الفرعية للأدمن
import CourseStatsGrid from '../../../components/dashboard/admin/courses/CourseStatsGrid';
import CourseFilters from '../../../components/dashboard/admin/courses/CourseFilters';
import CourseTable from '../../../components/dashboard/admin/courses/CourseTable';

const CourseManagerPage = () => {
  const navigate = useNavigate();

  // استدعاء البيانات والتحكم والفلترة الكاملة من الهوك الرئيسي
  const {
    courses,
    isLoading,
    error,
    stats,
    activeFilter,
    setActiveFilter,
    deleteCourse,
    togglePublish,
    togglingId,
  } = useCourses();

  const handleAddCourseClick = () => {
    navigate('/dashboard/admin/courses/create');
  };

  return (
    <div className="min-h-screen bg-surface p-8 rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* رأس الصفحة الفاخر بتأثير تذهيب خفيف */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/30 pb-6 mb-8 gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-primary mb-1">
              أكاديمية إدارة المناهج والدروس
            </h2>
            <p className="text-on-surface-variant text-xs font-label">
              مراجعة المحتوى الأكاديمي، تتبع حالة النشر الفوري، وإضافة المواد العلمية للأكاديمية.
            </p>
          </div>
          
          <button
            onClick={handleAddCourseClick}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-[4px] font-bold text-xs shadow-md shadow-primary/10 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            إنشاء درس جديد
          </button>
        </div>

        {/* 1. شبكة البطاقات الإحصائية المستقلة */}
        <CourseStatsGrid stats={stats} isLoading={isLoading} />

        {/* 2. شريط الفلاتر المتقدم التفاعلي */}
        <CourseFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* 3. جدول عرض البيانات الفعلي (يتضمن معالجة التحميل والخطأ والشاشة الفارغة تلقائياً) */}
        <CourseTable 
          courses={courses} 
          isLoading={isLoading} 
          error={error} 
          onDelete={deleteCourse}
          onTogglePublish={togglePublish}
          togglingId={togglingId}
          onAddClick={handleAddCourseClick}
        />

      </div>
    </div>
  );
};

export default CourseManagerPage;