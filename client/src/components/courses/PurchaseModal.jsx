import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCoursePurchase } from '../../hooks/useCoursePurchase';

export default function PurchaseModal({ course, onClose, onSuccess }) {
  const [note, setNote] = useState('');
  const { purchase, loading, error } = useCoursePurchase();

  const handleConfirm = async () => {
    try {
      const result = await purchase(course.id, note);
      onSuccess?.(result.order);
      onClose();
    } catch {
      // error already surfaced via the hook's error state
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-xl text-right">
        <h3 className="font-bold text-lg mb-1">طلب شراء الدورة</h3>
        <p className="text-sm text-on-surface-variant mb-6">{course.title} — {Number(course.price)} د.ت</p>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4 flex gap-3">
          <span className="material-symbols-outlined text-primary shrink-0">call</span>
          <p className="text-sm text-on-surface leading-relaxed">
            سيتواصل معك الشيخ عبر الهاتف لإتمام عملية الدفع، وبعد ذلك سيتم تفعيل الدورة تلقائياً في حسابك.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
            ملاحظة (اختياري)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="مثال: أفضل التواصل بعد صلاة المغرب"
            className="w-full border border-outline-variant/40 rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {error && (
          <p className="text-sm text-error bg-error/10 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-primary text-on-primary py-3 rounded-xl font-bold disabled:opacity-60"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال طلب الشراء'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}