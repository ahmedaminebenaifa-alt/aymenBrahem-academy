import { useParams, useNavigate } from 'react-router-dom';
import { usePublicCourseOverview } from '../hooks/usePublicCourseOverview';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getCategoryLabel } from '../constants/courseCategories';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CourseLandingPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { course, isLoading, error } = usePublicCourseOverview(courseId);

  useDocumentMeta(
    course ? `${course.title} | أكاديمية الحكمة` : undefined,
    course?.description?.slice(0, 160)
  );

  const resolvedImageUrl = course?.coverImage
    ? course.coverImage.startsWith('http')
      ? course.coverImage
      : `${API_BASE_URL}${course.coverImage}`
    : null;

  const totalThemes = course?.subCourses?.reduce((sum, sc) => sum + sc.themes.length, 0) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <span className="material-symbols-outlined text-5xl text-outline-variant">search_off</span>
        <h1 className="text-xl font-bold text-on-surface font-arabic">{error || 'الدورة غير متاحة'}</h1>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2 bg-primary text-on-primary rounded font-bold text-sm"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="relative bg-[#063c25] text-white">
        {resolvedImageUrl && (
          <div className="absolute inset-0">
            <img src={resolvedImageUrl} alt="" className="w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#063c25] to-[#063c25]/70" />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
          {course.category && (
            <span className="inline-block bg-[#d4af37]/20 text-[#d4af37] px-3 py-1 rounded text-xs font-bold mb-4 border border-[#d4af37]/30">
              {getCategoryLabel(course.category)}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold font-arabic mb-4 leading-tight">{course.title}</h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4 mt-8 text-sm text-white/70">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#d4af37]">menu_book</span>
              {course.subCourses.length} وحدة
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#d4af37]">topic</span>
              {totalThemes} موضوعاً
            </div>
            {course.resourcesCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#d4af37]">picture_as_pdf</span>
                {course.resourcesCount} مصادر
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body: syllabus + enroll CTA */}
      <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold font-arabic text-on-surface mb-6">محتوى الدورة</h2>
          <div className="space-y-3">
            {course.subCourses.length === 0 && (
              <p className="text-sm text-on-surface-variant">سيتم إضافة المحتوى قريباً.</p>
            )}
            {course.subCourses.map((sc, i) => (
              <div key={sc.id} className="border border-outline-variant/30 rounded-lg overflow-hidden">
                <div className="bg-surface-container-low px-4 py-3 font-bold text-sm font-arabic text-on-surface flex items-center gap-2">
                  <span className="text-primary">{i + 1}.</span>
                  {sc.title}
                </div>
                {sc.themes.length > 0 && (
                  <ul className="divide-y divide-outline-variant/10">
                    {sc.themes.map((theme) => (
                      <li key={theme.id} className="px-4 py-2.5 text-sm text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
                        {theme.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="sticky top-6 bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-6 shadow-sm">
            <p className="text-2xl font-bold text-on-surface mb-1">
              {course.isFree ? 'مجانية' : `${Number(course.price).toLocaleString('ar-EG')} د.ت`}
            </p>
            <p className="text-xs text-on-surface-variant mb-6">
              {course.isFree ? 'التسجيل مجاني بالكامل' : 'دفعة واحدة، وصول دائم'}
            </p>
            <button
              onClick={() => navigate('/login', { state: { redirectTo: `/dashboard/student/courses/${course.id}/structure` } })}
              className="w-full py-3 bg-primary text-on-primary rounded font-bold text-sm hover:opacity-90 transition-all"
            >
              {course.isFree ? 'سجل مجاناً الآن' : 'اشترك الآن'}
            </button>
            <p className="text-[11px] text-on-surface-variant text-center mt-3">
              يتطلب إنشاء حساب للوصول إلى محتوى الدروس
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLandingPage;