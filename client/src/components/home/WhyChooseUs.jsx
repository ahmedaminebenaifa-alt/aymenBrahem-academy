const features = [
  { icon: 'verified_user', title: 'تعليم معتمد', desc: 'مناهج تعليمية رصينة معتمدة ومبنية على أسس أكاديمية متينة.' },
  { icon: 'schedule', title: 'مرونة التعليم', desc: 'تعلم في الوقت الذي يناسبك ومن أي مكان في العالم عبر منصتنا.' },
  { icon: 'support_agent', title: 'إشراف مباشر', desc: 'تواصل مباشر مع الشيخ والمعلمين للحصول على التوجيه المستمر.' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-[var(--primary)] text-[var(--on-primary)]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-right">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="font-display text-2xl font-bold mb-4 text-[var(--primary-fixed)]">لماذا تختار أكاديميتنا؟</h2>
            <p className="text-[var(--on-primary)]/70">نحن نقدم تجربة تعليمية فريدة تجمع بين الجودة والمرونة.</p>
          </div>
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-lg bg-[var(--primary-container)]/50 border border-[var(--outline)]/20">
              <span className="material-symbols-outlined text-4xl text-[var(--on-tertiary-container)] mb-4 block">{f.icon}</span>
              <h4 className="font-display text-lg mb-2">{f.title}</h4>
              <p className="text-[var(--on-primary)]/60 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}