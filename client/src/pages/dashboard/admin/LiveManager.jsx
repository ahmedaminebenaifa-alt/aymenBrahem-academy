import LiveWidget from '../../../components/live/LiveWidget'; 

const LiveManager = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة البث المباشر</h1>
        <p className="text-gray-500">
          من هنا يمكنك بدء بث مباشر جديد ومشاركة شاشتك مع جميع الطلاب المسجلين.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Smart Widget */}
        <div className="col-span-1">
          <LiveWidget />
        </div>

        {/* Instructions */}
        <div className="col-span-1 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-800 mb-4">تعليمات البث المباشر:</h3>
          <ul className="space-y-3 text-sm text-blue-700">
            <li className="flex items-center gap-2">
              <span>✅</span> عند بدء البث، سيتم نقلك إلى شاشة العرض الكاملة.
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span> سيظهر زر "الانضمام" للطلاب تلقائياً في لوحة التحكم الخاصة بهم.
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span> يمكنك مشاركة شاشتك بالضغط على الزر الأزرق أسفل الشاشة.
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span> الميكروفونات الخاصة بالطلاب مغلقة افتراضياً لمنع الإزعاج.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveManager;