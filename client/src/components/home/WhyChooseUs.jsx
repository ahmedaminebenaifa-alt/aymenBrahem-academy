import React from 'react';

const features = [
  { icon: 'verified_user', title: 'تعليم معتمد', desc: 'مناهج تعليمية رصينة معتمدة ومبنية على أسس أكاديمية متينة.' },
  { icon: 'schedule', title: 'مرونة التعليم', desc: 'تعلم في الوقت الذي يناسبك ومن أي مكان في العالم عبر منصتنا.' },
  { icon: 'support_agent', title: 'إشراف مباشر', desc: 'تواصل مباشر مع الشيخ والمعلمين للحصول على التوجيه المستمر.' },
];

export default function WhyChooseUs() {
  return (
    <>
      <style>{`
        @keyframes fadeUpFeature {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.0); }
          50% { box-shadow: 0 0 20px 0 rgba(255, 255, 255, 0.1); }
        }
        .animate-fade-up-feature {
          animation: fadeUpFeature 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <section className="relative py-32 bg-[var(--primary)] text-white overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--primary-fixed)]/10 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/4" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-center md:text-right items-center">
            
            <div className="col-span-1 md:col-span-2 lg:col-span-1 animate-fade-up-feature" style={{ animationDelay: '100ms' }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-6 backdrop-blur-md">
                <span className="material-symbols-outlined text-[16px] text-[var(--primary-fixed)]">star</span>
                <span className="font-label text-sm text-[var(--primary-fixed)] font-bold">تميز معنا</span>
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6 text-white leading-tight">
                لماذا تختار <span className="text-[var(--primary-fixed)]">أكاديميتنا؟</span>
              </h2>
              <p className="text-white/70 leading-relaxed text-lg mb-8 lg:mb-0">
                نحن نقدم تجربة تعليمية فريدة تجمع بين أصالة المنهج، جودة التلقي، ومرونة التقنية الحديثة.
              </p>
            </div>

            {features.map((f, index) => (
              <div 
                key={f.title} 
                className="animate-fade-up-feature group relative p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden hover:-translate-y-2 h-full flex flex-col"
                style={{ animationDelay: `${index * 150 + 250}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 transform scale-0 group-hover:scale-100 transition-transform duration-700 origin-top-right" />
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 mb-8 group-hover:scale-110 group-hover:border-[var(--primary-fixed)]/50 transition-all duration-500 shadow-lg relative">
                  <div className="absolute inset-0 rounded-2xl bg-[var(--primary-fixed)]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="material-symbols-outlined text-4xl text-[var(--primary-fixed)] relative z-10">
                    {f.icon}
                  </span>
                </div>
                
                <h4 className="font-display text-xl font-bold mb-4 text-white group-hover:text-[var(--primary-fixed)] transition-colors duration-300">
                  {f.title}
                </h4>
                
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300 flex-1">
                  {f.desc}
                </p>

                <div className="w-8 h-1 bg-white/20 rounded-full mt-8 group-hover:w-16 group-hover:bg-[var(--primary-fixed)] transition-all duration-500" />
              </div>
            ))}

          </div>
        </div>
      </section>
    </>
  );
}