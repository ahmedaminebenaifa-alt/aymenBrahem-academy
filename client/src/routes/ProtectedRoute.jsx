import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // 1. If not logged in at all, kick to home/login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. If logged in but wrong role, kick back to their proper dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If a student tries to access admin, send them to student dashboard
    if (user.role === 'STUDENT') return <Navigate to="/dashboard/student" replace />;
    
    // If an admin tries to access student (optional rule), send to admin
    if (user.role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
  }

  // 3. If they pass all checks, render the layout!
  return children;
}