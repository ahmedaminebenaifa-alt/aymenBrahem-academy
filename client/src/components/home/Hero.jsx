import sheikhPhoto from '../../assets/AymenBrahem.png';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[80vh] flex items-center overflow-hidden pt-10">
      <div className="absolute inset-0 pattern-overlay pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="order-2 md:order-1 text-center md:text-right animate-fade-up">
          <span className="inline-block px-4 py-1 bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] rounded-full font-label text-sm mb-6">
            مرحباً بكم في صرح العلم
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--primary)] mb-6 leading-tight">
            أكاديمية أيمن براهم
            <br />
            <span className="text-[var(--on-tertiary-container)]">للعلوم الشرعية واللغة</span>
          </h1>
          <p className="font-body text-lg text-[var(--on-surface-variant)] mb-10 max-w-xl mx-auto md:mr-0 leading-relaxed">
            نهجنا تأصيل العلم الشرعي على خطى السلف الصالح، نجمع بين عراقة التراث ودقة المنهج الأكاديمي المعاصر لنبني جيلاً فقيهاً بدينه، فصيحاً بلسانه.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href="#auth"
              className="bg-[var(--primary)] text-[var(--on-primary)] px-10 py-4 rounded-lg font-label text-sm shadow-lg hover:shadow-xl transition-all"
            >
              سجل الآن
            </a>
            <a
              href="#tracks"
              className="border border-[var(--on-tertiary-container)] text-[var(--on-tertiary-container)] px-10 py-4 rounded-lg font-label text-sm hover:bg-[var(--tertiary-fixed)]/10 transition-all"
            >
              تصفح المسارات
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-center relative animate-fade-up delay-2">
          <div className="relative w-full max-w-md aspect-square rounded-full border-2 border-[var(--on-tertiary-container)]/30 p-4">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--on-tertiary-container)] shadow-2xl">
              <img src={sheikhPhoto} alt="الشيخ أيمن براهم" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[var(--surface-container-lowest)] p-6 rounded-xl shadow-xl border border-[var(--outline-variant)]/30 hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center text-[var(--primary)]">
                  <span className="material-symbols-outlined filled">school</span>
                </div>
                <div>
                  <p className="font-label text-sm text-[var(--primary)]">تعلم مؤصل</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">منهج علمي رصين</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}