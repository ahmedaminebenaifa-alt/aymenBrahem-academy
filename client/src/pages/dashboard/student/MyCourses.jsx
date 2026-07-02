import { useState } from 'react';

export default function MyCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('الكل');

  // Expanded mock data for the dedicated courses page
  const enrolledCourses = [
    {
      id: 1,
      title: 'فقه العبادات - المستوى الأول',
      category: 'الفقه',
      progress: 65,
      totalLessons: 24,
      completedLessons: 15,
      lastAccessed: 'منذ يومين',
      instructor: 'د. أيمن إبراهيم',
      status: 'active' // active, completed
    },
    {
      id: 2,
      title: 'مدخل إلى العقيدة الإسلامية',
      category: 'العقيدة',
      progress: 30,
      totalLessons: 12,
      completedLessons: 4,
      lastAccessed: 'اليوم',
      instructor: 'الشيخ محمد صالح',
      status: 'active'
    },
    {
      id: 3,
      title: 'تفسير قصار السور',
      category: 'القرآن وعلومه',
      progress: 100,
      totalLessons: 10,
      completedLessons: 10,
      lastAccessed: 'منذ أسبوعين',
      instructor: 'د. أحمد محمود',
      status: 'completed'
    },
    {
      id: 4,
      title: 'السيرة النبوية - العهد المكي',
      category: 'السيرة',
      progress: 0,
      totalLessons: 18,
      completedLessons: 0,
      lastAccessed: 'لم تبدأ بعد',
      instructor: 'د. أيمن إبراهيم',
      status: 'active'
    }
  ];

  const categories = ['الكل', 'الفقه', 'العقيدة', 'القرآن وعلومه', 'السيرة', 'مكتملة'];

  // Filter logic combining search, category, and completion status
  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = course.title.includes(searchQuery) || course.instructor.includes(searchQuery);
    const matchesCategory = 
      activeFilter === 'الكل' ? true : 
      activeFilter === 'مكتملة' ? course.status === 'completed' : 
      course.category === activeFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- Page Header --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--outline-variant)]/30 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">menu_book</span>
            دوراتي
          </h1>
          <p className="text-[var(--on-surface-variant)] text-sm">
            تابع تقدمك وواصل رحلتك في طلب العلم من حيث توقفت.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--outline)]">
            search
          </span>
          <input 
            type="text" 
            placeholder="ابحث في دوراتك..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all"
          />
        </div>
      </header>

      {/* --- Filter Pills --- */}
      <section>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                activeFilter === category
                  ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] border-[var(--primary-container)] shadow-sm'
                  : 'bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 hover:bg-[var(--surface-container-low)] hover:border-[var(--outline)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* --- Course Grid --- */}
      <section>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div 
                key={course.id} 
                className="group bg-[var(--surface-container-lowest)] rounded-lg border border-[var(--outline-variant)]/30 border-t-2 border-t-[var(--tertiary)] p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="mb-4 flex justify-between items-start">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    course.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  }`}>
                    {course.status === 'completed' ? 'مكتملة' : course.category}
                  </span>
                  
                  {course.status === 'completed' && (
                    <span className="material-symbols-outlined text-green-600">verified</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[var(--on-surface)] mb-1 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[var(--on-surface-variant)] mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    {course.instructor}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-[var(--outline-variant)]/20">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs text-[var(--on-surface-variant)]">
                      <span className="block mb-1">الدروس المنجزة: {course.completedLessons} من {course.totalLessons}</span>
                      <span className="flex items-center gap-1 text-[10px] text-[var(--outline)]">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        آخر نشاط: {course.lastAccessed}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--on-surface)]">{course.progress}%</span>
                  </div>
                  
                  <div className="w-full bg-[var(--surface-container-high)] rounded-full h-1.5 mb-4 overflow-hidden">
                    <div 
                      className={`${course.status === 'completed' ? 'bg-green-500' : 'bg-[var(--primary)]'} h-1.5 rounded-full transition-all duration-1000`} 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  <button className={`w-full py-2.5 rounded font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 ${
                    course.status === 'completed'
                      ? 'bg-[var(--surface-container-high)] text-[var(--on-surface)] hover:bg-[var(--outline-variant)]/40'
                      : 'bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-container)]'
                  }`}>
                    {course.status === 'completed' ? (
                      <>
                        <span className="material-symbols-outlined text-base">workspace_premium</span>
                        عرض الشهادة
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">play_circle</span>
                        {course.progress === 0 ? 'ابدأ الآن' : 'متابعة التعلم'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--surface-container-lowest)] rounded-xl border border-[var(--outline-variant)]/30 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[var(--surface-container-high)] rounded-full flex items-center justify-center mb-4 text-[var(--outline)]">
              <span className="material-symbols-outlined text-3xl">search_off</span>
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--on-surface)] mb-2">لم نجد أي دورات مطابقة</h3>
            <p className="text-[var(--on-surface-variant)] text-sm">حاول البحث بكلمات مختلفة أو تغيير التصنيف.</p>
          </div>
        )}
      </section>

    </div>
  );
}