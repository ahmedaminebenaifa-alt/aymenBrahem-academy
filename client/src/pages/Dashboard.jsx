import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div dir="rtl" className="max-w-2xl mx-auto mt-20 text-right">
      <h1 className="text-2xl font-bold mb-4">مرحباً، {user.name || user.email}</h1>
      <button onClick={logout} className="text-red-600 underline">
        تسجيل الخروج
      </button>
    </div>
  );
}