import React, { useState, useEffect, useMemo } from 'react';
import { useLiveSchedule } from '../../../../hooks/useLiveSchedule';

const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTH_NAMES = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const START_HOUR = 8; 
const END_HOUR = 23;  
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR);
const ROW_HEIGHT = 64; 

const AdminScheduleTable = () => {
  const { sessions, startSession, cancelSession, isStarting } = useLiveSchedule();
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

  const handleStart = async (id) => {
    if (!window.confirm('بدء هذه الجلسة الآن؟')) return;
    await startSession(id);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('إلغاء هذه الجلسة المجدولة؟')) return;
    await cancelSession(id);
  };

  const calculateTopOffset = (dateObj) => {
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    if (hours < START_HOUR || hours > END_HOUR) return -1;
    const offsetHours = hours - START_HOUR;
    return (offsetHours * ROW_HEIGHT) + ((minutes / 60) * ROW_HEIGHT);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[700px] w-full">
      
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container-lowest">
        <div className="flex items-center gap-4">
          <h3 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_view_week</span>
            الجدول الأسبوعي
          </h3>
          <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold text-on-surface-variant border border-outline-variant/30">
            هذا الأسبوع
          </span>
        </div>
        <div className="text-sm font-bold text-on-surface-variant">
          {weekDates[0].getDate()} {MONTH_NAMES[weekDates[0].getMonth()]} - {weekDates[6].getDate()} {MONTH_NAMES[weekDates[6].getMonth()]} {weekDates[0].getFullYear()}
        </div>
      </div>

      {/* Grid Container with Horizontal Scroll fix */}
      <div className="flex-1 overflow-auto relative scrollbar-hide">
        <div className="min-w-[900px] w-full flex flex-col h-full"> {/* Ensures minimum width to prevent squishing */}
          
          {/* Days Header */}
          <div className="sticky top-0 z-30 flex bg-surface-container-lowest border-b border-outline-variant/40 shadow-sm">
            <div className="w-16 shrink-0 border-l border-outline-variant/30 bg-surface-container-low" />
            
            {weekDates.map((date, i) => {
              const today = isToday(date);
              return (
                <div 
                  key={i} 
                  className={`flex-1 min-w-[120px] p-3 text-center border-l last:border-l-0 border-outline-variant/30 transition-colors ${
                    today ? 'bg-primary text-on-primary rounded-t-lg' : 'bg-surface-container-lowest text-on-surface'
                  }`}
                >
                  <div className="text-sm font-bold">{DAY_NAMES[date.getDay()]}</div>
                  <div className={`text-xs mt-1 ${today ? 'text-primary-fixed opacity-90' : 'text-on-surface-variant'}`}>
                    {date.getDate()} {MONTH_NAMES[date.getMonth()].substring(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid Body */}
          <div className="flex relative isolate flex-1">
            
            {/* Time Labels Column */}
            <div className="w-16 shrink-0 border-l border-outline-variant/30 bg-surface-container flex flex-col z-20 sticky right-0">
              {HOURS.map((hour) => (
                <div key={hour} className="h-[64px] border-b border-outline-variant/30 relative">
                  <span className="absolute -top-2.5 left-0 right-0 text-center text-[11px] font-bold text-on-surface-variant">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {weekDates.map((date, i) => {
               const today = isToday(date);
               return (
                <div key={i} className={`flex-1 min-w-[120px] border-l last:border-l-0 border-outline-variant/30 relative ${today ? 'bg-surface-container-low' : 'bg-surface-container-lowest'}`}>
                  
                  {/* Background grid lines */}
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-[64px] border-b border-dashed border-outline-variant/40 opacity-50" />
                  ))}

                  {/* Sessions */}
                  {getEventsForDate(date).map((session) => {
                    const top = calculateTopOffset(new Date(session.scheduledAt));
                    if (top < 0) return null; 
                    
                    const isLive = session.status === 'LIVE';

                    return (
                      <div
                        key={session.id}
                        className={`absolute left-1 right-1 rounded-lg p-2 shadow-sm group hover:z-30 transition-all border ${
                          isLive 
                            ? 'bg-error text-white border-error z-20' 
                            : 'bg-primary-container text-on-primary-container border-primary/20 hover:bg-primary-fixed hover:text-on-primary-fixed z-10'
                        }`}
                        style={{ top: `${top}px`, minHeight: '60px' }}
                      >
                        <div className="text-xs font-bold leading-tight line-clamp-2">
                          {session.title}
                        </div>
                        <div className="text-[10px] mt-1 flex justify-between items-center opacity-80">
                          <span>
                            {new Date(session.scheduledAt).toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isLive && <span className="material-symbols-outlined text-[14px] animate-pulse">sensors</span>}
                        </div>

                        {/* Hover Actions */}
                        {!isLive && (
                          <div className="absolute top-1 left-1 hidden group-hover:flex bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
                            <button 
                              onClick={() => handleStart(session.id)} 
                              disabled={isStarting}
                              className="p-1 text-primary hover:bg-surface-container transition-colors"
                              title="بدء الآن"
                            >
                              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                            </button>
                            <button 
                              onClick={() => handleCancel(session.id)} 
                              className="p-1 text-error hover:bg-error/10 transition-colors border-r border-outline-variant/30"
                              title="إلغاء"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
               )
            })}

            {/* Current Time Line */}
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
  );
};

export default AdminScheduleTable;