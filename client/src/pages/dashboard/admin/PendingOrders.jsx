import { usePendingOrders } from '../../../hooks/usePendingOrders';
import { useSidebar } from '../../../context/SidebarContext'; 

export default function PendingOrders() {
  const { orders, loading, approve, reject } = usePendingOrders();
  const { isOpen } = useSidebar(); 

  const handleApprove = async (order) => {
    if (!window.confirm(`تأكيد استلام الدفع من "${order.user.name}" وتفعيل "${order.course.title}"؟`)) return;
    try {
      await approve(order.id);
    } catch (err) {
      alert(err.response?.data?.message || 'فشل في تفعيل الدورة');
    }
  };

  const handleReject = async (order) => {
    if (!window.confirm(`إلغاء طلب "${order.user.name}"؟`)) return;
    try {
      await reject(order.id);
    } catch (err) {
      alert(err.response?.data?.message || 'فشل في إلغاء الطلب');
    }
  };

  // 1. Loading State (Now protected from sidebar overlap)
  if (loading) {
    return (
      <div className={`p-4 md:py-8 md:pl-8 transition-[padding] duration-500 ease-[cubic-bezier(0.2,1,0.2,1)] ${
        isOpen ? 'md:pr-[300px]' : 'md:pr-[120px]'
      }`}>
        <div className="max-w-4xl space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-container-lowest border border-outline-variant/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // 2. Main Data State
  return (
    <div className={`p-4 md:py-8 md:pl-8 transition-[padding] duration-500 ease-[cubic-bezier(0.2,1,0.2,1)] ${
      isOpen ? 'md:pr-[300px]' : 'md:pr-[120px]'
    }`}>
      
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-on-surface">طلبات الشراء</h1>
          <p className="text-base text-on-surface-variant mt-2">
            طلاب ينتظرون اتصالك لإتمام الدفع وتفعيل الدورة
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm">
            <span className="material-symbols-outlined text-6xl text-outline-variant/50 mb-4">inbox</span>
            <p className="text-on-surface-variant text-lg font-medium">لا توجد طلبات معلّقة حالياً</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-on-surface">{order.user.name}</span>
                    {order.user.phoneNumber && (
                      <a
                        href={`tel:${order.user.phoneNumber}`}
                        dir="ltr"
                        className="text-sm text-primary hover:text-primary/80 hover:underline flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md"
                      >
                        <span className="material-symbols-outlined text-[16px]">call</span>
                        {order.user.phoneNumber}
                      </a>
                    )}
                  </div>
                  <p className="text-base text-on-surface-variant mb-3">
                    طلب الوصول إلى: <span className="font-bold text-primary">{order.course.title}</span>
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-outline-variant">
                    <span className="font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded">
                      {Number(order.amount)} د.ت
                    </span>
                    <span className="w-1.5 h-1.5 bg-outline-variant/50 rounded-full" />
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      {new Date(order.createdAt).toLocaleDateString('ar-EG-u-nu-latn')}
                    </span>
                    
                    {order.transferReference && (
                      <>
                        <span className="w-1.5 h-1.5 bg-outline-variant/50 rounded-full" />
                        <span className="flex items-center gap-1 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                          ملاحظة: {order.transferReference}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
                  <button
                    onClick={() => handleApprove(order)}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    تفعيل الدورة
                  </button>
                  <button
                    onClick={() => handleReject(order)}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-error/10 text-error rounded-xl text-sm font-bold hover:bg-error/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
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
}