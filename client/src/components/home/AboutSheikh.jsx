export default function AboutSheikh() {
  const points = [
    'نشر الوعي الشرعي الصحيح المبني على الدليل',
    'إحياء لغة القرآن وتعزيز مهارات التحدث والكتابة',
    'تيسير الوصول للعلماء والمشايخ الموثوقين',
  ];

  return (
    <section id="about" className="py-24 bg-[var(--surface-container-low)]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
          <div className="w-full md:w-1/2 relative">
            <div className="w-full aspect-video rounded-xl bg-[var(--surface-container)] shadow-inner border border-[var(--outline-variant)]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-[var(--primary)]/20">auto_stories</span>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--tertiary-fixed)] rounded-lg -z-10" />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-right">
            <h2 className="font-display text-3xl font-bold text-[var(--primary)] mb-6">
              رؤية الأكاديمية ورسالتها
            </h2>
            <p className="text-[var(--on-surface-variant)] mb-6 leading-loose">
              تأسست أكاديمية أيمن براهم لتكون منارة علمية تهدف إلى تقريب العلوم الشرعية واللغة العربية للراغبين في تعلمها، مع التركيز على المنهجية الصحيحة في التلقي.
            </p>
            <ul className="space-y-4 inline-block text-right">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="material-symbols-outlined filled text-[var(--on-tertiary-container)]">star</span>
                  <span className="text-[var(--on-surface)]">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}