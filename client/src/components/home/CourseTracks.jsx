import React from 'react';

const tracks = [
  {
    num: '١',
    icon: 'menu_book',
    title: 'القرآن الكريم',
    desc: 'حفظ ومراجعة وتجويد وتفسير آيات الذكر الحكيم بأعلى معايير الدقة.',
    tags: ['حفظ', 'تجويد', 'تفسير'],
  },
  {
    num: '٢',
    icon: 'translate',
    title: 'اللغة العربية',
    desc: 'قواعد النحو والصرف والبلاغة والأدب لتمكين الطالب من فهم النصوص العربية.',
    tags: ['نحو', 'صرف', 'أدب'],
  },
  {
    num: '٣',
    icon: 'balance',
    title: 'العلوم الشرعية',
    desc: 'الفقه والعقيدة والحديث وأصول الفقه لبناء ملكة شرعية قوية لدى الطالب.',
    tags: ['فقه', 'عقيدة', 'حديث'],
  },
];

export default function CourseTracks() {
  return (
    <>
      <style>{`
        @keyframes fadeUpTrack {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-fade-up-track {
          animation: fadeUpTrack 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-icon-float {
          animation: iconFloat 4s ease-in-out infinite;
        }
      `}</style>

      <section id="tracks" className="relative py-32 bg-[var(--surface)] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[var(--on-tertiary-container)]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
          <div className="text-center mb-20 animate-fade-up-track">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[var(--primary)]/10 to-transparent border border-[var(--primary)]/20 rounded-full mb-6 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[18px] text-[var(--primary)]">route</span>
              <span className="font-label text-sm text-[var(--primary)] font-bold">برامجنا المتخصصة</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--on-surface)] mb-6">
              المسارات{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--primary)] to-[var(--on-tertiary-container)]">
                التعليمية
              </span>
            </h2>
            <p className="text-[var(--on-surface-variant)] text-lg max-w-2xl mx-auto leading-relaxed">
              اختر مسارك التعليمي وابدأ رحلتك في طلب العلم من خلال برامجنا المتخصصة المصممة بعناية لبناء تأصيل علمي متين
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {tracks.map((track, index) => (
              <div
                key={track.title}
                className="animate-fade-up-track group relative bg-[var(--surface-container-lowest)]/80 backdrop-blur-xl rounded-3xl p-8 border border-[var(--outline-variant)]/30 shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden text-right flex flex-col h-full"
                style={{ animationDelay: `${index * 150 + 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 to-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-[var(--on-tertiary-container)] to-[var(--primary)] transform scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500" />

                <div className="absolute -right-8 -top-8 text-[180px] leading-none font-black text-[var(--primary)]/5 group-hover:text-[var(--primary)]/10 group-hover:-translate-x-4 group-hover:translate-y-4 transition-all duration-700 select-none z-0">
                  {track.num}
                </div>

                <div className="relative z-10 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary-fixed)] to-[var(--primary)]/20 rounded-2xl flex items-center justify-center text-[var(--primary)] mb-8 shadow-inner animate-icon-float group-hover:scale-110 transition-transform duration-500 border border-[var(--primary)]/20">
                    <span className="material-symbols-outlined text-4xl">{track.icon}</span>
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-[var(--on-surface)] mb-4 group-hover:text-[var(--primary)] transition-colors duration-300">
                    {track.title}
                  </h3>
                  
                  <p className="text-[var(--on-surface-variant)] leading-relaxed mb-8 group-hover:text-[var(--on-surface)] transition-colors duration-300">
                    {track.desc}
                  </p>
                </div>

                <div className="relative z-10 mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {track.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-4 py-1.5 bg-[var(--surface-container)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] text-[var(--on-surface-variant)] rounded-full text-xs font-bold transition-colors duration-300 border border-transparent group-hover:border-[var(--primary)]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 cursor-pointer w-fit">
                    <span>استكشف المسار</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}