import React from 'react';
import { useNavigate } from 'react-router-dom';

const AYAH = {
  arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
  reference: 'سورة طه، الآية ١١٤',
};

const WelcomeHeader = ({
  studentName = 'طالب العلم',
  lastLesson = null,
  stats = null,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    if (lastLesson?.link) {
      navigate(lastLesson.link);
    } else {
      navigate('/dashboard/student/courses');
    }
  };

  return (
    <div className="relative p-[1px] bg-gradient-to-b from-transparent via-[#d4af37]/5 to-transparent transition-all duration-300 ease-in-out">      
      {/* 
        Increased padding drastically (pb-48 md:pb-64) to give the gradient a massive 
        canvas to fade out smoothly over a long distance.
      */}
      <section className="relative overflow-hidden px-8 pt-12 pb-48 md:px-12 md:pt-16 md:pb-64 transition-all">
        
        {/* ISOLATED BACKGROUND LAYER WITH MULTI-STOP EASED MASK */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#023321]"
          style={{
            /* 
               Multi-stop gradient: Instead of a straight line, this curves the opacity down slowly.
               Solid until 55%, then eases out gradually so there is no noticeable "edge" 
            */
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0.1) 95%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0.1) 95%, transparent 100%)'
          }}
        >
          {/* Subtle glow / light blur matching your reference style */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

          {/* Engravings */}
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.12] animate-ambient-pan">
            <defs>
              <filter id="carved-depth" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor="#00140d" floodOpacity="0.8" />
                <feDropShadow dx="-0.5" dy="-0.5" stdDeviation="0.5" floodColor="#ffffff" floodOpacity="0.1" />
              </filter>

              <pattern id="alhambra-engraving" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
                <g stroke="#d4af37" fill="none" filter="url(#carved-depth)">
                  <path strokeWidth="1" d="M60 0 L75 25 L100 25 L85 45 L95 70 L60 55 L25 70 L35 45 L20 25 L45 25 Z" opacity="0.6"/>
                  <path strokeWidth="1.5" d="M60 120 L75 95 L100 95 L85 75 L95 50 L60 65 L25 50 L35 75 L20 95 L45 95 Z" opacity="0.6"/>
                  <path strokeWidth="0.5" d="M0 60 L25 75 L25 100 L45 85 L70 95 L55 60 L70 25 L45 35 L25 20 L25 45 Z" opacity="0.4"/>
                  <path strokeWidth="0.5" d="M120 60 L95 75 L95 100 L75 85 L50 95 L65 60 L50 25 L75 35 L95 20 L95 45 Z" opacity="0.4"/>
                  <circle cx="60" cy="60" r="22" strokeWidth="0.75" opacity="0.5" />
                  <circle cx="60" cy="60" r="14" strokeWidth="1" />
                  <path strokeWidth="0.5" d="M46 46 L74 74 M46 74 L74 46 M60 38 L60 82 M38 60 L82 60" opacity="0.4"/>
                  <path strokeWidth="0.5" d="M30 0 L0 30 L0 90 L30 120 L90 120 L120 90 L120 30 L90 0 Z" opacity="0.3" strokeDasharray="4 2"/>
                </g>
              </pattern>
            </defs>
            <rect width="200%" height="200%" fill="url(#alhambra-engraving)" transform="translate(-50, -50)" />
          </svg>
        </div>

        {/* CONTENT LAYER: Untouched by the mask, stays 100% solid */}
        <div className="relative z-10 flex flex-col items-center text-center gap-10">
          
          {/* Welcome Banner */}
          <div className="w-full flex justify-between items-center animate-fade-up-cinematic">
            {loading ? (
              <div className="h-6 w-32 bg-[#02422a]/50 rounded animate-pulse" />
            ) : (
              <span className="text-[#a4ceb5] font-medium text-sm md:text-base tracking-wide flex items-center gap-2 px-3 py-1">
                <svg className="w-4 h-4 text-[#c6a15a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                أهلاً بك، {studentName}
              </span>
            )}
          </div>

          {/* Central Ayah Presentation */}
          <div className="relative w-full max-w-4xl py-10 px-8 mx-auto transition-[max-width] duration-300 ease-in-out animate-fade-up-cinematic delay-1 flex flex-col items-center justify-center group">            
            {/* Corner Engravings */}
            <svg className="absolute top-0 right-0 w-16 h-16 text-[#d4af37] opacity-45" viewBox="0 0 100 100" fill="none" filter="url(#carved-depth)">
              <path d="M100 0 H0 Q 40 0 50 50 Q 50 90 100 100 V0 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1"/>
              <path d="M90 10 Q 50 10 50 50 Q 50 80 90 90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
              <circle cx="75" cy="25" r="3" fill="currentColor" />
            </svg>
            <svg className="absolute top-0 left-0 w-16 h-16 text-[#d4af37] opacity-45 -scale-x-100" viewBox="0 0 100 100" fill="none" filter="url(#carved-depth)">
              <path d="M100 0 H0 Q 40 0 50 50 Q 50 90 100 100 V0 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1"/>
              <path d="M90 10 Q 50 10 50 50 Q 50 80 90 90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
              <circle cx="75" cy="25" r="3" fill="currentColor" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-16 h-16 text-[#d4af37] opacity-45 -scale-y-100" viewBox="0 0 100 100" fill="none" filter="url(#carved-depth)">
              <path d="M100 0 H0 Q 40 0 50 50 Q 50 90 100 100 V0 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1"/>
              <path d="M90 10 Q 50 10 50 50 Q 50 80 90 90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
              <circle cx="75" cy="25" r="3" fill="currentColor" />
            </svg>
            <svg className="absolute bottom-0 left-0 w-16 h-16 text-[#d4af37] opacity-45 -scale-x-100 -scale-y-100" viewBox="0 0 100 100" fill="none" filter="url(#carved-depth)">
              <path d="M100 0 H0 Q 40 0 50 50 Q 50 90 100 100 V0 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1"/>
              <path d="M90 10 Q 50 10 50 50 Q 50 80 90 90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
              <circle cx="75" cy="25" r="3" fill="currentColor" />
            </svg>

            <h1 className="font-quran text-4xl md:text-5xl lg:text-6xl text-[#e8dbb7] leading-[1.6] md:leading-[1.8] drop-shadow-sm">
              {AYAH.arabic}
            </h1>
            <div className="flex items-center gap-4 mt-8 opacity-60">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <p className="text-[#a4ceb5] text-sm font-medium tracking-widest">
                {AYAH.reference}
              </p>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
          </div>

          {/* Footer: Stats & CTA */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#d4af37]/10 animate-fade-up-cinematic delay-2">
            
            <div className="flex flex-wrap justify-center gap-3">
              {stats && !loading && (
                <>
                  {typeof stats.streakDays === 'number' && stats.streakDays > 0 && (
                    <div className="flex items-center gap-2 text-[#d8c386] px-3 py-1.5 rounded-lg text-sm font-medium border border-[#d8c386]/20 bg-[#023321]/80 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-base">local_fire_department</span>
                      {stats.streakDays} يوم متتالي
                    </div>
                  )}
                  {typeof stats.enrolledCount === 'number' && (
                    <div className="flex items-center gap-2 text-[#a4ceb5] px-3 py-1.5 rounded-lg text-sm font-medium border border-[#a4ceb5]/20 bg-[#023321]/80 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-base">menu_book</span>
                      {stats.enrolledCount} دورة
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
              <button
                onClick={handleCTAClick}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#c6a15a] text-[#012d1d] transition-colors duration-300 px-7 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {lastLesson ? 'play_circle' : 'explore'}
                </span>
                <span>
                  {lastLesson ? 'متابعة آخر درس' : 'استكشف الدورات'}
                </span>
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default WelcomeHeader;