import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';

const ICONS = {
  ENROLLMENT: { icon: 'person_add', color: 'text-primary' },
  COURSE_PUBLISHED: { icon: 'auto_stories', color: 'text-green-600' },
  LIVE_STARTED: { icon: 'podcasts', color: 'text-red-600' },
  LIVE_ENDED: { icon: 'stop_circle', color: 'text-on-surface-variant' },
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await api.get('/dashboard/recent-activity');
        setActivities(data.data);
      } catch (err) {
        console.error('Failed to fetch recent activity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-sm border border-outline-variant/30">
      <h3 className="font-arabic font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">history</span>
        آخر النشاطات
      </h3>

      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-4 h-4 bg-outline-variant/30 rounded-full mt-1" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-outline-variant/30 rounded w-4/5" />
                <div className="h-2.5 bg-outline-variant/20 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <p className="text-sm text-on-surface-variant text-center py-6">لا توجد نشاطات حديثة بعد.</p>
      )}

      {!loading && activities.length > 0 && (
        <div className="space-y-4">
          {activities.map((activity) => {
            const { icon, color } = ICONS[activity.type] || { icon: 'circle', color: 'text-on-surface-variant' };
            return (
              <div key={activity.id} className="flex gap-3">
                <div className={`mt-1 ${color}`}>
                  <span className="material-symbols-outlined text-sm">{icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">{activity.text}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{timeAgo(activity.time)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;