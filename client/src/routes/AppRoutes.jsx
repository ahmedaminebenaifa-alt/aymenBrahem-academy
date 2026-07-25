import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ---------------------------------------------------------
// 1. STATIC IMPORTS (Keep Layouts & Security Wrappers static)
// ---------------------------------------------------------
import ProtectedRoute from './ProtectedRoute';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';
import Loader from '../components/Loader'; // Adjust path to where you saved the Loader

// ---------------------------------------------------------
// 2. LAZY IMPORTS (Pages downloaded only when visited)
// ---------------------------------------------------------

// Public Pages
const Home = lazy(() => import('../pages/Home'));
const LiveSession = lazy(() => import('../pages/LiveSession'));
const CourseLandingPage = lazy(() => import('../pages/CourseLandingPage'));

// Student Pages
const StudentDashboard = lazy(() => import('../pages/dashboard/student/StudentDashboard'));
const StudentSettings = lazy(() => import('../pages/dashboard/student/Settings'));
const MyCourses = lazy(() => import('../pages/dashboard/student/MyCourses'));
const StructuredCoursePlayer = lazy(() => import('../pages/dashboard/student/StructuredCoursePlayer'));

// Admin Pages
const AdminHome = lazy(() => import('../pages/dashboard/admin/adminHome'));
const CreateCoursePage = lazy(() => import('../pages/dashboard/admin/CreateCoursePage'));
const CourseManagerPage = lazy(() => import('../pages/dashboard/admin/CourseManagerPage'));
const EditCoursePage = lazy(() => import('../pages/dashboard/admin/EditCoursePage'));
const UserManagerPage = lazy(() => import('../pages/dashboard/admin/UserManagerPage'));
const AdminSettings = lazy(() => import('../pages/dashboard/admin/Settings'));
const LiveManager = lazy(() => import('../pages/dashboard/admin/LiveManager'));
const PendingOrders = lazy(() => import('../pages/dashboard/admin/PendingOrders'));
const CourseStructureEditor = lazy(() => import('../pages/dashboard/admin/CourseStructureEditor'));

export default function AppRoutes() {
  return (
    /* Suspense wraps the entire routing tree and shows the Loader while chunks download */
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ------------------------------------------- */}
        {/* PUBLIC ROUTES                               */}
        {/* ------------------------------------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/live" element={<LiveSession />} />
        <Route path="/courses/:courseId" element={<CourseLandingPage />} />

        {/* ------------------------------------------- */}
        {/* STUDENT DASHBOARD (Nested Routing)          */}
        {/* ------------------------------------------- */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="courses/:courseId/structure" element={<StructuredCoursePlayer />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        {/* ------------------------------------------- */}
        {/* ADMIN DASHBOARD (Nested Routing)            */}
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
          <Route path="courses/add" element={<CreateCoursePage />} />
          <Route path="courses" element={<CourseManagerPage />} />
          <Route path="courses/:id/edit" element={<EditCoursePage />} />
          <Route path="courses/:courseId/structure" element={<CourseStructureEditor />} />
          <Route path="users" element={<UserManagerPage />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="orders/pending" element={<PendingOrders />} />
        </Route>

        {/* ------------------------------------------- */}
        {/* FALLBACK REDIRECTS                          */}
        {/* ------------------------------------------- */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/student" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}