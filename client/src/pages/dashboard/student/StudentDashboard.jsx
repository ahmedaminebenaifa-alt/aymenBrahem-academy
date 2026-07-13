import React, { useState, useMemo } from 'react';
import WelcomeHeader from '../../../components/dashboard/student/WelcomeHeader';
import CourseFilterBar from '../../../components/dashboard/student/CourseFilterBar';
import CourseCard from '../../../components/courses/CourseCard';
import { useAuth } from '../../../context/AuthContext';
import { useStudentCourses } from '../../../hooks/useStudentCourses';
import LiveWidget from '../../../components/live/LiveWidget';
import EngravedBackground from '../../../components/dashboard/shared/EngravedBackground';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { courses, isLoading, error, enrollingCourseId, enrollInCourse, refreshCatalog } = useStudentCourses();

  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const processedCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      if (activeFilter === 'all') return true;
      const courseCategory = course.category?.toLowerCase() || '';
      return courseCategory === activeFilter.toLowerCase();
    });

    filtered = [...filtered].sort((a, b) => {
      if (sortOption === 'alphabetical') return a.title.localeCompare(b.title, 'ar');
      if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

    return filtered;
  }, [courses, activeFilter, sortOption]);

  const enrolledCount = useMemo(
    () => courses.filter((c) => c.isEnrolled).length,
    [courses]
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-10 pb-12">
        {/* Skeleton banner instead of a blank spinner screen — avoids a jarring layout jump once content loads */}
        <div className="h-64 md:h-80 bg-surface-container-lowest border border-outline-variant/30 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-surface-container-lowest border border-outline-variant/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-error/10 border-l-4 border-error text-error p-6 rounded-r-lg shadow-sm">
        <div className="flex items-center gap-3 font-bold mb-3">
          <span className="material-symbols-outlined">warning</span>
          حدث خطأ أثناء جلب البيانات
        </div>
        <p className="text-sm mb-4">{error}</p>
        {refreshCatalog && (
          <button
            onClick={refreshCatalog}
            className="px-4 py-2 bg-error text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <EngravedBackground color="var(--primary-container)" opacity={0.06} animated={false} />

      <div className="relative z-10 w-full space-y-8 pb-12 animate-fade-up">

        {/* 1. Welcome banner */}
        <WelcomeHeader
          studentName={user?.name}
          stats={{ enrolledCount }}
        />

        {/* 2. Live session widget — own visual weight, not squeezed under a leftover grid wrapper */}
        <LiveWidget />

        {/* 3. Courses section */}
        <div className="max-w-7xl mx-auto bg-surface-container-lowest/50 rounded-xl p-1 md:p-4">
          <CourseFilterBar
            title="الدورات المتاحة"
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />

          {processedCourses.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-6">
              {processedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={async (id) => {
                    const result = await enrollInCourse(id);
                    if (!result.success) {
                      alert(result.message);
                    }
                    // Successful enrollment already reflects in `courses` state via the hook —
                    // no need to alert on success, the card's own UI should update instead.
                  }}
                  isEnrolling={enrollingCourseId === course.id}
                />
              ))}
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-surface-container-lowest border border-outline-variant/30 rounded-xl mt-6 shadow-sm">
              <span className="material-symbols-outlined text-[80px] text-outline-variant/50 mb-6">
                search_off
              </span>
              <h3 className="text-2xl font-bold font-arabic text-on-surface mb-3">لا توجد دورات مطابقة</h3>
              <p className="text-on-surface-variant font-medium">
                حاول تغيير إعدادات الفلترة أو استكشف تصنيفات أخرى لطلب العلم.
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-6 px-6 py-2.5 bg-primary/10 text-primary font-bold rounded hover:bg-primary hover:text-on-primary transition-colors"
              >
                عرض جميع الدورات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;