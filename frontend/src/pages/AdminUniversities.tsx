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

interface UniversityProgram {
  id: number;
  university_id: number;
  program_name: string;
  program_code: string;
  degree_level: string;
  department: string;
  total_seats: number;
  reserved_seats: number;
  fee_per_semester: number;
  duration_years: number;
  eligibility_criteria: string;
  application_deadline?: string | null;
  shift: string;
  is_active: boolean;
}

interface ProgramFormData {
  program_name: string;
  program_code: string;
  degree_level: string;
  department: string;
  total_seats: number;
  reserved_seats: number;
  fee_per_semester: number;
  duration_years: number;
  eligibility_criteria: string;
  application_deadline: string;
  shift: string;
  is_active: boolean;
}

// ==========================================
// Empty Forms
// ==========================================

const emptyUniversityForm: UniversityFormData = {
  name: "",
  code: "",
  city: "",
  province: "",
  website: "",
  description: "",
  is_active: true,
};

const emptyProgramForm: ProgramFormData = {
  program_name: "",
  program_code: "",
  degree_level: "BS",
  department: "",
  total_seats: 50,
  reserved_seats: 10,
  fee_per_semester: 35000,
  duration_years: 4,
  eligibility_criteria: "",
  application_deadline: "",
  shift: "Morning",
  is_active: true,
};

// ==========================================
// Component
// ==========================================

const AdminUniversities = () => {
  const navigate = useNavigate();

  // ==========================================
  // University States
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
    useState<UniversityFormData>(emptyUniversityForm);

  // ==========================================
  // Program States
  // ==========================================

  const [selectedUniversityForPrograms, setSelectedUniversityForPrograms] =
    useState<University | null>(null);

  const [programs, setPrograms] = useState<UniversityProgram[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);

  const [editingProgram, setEditingProgram] =
    useState<UniversityProgram | null>(null);

  const [programFormData, setProgramFormData] =
    useState<ProgramFormData>(emptyProgramForm);

  const [savingProgram, setSavingProgram] = useState(false);
  const [deletingProgramId, setDeletingProgramId] =
    useState<number | null>(null);

  // ==========================================
  // Authentication
  // ==========================================

  const getAdminToken = (): string | null => {
    return (
      localStorage.getItem("admin_access_token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token")
    );
  };

  const clearAdminAuthentication = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

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

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/universities/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError(
          "You do not have permission to manage universities."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to load universities."
        );
      }

      const universityData = Array.isArray(data)
        ? data
        : data?.universities ||
          data?.data ||
          data?.items ||
          [];

      setUniversities(universityData);
    } catch (error) {
      console.error("Load universities error:", error);

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
  // University Form
  // ==========================================

  const handleAddUniversity = () => {
    setEditingUniversity(null);
    setFormData(emptyUniversityForm);
    setError("");
    setSuccessMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEditUniversity = (university: University) => {
    setEditingUniversity(university);

    setFormData({
      name: university.name || "",
      code: university.code || "",
      city: university.city || "",
      province: university.province || "",
      website: university.website || "",
      description: university.description || "",
      is_active: university.is_active !== false,
    });

    setError("");
    setSuccessMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCloseForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingUniversity(null);
    setFormData(emptyUniversityForm);
  };

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
  // Add / Update University
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (
      !formData.name.trim() ||
      !formData.code.trim() ||
      !formData.city.trim() ||
      !formData.province.trim()
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setSaving(true);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const isEditing = editingUniversity !== null;

      const url = isEditing
        ? `${API_URL}/universities/${editingUniversity.id}`
        : `${API_URL}/universities/`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          city: formData.city.trim(),
          province: formData.province.trim(),
          website: formData.website.trim(),
          description: formData.description.trim(),
          is_active: formData.is_active,
        }),
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError(
          "You do not have permission to manage universities."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to save university."
        );
      }

      setSuccessMessage(
        isEditing
          ? "University updated successfully."
          : "University added successfully."
      );

      setShowForm(false);
      setEditingUniversity(null);
      setFormData(emptyUniversityForm);

      await loadUniversities();
    } catch (error) {
      console.error("Save university error:", error);

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

    if (!confirmed) return;

    try {
      setDeletingId(university.id);
      setError("");
      setSuccessMessage("");

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

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

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError(
          "You do not have permission to delete universities."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to delete university."
        );
      }

      setSuccessMessage(
        "University deleted successfully."
      );

      setUniversities((previous) =>
        previous.filter(
          (item) => item.id !== university.id
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
  // Open Programs Modal
  // ==========================================

  const handleOpenProgramsModal = async (
    university: University
  ) => {
    setSelectedUniversityForPrograms(university);
    setShowProgramModal(true);
    setShowProgramForm(false);
    setEditingProgram(null);
    setProgramFormData(emptyProgramForm);

    await loadProgramsForUniversity(university.id);
  };

  // ==========================================
  // Load Programs
  // ==========================================

  const loadProgramsForUniversity = async (
    uniId: number
  ) => {
    try {
      setLoadingPrograms(true);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      /*
       * IMPORTANT:
       * Correct backend endpoint
       *
       * GET
       * /university-programs/university/{university_id}
       */

      const response = await fetch(
        `${API_URL}/university-programs/university/${uniId}`,
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

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        alert(
          "You do not have permission to view programs."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Failed to load programs."
        );
      }

      const programData = Array.isArray(data)
        ? data
        : data?.programs ||
          data?.data ||
          data?.items ||
          [];

      setPrograms(programData);
    } catch (error) {
      console.error(
        "Error loading programs:",
        error
      );

      setPrograms([]);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load programs."
      );
    } finally {
      setLoadingPrograms(false);
    }
  };

  // ==========================================
  // Add Program Button
  // ==========================================

  const handleAddProgramClick = () => {
    setEditingProgram(null);
    setProgramFormData(emptyProgramForm);
    setShowProgramForm(true);
  };

  // ==========================================
  // Edit Program
  // ==========================================

  const handleEditProgramClick = (
    prog: UniversityProgram
  ) => {
    setEditingProgram(prog);

    setProgramFormData({
      program_name: prog.program_name || "",
      program_code: prog.program_code || "",
      degree_level: prog.degree_level || "BS",
      department: prog.department || "",
      total_seats: prog.total_seats || 50,
      reserved_seats: prog.reserved_seats || 10,
      fee_per_semester:
        prog.fee_per_semester || 35000,
      duration_years:
        prog.duration_years || 4,
      eligibility_criteria:
        prog.eligibility_criteria || "",
      application_deadline:
        prog.application_deadline
          ? prog.application_deadline.split("T")[0]
          : "",
      shift: prog.shift || "Morning",
      is_active: prog.is_active !== false,
    });

    setShowProgramForm(true);
  };

  // ==========================================
  // Add / Update Program
  // ==========================================

  const handleProgramSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedUniversityForPrograms) {
      return;
    }

    try {
      setSavingProgram(true);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const isEditing = editingProgram !== null;

      /*
       * Correct backend endpoints:
       *
       * POST
       * /university-programs/university/{university_id}
       *
       * PUT
       * /university-programs/{program_id}
       */

      const url = isEditing
        ? `${API_URL}/university-programs/${editingProgram.id}`
        : `${API_URL}/university-programs/university/${selectedUniversityForPrograms.id}`;

      const method = isEditing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          program_name:
            programFormData.program_name.trim(),

          program_code:
            programFormData.program_code
              .trim()
              .toUpperCase(),

          degree_level:
            programFormData.degree_level.trim(),

          department:
            programFormData.department.trim(),

          total_seats:
            Number(programFormData.total_seats),

          reserved_seats:
            Number(programFormData.reserved_seats),

          fee_per_semester:
            Number(
              programFormData.fee_per_semester
            ),

          duration_years:
            Number(
              programFormData.duration_years
            ),

          eligibility_criteria:
            programFormData.eligibility_criteria.trim(),

          application_deadline:
            programFormData.application_deadline
              ? new Date(
                  programFormData.application_deadline
                ).toISOString()
              : null,

          shift:
            programFormData.shift.trim(),

          is_active:
            programFormData.is_active,
        }),
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        alert(
          "You do not have permission to manage programs."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Failed to ${
              isEditing
                ? "update"
                : "create"
            } program.`
        );
      }

      setShowProgramForm(false);
      setEditingProgram(null);
      setProgramFormData(emptyProgramForm);

      await loadProgramsForUniversity(
        selectedUniversityForPrograms.id
      );
    } catch (error) {
      console.error(
        "Save program error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while saving the program."
      );
    } finally {
      setSavingProgram(false);
    }
  };

  // ==========================================
  // Delete Program
  // ==========================================

  const handleDeleteProgram = async (
    progId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this program?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProgramId(progId);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      /*
       * Correct backend endpoint:
       *
       * DELETE
       * /university-programs/{program_id}
       */

      const response = await fetch(
        `${API_URL}/university-programs/${progId}`,
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

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        alert(
          "You do not have permission to delete programs."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Failed to delete program."
        );
      }

      setPrograms((previous) =>
        previous.filter(
          (program) =>
            program.id !== progId
        )
      );
    } catch (error) {
      console.error(
        "Delete program error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the program."
      );
    } finally {
      setDeletingProgramId(null);
    }
  };

  // ==========================================
  // Close Programs Modal
  // ==========================================

  const handleCloseProgramsModal = () => {
    if (savingProgram) {
      return;
    }

    setShowProgramModal(false);
    setShowProgramForm(false);
    setEditingProgram(null);
    setSelectedUniversityForPrograms(null);
    setPrograms([]);
    setProgramFormData(emptyProgramForm);
  };

  // ==========================================
  // Filter Universities
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
  // JSX
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ====================================== */}
      {/* Header                                 */}
      {/* ====================================== */}

      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-2xl">
              🎓
            </div>

            <div>
              <h1 className="font-bold">
                Directorate Reserve Seats
              </h1>

              <p className="text-xs text-slate-400">
                University & Programs Management
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

      {/* ====================================== */}
      {/* Main                                   */}
      {/* ====================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Page Heading */}

        <section>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-sm font-semibold text-indigo-400">
                Administration
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Universities & Programs Management
              </h2>

              <p className="mt-3 max-w-3xl text-slate-400">
                Manage official universities, fee structures,
                total seats, shifts, and departmental degree
                offerings.
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

        {/* ====================================== */}
        {/* Error Alert                             */}
        {/* ====================================== */}

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
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-200"
              >
                ✕
              </button>

            </div>
          </div>
        )}

        {/* ====================================== */}
        {/* Success Alert                           */}
        {/* ====================================== */}

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

        {/* ====================================== */}
        {/* Add / Edit University Form              */}
        {/* ====================================== */}

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

                {/* Code */}

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
                    rows={4}
                    disabled={saving}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>

              </div>

              {/* Active */}

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
                      Active universities can be used by
                      the student system.
                    </p>
                  </div>

                </label>

              </div>

              {/* Buttons */}

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

        {/* ====================================== */}
        {/* Search & Stats                          */}
        {/* ====================================== */}

        <section className="mt-8">

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Total Universities
              </p>

              <p className="mt-2 text-3xl font-bold">
                {universities.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Active Universities
              </p>

              <p className="mt-2 text-3xl font-bold text-green-400">
                {
                  universities.filter(
                    (u) => u.is_active
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Search Results
              </p>

              <p className="mt-2 text-3xl font-bold text-indigo-400">
                {filteredUniversities.length}
              </p>
            </div>

          </div>

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

        {/* ====================================== */}
        {/* Universities List                       */}
        {/* ====================================== */}

        <section className="mt-6">

          {loading ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

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

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[950px]">

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

                          <td className="px-6 py-5">

                            <span className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                              {university.code}
                            </span>

                          </td>

                          <td className="px-6 py-5">

                            <p className="text-sm text-slate-300">
                              {university.city}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {university.province}
                            </p>

                          </td>

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

                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenProgramsModal(
                                    university
                                  )
                                }
                                className="rounded-lg border border-indigo-500/40 bg-indigo-600/20 px-3 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-600 hover:text-white"
                              >
                                Programs
                              </button>

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
                                className="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950/50 hover:text-red-300 disabled:opacity-50"
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

      {/* ====================================== */}
      {/* PROGRAMS MODAL                          */}
      {/* ====================================== */}

      {showProgramModal &&
        selectedUniversityForPrograms && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

              {/* Modal Header */}

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Department & Degree Management
                  </p>

                  <h3 className="text-xl font-bold">
                    {selectedUniversityForPrograms.name}{" "}
                    — Programs
                  </h3>

                </div>

                <button
                  type="button"
                  onClick={
                    handleCloseProgramsModal
                  }
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  ✕ Close
                </button>

              </div>

              {/* Program Header */}

              <div className="mt-6 flex items-center justify-between">

                <p className="text-sm text-slate-400">
                  Total Programs Listed:{" "}
                  {programs.length}
                </p>

                <button
                  type="button"
                  onClick={
                    handleAddProgramClick
                  }
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  + Add Program
                </button>

              </div>

              {/* ================================== */}
              {/* Program Form                        */}
              {/* ================================== */}

              {showProgramForm && (

                <div className="mt-6 rounded-xl border border-indigo-500/30 bg-slate-950 p-5">

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">

                    <h4 className="font-semibold text-indigo-300">
                      {editingProgram
                        ? "Edit Program Details"
                        : "Add New Program"}
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        setShowProgramForm(false)
                      }
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>

                  </div>

                  <form
                    onSubmit={
                      handleProgramSubmit
                    }
                    className="mt-4 grid gap-4 md:grid-cols-3"
                  >

                    {/* Program Name */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Program Name *
                      </label>

                      <input
                        type="text"
                        required
                        value={
                          programFormData.program_name
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            program_name:
                              e.target.value,
                          })
                        }
                        placeholder="BS Software Engineering"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      />

                    </div>

                    {/* Program Code */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Program Code *
                      </label>

                      <input
                        type="text"
                        required
                        value={
                          programFormData.program_code
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            program_code:
                              e.target.value,
                          })
                        }
                        placeholder="BSSE"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm uppercase text-white"
                      />

                    </div>

                    {/* Degree Level */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Degree Level
                      </label>

                      <input
                        type="text"
                        value={
                          programFormData.degree_level
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            degree_level:
                              e.target.value,
                          })
                        }
                        placeholder="BS / MS / PhD"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      />

                    </div>

                    {/* Department */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Department
                      </label>

                      <input
                        type="text"
                        value={
                          programFormData.department
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            department:
                              e.target.value,
                          })
                        }
                        placeholder="Computer Science"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      />

                    </div>

                    {/* Total Seats */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Total Seats
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          programFormData.total_seats
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            total_seats:
                              Number(
                                e.target.value
                              ),
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      />

                    </div>

                    {/* Reserved Seats */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Reserved Seats
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          programFormData.reserved_seats
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            reserved_seats:
                              Number(
                                e.target.value
                              ),
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      />

                    </div>

                    {/* Fee */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Fee Per Semester (PKR)
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          programFormData.fee_per_semester
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            fee_per_semester:
                              Number(
                                e.target.value
                              ),
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      />

                    </div>

                    {/* Duration */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Duration (Years)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          programFormData.duration_years
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            duration_years:
                              Number(
                                e.target.value
                              ),
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      />

                    </div>

                    {/* Shift */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Shift
                      </label>

                      <select
                        value={
                          programFormData.shift
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            shift:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      >
                        <option value="Morning">
                          Morning
                        </option>

                        <option value="Evening">
                          Evening
                        </option>

                        <option value="Both">
                          Both
                        </option>
                      </select>

                    </div>

                    {/* Eligibility */}

                    <div className="md:col-span-2">

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Eligibility Criteria
                      </label>

                      <input
                        type="text"
                        value={
                          programFormData.eligibility_criteria
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            eligibility_criteria:
                              e.target.value,
                          })
                        }
                        placeholder="Intermediate with 50% marks"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      />

                    </div>

                    {/* Deadline */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Application Deadline
                      </label>

                      <input
                        type="date"
                        value={
                          programFormData.application_deadline
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            application_deadline:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                      />

                    </div>

                    {/* Active */}

                    <div className="flex items-center gap-2 md:col-span-3">

                      <input
                        type="checkbox"
                        id="prog_active"
                        checked={
                          programFormData.is_active
                        }
                        onChange={(e) =>
                          setProgramFormData({
                            ...programFormData,
                            is_active:
                              e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-600"
                      />

                      <label
                        htmlFor="prog_active"
                        className="text-xs font-medium text-slate-300"
                      >
                        Program Active
                      </label>

                    </div>

                    {/* Form Buttons */}

                    <div className="flex justify-end gap-2 pt-2 md:col-span-3">

                      <button
                        type="button"
                        onClick={() =>
                          setShowProgramForm(false)
                        }
                        disabled={savingProgram}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={savingProgram}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {savingProgram
                          ? "Saving..."
                          : editingProgram
                          ? "Update Program"
                          : "Save Program"}
                      </button>

                    </div>

                  </form>

                </div>
              )}

              {/* ================================== */}
              {/* Programs Table                       */}
              {/* ================================== */}

              <div className="mt-6">

                {loadingPrograms ? (

                  <div className="py-10 text-center text-sm text-indigo-300">
                    Loading programs...
                  </div>

                ) : programs.length === 0 ? (

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center text-sm text-slate-400">

                    No programs found for this
                    university. Add one using the
                    button above.

                  </div>

                ) : (

                  <div className="overflow-x-auto rounded-xl border border-slate-800">

                    <table className="w-full min-w-[800px] text-left text-sm">

                      <thead className="border-b border-slate-800 bg-slate-950 text-xs uppercase text-slate-400">

                        <tr>

                          <th className="px-4 py-3">
                            Program
                          </th>

                          <th className="px-4 py-3">
                            Code / Shift
                          </th>

                          <th className="px-4 py-3">
                            Seats (Total/Res)
                          </th>

                          <th className="px-4 py-3">
                            Fee / Sem
                          </th>

                          <th className="px-4 py-3">
                            Status
                          </th>

                          <th className="px-4 py-3 text-right">
                            Actions
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-800 bg-slate-900/50">

                        {programs.map((prog) => (

                          <tr
                            key={prog.id}
                            className="hover:bg-slate-800/40"
                          >

                            <td className="px-4 py-3">

                              <p className="font-semibold text-white">
                                {prog.program_name}
                              </p>

                              <p className="text-xs text-slate-500">
                                {prog.department ||
                                  prog.degree_level}
                              </p>

                            </td>

                            <td className="px-4 py-3">

                              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                                {prog.program_code}
                              </span>

                              <p className="mt-1 text-xs text-slate-500">
                                {prog.shift}
                              </p>

                            </td>

                            <td className="px-4 py-3">

                              <p className="text-slate-300">
                                {prog.total_seats} seats
                              </p>

                              <p className="text-xs text-indigo-400">
                                Reserved:{" "}
                                {prog.reserved_seats}
                              </p>

                            </td>

                            <td className="px-4 py-3 font-medium text-green-400">

                              PKR{" "}
                              {prog.fee_per_semester?.toLocaleString()}

                            </td>

                            <td className="px-4 py-3">

                              {prog.is_active ? (

                                <span className="rounded-full bg-green-950/60 px-2.5 py-0.5 text-xs font-semibold text-green-400">
                                  Active
                                </span>

                              ) : (

                                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                                  Inactive
                                </span>

                              )}

                            </td>

                            <td className="px-4 py-3 text-right">

                              <div className="flex justify-end gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditProgramClick(
                                      prog
                                    )
                                  }
                                  className="rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteProgram(
                                      prog.id
                                    )
                                  }
                                  disabled={
                                    deletingProgramId ===
                                    prog.id
                                  }
                                  className="rounded border border-red-900/60 px-2.5 py-1 text-xs text-red-400 hover:bg-red-950/50 disabled:opacity-50"
                                >
                                  {deletingProgramId ===
                                  prog.id
                                    ? "..."
                                    : "Delete"}
                                </button>

                              </div>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default AdminUniversities;