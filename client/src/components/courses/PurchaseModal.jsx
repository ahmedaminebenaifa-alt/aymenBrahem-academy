import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCoursePurchase } from '../../hooks/useCoursePurchase';

const BANK_DETAILS = {
  BANK_TRANSFER: {
    label: 'تحويل بنكي (البياط)',
    icon: 'account_balance',
    accountLabel: 'رقم الحساب (RIB)',
    accountValue: 'XX XXX XXXXXXXXXXXXXXXX XX', // ضع رقم RIB الحقيقي هنا
    note: 'البنك: البنك الدولي العربي التونسي (BIAT)',
  },
  POSTAL_TRANSFER: {
    label: 'التحويل البريدي (D17 / CCP)',
    icon: 'local_post_office',
    accountLabel: 'رقم الحساب الجاري البريدي (CCP)',
    accountValue: 'XX XXXXXXX', // ضع رقم CCP الحقيقي هنا
    note: 'يمكنك التحويل عبر تطبيق D17 أو من أي مكتب بريد',
  },
};

export default function PurchaseModal({ course, onClose, onManualSuccess }) {
  const [method, setMethod] = useState('BANK_TRANSFER');
  const [transferReference, setTransferReference] = useState('');
  const { purchase, loading, error } = useCoursePurchase();

  const handleConfirm = async () => {
    try {
      const result = await purchase(course.id, method, transferReference);
      onManualSuccess?.(result.order);
      onClose();
    } catch {
      // error already surfaced via the hook's error state
    }
  };

  const offlineDetails = BANK_DETAILS[method];

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-xl text-right max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-1">شراء الدورة</h3>
        <p className="text-sm text-on-surface-variant mb-6">{course.title} — {Number(course.price)} د.ت</p>

        <div className="space-y-3 mb-4">
          <button
            onClick={() => setMethod('BANK_TRANSFER')}
            className={`w-full text-right p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
              method === 'BANK_TRANSFER' ? 'border-primary bg-primary/5' : 'border-outline-variant/30'
            }`}
          >
            <div>
              <p className="font-bold text-sm">تحويل بنكي (البياط)</p>
              <p className="text-xs text-on-surface-variant mt-1">يتطلب موافقة الإدارة</p>
            </div>
            <span className="material-symbols-outlined text-primary">account_balance</span>
          </button>

          <button
            onClick={() => setMethod('POSTAL_TRANSFER')}
            className={`w-full text-right p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
              method === 'POSTAL_TRANSFER' ? 'border-primary bg-primary/5' : 'border-outline-variant/30'
            }`}
          >
            <div>
              <p className="font-bold text-sm">التحويل البريدي (D17 / CCP)</p>
              <p className="text-xs text-on-surface-variant mt-1">يتطلب موافقة الإدارة</p>
            </div>
            <span className="material-symbols-outlined text-primary">local_post_office</span>
          </button>

          <button
            onClick={() => setMethod('MANUAL')}
            className={`w-full text-right p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
              method === 'MANUAL' ? 'border-primary bg-primary/5' : 'border-outline-variant/30'
            }`}
          >
            <div>
              <p className="font-bold text-sm">طريقة أخرى / التواصل المباشر</p>
              <p className="text-xs text-on-surface-variant mt-1">يتطلب موافقة الإدارة</p>
            </div>
            <span className="material-symbols-outlined text-primary">chat</span>
          </button>
        </div>

        {offlineDetails && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4 space-y-2">
            <p className="text-xs font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">{offlineDetails.icon}</span>
              تفاصيل {offlineDetails.label}
            </p>
            <p className="text-sm text-on-surface">{offlineDetails.note}</p>
            <div className="bg-surface rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">{offlineDetails.accountLabel}</span>
              <span dir="ltr" className="font-mono text-sm font-bold text-on-surface">{offlineDetails.accountValue}</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed pt-1">
              بعد إتمام التحويل، أدخل رقم المرجع أو آخر أرقام الإيصال أدناه ليتمكن الإداري من التحقق من عمليتك.
            </p>
            <input
              type="text"
              value={transferReference}
              onChange={(e) => setTransferReference(e.target.value)}
              placeholder="رقم المرجع / الإيصال"
              className="w-full border border-outline-variant/40 rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {method === 'MANUAL' && (
          <div className="bg-surface-container-low rounded-xl p-4 mb-4">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              سيتم التواصل معك من قبل الإدارة لتنسيق طريقة الدفع. يمكنك إضافة أي ملاحظة أدناه.
            </p>
            <input
              type="text"
              value={transferReference}
              onChange={(e) => setTransferReference(e.target.value)}
              placeholder="ملاحظة (اختياري)"
              className="w-full mt-2 border border-outline-variant/40 rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-error bg-error/10 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-primary text-on-primary py-3 rounded-xl font-bold disabled:opacity-60"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
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