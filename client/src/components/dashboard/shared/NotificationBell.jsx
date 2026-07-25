import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications';
import { useClickOutside } from '../../../hooks/useClickOutside';

const ICONS = {
  LIVE_SESSION: { icon: 'live_tv', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  ANNOUNCEMENT_LIVE: { icon: 'podcasts', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ANNOUNCEMENT_COURSE: { icon: 'auto_stories', color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/10', border: 'border-[var(--primary)]/20' },
  ANNOUNCEMENT_GENERAL: { icon: 'campaign', color: 'text-teal-500', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
};

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('ar-EG-u-nu-latn', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatScheduled = (dateString) => {
  const date = new Date(dateString);
  const isFuture = date.getTime() > Date.now();
  const formatted = date.toLocaleString('ar-EG-u-nu-latn', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return isFuture ? `الموعد: ${formatted}` : `كان في: ${formatted}`;
};

export default function NotificationBell({ onToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const dropdownRef = useClickOutside(() => setIsOpen(false));

  useEffect(() => {
    if (onToggle) {
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markAsRead(notification.id);
    if (notification.link) navigate(notification.link);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group ${
          isOpen 
            ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 shadow-inner' 
            : 'bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 hover:border-[var(--primary)]/50 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:bg-[var(--surface-container-low)]'
        }`}
        aria-label="الإشعارات"
      >
        <span className={`material-symbols-outlined text-[22px] transition-all duration-500 ${
          isOpen ? 'text-[var(--primary)] rotate-[15deg] scale-110' : 'text-[var(--on-surface-variant)] group-hover:text-[var(--primary)] group-hover:rotate-[15deg]'
        }`}>
          {unreadCount > 0 ? 'notifications_active' : 'notifications'}
        </span>
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none border-[3px] border-[var(--surface)] shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Panel (Fixed on mobile to prevent clipping, Absolute on desktop) */}
      <div 
        className={`fixed left-4 right-4 top-[72px] md:absolute md:inset-auto md:left-0 md:top-[calc(100%+16px)] md:w-[420px] bg-[var(--surface)]/95 backdrop-blur-3xl border border-[var(--outline-variant)]/20 rounded-[28px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top md:origin-top-left ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible' 
            : 'opacity-0 -translate-y-4 scale-[0.96] pointer-events-none invisible'
        }`}
      >
        {/* Decorative Top Highlight */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent"></div>
        
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center bg-[var(--surface-container-lowest)]/40 border-b border-[var(--outline-variant)]/10">
          <div className="flex items-center gap-3">
            <h3 className="text-[17px] font-black text-[var(--on-surface)] tracking-tight">الإشعارات</h3>
            {unreadCount > 0 && (
              <span className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm">
                {unreadCount} جديدة
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="group/btn flex items-center gap-1.5 text-xs font-bold text-[var(--on-surface-variant)] hover:text-[var(--primary)] px-3 py-1.5 rounded-full hover:bg-[var(--primary)]/10 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[16px] group-hover/btn:scale-110 transition-transform">done_all</span>
              تحديد كـ مقروء
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[420px] overflow-y-auto p-3 scrollbar-hide flex flex-col gap-2 relative">
          {notifications.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[var(--surface-container-low)] flex items-center justify-center mb-4 shadow-inner">
                <span className="material-symbols-outlined text-4xl text-[var(--outline)]">notifications_paused</span>
              </div>
              <span className="text-sm font-bold text-[var(--on-surface-variant)]">لا توجد إشعارات حالياً</span>
              <span className="text-xs text-[var(--outline)] mt-1">عندما تتلقى إشعارات جديدة ستظهر هنا</span>
            </div>
          ) : (
            notifications.map((n) => {
              const meta = ICONS[n.type] || { icon: 'notifications', color: 'text-[var(--on-surface-variant)]', bg: 'bg-[var(--surface-container-high)]', border: 'border-[var(--outline-variant)]/30' };
              
              return (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`relative w-full text-right p-4 rounded-[20px] transition-all duration-300 flex gap-4 group/item overflow-hidden ${
                    !n.isRead 
                      ? 'bg-[var(--surface-container-lowest)] shadow-sm hover:shadow-md border border-[var(--outline-variant)]/40 hover:border-[var(--primary)]/30' 
                      : 'bg-transparent hover:bg-[var(--surface-container-lowest)] border border-transparent hover:border-[var(--outline-variant)]/20'
                  }`}
                >
                  {/* Unread Left Border Accent */}
                  {!n.isRead && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]"></div>
                  )}

                  {/* Icon Container */}
                  <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 border ${meta.bg} ${meta.border} ${n.isRead ? 'opacity-60 grayscale-[50%]' : 'shadow-inner'} group-hover/item:scale-105 transition-transform duration-500`}>
                    <span className={`material-symbols-outlined text-[24px] ${meta.color}`}>
                      {meta.icon}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-w-0 pt-0.5 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-[14px] leading-tight truncate pr-1 ${!n.isRead ? 'font-bold text-[var(--on-surface)]' : 'font-medium text-[var(--on-surface-variant)]'}`}>
                        {n.title}
                      </p>
                      
                      {/* Unread Dot */}
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_6px_var(--primary)] shrink-0 mt-1"></span>
                      )}
                    </div>
                    
                    {n.message && (
                      <p className={`text-[12px] line-clamp-2 leading-relaxed pr-1 ${!n.isRead ? 'text-[var(--on-surface-variant)]' : 'text-[var(--outline)]'}`}>
                        {n.message}
                      </p>
                    )}
                    
                    {/* Meta Info row (Time / Schedule) */}
                    <div className="flex flex-wrap items-center gap-3 mt-2.5">
                      <p className="text-[10px] font-medium text-[var(--outline)] flex items-center gap-1.5 bg-[var(--surface-container-high)]/50 px-2 py-0.5 rounded-md">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        {timeAgo(n.createdAt)}
                      </p>

                      {n.scheduledFor && (
                        <p className={`text-[10px] font-bold flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                          !n.isRead ? 'bg-orange-500/10 text-orange-600' : 'bg-[var(--surface-container-high)] text-[var(--outline)]'
                        }`}>
                          <span className="material-symbols-outlined text-[12px]">event</span>
                          {formatScheduled(n.scheduledFor)}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}