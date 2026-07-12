import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../../../../api/axios';

const TYPE_META = {
  ANNOUNCEMENT_LIVE: { icon: 'podcasts', label: 'بث مباشر', color: 'text-red-600' },
  ANNOUNCEMENT_COURSE: { icon: 'auto_stories', label: 'دورة جديدة', color: 'text-primary' },
  ANNOUNCEMENT_GENERAL: { icon: 'campaign', label: 'إعلان', color: 'text-tertiary' },
};

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('ar-EG-u-nu-latn', {
    weekday: 'long', hour: '2-digit', minute: '2-digit',
  });
}

const UpcomingSessions = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [type, setType] = useState('ANNOUNCEMENT_LIVE');

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get('/notifications/announcements/upcoming');
      setAnnouncements(data.data);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!title || !scheduledFor) return;
    setSaving(true);
    try {
      await api.post('/notifications/announcements', { type, title, message, scheduledFor });
      await fetchAnnouncements();
      setTitle('');
      setMessage('');
      setScheduledFor('');
      setType('ANNOUNCEMENT_LIVE');
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'فشل حفظ الإعلان');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-sm border border-outline-variant/30 relative">
      <h3 className="font-arabic font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-tertiary-container">campaign</span>
        الإعلانات القادمة
      </h3>

      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-outline-variant/20 rounded-lg" />
          ))}
        </div>
      )}

      {!loading && announcements.length === 0 && (
        <p className="text-sm text-on-surface-variant text-center py-6">لا توجد إعلانات قادمة بعد.</p>
      )}

      {!loading && announcements.length > 0 && (
        <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
          {announcements.map((a) => {
            const meta = TYPE_META[a.type] || TYPE_META.ANNOUNCEMENT_GENERAL;
            return (
              <div key={a.id} className="flex gap-4 p-3 rounded-lg border border-outline-variant/20 bg-surface-container-lowest hover:border-primary/30 transition-colors">
                <div className={`bg-surface-container w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
                  <span className="material-symbols-outlined text-xl">{meta.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm mb-1">{a.title}</p>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                    <span>{formatDateTime(a.scheduledFor)}</span>
                    <span className="w-1 h-1 bg-outline rounded-full"></span>
                    <span>{meta.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-4 py-2.5 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        إضافة إعلان جديد
      </button>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-xl w-full max-w-md overflow-hidden text-right">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center flex-row-reverse">
              <h4 className="font-arabic font-bold text-on-surface text-base">إعلان جديد للطلاب</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface material-symbols-outlined text-xl p-1 rounded-md hover:bg-surface-container-high transition-all"
              >
                close
              </button>
            </div>

            <form onSubmit={handleAddAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">نوع الإعلان</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
                >
                  <option value="ANNOUNCEMENT_LIVE">بث مباشر قادم</option>
                  <option value="ANNOUNCEMENT_COURSE">دورة جديدة قادمة</option>
                  <option value="ANNOUNCEMENT_GENERAL">إعلان عام</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">العنوان</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سأبث مباشرة شرح كتاب التوحيد"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">تفاصيل إضافية (اختياري)</label>
                <textarea
                  rows={2}
                  placeholder="أي تفاصيل تريد إضافتها للطلاب"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">الموعد المتوقع</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
                />
              </div>

              <div className="pt-2 flex gap-3 justify-start">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-on-primary font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-primary-container transition-all disabled:opacity-60"
                >
                  {saving ? 'جاري الحفظ...' : 'نشر الإعلان'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-surface-container text-on-surface-variant font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-surface-container-high transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UpcomingSessions;