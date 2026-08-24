import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==========================================
// Public / Student Pages
// ==========================================

import Home from "../pages/Home";
import StudentLogin from "../pages/StudentLogin";
import StudentRegister from "../pages/StudentRegister";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import StudentDashboard from "../pages/StudentDashboard";
import StudentChat from "../pages/StudentChat";
import StudentUniversityDetails from "../pages/StudentUniversityDetails";

// ==========================================
// Admin Pages
// ==========================================

import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminDocuments from "../pages/AdminDocuments";
import AdminInformation from "../pages/AdminInformation";
import AdminUniversities from "../pages/AdminUniversities";

// ==========================================
// Layout
// ==========================================

import MainLayout from "../layouts/MainLayout";

// ==========================================
// App Routes
// ==========================================

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================================
            Public Website
        ========================================== */}

        <Route element={<MainLayout />}>

          {/* Home Page */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* Student Login */}

          <Route
            path="/login"
            element={<StudentLogin />}
          />

          {/* Student Registration */}

          <Route
            path="/register"
            element={<StudentRegister />}
          />

          {/* Forgot Password */}

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* Reset Password */}

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

        </Route>

        {/* ==========================================
            Student Portal
        ========================================== */}

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        {/* ==========================================
            Student University Details
        ========================================== */}

        <Route
          path="/student/universities/:universityId"
          element={<StudentUniversityDetails />}
        />

        {/* ==========================================
            AI Student Assistant
        ========================================== */}

        <Route
          path="/student/chat"
          element={<StudentChat />}
        />

        {/* ==========================================
            Admin Portal
        ========================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* ==========================================
            Admin Knowledge Base
        ========================================== */}

        <Route
          path="/admin/documents"
          element={<AdminDocuments />}
        />

        <Route
          path="/admin/information"
          element={<AdminInformation />}
        />

        {/* ==========================================
            Universities Management
        ========================================== */}

        <Route
          path="/admin/universities"
          element={<AdminUniversities />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;