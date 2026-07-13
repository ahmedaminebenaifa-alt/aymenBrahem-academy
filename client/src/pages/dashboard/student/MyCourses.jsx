import { useMyEnrollments } from '../../../hooks/useMyEnrollments';
import CourseCard from '../../../components/courses/CourseCard';
import CourseFilterBar from '../../../components/dashboard/student/CourseFilterBar';
import EngravedBackground from '../../../components/dashboard/shared/EngravedBackground';

export default function MyCourses() {
  const {
    courses,
    totalCount,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
  } = useMyEnrollments();

  return (
    <div className="relative min-h-screen">
      {/* خلفية النقش الإسلامي مطابقة للوحة تحكم الطالب */}
      <EngravedBackground color="var(--primary-container)" opacity={0.06} animated={false} />

      {/* حاوية المحتوى بنفس العرض والمسافات */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-up">
        
        <div className="bg-[var(--surface-container-lowest)]/50 rounded-2xl p-4 md:p-6 lg:p-8 shadow-sm border border-[var(--outline-variant)]/20">
          <CourseFilterBar
            title="دوراتي"
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortOption={sortOption}
            onSortChange={setSortOption}
            showViewAll={false}
          />

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-xl bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="max-w-2xl mx-auto mt-12 bg-red-500/10 border-l-4 border-red-500 text-red-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-center gap-3 font-bold mb-3">
                <span className="material-symbols-outlined">warning</span>
                حدث خطأ أثناء جلب البيانات
              </div>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!isLoading && !error && totalCount === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 rounded-xl mt-6 shadow-sm">
              <span className="material-symbols-outlined text-[80px] text-[var(--outline-variant)]/50 mb-6">
                menu_book
              </span>
              <h3 className="text-2xl font-bold font-arabic text-[var(--on-surface)] mb-3">
                لم تسجل في أي دورة بعد
              </h3>
              <p className="text-[var(--on-surface-variant)] font-medium">
                تصفح الدورات المتاحة وابدأ رحلتك التعليمية في طلب العلم.
              </p>
            </div>
          )}

          {!isLoading && !error && totalCount > 0 && courses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 rounded-xl mt-6 shadow-sm">
              <span className="material-symbols-outlined text-[80px] text-[var(--outline-variant)]/50 mb-6">
                search_off
              </span>
              <h3 className="text-2xl font-bold font-arabic text-[var(--on-surface)] mb-3">
                لا توجد دورات مطابقة
              </h3>
              <p className="text-[var(--on-surface-variant)] font-medium">
                حاول تغيير إعدادات الفلترة لرؤية دوراتك.
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-6 px-6 py-2.5 bg-[var(--primary)]/10 text-[var(--primary)] font-bold rounded hover:bg-[var(--primary)] hover:text-white transition-colors"
              >
                عرض جميع دوراتي
              </button>
            </div>
          )}

          {!isLoading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={{ ...course, isEnrolled: true }} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}