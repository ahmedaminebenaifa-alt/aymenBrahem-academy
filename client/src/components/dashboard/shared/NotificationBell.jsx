import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications';
import { useClickOutside } from '../../../hooks/useClickOutside';


const ICONS = {
  LIVE_SESSION: { icon: 'live_tv', color: 'text-red-600', bg: 'bg-red-600/10' },
  ANNOUNCEMENT_LIVE: { icon: 'podcasts', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ANNOUNCEMENT_COURSE: { icon: 'auto_stories', color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/10' },
  ANNOUNCEMENT_GENERAL: { icon: 'campaign', color: 'text-teal-600', bg: 'bg-teal-600/10' },
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
    <>
      <style>{`
        @keyframes slideDownFade {
          0% { opacity: 0; transform: translateY(-8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-down {
          animation: slideDownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative p-2.5 rounded-full hover:bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-all duration-300 cursor-pointer group"
          aria-label="الإشعارات"
        >
          <span className={`material-symbols-outlined text-[24px] transition-transform duration-300 ${isOpen ? 'rotate-12 text-[var(--primary)]' : 'group-hover:rotate-12'}`}>
            {unreadCount > 0 ? 'notifications_active' : 'notifications'}
          </span>
          
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none border-2 border-[var(--surface)] shadow-sm animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 mt-3 w-[calc(100vw-2rem)] max-w-[340px] bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--outline-variant)]/20 rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] overflow-hidden z-[60] origin-top animate-slide-down flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60"></div>
            
            <div className="px-5 py-4 border-b border-[var(--outline-variant)]/10 flex justify-between items-center bg-[var(--surface-container-lowest)]/50">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--on-surface)]">الإشعارات</h3>
                {unreadCount > 0 && (
                  <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-[11px] px-2 py-0.5 rounded-md font-bold">
                    {unreadCount} جديدة
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-[var(--primary)]/80 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 px-2 py-1 rounded transition-colors"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[var(--outline-variant)]/30 scrollbar-track-transparent">
              {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-[var(--outline)]">
                  <span className="material-symbols-outlined text-5xl mb-3 opacity-40">notifications_off</span>
                  <span className="text-sm font-medium text-[var(--on-surface-variant)]">لا توجد إشعارات حالياً</span>
                </div>
              ) : (
                notifications.map((n) => {
                  const meta = ICONS[n.type] || { icon: 'notifications', color: 'text-[var(--on-surface-variant)]', bg: 'bg-[var(--surface-container-high)]' };
                  
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-right p-3 rounded-xl transition-all duration-200 flex gap-3.5 mb-1 last:mb-0 group/item ${
                        !n.isRead 
                          ? 'bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 border border-[var(--primary)]/10' 
                          : 'hover:bg-[var(--surface-container-low)] border border-transparent'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.bg} ${n.isRead ? 'opacity-60' : ''}`}>
                        <span className={`material-symbols-outlined text-[20px] ${meta.color}`}>
                          {meta.icon}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className={`text-sm leading-tight ${!n.isRead ? 'font-bold text-[var(--on-surface)]' : 'font-medium text-[var(--on-surface-variant)]'}`}>
                          {n.title}
                        </p>
                        
                        {n.message && (
                          <p className={`text-xs truncate mt-1 ${!n.isRead ? 'text-[var(--on-surface-variant)]' : 'text-[var(--outline)]'}`}>
                            {n.message}
                          </p>
                        )}
                        
                        {n.scheduledFor && (
                          <p className="text-xs text-[var(--primary)] font-bold mt-1.5 flex items-center gap-1 bg-[var(--primary)]/5 inline-flex px-2 py-0.5 rounded">
                            <span className="material-symbols-outlined text-[14px]">event</span>
                            {formatScheduled(n.scheduledFor)}
                          </p>
                        )}
                        
                        <p className="text-[11px] text-[var(--outline)] mt-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>

                      {!n.isRead && (
                        <div className="flex flex-col justify-center items-center shrink-0 w-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)] opacity-80 group-hover/item:opacity-100 transition-opacity"></span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}