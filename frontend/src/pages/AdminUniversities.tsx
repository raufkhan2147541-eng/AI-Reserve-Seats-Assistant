import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";

// ==========================================
// API Configuration
// ==========================================

const API_URL = "https://ai-reserve-seats-assistant.onrender.com";

// ==========================================
// Types
// ==========================================

interface University {
  id: number;
  name: string;
  code: string;
  city: string;
  province: string;
  website: string;
  description: string;
  is_active: boolean;
}

interface UniversityFormData {
  name: string;
  code: string;
  city: string;
  province: string;
  website: string;
  description: string;
  is_active: boolean;
}

// ==========================================
// Empty Form
// ==========================================

const emptyForm: UniversityFormData = {
  name: "",
  code: "",
  city: "",
  province: "",
  website: "",
  description: "",
  is_active: true,
};

// ==========================================
// Component
// ==========================================

const AdminUniversities = () => {
  const navigate = useNavigate();

  // ==========================================
  // State
  // ==========================================

  const [universities, setUniversities] = useState<University[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingUniversity, setEditingUniversity] =
    useState<University | null>(null);

  const [formData, setFormData] =
    useState<UniversityFormData>(emptyForm);

  // ==========================================
  // Get Authentication Token
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
  // Clear Authentication
  // ==========================================

  const clearAdminAuthentication = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

  // ==========================================
  // Handle Unauthorized
  // ==========================================

  const handleUnauthorized = () => {
    clearAdminAuthentication();

    navigate("/admin/login");
  };

  // ==========================================
  // Load Universities
  // ==========================================

  const loadUniversities = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      // ----------------------------------------
      // Token optional check
      // ----------------------------------------

      if (!token) {
        navigate("/admin/login");
        return;
      }

      // ----------------------------------------
      // IMPORTANT:
      // Swagger endpoint is /universities/
      // NOT /admin/universities
      // ----------------------------------------

      const response = await fetch(
        `${API_URL}/universities/`,
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

      // ----------------------------------------
      // Unauthorized
      // ----------------------------------------

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      // ----------------------------------------
      // Forbidden
      // ----------------------------------------

      if (response.status === 403) {
        setError(
          "You do not have permission to manage universities."
        );
        return;
      }

      // ----------------------------------------
      // Other errors
      // ----------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to load universities."
        );
      }

      // ----------------------------------------
      // Support different response formats
      // ----------------------------------------

      const universityData = Array.isArray(data)
        ? data
        : data?.universities ||
          data?.data ||
          data?.items ||
          [];

      setUniversities(universityData);
    } catch (error) {
      console.error(
        "Load universities error:",
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
  // Initial Load
  // ==========================================

  useEffect(() => {
    loadUniversities();
  }, []);

  // ==========================================
  // Open Add Form
  // ==========================================

  const handleAddUniversity = () => {
    setEditingUniversity(null);

    setFormData(emptyForm);

    setError("");

    setSuccessMessage("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // Open Edit Form
  // ==========================================

  const handleEditUniversity = (
    university: University
  ) => {
    setEditingUniversity(university);

    setFormData({
      name: university.name || "",
      code: university.code || "",
      city: university.city || "",
      province: university.province || "",
      website: university.website || "",
      description: university.description || "",
      is_active:
        university.is_active !== false,
    });

    setError("");

    setSuccessMessage("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // Close Form
  // ==========================================

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);

    setEditingUniversity(null);

    setFormData(emptyForm);
  };

  // ==========================================
  // Form Input Handler
  // ==========================================

  const handleInputChange = (
    field: keyof UniversityFormData,
    value: string | boolean
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================
  // Save University
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    setSuccessMessage("");

    // ----------------------------------------
    // Validation
    // ----------------------------------------

    if (!formData.name.trim()) {
      setError("University name is required.");
      return;
    }

    if (!formData.code.trim()) {
      setError("University code is required.");
      return;
    }

    if (!formData.city.trim()) {
      setError("City is required.");
      return;
    }

    if (!formData.province.trim()) {
      setError("Province is required.");
      return;
    }

    try {
      setSaving(true);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      // ----------------------------------------
      // Determine Request
      // ----------------------------------------

      const isEditing =
        editingUniversity !== null;

      // IMPORTANT:
      // Swagger uses /universities/
      // ----------------------------------------

      const url = isEditing
        ? `${API_URL}/universities/${editingUniversity.id}`
        : `${API_URL}/universities/`;

      const method = isEditing
        ? "PUT"
        : "POST";

      // ----------------------------------------
      // Request
      // ----------------------------------------

      const response = await fetch(url, {
        method,

        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: formData.name.trim(),

          code: formData.code
            .trim()
            .toUpperCase(),

          city: formData.city.trim(),

          province: formData.province.trim(),

          website: formData.website.trim(),

          description:
            formData.description.trim(),

          is_active: formData.is_active,
        }),
      });

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
        handleUnauthorized();
        return;
      }

      // ----------------------------------------
      // Forbidden
      // ----------------------------------------

      if (response.status === 403) {
        setError(
          "You do not have permission to manage universities."
        );
        return;
      }

      // ----------------------------------------
      // Error
      // ----------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to save university."
        );
      }

      // ----------------------------------------
      // Success
      // ----------------------------------------

      setSuccessMessage(
        isEditing
          ? "University updated successfully."
          : "University added successfully."
      );

      setShowForm(false);

      setEditingUniversity(null);

      setFormData(emptyForm);

      // ----------------------------------------
      // Refresh List
      // ----------------------------------------

      await loadUniversities();
    } catch (error) {
      console.error(
        "Save university error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save university."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Delete University
  // ==========================================

  const handleDeleteUniversity = async (
    university: University
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${university.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(university.id);

      setError("");

      setSuccessMessage("");

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      // IMPORTANT:
      // Swagger uses /universities/{id}
      // ----------------------------------------

      const response = await fetch(
        `${API_URL}/universities/${university.id}`,
        {
          method: "DELETE",

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

      // ----------------------------------------
      // Unauthorized
      // ----------------------------------------

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      // ----------------------------------------
      // Forbidden
      // ----------------------------------------

      if (response.status === 403) {
        setError(
          "You do not have permission to delete universities."
        );
        return;
      }

      // ----------------------------------------
      // Error
      // ----------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to delete university."
        );
      }

      // ----------------------------------------
      // Success
      // ----------------------------------------

      setSuccessMessage(
        "University deleted successfully."
      );

      setUniversities((previous) =>
        previous.filter(
          (item) =>
            item.id !== university.id
        )
      );
    } catch (error) {
      console.error(
        "Delete university error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete university."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // Search
  // ==========================================

  const filteredUniversities =
    universities.filter((university) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        university.name
          ?.toLowerCase()
          .includes(searchText) ||

        university.code
          ?.toLowerCase()
          .includes(searchText) ||

        university.city
          ?.toLowerCase()
          .includes(searchText) ||

        university.province
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================
          Header
      ====================================== */}

      <header className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Brand */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-2xl">
              🎓
            </div>

            <div>

              <h1 className="font-bold">
                Directorate Reserve Seats
              </h1>

              <p className="text-xs text-slate-400">
                University Management
              </p>

            </div>

          </div>

          {/* Back Button */}

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

      {/* ======================================
          Main
      ====================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Page Heading */}

        <section>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-sm font-semibold text-indigo-400">
                Administration
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Universities Management
              </h2>

              <p className="mt-3 max-w-3xl text-slate-400">
                Add, edit, delete and manage official
                university information used by the
                Directorate Reserve Seats system.
              </p>

            </div>

            <button
              type="button"
              onClick={handleAddUniversity}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              + Add University
            </button>

          </div>

        </section>

        {/* ======================================
            Error Message
        ====================================== */}

        {error && (

          <div className="mt-8 rounded-xl border border-red-800 bg-red-950/40 p-5">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="font-semibold text-red-300">
                  Error
                </p>

                <p className="mt-1 text-sm text-red-400">
                  {error}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="text-red-400 hover:text-red-200"
              >
                ✕
              </button>

            </div>

          </div>

        )}

        {/* ======================================
            Success Message
        ====================================== */}

        {successMessage && (

          <div className="mt-8 rounded-xl border border-green-800 bg-green-950/40 p-5">

            <div className="flex items-center justify-between gap-4">

              <p className="text-sm text-green-400">
                ✓ {successMessage}
              </p>

              <button
                type="button"
                onClick={() =>
                  setSuccessMessage("")
                }
                className="text-green-400 hover:text-green-200"
              >
                ✕
              </button>

            </div>

          </div>

        )}

        {/* ======================================
            Add / Edit Form
        ====================================== */}

        {showForm && (

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-indigo-400">
                  {editingUniversity
                    ? "Edit University"
                    : "New University"}
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  {editingUniversity
                    ? "Update University Information"
                    : "Add University Information"}
                </h3>

              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                disabled={saving}
                className="rounded-lg border border-slate-700 px-3 py-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7"
            >

              <div className="grid gap-5 md:grid-cols-2">

                {/* University Name */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    University Name *
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      handleInputChange(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="University of Okara"
                    disabled={saving}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />

                </div>

                {/* University Code */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    University Code *
                  </label>

                  <input
                    type="text"
                    value={formData.code}
                    onChange={(event) =>
                      handleInputChange(
                        "code",
                        event.target.value
                      )
                    }
                    placeholder="UO"
                    disabled={saving}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm uppercase text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />

                </div>

                {/* City */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    City *
                  </label>

                  <input
                    type="text"
                    value={formData.city}
                    onChange={(event) =>
                      handleInputChange(
                        "city",
                        event.target.value
                      )
                    }
                    placeholder="Okara"
                    disabled={saving}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />

                </div>

                {/* Province */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Province *
                  </label>

                  <input
                    type="text"
                    value={formData.province}
                    onChange={(event) =>
                      handleInputChange(
                        "province",
                        event.target.value
                      )
                    }
                    placeholder="Punjab"
                    disabled={saving}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />

                </div>

                {/* Website */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Official Website
                  </label>

                  <input
                    type="url"
                    value={formData.website}
                    onChange={(event) =>
                      handleInputChange(
                        "website",
                        event.target.value
                      )
                    }
                    placeholder="https://example.edu.pk"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />

                </div>

                {/* Description */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      handleInputChange(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Enter official university information..."
                    rows={5}
                    disabled={saving}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />

                </div>

              </div>

              {/* Active Status */}

              <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(event) =>
                      handleInputChange(
                        "is_active",
                        event.target.checked
                      )
                    }
                    disabled={saving}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                  />

                  <div>

                    <p className="text-sm font-medium text-white">
                      Active University
                    </p>

                    <p className="text-xs text-slate-500">
                      Active universities can be used
                      by the student system.
                    </p>

                  </div>

                </label>

              </div>

              {/* Form Actions */}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingUniversity
                    ? "Update University"
                    : "Add University"}
                </button>

                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>

        )}

        {/* ======================================
            Search & Statistics
        ====================================== */}

        <section className="mt-8">

          <div className="grid gap-5 md:grid-cols-3">

            {/* Total */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Total Universities
              </p>

              <p className="mt-2 text-3xl font-bold">
                {universities.length}
              </p>

            </div>

            {/* Active */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Active Universities
              </p>

              <p className="mt-2 text-3xl font-bold text-green-400">
                {
                  universities.filter(
                    (university) =>
                      university.is_active
                  ).length
                }
              </p>

            </div>

            {/* Search Results */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Search Results
              </p>

              <p className="mt-2 text-3xl font-bold text-indigo-400">
                {filteredUniversities.length}
              </p>

            </div>

          </div>

          {/* Search */}

          <div className="mt-6">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by university name, code, city or province..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />

          </div>

        </section>

        {/* ======================================
            Universities List
        ====================================== */}

        <section className="mt-6">

          {loading ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10">

              <div className="flex items-center justify-center gap-3">

                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />

                <p className="text-sm text-indigo-300">
                  Loading universities...
                </p>

              </div>

            </div>

          ) : filteredUniversities.length === 0 ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

              <div className="text-4xl">
                🎓
              </div>

              <h3 className="mt-4 text-lg font-bold">
                No Universities Found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {search
                  ? "No university matches your search."
                  : "No universities have been added yet."}
              </p>

              {!search && (

                <button
                  type="button"
                  onClick={handleAddUniversity}
                  className="mt-5 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  + Add First University
                </button>

              )}

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="border-b border-slate-800 bg-slate-950">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        University
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Code
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Location
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-800">

                    {filteredUniversities.map(
                      (university) => (

                        <tr
                          key={university.id}
                          className="transition hover:bg-slate-800/40"
                        >

                          {/* University */}

                          <td className="px-6 py-5">

                            <div className="flex items-start gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-lg">
                                🎓
                              </div>

                              <div>

                                <p className="font-semibold text-white">
                                  {university.name}
                                </p>

                                {university.description && (

                                  <p className="mt-1 max-w-md truncate text-xs text-slate-500">
                                    {university.description}
                                  </p>

                                )}

                              </div>

                            </div>

                          </td>

                          {/* Code */}

                          <td className="px-6 py-5">

                            <span className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                              {university.code}
                            </span>

                          </td>

                          {/* Location */}

                          <td className="px-6 py-5">

                            <p className="text-sm text-slate-300">
                              {university.city}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {university.province}
                            </p>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-5">

                            {university.is_active ? (

                              <span className="inline-flex items-center gap-2 rounded-full bg-green-950/50 px-3 py-1 text-xs font-semibold text-green-400">

                                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                                Active

                              </span>

                            ) : (

                              <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-500">

                                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />

                                Inactive

                              </span>

                            )}

                          </td>

                          {/* Actions */}

                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              {/* Edit */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditUniversity(
                                    university
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  university.id
                                }
                                className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                              >
                                Edit
                              </button>

                              {/* Delete */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteUniversity(
                                    university
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  university.id
                                }
                                className="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950/50 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingId ===
                                university.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default AdminUniversities;