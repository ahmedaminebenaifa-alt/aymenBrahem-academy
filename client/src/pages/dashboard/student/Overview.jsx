import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function StudentOverview() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('الكل');

  // Realistic mock data for the Islamic Academy context
  const activeCourses = [
    {
      id: 1,
      title: 'فقه العبادات - المستوى الأول',
      category: 'الفقه',
      progress: 65,
      nextLesson: 'أحكام سجود السهو',
      instructor: 'د. أيمن إبراهيم'
    },
    {
      id: 2,
      title: 'مدخل إلى العقيدة الإسلامية',
      category: 'العقيدة',
      progress: 30,
      nextLesson: 'توحيد الألوهية',
      instructor: 'الشيخ محمد صالح'
    },
    {
      id: 3,
      title: 'تفسير قصار السور',
      category: 'القرآن وعلومه',
      progress: 0,
      nextLesson: 'مقدمة في علم التفسير',
      instructor: 'د. أحمد محمود'
    }
  ];

  const filters = ['الكل', 'الفقه', 'العقيدة', 'القرآن وعلومه', 'السيرة'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- Welcome Section --- */}
      <section className="bg-[var(--surface-container-lowest)] p-6 md:p-8 rounded-xl border border-[var(--outline-variant)]/30 shadow-sm relative overflow-hidden">
        {/* Subtle geometric background decoration */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full -translate-x-10 -translate-y-10 blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--primary)] mb-2">
            مرحباً بك، {user?.name?.split(' ')[0] || 'يا طالب العلم'}
          </h1>
          <p className="text-[var(--on-surface-variant)] text-sm md:text-base">
            "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ". نرجو لك رحلة مباركة.
          </p>
        </div>
      </section>

      {/* --- Filter Pills Section --- */}
      <section>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                activeFilter === filter
                  ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] border-[var(--primary-container)]'
                  : 'bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 hover:bg-[var(--surface-container-low)] hover:border-[var(--outline)]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* --- Course Cards Grid --- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-[var(--on-surface)]">
            مساقتك الحالية
          </h2>
          <a href="/dashboard/student/courses" className="text-[var(--primary)] text-sm font-bold hover:underline">
            عرض الكل
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCourses
            .filter(course => activeFilter === 'الكل' || course.category === activeFilter)
            .map(course => (
              <div 
                key={course.id} 
                className="group bg-[var(--surface-container-lowest)] rounded-lg border border-[var(--outline-variant)]/30 border-t-2 border-t-[var(--tertiary)] p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Category Chip (Light Green with Green Text per design spec) */}
                <div className="mb-4 flex justify-between items-start">
                  <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 py-1 rounded text-xs font-bold">
                    {course.category}
                  </span>
                  <span className="material-symbols-outlined text-[var(--outline)] text-lg">
                    bookmark_border
                  </span>
                </div>

                {/* Course Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[var(--on-surface)] mb-1 group-hover:text-[var(--primary)] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[var(--on-surface-variant)] mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    {course.instructor}
                  </p>
                </div>

                {/* Progress & Action */}
                <div className="mt-4 pt-4 border-t border-[var(--outline-variant)]/20">
                  <div className="flex justify-between text-xs text-[var(--on-surface-variant)] mb-2">
                    <span>الدرس القادم: <strong className="text-[var(--on-surface)]">{course.nextLesson}</strong></span>
                    <span>{course.progress}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[var(--surface-container-high)] rounded-full h-1.5 mb-4 overflow-hidden">
                    <div 
                      className="bg-[var(--primary)] h-1.5 rounded-full transition-all duration-1000" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  {/* Primary Action Button */}
                  <button className="w-full bg-[var(--primary)] text-[var(--on-primary)] py-2 rounded font-bold text-sm hover:bg-[var(--primary-container)] transition-colors shadow-sm">
                    متابعة التعلم
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

    </div>
  );
}