import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveSchedule } from '../../../hooks/useLiveSchedule';
import { useSidebar } from '../../../context/SidebarContext'; 

const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTH_NAMES = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const START_HOUR = 8;
const END_HOUR = 23;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR);
const ROW_HEIGHT = 64; 

const SchedulePage = () => {
  const navigate = useNavigate();
  const { sessions, isLoading } = useLiveSchedule();
  const { isOpen } = useSidebar(); 
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const weekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, []);

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
  };

  const getEventsForDate = (date) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.scheduledAt);
      return (
        sessionDate.getDate() === date.getDate() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const calculateTopOffset = (dateObj) => {
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    if (hours < START_HOUR || hours > END_HOUR) return -1;
    const offsetHours = hours - START_HOUR;
    return (offsetHours * ROW_HEIGHT) + ((minutes / 60) * ROW_HEIGHT);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-surface">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
        <p className="text-on-surface-variant font-medium animate-pulse">جاري تحميل الجدول...</p>
      </div>
    );
  }

  return (
    <div 
      dir="rtl" 
      className={`min-h-screen bg-surface p-4 md:py-8 md:pl-8 w-full overflow-hidden transition-[padding] duration-500 ease-[cubic-bezier(0.2,1,0.2,1)] ${
        isOpen ? 'md:pr-[300px]' : 'md:pr-[120px]'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-right">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-primary mb-3 flex items-center justify-center md:justify-start gap-3">
            <span className="material-symbols-outlined text-4xl md:text-5xl">event_note</span>
            جدول الجلسات المباشرة
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg">تصفح مواعيد الدروس المباشرة لهذا الأسبوع وانضم في الوقت المحدد.</p>
        </div>

        {/* Weekly Table Container */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[750px]">
          
          <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container-lowest">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">calendar_month</span>
              <h3 className="font-bold text-lg text-on-surface hidden sm:block">الجدول الأسبوعي</h3>
            </div>
            <div className="px-4 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">date_range</span>
              {weekDates[0].getDate()} {MONTH_NAMES[weekDates[0].getMonth()]} - {weekDates[6].getDate()} {MONTH_NAMES[weekDates[6].getMonth()]} {weekDates[0].getFullYear()}
            </div>
          </div>

          {/* Scrollable Area - Fixed horizontal scrolling */}
          <div className="flex-1 overflow-auto relative scrollbar-hide">
            <div className="min-w-[900px] w-full flex flex-col h-full"> 
              
              {/* Days Header */}
              <div className="sticky top-0 z-30 flex bg-surface-container-lowest border-b border-outline-variant/30 shadow-sm">
                <div className="w-16 shrink-0 border-l border-outline-variant/30 bg-surface-container-low" />
                {weekDates.map((date, i) => {
                  const today = isToday(date);
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 min-w-[120px] p-3 text-center border-l last:border-l-0 border-outline-variant/30 transition-colors ${
                        today ? 'bg-primary text-on-primary rounded-t-lg border-b-2 border-primary-fixed shadow-inner' : 'text-on-surface'
                      }`}
                    >
                      <div className="text-sm font-bold">{DAY_NAMES[date.getDay()]}</div>
                      <div className={`text-xs mt-1 ${today ? 'text-primary-fixed font-medium' : 'text-on-surface-variant'}`}>
                        {date.getDate()} {MONTH_NAMES[date.getMonth()].substring(0, 3)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grid Body */}
              <div className="flex relative isolate flex-1">
                
                <div className="w-16 shrink-0 border-l border-outline-variant/30 bg-surface-container flex flex-col z-20 sticky right-0">
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-[64px] border-b border-outline-variant/30 relative">
                      <span className="absolute -top-2.5 left-0 right-0 text-center text-[11px] font-bold text-on-surface-variant">
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                    </div>
                  ))}
                </div>

                {weekDates.map((date, i) => {
                  const today = isToday(date);
                  return (
                    <div key={i} className={`flex-1 min-w-[120px] border-l last:border-l-0 border-outline-variant/30 relative ${today ? 'bg-surface-container-low' : 'bg-surface-container-lowest'}`}>
                      {HOURS.map((hour) => (
                        <div key={hour} className="h-[64px] border-b border-dashed border-outline-variant/40 opacity-50" />
                      ))}

                      {getEventsForDate(date).map((session) => {
                        const top = calculateTopOffset(new Date(session.scheduledAt));
                        if (top < 0) return null;
                        
                        const isLive = session.status === 'LIVE';

                        return (
                          <div
                            key={session.id}
                            className={`absolute left-1.5 right-1.5 rounded-xl p-2.5 border shadow-sm transition-all overflow-hidden ${
                              isLive 
                                ? 'bg-error text-white border-error z-20 ring-2 ring-error/30' 
                                : 'bg-primary-container text-on-primary-container hover:-translate-y-0.5 hover:shadow-md border-primary/20 hover:bg-primary-fixed z-10'
                            }`}
                            style={{ 
                              top: `${top}px`, 
                              minHeight: isLive ? '100px' : '85px', 
                            }}
                          >
                            <div className="relative z-10 flex flex-col h-full">
                              <div className="text-[11px] flex justify-between items-center mb-1 font-bold opacity-80">
                                <span>
                                  {new Date(session.scheduledAt).toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isLive && <span className="material-symbols-outlined text-[14px] animate-pulse">sensors</span>}
                              </div>
                              
                              <div className="text-xs font-bold leading-tight line-clamp-2 mb-1">
                                {session.title}
                              </div>

                              {!isLive && session.course?.title && (
                                <div className="text-[10px] opacity-70 line-clamp-1 mt-auto font-medium">
                                  {session.course.title}
                                </div>
                              )}

                              {isLive && (
                                <button
                                  onClick={() => navigate('/live')}
                                  className="mt-auto w-full py-1.5 bg-white text-error rounded-lg text-[11px] font-bold shadow-sm hover:bg-surface-container-lowest transition-all flex items-center justify-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[14px]">login</span>
                                  انضم
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {(() => {
                  const topOffset = calculateTopOffset(currentTime);
                  if (topOffset >= 0) {
                    return (
                      <div 
                        className="absolute left-0 right-0 h-0 border-t-2 border-dashed border-primary z-20 pointer-events-none flex items-center"
                        style={{ top: `${topOffset}px` }}
                      >
                        <div className="absolute right-0 w-16 text-center text-[10px] font-bold text-on-primary bg-primary py-0.5 rounded-l-md shadow-sm">
                          {currentTime.toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-primary absolute right-[60px] -translate-y-1/2 ring-2 ring-primary-container"></div>
                      </div>
                    );
                  }
                  return null;
                })()}

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SchedulePage;