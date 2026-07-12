import { useMyEnrollments } from '../../../hooks/useMyEnrollments';
import CourseCard from '../../../components/courses/CourseCard';
import CourseFilterBar from '../../../components/dashboard/student/CourseFilterBar';

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
    <div>
      <CourseFilterBar
        title="دوراتي"
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        showViewAll={false}
      />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 rounded bg-surface-container-low animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl text-error mb-2 block">
            error
          </span>
          {error}
        </div>
      )}

      {!isLoading && !error && totalCount === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-outline mb-3 block">
            menu_book
          </span>
          <p className="text-on-surface-variant font-semibold mb-1">
            لم تسجل في أي دورة بعد
          </p>
          <p className="text-sm text-outline">
            تصفح الدورات المتاحة وابدأ رحلتك التعليمية
          </p>
        </div>
      )}

      {!isLoading && !error && totalCount > 0 && courses.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant">
          لا توجد دورات مطابقة لهذا التصنيف
        </div>
      )}

      {!isLoading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={{ ...course, isEnrolled: true }} />
          ))}
        </div>
      )}
    </div>
  );
}