import { useEffect, useState } from "react";
import universityApi from "../services/universityApi";
import type { University } from "../services/universityApi";

interface Student {
  id: number;
  full_name: string;
  email: string;
}

interface ChatHistoryItem {
  id: number;
  student_id: number;
  question: string;
  answer: string;
  created_at: string;
}

const API_URL = "https://ai-reserve-seats-assistant.onrender.com";

const StudentDashboard = () => {
  // ==========================================
  // Student State
  // ==========================================

  const [student, setStudent] = useState<Student | null>(null);

  const [history, setHistory] = useState<ChatHistoryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // University State
  // ==========================================

  const [universities, setUniversities] = useState<University[]>([]);

  const [universityLoading, setUniversityLoading] =
    useState(true);

  const [universityError, setUniversityError] =
    useState("");

  const [universitySearch, setUniversitySearch] =
    useState("");

  const [selectedProvince, setSelectedProvince] =
    useState("");

  const [selectedCity, setSelectedCity] =
    useState("");

  const [selectedUniversityType, setSelectedUniversityType] =
    useState("");

  // ==========================================
  // Load Student Dashboard
  // ==========================================

  useEffect(() => {
    const loadDashboard = async () => {
      const accessToken =
        localStorage.getItem("access_token");

      if (!accessToken) {
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);
        setError("");

        // ======================================
        // Get Current Student
        // ======================================

        const studentResponse = await fetch(
          `${API_URL}/auth/student/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const studentData =
          await studentResponse.json();

        // ======================================
        // Authentication Error
        // ======================================

        if (studentResponse.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("student");

          window.location.href = "/login";
          return;
        }

        if (!studentResponse.ok) {
          throw new Error(
            studentData.detail ||
              "Unable to load student profile."
          );
        }

        setStudent(studentData.student);

        localStorage.setItem(
          "student",
          JSON.stringify(studentData.student)
        );

        // ======================================
        // Get Chat History
        // ======================================

        const historyResponse = await fetch(
          `${API_URL}/qa/history`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const historyData =
          await historyResponse.json();

        // ======================================
        // History Authentication Error
        // ======================================

        if (historyResponse.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("student");

          window.location.href = "/login";
          return;
        }

        if (!historyResponse.ok) {
          throw new Error(
            historyData.detail ||
              "Unable to load chat history."
          );
        }

        setHistory(historyData.history || []);
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ==========================================
  // Load Universities
  // ==========================================

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setUniversityLoading(true);
        setUniversityError("");

        const response =
          await universityApi.getUniversities();

        setUniversities(
          response.universities || []
        );
      } catch (error) {
        console.error(
          "University loading error:",
          error
        );

        setUniversityError(
          error instanceof Error
            ? error.message
            : "Unable to load universities."
        );
      } finally {
        setUniversityLoading(false);
      }
    };

    loadUniversities();
  }, []);

  // ==========================================
  // Search Universities
  // ==========================================

  const handleUniversitySearch = async () => {
    try {
      setUniversityLoading(true);
      setUniversityError("");

      const response =
        await universityApi.searchUniversities({
          query:
            universitySearch.trim() || undefined,

          province:
            selectedProvince || undefined,

          city:
            selectedCity || undefined,

          university_type:
            selectedUniversityType || undefined,
        });

      setUniversities(
        response.universities || []
      );
    } catch (error) {
      console.error(
        "University search error:",
        error
      );

      setUniversityError(
        error instanceof Error
          ? error.message
          : "Unable to search universities."
      );
    } finally {
      setUniversityLoading(false);
    }
  };

  // ==========================================
  // Clear University Filters
  // ==========================================

  const clearUniversityFilters = async () => {
    setUniversitySearch("");
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedUniversityType("");

    try {
      setUniversityLoading(true);
      setUniversityError("");

      const response =
        await universityApi.getUniversities();

      setUniversities(
        response.universities || []
      );
    } catch (error) {
      console.error(
        "University reload error:",
        error
      );

      setUniversityError(
        error instanceof Error
          ? error.message
          : "Unable to reload universities."
      );
    } finally {
      setUniversityLoading(false);
    }
  };

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("student");

    window.location.href = "/login";
  };

  // ==========================================
  // Open AI Assistant
  // ==========================================

  const openAssistant = () => {
    window.location.href = "/student/chat";
  };

  // ==========================================
  // View University Details
  // ==========================================

  const openUniversityDetails = (
    universityId: number
  ) => {
    window.location.href =
      `/student/universities/${universityId}`;
  };

  // ==========================================
  // Loading Screen
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading student dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Dashboard
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================
          Dashboard Header
      ====================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Student Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Directorate Reserve Seats
            </p>
          </div>

          <div className="flex items-center gap-4">

            {student && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {student.full_name}
                </p>

                <p className="text-xs text-slate-500">
                  {student.email}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* ======================================
          Dashboard Content
      ====================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* ====================================
            Welcome
        ==================================== */}

        <section>
          <p className="text-sm font-medium text-blue-600">
            Student Portal
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {student
              ? `Welcome, ${student.full_name}`
              : "Welcome to your dashboard"}
          </h2>

          <p className="mt-3 max-w-3xl text-slate-600">
            Access the AI Student Assistant,
            explore universities, check admission
            information and get guidance about
            reserved seats and eligibility.
          </p>
        </section>

        {/* ====================================
            Error
        ==================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* ====================================
            Statistics
        ==================================== */}

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Questions */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Questions Asked
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {history.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                💬
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Questions asked through AI Assistant
            </p>
          </div>

          {/* Account */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Account
                </p>

                <p className="mt-2 text-lg font-bold text-green-600">
                  Active
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                ✓
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Student account is authenticated
            </p>
          </div>

          {/* AI Assistant */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  AI Assistant
                </p>

                <p className="mt-2 text-lg font-bold text-blue-600">
                  Available
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                🤖
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Official knowledge assistant
            </p>
          </div>

        </section>

        {/* ====================================
            Main Dashboard Cards
        ==================================== */}

        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* AI Assistant */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              🤖
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              AI Student Assistant
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ask questions and get guidance
              based on official information
              provided by the Directorate.
            </p>

            <button
              type="button"
              onClick={openAssistant}
              className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Open AI Assistant →
            </button>

          </div>

          {/* Universities */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
              🎓
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Universities
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore universities, programs,
              admission information, fees and
              eligibility requirements.
            </p>

            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("universities")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
              className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Explore Universities →
            </button>

          </div>

          {/* Information */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              📚
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Reserved Seats Information
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore important information about
              reserved seats, admission procedures
              and eligibility.
            </p>

            <button
              type="button"
              onClick={openAssistant}
              className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Ask AI About Information →
            </button>

          </div>

          {/* Profile */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              👤
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              My Profile
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {student
                ? student.email
                : "View your student account information."}
            </p>

            <button
              type="button"
              onClick={() => {
                window.alert(
                  student
                    ? `Name: ${student.full_name}\nEmail: ${student.email}`
                    : "Student profile unavailable."
                );
              }}
              className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View Profile →
            </button>

          </div>

        </section>

        {/* ====================================
            Universities Section
        ==================================== */}

        <section
          id="universities"
          className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          {/* Section Header */}

          <div className="border-b border-slate-200 px-6 py-6">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  University Management
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  Explore Universities
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Browse universities available in the
                  Directorate Reserve Seats information system.
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 px-4 py-3">
                <p className="text-xs text-blue-600">
                  Universities Available
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-700">
                  {universities.length}
                </p>
              </div>

            </div>

            {/* Search and Filters */}

            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">

              {/* Search */}

              <div className="lg:col-span-2">
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Search University
                </label>

                <input
                  type="text"
                  value={universitySearch}
                  onChange={(event) =>
                    setUniversitySearch(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleUniversitySearch();
                    }
                  }}
                  placeholder="Search by university name..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Province */}

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Province
                </label>

                <input
                  type="text"
                  value={selectedProvince}
                  onChange={(event) =>
                    setSelectedProvince(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Balochistan"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* City */}

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  City
                </label>

                <input
                  type="text"
                  value={selectedCity}
                  onChange={(event) =>
                    setSelectedCity(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Quetta"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* University Type */}

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">

              <input
                type="text"
                value={selectedUniversityType}
                onChange={(event) =>
                  setSelectedUniversityType(
                    event.target.value
                  )
                }
                placeholder="University type e.g. Public, Private"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={handleUniversitySearch}
                disabled={universityLoading}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {universityLoading
                  ? "Searching..."
                  : "Search"}
              </button>

              <button
                type="button"
                onClick={clearUniversityFilters}
                disabled={universityLoading}
                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>

            </div>

          </div>

          {/* University Error */}

          {universityError && (
            <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">
                Unable to load universities
              </p>

              <p className="mt-1 text-sm text-red-600">
                {universityError}
              </p>
            </div>
          )}

          {/* University Loading */}

          {universityLoading && (
            <div className="flex items-center justify-center px-6 py-12">
              <div className="text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="mt-3 text-sm text-slate-500">
                  Loading universities...
                </p>

              </div>
            </div>
          )}

          {/* No Universities */}

          {!universityLoading &&
            !universityError &&
            universities.length === 0 && (
              <div className="px-6 py-12 text-center">

                <div className="text-4xl">
                  🎓
                </div>

                <h4 className="mt-3 font-semibold text-slate-800">
                  No universities found
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>

              </div>
            )}

          {/* University Cards */}

          {!universityLoading &&
            universities.length > 0 && (
              <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">

                {universities.map((university) => (

                  <div
                    key={university.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  >

                    {/* University Icon */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                        🎓
                      </div>

                      {Boolean(
                        university.hec_recognized
                      ) && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          HEC Recognized
                        </span>
                      )}

                    </div>

                    {/* Name */}

                    <h4 className="mt-5 line-clamp-2 text-lg font-bold text-slate-900">
                      {university.name}
                    </h4>

                    {/* University Type */}

                    {university.university_type && (
                      <p className="mt-2 text-sm font-medium text-blue-600">
                        {university.university_type}
                      </p>
                    )}

                    {/* Location */}

                    <div className="mt-4 space-y-2">

                      {(university.city ||
                        university.province) && (
                        <div className="flex gap-2 text-sm text-slate-600">
                          <span>📍</span>

                          <span>
                            {[
                              university.city,
                              university.province,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}

                      {university.campus && (
                        <div className="flex gap-2 text-sm text-slate-600">
                          <span>🏫</span>

                          <span>
                            {university.campus}
                          </span>
                        </div>
                      )}

                      {university.academic_session && (
                        <div className="flex gap-2 text-sm text-slate-600">
                          <span>📅</span>

                          <span>
                            {university.academic_session}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* Description */}

                    {university.description && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                        {university.description}
                      </p>
                    )}

                    {/* Buttons */}

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">

                      <button
                        type="button"
                        onClick={() =>
                          openUniversityDetails(
                            university.id
                          )
                        }
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Details
                      </button>

                      {university.official_website && (
                        <a
                          href={
                            university.official_website
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Official Website
                        </a>
                      )}

                    </div>

                  </div>

                ))}

              </div>
            )}

        </section>

        {/* ====================================
            Recent Chat History
        ==================================== */}

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recent AI Conversations
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your recent questions and AI
                  assistant responses.
                </p>
              </div>

              <button
                type="button"
                onClick={openAssistant}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Open AI Assistant →
              </button>

            </div>

          </div>

          <div className="p-6">

            {history.length === 0 ? (

              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                <div className="text-3xl">
                  💬
                </div>

                <h4 className="mt-3 font-semibold text-slate-800">
                  No conversations yet
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Start asking questions from the
                  AI Student Assistant.
                </p>

                <button
                  type="button"
                  onClick={openAssistant}
                  className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Ask Your First Question
                </button>

              </div>

            ) : (

              <div className="space-y-4">

                {history
                  .slice(0, 5)
                  .map((item) => (

                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 p-5"
                    >

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                          💬
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-semibold text-slate-900">
                            {item.question}
                          </p>

                          <div className="mt-3 rounded-lg bg-slate-50 p-4">

                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {item.answer}
                            </p>

                          </div>

                          <p className="mt-3 text-xs text-slate-400">
                            {item.created_at}
                          </p>

                        </div>

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </div>

        </section>

        {/* ====================================
            Quick Help
        ==================================== */}

        <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Need help?
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Ask our AI assistant about eligibility,
                universities, programs, documents or
                reserved seat procedures.
              </p>
            </div>

            <button
              type="button"
              onClick={openAssistant}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Ask AI Assistant
            </button>

          </div>

        </section>

      </main>

    </div>
  );
};

export default StudentDashboard;