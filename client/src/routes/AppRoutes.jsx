import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home';
// import AuthSection from '../components/AuthSection'; // Add this if it's on a separate route

// Security Wrapper
import ProtectedRoute from './ProtectedRoute';

// Layouts (The Shells)
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';

// Student Pages
import StudentOverview from '../pages/dashboard/student/Overview';
import MyCourses from '../pages/dashboard/student/MyCourses';
import StudentSettings from '../pages/dashboard/student/Settings';

// Admin Pages (Placeholders for later)
import AdminOverview from '../pages/dashboard/admin/Overview';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ------------------------------------------- */}
      {/* 1. PUBLIC ROUTES                            */}
      {/* ------------------------------------------- */}
      <Route path="/" element={<Home />} />
      {/* <Route path="/login" element={<AuthSection />} /> */}

      {/* ------------------------------------------- */}
      {/* 2. STUDENT DASHBOARD (Nested Routing)       */}
      {/* ------------------------------------------- */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        {/* The 'index' route loads automatically at /dashboard/student */}
        <Route index element={<StudentOverview />} />
        
        {/* Loads at /dashboard/student/courses */}
        <Route path="courses" element={<MyCourses />} />
        
        {/* Loads at /dashboard/student/settings */}
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* ------------------------------------------- */}
      {/* 3. ADMIN DASHBOARD (Nested Routing)         */}
      {/* ------------------------------------------- */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        {/* Add ManageCourses, Users, etc., here later */}
      </Route>

      {/* ------------------------------------------- */}
      {/* 4. FALLBACK REDIRECTS                       */}
      {/* ------------------------------------------- */}
      {/* If someone just types /dashboard, redirect them based on their role */}
      <Route path="/dashboard" element={<Navigate to="/dashboard/student" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      
    </Routes>
  );
}