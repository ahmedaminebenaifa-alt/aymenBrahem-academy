import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../api/axios';

const TYPE_META = {
  ANNOUNCEMENT_LIVE: { icon: 'podcasts', label: 'بث مباشر', color: 'text-error' },
  ANNOUNCEMENT_COURSE: { icon: 'auto_stories', label: 'دورة جديدة', color: 'text-primary' },
  ANNOUNCEMENT_GENERAL: { icon: 'campaign', label: 'إعلان', color: 'text-tertiary' },
};

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('ar-EG-u-nu-latn', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function toDatetimeLocalValue(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const emptyForm = { type: 'ANNOUNCEMENT_LIVE', title: '', message: '', scheduledFor: '' };

const fetchAnnouncements = async () => {
  const { data } = await api.get('/notifications/announcements/upcoming');
  return data.data;
};

const UpcomingSessions = () => {
  const queryClient = useQueryClient();
  const queryKey = ['upcomingAnnouncements'];

  const { data: announcements = [], isLoading: loading } = useQuery({
    queryKey,
    queryFn: fetchAnnouncements,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const deletingIdRef = useRef(null);
  const [deletingId, setDeletingId] = useState(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      id ? api.patch(`/notifications/announcements/${id}`, payload) : api.post('/notifications/announcements', payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/notifications/announcements/${id}`),
    onMutate: async (id) => {
      setDeletingId(id);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old = []) => old.filter((a) => a.id !== id));
      return { previous };
    },
    onError: (err, id, context) => {
      alert(err.response?.data?.message || 'فشل حذف الإعلان');
      queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => setDeletingId(null),
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (a) => {
    setEditingId(a.id);
    setForm({
      type: a.type,
      title: a.title,
      message: a.message || '',
      scheduledFor: toDatetimeLocalValue(a.scheduledFor),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.scheduledFor) return;
    try {
      await saveMutation.mutateAsync({ id: editingId, payload: form });
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'فشل حفظ الإعلان');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="bg-surface-container-lowest/70 backdrop-blur-md rounded-xl p-6 shadow-sm border border-outline-variant/30 relative">
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
              <div key={a.id} className="group flex gap-4 p-3 rounded-lg border border-outline-variant/20 bg-surface-container-lowest hover:border-primary/30 transition-colors">
                <div className={`bg-surface-container w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
                  <span className="material-symbols-outlined text-xl">{meta.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface text-sm mb-1 truncate">{a.title}</p>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                    <span>{formatDateTime(a.scheduledFor)}</span>
                    <span className="w-1 h-1 bg-outline rounded-full"></span>
                    <span>{meta.label}</span>
                  </div>
                </div>
                <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEditModal(a)}
                    className="text-on-surface-variant hover:text-primary p-1.5 rounded-md hover:bg-primary/10 transition-colors"
                    title="تعديل"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={deletingId === a.id}
                    className="text-on-surface-variant hover:text-error p-1.5 rounded-md hover:bg-error-container/20 transition-colors disabled:opacity-50"
                    title="حذف"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {deletingId === a.id ? 'hourglass_empty' : 'delete'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={openCreateModal}
        className="w-full mt-4 py-2.5 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        إضافة إعلان جديد
      </button>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-xl w-full max-w-md overflow-hidden text-right">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center flex-row-reverse">
              <h4 className="font-arabic font-bold text-on-surface text-base">
                {editingId ? 'تعديل الإعلان' : 'إعلان جديد للطلاب'}
              </h4>
              <button
                onClick={closeModal}
                className="text-on-surface-variant hover:text-on-surface material-symbols-outlined text-xl p-1 rounded-md hover:bg-surface-container-high transition-all"
              >
                close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">نوع الإعلان</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
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
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">تفاصيل إضافية (اختياري)</label>
                <textarea
                  rows={2}
                  placeholder="أي تفاصيل تريد إضافتها للطلاب"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">الموعد المتوقع</label>
                <input
                  type="datetime-local"
                  required
                  value={form.scheduledFor}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledFor: e.target.value }))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
                />
              </div>

              <div className="pt-2 flex gap-3 justify-start">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-primary text-on-primary font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-primary-container transition-all disabled:opacity-60"
                >
                  {saveMutation.isPending ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'نشر الإعلان'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
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