
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { useNavigate } from "react-router-dom";

// ==========================================
// Types
// ==========================================

interface DashboardStatistics {
  total_documents: number;
  knowledge_chunks: number;
  students: number;
  questions_asked: number;
}

interface AdminInfo {
  id: number;
  email: string;
  role: string;
}

interface DashboardResponse {
  success: boolean;
  admin: AdminInfo;
  statistics: DashboardStatistics;
}

// ==========================================
// API Configuration
// ==========================================

const API_URL = "https://ai-reserve-seats-assistant.onrender.com";

// ==========================================
// Component
// ==========================================

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ==========================================
  // Dashboard State
  // ==========================================

  const [statistics, setStatistics] =
    useState<DashboardStatistics>({
      total_documents: 0,
      knowledge_chunks: 0,
      students: 0,
      questions_asked: 0,
    });

  const [admin, setAdmin] =
    useState<AdminInfo | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // Upload State
  // ==========================================

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [uploadError, setUploadError] =
    useState("");

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  // ==========================================
  // Get Admin Token
  // ==========================================

  const getAdminToken = (): string | null => {
    return (
      localStorage.getItem("admin_access_token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token")
    );
  };

  // ==========================================
  // Clear Admin Authentication
  // ==========================================

  const clearAdminAuthentication = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

  // ==========================================
  // Load Dashboard
  // ==========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        setError(
          "Admin authentication token not found. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/dashboard`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      // ========================================
      // Unauthorized
      // ========================================

      if (response.status === 401) {
        clearAdminAuthentication();

        setError(
          "Your admin session has expired. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      // ========================================
      // Forbidden
      // ========================================

      if (response.status === 403) {
        setError(
          "Admin access is required to view this dashboard."
        );

        return;
      }

      // ========================================
      // Other Errors
      // ========================================

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to load admin dashboard."
        );
      }

      // ========================================
      // Validate Response
      // ========================================

      if (
        !data ||
        !data.statistics ||
        !data.admin
      ) {
        throw new Error(
          "Invalid dashboard response received from the backend."
        );
      }

      const dashboardData =
        data as DashboardResponse;

      setStatistics(
        dashboardData.statistics
      );

      setAdmin(
        dashboardData.admin
      );

    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load Dashboard on Page Open
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    clearAdminAuthentication();
    navigate("/admin/login");
  };

  // ==========================================
  // File Selection
  // ==========================================

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    setUploadMessage("");
    setUploadError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // ----------------------------------------
    // Check Extension
    // ----------------------------------------

    const fileName =
      file.name.toLowerCase();

    const isPdf =
      fileName.endsWith(".pdf");

    const isTxt =
      fileName.endsWith(".txt");

    if (!isPdf && !isTxt) {
      setSelectedFile(null);

      setUploadError(
        "Only PDF and TXT files are supported."
      );

      event.target.value = "";
      return;
    }

    // ----------------------------------------
    // Check File Size
    // ----------------------------------------

    const maxFileSize =
      20 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setSelectedFile(null);

      setUploadError(
        "File size must be less than 20 MB."
      );

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // ==========================================
  // Upload Knowledge Document
  // ==========================================

  const handleUploadDocument = async () => {
    setUploadMessage("");
    setUploadError("");

    if (!selectedFile) {
      setUploadError(
        "Please select a PDF or TXT file first."
      );

      return;
    }

    try {
      setUploading(true);

      const token =
        getAdminToken();

      if (!token) {
        setUploadError(
          "Admin authentication token not found. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      // ----------------------------------------
      // Create Form Data
      // ----------------------------------------

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      // ----------------------------------------
      // Upload Request
      // ----------------------------------------

      const response = await fetch(
        `${API_URL}/knowledge/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      // ----------------------------------------
      // Read Response
      // ----------------------------------------

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      // ----------------------------------------
      // Unauthorized
      // ----------------------------------------

      if (response.status === 401) {
        clearAdminAuthentication();

        setUploadError(
          "Your admin session has expired. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      // ----------------------------------------
      // Forbidden
      // ----------------------------------------

      if (response.status === 403) {
        setUploadError(
          "Admin access is required to upload documents."
        );

        return;
      }

      // ----------------------------------------
      // Other Errors
      // ----------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Document upload failed."
        );
      }

      // ----------------------------------------
      // Success
      // ----------------------------------------

      setUploadMessage(
        data?.message ||
          "Knowledge document uploaded successfully."
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // ----------------------------------------
      // Refresh Statistics
      // ----------------------------------------

      await loadDashboard();

    } catch (error) {
      console.error(
        "Document upload error:",
        error
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Unable to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // Navigation Helper
  // ==========================================

  const goTo = (path: string) => {
    navigate(path);
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="mx-auto max-w-7xl px-6">

          <div className="flex min-h-20 items-center justify-between gap-6">

            {/* Brand */}

            <button
              type="button"
              onClick={() =>
                goTo("/admin/dashboard")
              }
              className="flex items-center gap-3 text-left"
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-2xl">
                🛡️
              </div>

              <div>

                <h1 className="font-bold">
                  Directorate Reserve Seats
                </h1>

                <p className="text-xs text-slate-400">
                  Unified Administration Portal
                </p>

              </div>

            </button>

            {/* Desktop Navigation */}

            <nav className="hidden items-center gap-1 lg:flex">

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/dashboard")
                }
                className="rounded-lg bg-blue-600/15 px-3 py-2 text-sm font-medium text-blue-400"
              >
                Dashboard
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/documents")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Documents
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/universities")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Universities
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/information")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Information
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/students")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Students
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/analytics")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Analytics
              </button>

            </nav>

            {/* Admin Account */}

            <div className="flex items-center gap-3">

              <div className="hidden text-right xl:block">

                <p className="text-sm font-semibold">
                  {admin?.email ||
                    "Administrator"}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {admin?.role ||
                    "Admin"}
                </p>

              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Logout
              </button>

            </div>

          </div>

          {/* Mobile Navigation */}

          <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden">

            <button
              type="button"
              onClick={() =>
                goTo("/admin/dashboard")
              }
              className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                goTo("/admin/documents")
              }
              className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"
            >
              Documents
            </button>

            <button
              type="button"
              onClick={() =>
                goTo("/admin/universities")
              }
              className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"
            >
              Universities
            </button>

            <button
              type="button"
              onClick={() =>
                goTo("/admin/information")
              }
              className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"
            >
              Information
            </button>

            <button
              type="button"
              onClick={() =>
                goTo("/admin/students")
              }
              className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"
            >
              Students
            </button>

            <button
              type="button"
              onClick={() =>
                goTo("/admin/analytics")
              }
              className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"
            >
              Analytics
            </button>

          </div>

        </div>

      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* ====================================
            Welcome
        ==================================== */}

        <section>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-sm font-semibold text-blue-400">
                Unified Administration Dashboard
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Directorate Reserve Seats
              </h2>

              <p className="mt-3 max-w-3xl text-slate-400">
                Manage Directorate Reserve Seats documents,
                universities, official information, students
                and AI knowledge base from one centralized
                administration portal.
              </p>

            </div>

            <div className="rounded-xl border border-green-800/60 bg-green-950/30 px-4 py-3">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                <span className="text-sm font-semibold text-green-400">
                  Admin Portal Connected
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================
            Loading
        ==================================== */}

        {loading && (

          <div className="mt-8 rounded-xl border border-blue-900/50 bg-blue-950/30 p-5">

            <div className="flex items-center gap-3">

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />

              <p className="text-sm text-blue-300">
                Loading dashboard data...
              </p>

            </div>

          </div>

        )}

        {/* ====================================
            Error
        ==================================== */}

        {!loading && error && (

          <div className="mt-8 rounded-xl border border-red-800 bg-red-950/40 p-5">

            <p className="font-semibold text-red-300">
              Dashboard Error
            </p>

            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>

          </div>

        )}

        {/* ====================================
            Statistics
        ==================================== */}

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Documents */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Total Documents
              </p>

              <span className="text-xl">
                📄
              </span>

            </div>

            <p className="mt-3 text-3xl font-bold">
              {loading
                ? "..."
                : statistics.total_documents}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              PDF and text sources
            </p>

          </div>

          {/* Chunks */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Knowledge Chunks
              </p>

              <span className="text-xl">
                🧠
              </span>

            </div>

            <p className="mt-3 text-3xl font-bold">
              {loading
                ? "..."
                : statistics.knowledge_chunks}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Processed information
            </p>

          </div>

          {/* Students */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Students
              </p>

              <span className="text-xl">
                👥
              </span>

            </div>

            <p className="mt-3 text-3xl font-bold">
              {loading
                ? "..."
                : statistics.students}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Registered users
            </p>

          </div>

          {/* Questions */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Questions Asked
              </p>

              <span className="text-xl">
                💬
              </span>

            </div>

            <p className="mt-3 text-3xl font-bold">
              {loading
                ? "..."
                : statistics.questions_asked}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              AI assistant usage
            </p>

          </div>

        </section>

        {/* ====================================
            MAIN ADMIN MODULES
        ==================================== */}

        <section className="mt-10">

          <div className="mb-6">

            <p className="text-sm font-semibold text-blue-400">
              Administration Modules
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              Manage Everything From One Portal
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              All existing administration features are
              connected through this central dashboard.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* ==================================
                Directorate Documents
            ================================== */}

            <div className="rounded-2xl border border-blue-900/60 bg-gradient-to-br from-blue-950/50 to-slate-900 p-7">

              <div className="flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-2xl">
                  📄
                </div>

                <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-400">
                  Directorate
                </span>

              </div>

              <h3 className="mt-5 text-xl font-bold">
                Directorate Documents
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Upload and manage official Directorate
                Reserve Seats PDF and text documents
                used by the AI knowledge base.
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    goTo("/admin/documents")
                  }
                  className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Manage Documents
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(
                        "quick-upload"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Quick Upload
                </button>

              </div>

            </div>

            {/* ==================================
                Universities
            ================================== */}

            <div className="rounded-2xl border border-indigo-900/60 bg-gradient-to-br from-indigo-950/50 to-slate-900 p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-2xl">
                🎓
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Universities
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add, edit, delete and manage official
                universities, campuses, locations and
                university information.
              </p>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/universities")
                }
                className="mt-6 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Manage Universities →
              </button>

            </div>

            {/* ==================================
                Knowledge Base
            ================================== */}

            <div className="rounded-2xl border border-green-900/60 bg-gradient-to-br from-green-950/40 to-slate-900 p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600/20 text-2xl">
                📝
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Official Information
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add official information manually when
                content is not available inside a document.
              </p>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/information")
                }
                className="mt-6 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Add Information →
              </button>

            </div>

            {/* ==================================
                Students
            ================================== */}

            <div className="rounded-2xl border border-orange-900/60 bg-gradient-to-br from-orange-950/40 to-slate-900 p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600/20 text-2xl">
                👥
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Student Accounts
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                View registered students and manage
                student account access.
              </p>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/students")
                }
                className="mt-6 rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Manage Students →
              </button>

            </div>

            {/* ==================================
                Analytics
            ================================== */}

            <div className="rounded-2xl border border-cyan-900/60 bg-gradient-to-br from-cyan-950/40 to-slate-900 p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600/20 text-2xl">
                📊
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Analytics
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Monitor questions, usage and overall AI
                Student Assistant activity.
              </p>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/analytics")
                }
                className="mt-6 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                View Analytics →
              </button>

            </div>

            {/* ==================================
                Admin Account
            ================================== */}

            <div className="rounded-2xl border border-purple-900/60 bg-gradient-to-br from-purple-950/40 to-slate-900 p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-2xl">
                🛡️
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Administrator
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                View the currently authenticated
                administrator account and session information.
              </p>

              {admin && (

                <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4">

                  <p className="break-all text-xs text-slate-400">
                    {admin.email}
                  </p>

                  <p className="mt-1 text-xs capitalize text-purple-400">
                    {admin.role}
                  </p>

                </div>

              )}

            </div>

          </div>

        </section>

        {/* ====================================
            QUICK UPLOAD
        ==================================== */}

        <section
          id="quick-upload"
          className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-7"
        >

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-xl">
                  📤
                </div>

                <div>

                  <p className="text-sm font-semibold text-blue-400">
                    Quick Upload
                  </p>

                  <h3 className="text-xl font-bold">
                    Add Directorate Knowledge
                  </h3>

                </div>

              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Upload an official PDF or TXT file directly
                from the central admin dashboard. This uses
                your existing knowledge upload system.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                goTo("/admin/documents")
              }
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Full Document Manager →
            </button>

          </div>

          <div className="mt-7">

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-300 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            />

          </div>

          {/* Selected File */}

          {selectedFile && (

            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800 p-4">

              <p className="text-sm font-medium text-white">
                Selected File
              </p>

              <p className="mt-1 break-all text-sm text-slate-400">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>

            </div>

          )}

          {/* Upload Error */}

          {uploadError && (

            <div className="mt-4 rounded-lg border border-red-800 bg-red-950/40 p-4">

              <p className="text-sm text-red-400">
                {uploadError}
              </p>

            </div>

          )}

          {/* Upload Success */}

          {uploadMessage && (

            <div className="mt-4 rounded-lg border border-green-800 bg-green-950/40 p-4">

              <p className="text-sm text-green-400">
                ✓ {uploadMessage}
              </p>

            </div>

          )}

          <button
            type="button"
            onClick={handleUploadDocument}
            disabled={
              uploading ||
              !selectedFile
            }
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : "Upload Document"}
          </button>

        </section>

        {/* ====================================
            SYSTEM STATUS
        ==================================== */}

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h3 className="font-bold">
                System Status
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Unified administration portal is connected
                to the Directorate Reserve Seats backend.
              </p>

            </div>

            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

              <span className="text-sm font-semibold text-green-400">
                Backend Connected
              </span>

            </div>

          </div>

        </section>

        {/* ====================================
            ADMIN INFORMATION
        ==================================== */}

        {admin && (

          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="font-bold">
              Current Administrator
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">

              <div>

                <p className="text-xs text-slate-500">
                  Admin ID
                </p>

                <p className="mt-1 text-sm font-medium">
                  {admin.id}
                </p>

              </div>

              <div>

                <p className="text-xs text-slate-500">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-medium">
                  {admin.email}
                </p>

              </div>

              <div>

                <p className="text-xs text-slate-500">
                  Role
                </p>

                <p className="mt-1 text-sm font-medium capitalize">
                  {admin.role}
                </p>

              </div>

            </div>

          </section>

        )}

      </main>

      {/* ======================================
          FOOTER
      ====================================== */}

      <footer className="border-t border-slate-800 bg-slate-950">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

            <p className="text-xs text-slate-500">
              Directorate Reserve Seats of Balochistan
            </p>

            <p className="text-xs text-slate-600">
              Unified Administration Portal
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default AdminDashboard;