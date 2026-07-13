import React from 'react';
import aboutPic from '../../assets/aboutPic.jpg';

export default function AboutSheikh() {
  const points = [
    'نشر الوعي الشرعي الصحيح المبني على الدليل',
    'إحياء لغة القرآن وتعزيز مهارات التحدث والكتابة',
    'تيسير الوصول للعلماء والمشايخ الموثوقين',
  ];

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatMedium {
          0%, 100 { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-slide-right { animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-left { animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float-medium { animation: floatMedium 5s ease-in-out infinite; }
      `}</style>

      <section id="about" className="relative py-24 bg-[var(--surface-container-low)] overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[var(--primary)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--on-tertiary-container)]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
          <div className="flex flex-col md:flex-row-reverse gap-16 lg:gap-20 items-center">
            
            <div className="w-full md:w-1/2 relative animate-slide-left opacity-0" style={{ animationDelay: '200ms' }}>
              <div className="relative w-full aspect-[4/5] max-h-[560px] rounded-2xl bg-gradient-to-br from-[var(--surface-container)] to-[var(--surface-container-high)] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-[var(--outline-variant)]/30 group overflow-hidden">
                <img 
                  src={aboutPic} 
                  alt="أكاديمية الشيخ أيمن براهم" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--on-tertiary-container)]/10 rounded-full blur-2xl" />
              </div>
              
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl border border-[var(--primary)]/20 bg-[var(--surface)]/60 backdrop-blur-md shadow-lg animate-float-medium -z-10" />

              <div className="absolute -bottom-6 -left-4 bg-[var(--surface)]/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-[var(--outline-variant)]/30 animate-float-medium flex items-center gap-4 z-20" style={{ animationDelay: '1s' }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--on-tertiary-container)] to-[var(--primary)] flex items-center justify-center text-white shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">mosque</span>
                </div>
                <div>
                  <p className="font-bold text-[var(--on-surface)] text-sm md:text-base">منارة علمية</p>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">منهجية صحيحة في التلقي</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 text-center md:text-right animate-slide-right opacity-0" style={{ animationDelay: '100ms' }}>
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[var(--primary)]/10 to-transparent border border-[var(--primary)]/20 rounded-full mb-8 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[18px] text-[var(--primary)]">info</span>
                <span className="font-label text-sm text-[var(--primary)] font-bold">عن الأكاديمية</span>
              </div>
              
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--on-surface)] mb-6 leading-tight">
                رؤية الأكاديمية ورسالتها
                <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-l from-[var(--primary)] to-[var(--on-tertiary-container)]">
                  نحو علم نافع وعمل صالح
                </span>
              </h2>
              
              <p className="text-[var(--on-surface-variant)] mb-10 leading-relaxed text-lg max-w-xl mx-auto md:mr-0">
                تأسست أكاديمية أيمن براهم لتكون منارة علمية تهدف إلى تقريب العلوم الشرعية واللغة العربية للراغبين في تعلمها، مع التركيز على المنهجية الصحيحة في التلقي.
              </p>
              
              <div className="space-y-4 inline-block text-right w-full">
                {points.map((point, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-container-lowest)]/50 hover:bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/20 hover:border-[var(--primary)]/40 transition-all duration-300 hover:shadow-lg cursor-default transform hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--primary)] transition-all duration-300 shrink-0">
                      <span className="material-symbols-outlined filled text-[var(--primary)] group-hover:text-white text-[20px] transition-colors">
                        verified
                      </span>
                    </div>
                    <span className="text-[var(--on-surface)] font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}