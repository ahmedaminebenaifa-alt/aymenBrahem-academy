import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications';
import { useClickOutside } from '../../../hooks/useClickOutside';

const ICONS = {
  LIVE_SESSION: { icon: 'live_tv', color: 'text-red-600' },
  ANNOUNCEMENT_LIVE: { icon: 'podcasts', color: 'text-red-600' },
  ANNOUNCEMENT_COURSE: { icon: 'auto_stories', color: 'text-primary' },
  ANNOUNCEMENT_GENERAL: { icon: 'campaign', color: 'text-tertiary' },
};

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'الآن';
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  return `منذ ${Math.floor(diffHours / 24)} يوم`;
};

const formatScheduled = (dateString) => {
  const date = new Date(dateString);
  const isFuture = date.getTime() > Date.now();
  const formatted = date.toLocaleString('ar-EG-u-nu-latn', {
    weekday: 'long', hour: '2-digit', minute: '2-digit',
  });
  return isFuture ? `الموعد: ${formatted}` : `كان في: ${formatted}`;
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const dropdownRef = useClickOutside(() => setIsOpen(false));

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markAsRead(notification.id);
    if (notification.link) navigate(notification.link);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors relative"
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant/30 rounded-[4px] shadow-lg overflow-hidden z-60 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low/40">
            <h4 className="font-bold text-sm text-on-surface">الإشعارات</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-primary hover:underline"
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-sm text-on-surface-variant flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl opacity-30">notifications_off</span>
                لا توجد إشعارات حالياً
              </div>
            ) : (
              notifications.map((n) => {
                const meta = ICONS[n.type] || { icon: 'notifications', color: 'text-outline' };
                return (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full text-right px-4 py-3 border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors flex gap-3 ${
                      !n.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-lg mt-0.5 shrink-0 ${
                        !n.isRead ? meta.color : 'text-outline'
                      }`}
                    >
                      {meta.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.isRead ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="text-xs text-on-surface-variant truncate mt-0.5">{n.message}</p>
                      )}
                      {n.scheduledFor && (
                        <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">event</span>
                          {formatScheduled(n.scheduledFor)}
                        </p>
                      )}
                      <p className="text-xs text-outline mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}