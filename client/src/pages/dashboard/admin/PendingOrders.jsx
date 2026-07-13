import { usePendingOrders } from '../../../hooks/usePendingOrders';

export default function PendingOrders() {
  const { orders, loading, approve, reject } = usePendingOrders();

  const handleApprove = async (order) => {
    if (!window.confirm(`تأكيد منح "${order.user.name}" حق الوصول إلى "${order.course.title}"؟`)) return;
    try {
      await approve(order.id);
    } catch (err) {
      alert(err.response?.data?.message || 'فشل في الموافقة على الطلب');
    }
  };

  const handleReject = async (order) => {
    if (!window.confirm(`رفض طلب "${order.user.name}"؟`)) return;
    try {
      await reject(order.id);
    } catch (err) {
      alert(err.response?.data?.message || 'فشل في رفض الطلب');
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-surface-container-lowest border border-outline-variant/30 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">طلبات الشراء اليدوية</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          الطلاب الذين اختاروا الدفع عبر التحويل البنكي ويحتاجون موافقتك لتفعيل الدورة
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest border border-outline-variant/30 rounded-xl">
          <span className="material-symbols-outlined text-5xl text-outline-variant/50 mb-3">inbox</span>
          <p className="text-on-surface-variant font-medium">لا توجد طلبات معلّقة حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-on-surface">{order.user.name}</span>
                  <span className="text-xs text-outline">{order.user.email}</span>
                </div>
                <p className="text-sm text-on-surface-variant">
                  طلب الوصول إلى: <span className="font-bold text-primary">{order.course.title}</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-outline">
                  <span>{Number(order.amount)} د.ت</span>
                  {order.user.phoneNumber && (
                    <>
                      <span className="w-1 h-1 bg-outline rounded-full" />
                      <span dir="ltr">{order.user.phoneNumber}</span>
                    </>
                  )}
                  <span className="w-1 h-1 bg-outline rounded-full" />
                  <span>{new Date(order.createdAt).toLocaleDateString('ar-EG-u-nu-latn')}</span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(order)}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  موافقة
                </button>
                <button
                  onClick={() => handleReject(order)}
                  className="px-4 py-2 bg-error/10 text-error rounded-lg text-sm font-bold hover:bg-error/20 transition-colors"
                >
                  رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}