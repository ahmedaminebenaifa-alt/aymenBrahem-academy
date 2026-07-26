import { useState } from 'react';
import { useLiveSchedule } from '../../../../hooks/useLiveSchedule';
import { useCourses } from '../../../../hooks/useCourses';

const SchedulePlanner = () => {
  const { sessions, scheduleSession, startSession, cancelSession, isScheduling, isStarting } = useLiveSchedule();
  const { courses } = useCourses();
  const publishedCourses = courses.filter((c) => c.published);

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const scheduledOnly = sessions.filter((s) => s.status === 'SCHEDULED');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !scheduledAt) return;
    try {
      await scheduleSession({ title, courseId: courseId || undefined, scheduledAt });
      setTitle('');
      setCourseId('');
      setScheduledAt('');
    } catch (err) {
      alert(err.response?.data?.message || 'فشل جدولة الجلسة');
    }
  };

  const handleStart = async (id) => {
    if (!window.confirm('بدء هذه الجلسة الآن؟')) return;
    try {
      await startSession(id);
    } catch (err) {
      alert(err.response?.data?.message || 'فشل بدء الجلسة');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('إلغاء هذه الجلسة المجدولة؟')) return;
    await cancelSession(id);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm p-6 lg:p-8 transition-shadow hover:shadow-md">
      <h3 className="font-display font-bold text-xl text-primary mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-2xl">calendar_add_on</span>
        جدولة جلسة جديدة
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant mr-1">عنوان الجلسة</label>
          <input
            type="text"
            placeholder="مثال: مراجعة شاملة للوحدة الأولى"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant mr-1">الدورة المرتبطة (اختياري)</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="">بث عام (متاح للجميع)</option>
            {publishedCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant mr-1">الموعد</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isScheduling || !title || !scheduledAt}
          className="w-full py-3 mt-2 flex items-center justify-center gap-2 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-sm hover:bg-primary/90 hover:shadow disabled:opacity-50 disabled:hover:shadow-sm transition-all"
        >
          {isScheduling ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">event_available</span>
          )}
          {isScheduling ? 'جاري الجدولة...' : 'تأكيد الجدولة'}
        </button>
      </form>

      <div className="space-y-3">
        <h4 className="text-base font-bold text-on-surface flex items-center gap-2 mb-4 border-b border-outline-variant/30 pb-2">
          <span className="material-symbols-outlined text-primary text-[20px]">upcoming</span>
          الجلسات المجدولة القادمة
        </h4>
        
        {scheduledOnly.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant/50 border-2 border-dashed border-outline-variant/30 rounded-xl">
             <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
             <p className="text-sm">لا توجد جلسات مجدولة حالياً</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledOnly.map((s) => (
              <div 
                key={s.id} 
                className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface hover:bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-sm hover:shadow transition-all gap-4"
              >
                <div>
                  <p className="text-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{s.title}</p>
                  <p className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {new Date(s.scheduledAt).toLocaleString('ar-EG-u-nu-latn', {
                      weekday: 'long', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleStart(s.id)}
                    disabled={isStarting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    بدء الآن
                  </button>
                  <button
                    onClick={() => handleCancel(s.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    إلغاء
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePlanner;