import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// Types
// ============================================================

interface University {
  id: number;
  name: string;
  university_type?: string | null;
  province?: string | null;
  city?: string | null;
  campus?: string | null;
  official_website?: string | null;
  admission_portal?: string | null;
  hec_recognized?: number | boolean;
  hec_recognition_source?: string | null;
  description?: string | null;
  academic_session?: string | null;
  is_active?: number | boolean;
}

interface UniversityForm {
  name: string;
  university_type: string;
  province: string;
  city: string;
  campus: string;
  official_website: string;
  admission_portal: string;
  hec_recognized: boolean;
  hec_recognition_source: string;
  description: string;
  academic_session: string;
}

// ============================================================
// Constants
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000";

// ============================================================
// Empty University Form
// ============================================================

const emptyUniversityForm: UniversityForm = {
  name: "",
  university_type: "",
  province: "",
  city: "",
  campus: "",
  official_website: "",
  admission_portal: "",
  hec_recognized: false,
  hec_recognition_source: "",
  description: "",
  academic_session: "",
};

// ============================================================
// Component
// ============================================================

const AdminInformation = () => {
  const navigate = useNavigate();

  // ==========================================================
  // Official Information State
  // ==========================================================

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================
  // University State
  // ==========================================================

  const [universities, setUniversities] = useState<University[]>([]);

  const [universityForm, setUniversityForm] =
    useState<UniversityForm>(emptyUniversityForm);

  const [editingUniversityId, setEditingUniversityId] =
    useState<number | null>(null);

  const [loadingUniversities, setLoadingUniversities] =
    useState(false);

  const [savingUniversity, setSavingUniversity] =
    useState(false);

  const [universityError, setUniversityError] =
    useState("");

  const [universitySuccess, setUniversitySuccess] =
    useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // ==========================================================
  // Get Admin Token
  // ==========================================================

  const getAdminToken = () => {
    return (
      localStorage.getItem("admin_access_token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token")
    );
  };

  // ==========================================================
  // Load Universities
  // ==========================================================

  const loadUniversities = async () => {
    try {
      setLoadingUniversities(true);
      setUniversityError("");

      const response = await fetch(
        `${API_BASE_URL}/universities/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to load universities."
        );
      }

      setUniversities(data?.universities || []);
    } catch (error) {
      console.error(
        "Load universities error:",
        error
      );

      setUniversityError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend."
      );
    } finally {
      setLoadingUniversities(false);
    }
  };

  // ==========================================================
  // Load Universities On Page Load
  // ==========================================================

  useEffect(() => {
    loadUniversities();
  }, []);

  // ==========================================================
  // Save Official Information
  // ==========================================================

  const handleSaveInformation = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle) {
      setErrorMessage("Please enter a title.");
      return;
    }

    if (!cleanContent) {
      setErrorMessage("Please enter the information.");
      return;
    }

    try {
      setSaving(true);

      const token = getAdminToken();

      if (!token) {
        setErrorMessage(
          "Admin authentication token not found. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/information`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: cleanTitle,
            content: cleanContent,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "admin_access_token"
        );
        localStorage.removeItem("adminToken");
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");

        setErrorMessage(
          "Your admin session has expired. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      if (response.status === 403) {
        setErrorMessage(
          "Admin access is required to add information."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to save information."
        );
      }

      setSuccessMessage(
        data?.message ||
          "Information added successfully."
      );

      setTitle("");
      setContent("");
    } catch (error) {
      console.error(
        "Add information error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // Handle University Input
  // ==========================================================

  const handleUniversityChange = (
    field: keyof UniversityForm,
    value: string | boolean
  ) => {
    setUniversityForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================================
  // Reset University Form
  // ==========================================================

  const resetUniversityForm = () => {
    setUniversityForm(emptyUniversityForm);
    setEditingUniversityId(null);
    setUniversityError("");
    setUniversitySuccess("");
  };

  // ==========================================================
  // Create / Update University
  // ==========================================================

  const handleSaveUniversity = async () => {
    setUniversityError("");
    setUniversitySuccess("");

    const cleanName = universityForm.name.trim();

    if (!cleanName) {
      setUniversityError(
        "University name is required."
      );
      return;
    }

    try {
      setSavingUniversity(true);

      const isEditing =
        editingUniversityId !== null;

      const url = isEditing
        ? `${API_BASE_URL}/universities/${editingUniversityId}`
        : `${API_BASE_URL}/universities/`;

      const method = isEditing ? "PUT" : "POST";

      const body = {
        name: cleanName,
        university_type:
          universityForm.university_type.trim() ||
          null,
        province:
          universityForm.province.trim() || null,
        city:
          universityForm.city.trim() || null,
        campus:
          universityForm.campus.trim() || null,
        official_website:
          universityForm.official_website.trim() ||
          null,
        admission_portal:
          universityForm.admission_portal.trim() ||
          null,
        hec_recognized:
          universityForm.hec_recognized,
        hec_recognition_source:
          universityForm.hec_recognition_source.trim() ||
          null,
        description:
          universityForm.description.trim() ||
          null,
        academic_session:
          universityForm.academic_session.trim() ||
          null,
      };

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to save university."
        );
      }

      setUniversitySuccess(
        data?.message ||
          (isEditing
            ? "University updated successfully."
            : "University added successfully.")
      );

      resetUniversityForm();

      await loadUniversities();
    } catch (error) {
      console.error(
        "Save university error:",
        error
      );

      setUniversityError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend."
      );
    } finally {
      setSavingUniversity(false);
    }
  };

  // ==========================================================
  // Edit University
  // ==========================================================

  const handleEditUniversity = (
    university: University
  ) => {
    setEditingUniversityId(university.id);

    setUniversityForm({
      name: university.name || "",
      university_type:
        university.university_type || "",
      province:
        university.province || "",
      city:
        university.city || "",
      campus:
        university.campus || "",
      official_website:
        university.official_website || "",
      admission_portal:
        university.admission_portal || "",
      hec_recognized:
        Boolean(university.hec_recognized),
      hec_recognition_source:
        university.hec_recognition_source || "",
      description:
        university.description || "",
      academic_session:
        university.academic_session || "",
    });

    setUniversityError("");
    setUniversitySuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // Delete University
  // ==========================================================

  const handleDeleteUniversity = async (
    universityId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this university?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUniversityError("");
      setUniversitySuccess("");

      const response = await fetch(
        `${API_BASE_URL}/universities/${universityId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to delete university."
        );
      }

      setUniversitySuccess(
        data?.message ||
          "University deleted successfully."
      );

      if (
        editingUniversityId === universityId
      ) {
        resetUniversityForm();
      }

      await loadUniversities();
    } catch (error) {
      console.error(
        "Delete university error:",
        error
      );

      setUniversityError(
        error instanceof Error
          ? error.message
          : "Unable to delete university."
      );
    }
  };

  // ==========================================================
  // Filter Universities
  // ==========================================================

  const filteredUniversities =
    universities.filter((university) => {
      const query =
        searchQuery.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        university.name
          ?.toLowerCase()
          .includes(query) ||
        university.city
          ?.toLowerCase()
          .includes(query) ||
        university.province
          ?.toLowerCase()
          .includes(query) ||
        university.university_type
          ?.toLowerCase()
          .includes(query)
      );
    });

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================================
          Header
      ====================================================== */}

      <header className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600/20 text-2xl">
              🏛️
            </div>

            <div>

              <h1 className="font-bold">
                Administration
              </h1>

              <p className="text-xs text-slate-400">
                Directorate Reserve Seats
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            ← Dashboard
          </button>

        </div>

      </header>

      {/* ======================================================
          Main
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* ====================================================
            Page Heading
        ==================================================== */}

        <section>

          <p className="text-sm font-semibold text-green-400">
            Administration
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            University Information Management
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400">
            Manage official university information,
            admission details, and student-related
            information used by the Directorate system.
          </p>

        </section>

        {/* ====================================================
            University Form
        ==================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-7">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

            <div>

              <p className="text-sm font-semibold text-blue-400">
                University Management
              </p>

              <h3 className="mt-1 text-xl font-bold">
                {editingUniversityId !== null
                  ? "Edit University"
                  : "Add University"}
              </h3>

            </div>

            {editingUniversityId !== null && (
              <button
                type="button"
                onClick={resetUniversityForm}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel Edit
              </button>
            )}

          </div>

          {/* University Name */}

          <div>
            <label
              htmlFor="university-name"
              className="text-sm font-semibold text-slate-200"
            >
              University Name *
            </label>

            <input
              id="university-name"
              type="text"
              value={universityForm.name}
              onChange={(event) =>
                handleUniversityChange(
                  "name",
                  event.target.value
                )
              }
              placeholder="Example: University of Okara"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Grid */}

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* University Type */}

            <div>

              <label className="text-sm font-semibold text-slate-200">
                University Type
              </label>

              <input
                type="text"
                value={
                  universityForm.university_type
                }
                onChange={(event) =>
                  handleUniversityChange(
                    "university_type",
                    event.target.value
                  )
                }
                placeholder="Public / Private"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

            {/* Province */}

            <div>

              <label className="text-sm font-semibold text-slate-200">
                Province
              </label>

              <input
                type="text"
                value={
                  universityForm.province
                }
                onChange={(event) =>
                  handleUniversityChange(
                    "province",
                    event.target.value
                  )
                }
                placeholder="Punjab"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

            {/* City */}

            <div>

              <label className="text-sm font-semibold text-slate-200">
                City
              </label>

              <input
                type="text"
                value={universityForm.city}
                onChange={(event) =>
                  handleUniversityChange(
                    "city",
                    event.target.value
                  )
                }
                placeholder="Okara"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

            {/* Campus */}

            <div>

              <label className="text-sm font-semibold text-slate-200">
                Campus
              </label>

              <input
                type="text"
                value={universityForm.campus}
                onChange={(event) =>
                  handleUniversityChange(
                    "campus",
                    event.target.value
                  )
                }
                placeholder="Main Campus"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

            {/* Official Website */}

            <div>

              <label className="text-sm font-semibold text-slate-200">
                Official Website
              </label>

              <input
                type="url"
                value={
                  universityForm.official_website
                }
                onChange={(event) =>
                  handleUniversityChange(
                    "official_website",
                    event.target.value
                  )
                }
                placeholder="https://example.edu.pk"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

            {/* Admission Portal */}

            <div>

              <label className="text-sm font-semibold text-slate-200">
                Admission Portal
              </label>

              <input
                type="url"
                value={
                  universityForm.admission_portal
                }
                onChange={(event) =>
                  handleUniversityChange(
                    "admission_portal",
                    event.target.value
                  )
                }
                placeholder="https://admissions.example.edu.pk"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

            {/* HEC Source */}

            <div>

              <label className="text-sm font-semibold text-slate-200">
                HEC Recognition Source
              </label>

              <input
                type="text"
                value={
                  universityForm.hec_recognition_source
                }
                onChange={(event) =>
                  handleUniversityChange(
                    "hec_recognition_source",
                    event.target.value
                  )
                }
                placeholder="HEC official source"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

            {/* Academic Session */}

            <div>

              <label className="text-sm font-semibold text-slate-200">
                Academic Session
              </label>

              <input
                type="text"
                value={
                  universityForm.academic_session
                }
                onChange={(event) =>
                  handleUniversityChange(
                    "academic_session",
                    event.target.value
                  )
                }
                placeholder="2026-27"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* HEC Checkbox */}

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">

            <label className="flex cursor-pointer items-center gap-3">

              <input
                type="checkbox"
                checked={
                  universityForm.hec_recognized
                }
                onChange={(event) =>
                  handleUniversityChange(
                    "hec_recognized",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-sm font-medium text-slate-200">
                HEC Recognized
              </span>

            </label>

          </div>

          {/* Description */}

          <div className="mt-6">

            <label className="text-sm font-semibold text-slate-200">
              Description
            </label>

            <textarea
              value={
                universityForm.description
              }
              onChange={(event) =>
                handleUniversityChange(
                  "description",
                  event.target.value
                )
              }
              rows={5}
              placeholder="Enter official university description..."
              className="mt-2 w-full resize-y rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

          </div>

          {/* University Messages */}

          {universityError && (
            <div className="mt-5 rounded-lg border border-red-800 bg-red-950/40 p-4">
              <p className="text-sm font-medium text-red-300">
                {universityError}
              </p>
            </div>
          )}

          {universitySuccess && (
            <div className="mt-5 rounded-lg border border-green-800 bg-green-950/40 p-4">
              <p className="text-sm font-medium text-green-400">
                ✓ {universitySuccess}
              </p>
            </div>
          )}

          {/* Buttons */}

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={handleSaveUniversity}
              disabled={savingUniversity}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingUniversity
                ? "Saving..."
                : editingUniversityId !== null
                ? "Update University"
                : "Add University"}
            </button>

            <button
              type="button"
              onClick={resetUniversityForm}
              disabled={savingUniversity}
              className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>

          </div>

        </section>

        {/* ====================================================
            University List
        ==================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-7">

          <div className="flex flex-wrap items-end justify-between gap-5">

            <div>

              <p className="text-sm font-semibold text-blue-400">
                University Database
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Universities
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {universities.length} universities
                available in the database.
              </p>

            </div>

            <div className="w-full md:w-80">

              <label className="sr-only">
                Search universities
              </label>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search university..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* Loading */}

          {loadingUniversities && (
            <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-5 text-center">
              <p className="text-sm text-slate-400">
                Loading universities...
              </p>
            </div>
          )}

          {/* Empty */}

          {!loadingUniversities &&
            filteredUniversities.length === 0 && (
              <div className="mt-6 rounded-lg border border-dashed border-slate-700 bg-slate-950 p-8 text-center">

                <div className="text-4xl">
                  🏛️
                </div>

                <h4 className="mt-3 font-semibold">
                  No universities found
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  Add a university using the form
                  above.
                </p>

              </div>
            )}

          {/* University Cards */}

          {!loadingUniversities &&
            filteredUniversities.length > 0 && (
              <div className="mt-6 grid gap-4">

                {filteredUniversities.map(
                  (university) => (
                    <div
                      key={university.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-5 transition hover:border-slate-700"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* Information */}

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-3">

                            <h4 className="text-lg font-bold text-white">
                              {university.name}
                            </h4>

                            {Boolean(
                              university.hec_recognized
                            ) && (
                              <span className="rounded-full bg-green-950 px-3 py-1 text-xs font-semibold text-green-400">
                                HEC Recognized
                              </span>
                            )}

                          </div>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">

                            {university.university_type && (
                              <span>
                                🏛️{" "}
                                {university.university_type}
                              </span>
                            )}

                            {university.city && (
                              <span>
                                📍{" "}
                                {university.city}
                              </span>
                            )}

                            {university.province && (
                              <span>
                                🗺️{" "}
                                {university.province}
                              </span>
                            )}

                            {university.campus && (
                              <span>
                                🏫{" "}
                                {university.campus}
                              </span>
                            )}

                            {university.academic_session && (
                              <span>
                                📅{" "}
                                {
                                  university.academic_session
                                }
                              </span>
                            )}

                          </div>

                          {university.description && (
                            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">
                              {
                                university.description
                              }
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-4 text-xs">

                            {university.official_website && (
                              <a
                                href={
                                  university.official_website
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                Official Website ↗
                              </a>
                            )}

                            {university.admission_portal && (
                              <a
                                href={
                                  university.admission_portal
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-green-400 hover:text-green-300"
                              >
                                Admission Portal ↗
                              </a>
                            )}

                          </div>

                        </div>

                        {/* Actions */}

                        <div className="flex shrink-0 flex-wrap gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditUniversity(
                                university
                              )
                            }
                            className="rounded-lg border border-blue-800 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-950"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/information?university=${university.id}`
                              )
                            }
                            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteUniversity(
                                university.id
                              )
                            }
                            className="rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

        </section>

        {/* ====================================================
            Official Information
        ==================================================== */}

        <section className="mt-10">

          <div>

            <p className="text-sm font-semibold text-green-400">
              Knowledge Base
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              Add Official Information
            </h3>

            <p className="mt-3 max-w-3xl text-slate-400">
              Add official information manually to the AI
              knowledge base. The AI Student Assistant can
              use this information when answering student
              questions.
            </p>

          </div>

          {/* Form Card */}

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-7">

            {/* Title */}

            <div>

              <label
                htmlFor="information-title"
                className="text-sm font-semibold text-slate-200"
              >
                Information Title
              </label>

              <input
                id="information-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Example: Reserved Seats Eligibility"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

            {/* Content */}

            <div className="mt-6">

              <label
                htmlFor="information-content"
                className="text-sm font-semibold text-slate-200"
              >
                Official Information
              </label>

              <textarea
                id="information-content"
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Enter the official information here..."
                rows={12}
                className="mt-2 w-full resize-y rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-500">

                <span>
                  Enter accurate official information.
                </span>

                <span>
                  {content.length} characters
                </span>

              </div>

            </div>

            {/* Error */}

            {errorMessage && (
              <div className="mt-5 rounded-lg border border-red-800 bg-red-950/40 p-4">

                <p className="text-sm font-medium text-red-300">
                  {errorMessage}
                </p>

              </div>
            )}

            {/* Success */}

            {successMessage && (
              <div className="mt-5 rounded-lg border border-green-800 bg-green-950/40 p-4">

                <p className="text-sm font-medium text-green-400">
                  ✓ {successMessage}
                </p>

              </div>
            )}

            {/* Buttons */}

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={
                  handleSaveInformation
                }
                disabled={saving}
                className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Information"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setContent("");
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                disabled={saving}
                className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/documents")
                }
                className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                View Documents
              </button>

            </div>

          </div>

        </section>

        {/* ====================================================
            Important Information
        ==================================================== */}

        <section className="mt-6 rounded-2xl border border-blue-900/50 bg-blue-950/20 p-6">

          <div className="flex gap-4">

            <div className="text-2xl">
              💡
            </div>

            <div>

              <h3 className="font-bold text-blue-300">
                Important
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Only add verified and official information.
                University information should be checked
                against official university or HEC sources
                before being used by the AI Student Assistant.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default AdminInformation;