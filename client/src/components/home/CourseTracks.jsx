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
    <section id="tracks" className="py-24 max-w-[1280px] mx-auto px-6 md:px-16">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl font-bold text-[var(--primary)] mb-4">المسارات التعليمية</h2>
        <p className="text-[var(--on-surface-variant)] max-w-2xl mx-auto">
          اختر مسارك التعليمي وابدأ رحلتك في طلب العلم من خلال برامجنا المتخصصة
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tracks.map((track) => (
          <div
            key={track.title}
            className="bg-[var(--surface-container-lowest)] rounded-xl border-t-4 border-[var(--on-tertiary-container)] shadow-sm hover:shadow-md transition-all p-8 group overflow-hidden relative text-right"
          >
            <div className="absolute -right-10 -top-10 text-9xl text-[var(--primary)]/5 font-bold group-hover:scale-110 transition-transform">
              {track.num}
            </div>
            <div className="w-16 h-16 bg-[var(--primary-fixed)] rounded-lg flex items-center justify-center text-[var(--primary)] mb-6">
              <span className="material-symbols-outlined text-4xl">{track.icon}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-[var(--primary)] mb-4">{track.title}</h3>
            <p className="text-[var(--on-surface-variant)] mb-6">{track.desc}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {track.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-[var(--surface-container)] text-[var(--on-surface-variant)] rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}