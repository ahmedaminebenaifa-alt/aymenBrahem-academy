import React from 'react';
import sheikhPhoto from '../../assets/AymenBrahem.png';

export default function Hero() {
  return (
    <>
      {/* 
        تمت إضافة Keyframes مخصصة داخل المكون مباشرة لضمان عمل الحركات الفاخرة 
        دون الحاجة لتعديل ملف tailwind.config.js 
      */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slow-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 2s; }
        .animate-spin-slow { animation: slow-spin 25s linear infinite; }
        .animate-spin-slow-reverse { animation: slow-spin-reverse 30s linear infinite; }
        
        .animate-entrance {
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
      `}</style>

      <section id="home" className="relative min-h-[85vh] flex items-center overflow-hidden pt-12 pb-20">
        {/* خلفيات إضاءة ناعمة (Ambient Glow) */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[var(--tertiary)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 pattern-overlay pointer-events-none opacity-40" />

        <div className="max-w-[1280px] mx-auto px-6 md:px-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* قسم النصوص */}
          <div className="order-2 md:order-1 text-center md:text-right">
            
            {/* الشارة العلوية */}
            <div className="animate-entrance">
              <span className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[var(--primary)]/10 to-transparent border border-[var(--primary)]/20 text-[var(--primary)] rounded-full font-label text-sm mb-6 backdrop-blur-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                مرحباً بكم في صرح العلم
              </span>
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-[var(--on-surface)] mb-6 leading-tight animate-entrance delay-100">
              أكاديمية أيمن براهم
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--primary)] to-[var(--on-tertiary-container)] inline-block mt-2">
                للعلوم الشرعية واللغة
              </span>
            </h1>

            {/* الوصف */}
            <p className="font-body text-lg text-[var(--on-surface-variant)] mb-10 max-w-xl mx-auto md:mr-0 leading-relaxed animate-entrance delay-200">
              نهجنا تأصيل العلم الشرعي على خطى السلف الصالح، نجمع بين عراقة التراث ودقة المنهج الأكاديمي المعاصر لنبني جيلاً فقيهاً بدينه، فصيحاً بلسانه.
            </p>

            {/* الأزرار */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-entrance delay-300">
              <a
                href="#auth"
                className="relative overflow-hidden group bg-[var(--primary)] text-[var(--on-primary)] px-10 py-4 rounded-xl font-bold text-sm shadow-[0_8px_25px_-8px_var(--primary)] hover:shadow-[0_12px_35px_-10px_var(--primary)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* تأثير اللمعان عند التمرير */}
                <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-[shine_1s_ease-in-out]" />
                <style>{`@keyframes shine { 100% { left: 200%; opacity: 1; } }`}</style>
                سجل الآن
              </a>
              
              <a
                href="#tracks"
                className="group border-2 border-[var(--outline-variant)] text-[var(--on-surface)] px-10 py-4 rounded-xl font-bold text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all duration-300 flex items-center gap-2"
              >
                تصفح المسارات
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
              </a>
            </div>
          </div>

          {/* قسم الصورة والإطارات الزخرفية */}
          <div className="order-1 md:order-2 flex justify-center items-center relative animate-entrance delay-400">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center animate-float">
              
              {/* الإطار الخارجي الدوار */}
              <div className="absolute inset-0 border-[1px] border-[var(--primary)]/30 rounded-full animate-spin-slow border-dashed" />
              
              {/* الإطار الأوسط الدوار بالعكس */}
              <div className="absolute inset-4 border-[2px] border-[var(--on-tertiary-container)]/20 rounded-full animate-spin-slow-reverse" />
              
              {/* الحاوية الرئيسية للصورة */}
              <div className="relative w-[85%] h-[85%] rounded-full overflow-hidden border-8 border-[var(--surface)] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/20 to-transparent z-10 pointer-events-none mix-blend-overlay" />
                <img 
                  src={sheikhPhoto} 
                  alt="الشيخ أيمن براهم" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                />
              </div>

              {/* البطاقة العائمة السفلية (زجاجية) */}
              <div className="absolute -bottom-4 -right-4 lg:-right-10 bg-[var(--surface)]/80 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-[var(--outline-variant)]/40 hidden md:flex items-center gap-4 animate-float-delayed">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--on-tertiary-container)] flex items-center justify-center text-white shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">menu_book</span>
                </div>
                <div>
                  <p className="font-bold text-[var(--on-surface)]">تعلم مؤصل</p>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">منهج علمي رصين</p>
                </div>
              </div>

              {/* بطاقة عائمة صغيرة إضافية (أعلى اليسار) */}
              <div className="absolute top-8 -left-4 lg:-left-8 bg-[var(--surface)]/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[var(--outline-variant)]/40 hidden md:flex items-center gap-3 animate-float">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-[var(--on-surface)]">إجازات علمية</p>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}