import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home';
import LiveSession from '../pages/LiveSession';
// import AuthSection from '../components/AuthSection'; // Add this if it's on a separate route

// Security Wrapper
import ProtectedRoute from './ProtectedRoute';

// Layouts (The Shells)
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';

// Student Pages

import StudentDashboard from '../pages/dashboard/student/StudentDashboard';
import StudentSettings from '../pages/dashboard/student/Settings';
import CoursePlayerPage from '../pages/dashboard/student/CoursePlayerPage';
import MyCourses from '../pages/dashboard/student/MyCourses';
import EditCoursePage from '../pages/dashboard/admin/EditCoursePage';

// Admin Pages (Placeholders for later)
import AdminHome from '../pages/dashboard/admin/adminHome';
import CreateCoursePage from '../pages/dashboard/admin/CreateCoursePage';
import CourseManagerPage from '../pages/dashboard/admin/CourseManagerPage';
import UserManagerPage from '../pages/dashboard/admin/UserManagerPage';
import AdminSettings from '../pages/dashboard/admin/Settings';
import LiveManager from '../pages/dashboard/admin/LiveManager';
import PendingOrders from '../pages/dashboard/admin/PendingOrders';


export default function AppRoutes() {
  return (
    <Routes>
      {/* ------------------------------------------- */}
      {/* 1. PUBLIC ROUTES                            */}
      {/* ------------------------------------------- */}
      <Route path="/" element={<Home />} />
      {/* <Route path="/login" element={<AuthSection />} /> */}
      <Route path="/live" element={<LiveSession />} />
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
        <Route index element={<StudentDashboard />} />
        
        {/* Loads at /dashboard/student/courses */}
        <Route path="courses" element={<MyCourses />} />
        <Route path="courses/:courseId" element={<CoursePlayerPage />} />
        
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
        <Route index element={<AdminHome />} />
        <Route path="live-management" element={<LiveManager />} />
        <Route path='courses/add' element={<CreateCoursePage />} />
        <Route path="courses" element={<CourseManagerPage />} />
        <Route path="courses/:id/edit" element={<EditCoursePage />} />
        <Route path="users" element={<UserManagerPage />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="orders/pending" element={<PendingOrders />} />
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