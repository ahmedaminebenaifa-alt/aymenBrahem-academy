import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body-md" dir="rtl">
      {/* Temporary minimal header for Admin */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg text-slate-800">بوابة الإدارة العامة</h1>
        <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-semibold">Admin Panel Portal</span>
      </header>

      {/* The main workspace canvas where admin pages will inject */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}