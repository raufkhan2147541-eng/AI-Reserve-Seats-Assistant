import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL = "https://ai-reserve-seats-assistant.onrender.com";

// ============================================================
// TYPES - UNIVERSITY
// ============================================================

interface University {
  id: number;
  name: string;
  university_type: string | null;
  province: string | null;
  city: string | null;
  campus: string | null;

  official_website: string | null;
  admission_portal: string | null;

  hec_recognized: boolean | number;
  hec_recognition_source: string | null;

  description: string | null;
  academic_session: string | null;

  is_active: boolean | number;

  created_at?: string;
  updated_at?: string;
}

interface UniversityFormData {
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

  is_active: boolean;
}

// ============================================================
// TYPES - PROGRAM
// ============================================================

interface UniversityProgram {
  id: number;
  university_id: number;

  program_name: string;

  degree_level: string | null;
  department: string | null;
  campus: string | null;

  duration: string | null;
  study_mode: string | null;

  eligibility: string | null;

  entry_test_required: boolean | number;

  admission_status: string | null;
  academic_session: string | null;

  source_url: string | null;
  last_verified: string | null;

  created_at?: string;
  updated_at?: string;

  university_name?: string;
}

interface ProgramFormData {
  program_name: string;

  degree_level: string;
  department: string;
  campus: string;

  duration: string;
  study_mode: string;

  eligibility: string;

  entry_test_required: boolean;

  admission_status: string;
  academic_session: string;

  source_url: string;
  last_verified: string;
}

// ============================================================
// TYPES - API
// ============================================================

interface ApiResponse {
  success?: boolean;
  message?: string;
  detail?: string;
  universities?: University[];
  programs?: UniversityProgram[];
  university?: University;
  program?: UniversityProgram;
  count?: number;
}

// ============================================================
// EMPTY FORMS
// ============================================================

const emptyUniversityForm: UniversityFormData = {
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

  is_active: true,
};

const emptyProgramForm: ProgramFormData = {
  program_name: "",

  degree_level: "BS",
  department: "",
  campus: "",

  duration: "4 Years",
  study_mode: "Morning",

  eligibility: "",

  entry_test_required: false,

  admission_status: "Open",
  academic_session: "",

  source_url: "",
  last_verified: "",
};

// ============================================================
// COMPONENT
// ============================================================

const AdminUniversities = () => {
  const navigate = useNavigate();

  // ==========================================================
  // UNIVERSITY STATE
  // ==========================================================

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");

  const [showUniversityForm, setShowUniversityForm] =
    useState(false);

  const [editingUniversity, setEditingUniversity] =
    useState<University | null>(null);

  const [universityFormData, setUniversityFormData] =
    useState<UniversityFormData>(emptyUniversityForm);

  // ==========================================================
  // PROGRAM STATE
  // ==========================================================

  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  const [programs, setPrograms] =
    useState<UniversityProgram[]>([]);

  const [loadingPrograms, setLoadingPrograms] =
    useState(false);

  const [showProgramModal, setShowProgramModal] =
    useState(false);

  const [showProgramForm, setShowProgramForm] =
    useState(false);

  const [editingProgram, setEditingProgram] =
    useState<UniversityProgram | null>(null);

  const [programFormData, setProgramFormData] =
    useState<ProgramFormData>(emptyProgramForm);

  const [savingProgram, setSavingProgram] =
    useState(false);

  const [deletingProgramId, setDeletingProgramId] =
    useState<number | null>(null);

  // ==========================================================
  // AUTH
  // ==========================================================

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

  // ==========================================================
  // COMMON API ERROR
  // ==========================================================

  const getErrorMessage = (
    data: ApiResponse | null,
    fallback: string
  ) => {
    return (
      data?.detail ||
      data?.message ||
      fallback
    );
  };

  // ==========================================================
  // LOAD UNIVERSITIES
  // GET /universities/
  // ==========================================================

  const loadUniversities = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

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

      let data: ApiResponse | null = null;

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
          getErrorMessage(
            data,
            "Unable to load universities."
          )
        );
      }

      setUniversities(data?.universities || []);
    } catch (err) {
      console.error("Load universities error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadUniversities();
  }, []);

  // ==========================================================
  // UNIVERSITY FORM
  // ==========================================================

  const handleAddUniversity = () => {
    setEditingUniversity(null);
    setUniversityFormData(emptyUniversityForm);

    setError("");
    setSuccessMessage("");

    setShowUniversityForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEditUniversity = (
    university: University
  ) => {
    setEditingUniversity(university);

    setUniversityFormData({
      name: university.name || "",
      university_type:
        university.university_type || "",

      province: university.province || "",
      city: university.city || "",
      campus: university.campus || "",

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

      is_active:
        Boolean(university.is_active),
    });

    setError("");
    setSuccessMessage("");

    setShowUniversityForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUniversityInput = (
    field: keyof UniversityFormData,
    value: string | boolean
  ) => {
    setUniversityFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCloseUniversityForm = () => {
    if (saving) return;

    setShowUniversityForm(false);
    setEditingUniversity(null);
    setUniversityFormData(emptyUniversityForm);
  };

  // ==========================================================
  // CREATE / UPDATE UNIVERSITY
  // POST /universities/
  // PUT /universities/{id}
  // ==========================================================

  const handleUniversitySubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (
      !universityFormData.name.trim()
    ) {
      setError(
        "University name is required."
      );
      return;
    }

    try {
      setSaving(true);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const isEditing =
        editingUniversity !== null;

      const url = isEditing
        ? `${API_URL}/universities/${editingUniversity.id}`
        : `${API_URL}/universities/`;

      const method = isEditing
        ? "PUT"
        : "POST";

      const body = isEditing
        ? {
            name:
              universityFormData.name.trim(),

            university_type:
              universityFormData.university_type.trim(),

            province:
              universityFormData.province.trim(),

            city:
              universityFormData.city.trim(),

            campus:
              universityFormData.campus.trim(),

            official_website:
              universityFormData.official_website.trim(),

            admission_portal:
              universityFormData.admission_portal.trim(),

            hec_recognized:
              universityFormData.hec_recognized,

            hec_recognition_source:
              universityFormData.hec_recognition_source.trim(),

            description:
              universityFormData.description.trim(),

            academic_session:
              universityFormData.academic_session.trim(),

            is_active:
              universityFormData.is_active,
          }
        : {
            name:
              universityFormData.name.trim(),

            university_type:
              universityFormData.university_type.trim(),

            province:
              universityFormData.province.trim(),

            city:
              universityFormData.city.trim(),

            campus:
              universityFormData.campus.trim(),

            official_website:
              universityFormData.official_website.trim(),

            admission_portal:
              universityFormData.admission_portal.trim(),

            hec_recognized:
              universityFormData.hec_recognized,

            hec_recognition_source:
              universityFormData.hec_recognition_source.trim(),

            description:
              universityFormData.description.trim(),

            academic_session:
              universityFormData.academic_session.trim(),
          };

      const response = await fetch(
        url,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      let data: ApiResponse | null = null;

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
          getErrorMessage(
            data,
            "Unable to save university."
          )
        );
      }

      setSuccessMessage(
        isEditing
          ? "University updated successfully."
          : "University added successfully."
      );

      setShowUniversityForm(false);
      setEditingUniversity(null);
      setUniversityFormData(
        emptyUniversityForm
      );

      await loadUniversities();
    } catch (err) {
      console.error(
        "Save university error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save university."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE UNIVERSITY
  // DELETE /universities/{id}
  // ==========================================================

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

      let data: ApiResponse | null = null;

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
          getErrorMessage(
            data,
            "Unable to delete university."
          )
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
    } catch (err) {
      console.error(
        "Delete university error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete university."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================
  // OPEN PROGRAMS
  // GET /universities/{id}/programs
  // ==========================================================

  const handleOpenPrograms = async (
    university: University
  ) => {
    setSelectedUniversity(university);

    setShowProgramModal(true);
    setShowProgramForm(false);

    setEditingProgram(null);
    setProgramFormData(emptyProgramForm);

    await loadPrograms(university.id);
  };

  const loadPrograms = async (
    universityId: number
  ) => {
    try {
      setLoadingPrograms(true);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/universities/${universityId}/programs`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      let data: ApiResponse | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to load programs."
          )
        );
      }

      setPrograms(data?.programs || []);
    } catch (err) {
      console.error(
        "Load programs error:",
        err
      );

      setPrograms([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load programs."
      );
    } finally {
      setLoadingPrograms(false);
    }
  };

  // ==========================================================
  // ADD PROGRAM
  // POST /universities/programs
  // ==========================================================

  const handleAddProgram = () => {
    setEditingProgram(null);
    setProgramFormData(emptyProgramForm);
    setShowProgramForm(true);
  };

  // ==========================================================
  // EDIT PROGRAM
  // PUT /universities/programs/{id}
  // ==========================================================

  const handleEditProgram = (
    program: UniversityProgram
  ) => {
    setEditingProgram(program);

    setProgramFormData({
      program_name:
        program.program_name || "",

      degree_level:
        program.degree_level || "",

      department:
        program.department || "",

      campus:
        program.campus || "",

      duration:
        program.duration || "",

      study_mode:
        program.study_mode || "",

      eligibility:
        program.eligibility || "",

      entry_test_required:
        Boolean(program.entry_test_required),

      admission_status:
        program.admission_status || "",

      academic_session:
        program.academic_session || "",

      source_url:
        program.source_url || "",

      last_verified:
        program.last_verified || "",
    });

    setShowProgramForm(true);
  };

  const handleProgramInput = (
    field: keyof ProgramFormData,
    value: string | boolean
  ) => {
    setProgramFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================================
  // CREATE / UPDATE PROGRAM
  // ==========================================================

  const handleProgramSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedUniversity) {
      setError("Please select a university.");
      return;
    }

    setError("");
    setSuccessMessage("");

    if (
      !programFormData.program_name.trim()
    ) {
      setError(
        "Program name is required."
      );
      return;
    }

    try {
      setSavingProgram(true);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const isEditing =
        editingProgram !== null;

      const url = isEditing
        ? `${API_URL}/universities/programs/${editingProgram.id}`
        : `${API_URL}/universities/programs`;

      const method = isEditing
        ? "PUT"
        : "POST";

      const body = {
        ...(isEditing
          ? {}
          : {
              university_id:
                selectedUniversity.id,
            }),

        program_name:
          programFormData.program_name.trim(),

        degree_level:
          programFormData.degree_level.trim() ||
          null,

        department:
          programFormData.department.trim() ||
          null,

        campus:
          programFormData.campus.trim() ||
          null,

        duration:
          programFormData.duration.trim() ||
          null,

        study_mode:
          programFormData.study_mode.trim() ||
          null,

        eligibility:
          programFormData.eligibility.trim() ||
          null,

        entry_test_required:
          programFormData.entry_test_required,

        admission_status:
          programFormData.admission_status.trim() ||
          null,

        academic_session:
          programFormData.academic_session.trim() ||
          null,

        source_url:
          programFormData.source_url.trim() ||
          null,

        last_verified:
          programFormData.last_verified.trim() ||
          null,
      };

      const response = await fetch(
        url,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      let data: ApiResponse | null = null;

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
          "You do not have permission to manage programs."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to save program."
          )
        );
      }

      setSuccessMessage(
        isEditing
          ? "Program updated successfully."
          : "Program added successfully."
      );

      setShowProgramForm(false);
      setEditingProgram(null);
      setProgramFormData(emptyProgramForm);

      await loadPrograms(
        selectedUniversity.id
      );
    } catch (err) {
      console.error(
        "Save program error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save program."
      );
    } finally {
      setSavingProgram(false);
    }
  };

  // ==========================================================
  // DELETE PROGRAM
  // DELETE /universities/programs/{id}
  // ==========================================================

  const handleDeleteProgram = async (
    program: UniversityProgram
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${program.program_name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingProgramId(program.id);

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/universities/programs/${program.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      let data: ApiResponse | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to delete program."
          )
        );
      }

      setSuccessMessage(
        "Program deleted successfully."
      );

      setPrograms((previous) =>
        previous.filter(
          (item) => item.id !== program.id
        )
      );
    } catch (err) {
      console.error(
        "Delete program error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete program."
      );
    } finally {
      setDeletingProgramId(null);
    }
  };

  // ==========================================================
  // FILTER UNIVERSITIES
  // ==========================================================

  const filteredUniversities =
    universities.filter((university) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) return true;

      return (
        university.name
          ?.toLowerCase()
          .includes(searchText) ||

        university.city
          ?.toLowerCase()
          .includes(searchText) ||

        university.province
          ?.toLowerCase()
          .includes(searchText) ||

        university.university_type
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  // ==========================================================
  // CLOSE PROGRAM MODAL
  // ==========================================================

  const closeProgramModal = () => {
    if (savingProgram) return;

    setShowProgramModal(false);
    setShowProgramForm(false);
    setSelectedUniversity(null);
    setEditingProgram(null);
    setPrograms([]);
    setProgramFormData(emptyProgramForm);
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

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
                University Management
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
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* PAGE TITLE */}

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
                Manage universities, HEC recognition,
                admission portals, academic sessions,
                programs and official university information.
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

        {/* ====================================================
            ALERTS
        ==================================================== */}

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

        {/* ====================================================
            UNIVERSITY FORM
        ==================================================== */}

        {showUniversityForm && (
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
                onClick={handleCloseUniversityForm}
                disabled={saving}
                className="rounded-lg border border-slate-700 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleUniversitySubmit}
              className="mt-7"
            >

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    University Name *
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      universityFormData.name
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="University of Okara"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />

                </div>

                {/* TYPE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    University Type
                  </label>

                  <select
                    value={
                      universityFormData.university_type
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "university_type",
                        e.target.value
                      )
                    }
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
                  >
                    <option value="">
                      Select Type
                    </option>
                    <option value="Public">
                      Public
                    </option>
                    <option value="Private">
                      Private
                    </option>
                    <option value="Government">
                      Government
                    </option>
                    <option value="Federal">
                      Federal
                    </option>
                    <option value="Military">
                      Military
                    </option>
                  </select>

                </div>

                {/* PROVINCE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Province
                  </label>

                  <input
                    type="text"
                    value={
                      universityFormData.province
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "province",
                        e.target.value
                      )
                    }
                    placeholder="Punjab"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
                  />

                </div>

                {/* CITY */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    City
                  </label>

                  <input
                    type="text"
                    value={
                      universityFormData.city
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "city",
                        e.target.value
                      )
                    }
                    placeholder="Okara"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
                  />

                </div>

                {/* CAMPUS */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Campus
                  </label>

                  <input
                    type="text"
                    value={
                      universityFormData.campus
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "campus",
                        e.target.value
                      )
                    }
                    placeholder="Main Campus"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
                  />

                </div>

                {/* OFFICIAL WEBSITE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Official Website
                  </label>

                  <input
                    type="url"
                    value={
                      universityFormData.official_website
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "official_website",
                        e.target.value
                      )
                    }
                    placeholder="https://example.edu.pk"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
                  />

                </div>

                {/* ADMISSION PORTAL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Admission Portal
                  </label>

                  <input
                    type="url"
                    value={
                      universityFormData.admission_portal
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "admission_portal",
                        e.target.value
                      )
                    }
                    placeholder="https://admissions.example.edu.pk"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
                  />

                </div>

                {/* HEC SOURCE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    HEC Recognition Source
                  </label>

                  <input
                    type="text"
                    value={
                      universityFormData.hec_recognition_source
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "hec_recognition_source",
                        e.target.value
                      )
                    }
                    placeholder="HEC Official Website"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
                  />

                </div>

                {/* ACADEMIC SESSION */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Academic Session
                  </label>

                  <input
                    type="text"
                    value={
                      universityFormData.academic_session
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "academic_session",
                        e.target.value
                      )
                    }
                    placeholder="2026-27"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description
                  </label>

                  <textarea
                    value={
                      universityFormData.description
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "description",
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Official university information..."
                    disabled={saving}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white"
                  />

                </div>

              </div>

              {/* HEC */}

              <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={
                      universityFormData.hec_recognized
                    }
                    onChange={(e) =>
                      handleUniversityInput(
                        "hec_recognized",
                        e.target.checked
                      )
                    }
                    disabled={saving}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600"
                  />

                  <div>

                    <p className="text-sm font-medium text-white">
                      HEC Recognized
                    </p>

                    <p className="text-xs text-slate-500">
                      Mark this university as recognized by HEC.
                    </p>

                  </div>

                </label>

              </div>

              {/* ACTIVE */}

              {editingUniversity && (
                <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-4">

                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="checkbox"
                      checked={
                        universityFormData.is_active
                      }
                      onChange={(e) =>
                        handleUniversityInput(
                          "is_active",
                          e.target.checked
                        )
                      }
                      disabled={saving}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600"
                    />

                    <div>

                      <p className="text-sm font-medium text-white">
                        Active University
                      </p>

                      <p className="text-xs text-slate-500">
                        Active universities appear in the student system.
                      </p>

                    </div>

                  </label>

                </div>
              )}

              {/* BUTTONS */}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingUniversity
                    ? "Update University"
                    : "Add University"}
                </button>

                <button
                  type="button"
                  onClick={handleCloseUniversityForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ====================================================
            STATS
        ==================================================== */}

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
                    (u) =>
                      Boolean(u.is_active)
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

          {/* SEARCH */}

          <div className="mt-6">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by university, city, province or type..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm text-white outline-none focus:border-indigo-500"
            />

          </div>

        </section>

        {/* ====================================================
            UNIVERSITIES TABLE
        ==================================================== */}

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

                <table className="w-full min-w-[1100px]">

                  <thead className="border-b border-slate-800 bg-slate-950">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        University
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Type
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Location
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        HEC
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

                          {/* UNIVERSITY */}

                          <td className="px-6 py-5">

                            <div className="flex items-start gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-lg">
                                🎓
                              </div>

                              <div>

                                <p className="font-semibold text-white">
                                  {university.name}
                                </p>

                                {university.campus && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {university.campus}
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* TYPE */}

                          <td className="px-6 py-5">

                            <span className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                              {university.university_type ||
                                "—"}
                            </span>

                          </td>

                          {/* LOCATION */}

                          <td className="px-6 py-5">

                            <p className="text-sm text-slate-300">
                              {university.city ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {university.province ||
                                "—"}
                            </p>

                          </td>

                          {/* HEC */}

                          <td className="px-6 py-5">

                            {Boolean(
                              university.hec_recognized
                            ) ? (

                              <span className="rounded-full bg-green-950/60 px-3 py-1 text-xs font-semibold text-green-400">
                                ✓ Recognized
                              </span>

                            ) : (

                              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-500">
                                Not Marked
                              </span>

                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            {Boolean(
                              university.is_active
                            ) ? (

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

                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenPrograms(
                                    university
                                  )
                                }
                                className="rounded-lg border border-indigo-500/40 bg-indigo-600/20 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white"
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
                                className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50"
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
                                className="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/50 disabled:opacity-50"
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

      {/* ======================================================
          PROGRAM MODAL
      ====================================================== */}

      {showProgramModal &&
        selectedUniversity && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

            <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Program Management
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {selectedUniversity.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedUniversity.city}
                    {selectedUniversity.province
                      ? `, ${selectedUniversity.province}`
                      : ""}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={
                    closeProgramModal
                  }
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  ✕ Close
                </button>

              </div>

              {/* PROGRAM TOP BAR */}

              <div className="mt-6 flex items-center justify-between">

                <p className="text-sm text-slate-400">
                  Total Programs:{" "}
                  <span className="font-semibold text-white">
                    {programs.length}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={handleAddProgram}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  + Add Program
                </button>

              </div>

              {/* ==================================================
                  PROGRAM FORM
              ================================================== */}

              {showProgramForm && (

                <div className="mt-6 rounded-xl border border-indigo-500/30 bg-slate-950 p-5">

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">

                    <h4 className="font-semibold text-indigo-300">
                      {editingProgram
                        ? "Edit Program"
                        : "Add New Program"}
                    </h4>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProgramForm(
                          false
                        );
                        setEditingProgram(
                          null
                        );
                        setProgramFormData(
                          emptyProgramForm
                        );
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>

                  </div>

                  <form
                    onSubmit={
                      handleProgramSubmit
                    }
                    className="mt-5 grid gap-4 md:grid-cols-3"
                  >

                    {/* PROGRAM NAME */}

                    <div className="md:col-span-2">

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
                          handleProgramInput(
                            "program_name",
                            e.target.value
                          )
                        }
                        placeholder="BS Software Engineering"
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      />

                    </div>

                    {/* DEGREE LEVEL */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Degree Level
                      </label>

                      <select
                        value={
                          programFormData.degree_level
                        }
                        onChange={(e) =>
                          handleProgramInput(
                            "degree_level",
                            e.target.value
                          )
                        }
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      >
                        <option value="BS">
                          BS
                        </option>
                        <option value="MS">
                          MS
                        </option>
                        <option value="MPhil">
                          MPhil
                        </option>
                        <option value="PhD">
                          PhD
                        </option>
                        <option value="Associate Degree">
                          Associate Degree
                        </option>
                        <option value="Diploma">
                          Diploma
                        </option>
                      </select>

                    </div>

                    {/* DEPARTMENT */}

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
                          handleProgramInput(
                            "department",
                            e.target.value
                          )
                        }
                        placeholder="Computer Science"
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      />

                    </div>

                    {/* CAMPUS */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Campus
                      </label>

                      <input
                        type="text"
                        value={
                          programFormData.campus
                        }
                        onChange={(e) =>
                          handleProgramInput(
                            "campus",
                            e.target.value
                          )
                        }
                        placeholder="Main Campus"
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      />

                    </div>

                    {/* DURATION */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Duration
                      </label>

                      <input
                        type="text"
                        value={
                          programFormData.duration
                        }
                        onChange={(e) =>
                          handleProgramInput(
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="4 Years"
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      />

                    </div>

                    {/* STUDY MODE */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Study Mode
                      </label>

                      <select
                        value={
                          programFormData.study_mode
                        }
                        onChange={(e) =>
                          handleProgramInput(
                            "study_mode",
                            e.target.value
                          )
                        }
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      >
                        <option value="">
                          Select
                        </option>
                        <option value="Morning">
                          Morning
                        </option>
                        <option value="Evening">
                          Evening
                        </option>
                        <option value="Weekend">
                          Weekend
                        </option>
                        <option value="Regular">
                          Regular
                        </option>
                        <option value="Distance Learning">
                          Distance Learning
                        </option>
                        <option value="Online">
                          Online
                        </option>
                      </select>

                    </div>

                    {/* ADMISSION STATUS */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Admission Status
                      </label>

                      <select
                        value={
                          programFormData.admission_status
                        }
                        onChange={(e) =>
                          handleProgramInput(
                            "admission_status",
                            e.target.value
                          )
                        }
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      >
                        <option value="">
                          Select
                        </option>
                        <option value="Open">
                          Open
                        </option>
                        <option value="Closed">
                          Closed
                        </option>
                        <option value="Upcoming">
                          Upcoming
                        </option>
                        <option value="Not Announced">
                          Not Announced
                        </option>
                      </select>

                    </div>

                    {/* ACADEMIC SESSION */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Academic Session
                      </label>

                      <input
                        type="text"
                        value={
                          programFormData.academic_session
                        }
                        onChange={(e) =>
                          handleProgramInput(
                            "academic_session",
                            e.target.value
                          )
                        }
                        placeholder="2026-27"
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      />

                    </div>

                    {/* ELIGIBILITY */}

                    <div className="md:col-span-3">

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Eligibility
                      </label>

                      <textarea
                        value={
                          programFormData.eligibility
                        }
                        onChange={(e) =>
                          handleProgramInput(
                            "eligibility",
                            e.target.value
                          )
                        }
                        rows={3}
                        placeholder="Intermediate / FSC with minimum 50% marks..."
                        disabled={
                          savingProgram
                        }
                        className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      />

                    </div>

                    {/* ENTRY TEST */}

                    <div className="md:col-span-3">

                      <label className="flex cursor-pointer items-center gap-3">

                        <input
                          type="checkbox"
                          checked={
                            programFormData.entry_test_required
                          }
                          onChange={(e) =>
                            handleProgramInput(
                              "entry_test_required",
                              e.target.checked
                            )
                          }
                          disabled={
                            savingProgram
                          }
                          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-600"
                        />

                        <div>

                          <p className="text-sm font-medium text-white">
                            Entry Test Required
                          </p>

                          <p className="text-xs text-slate-500">
                            Mark if admission requires an entry test.
                          </p>

                        </div>

                      </label>

                    </div>

                    {/* SOURCE URL */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Source URL
                      </label>

                      <input
                        type="url"
                        value={
                          programFormData.source_url
                        }
                        onChange={(e) =>
                          handleProgramInput(
                            "source_url",
                            e.target.value
                          )
                        }
                        placeholder="https://university.edu.pk"
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      />

                    </div>

                    {/* LAST VERIFIED */}

                    <div>

                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Last Verified
                      </label>

                      <input
                        type="text"
                        value={
                          programFormData.last_verified
                        }
                        onChange={(e) =>
                          handleProgramInput(
                            "last_verified",
                            e.target.value
                          )
                        }
                        placeholder="2026-08-26"
                        disabled={
                          savingProgram
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                      />

                    </div>

                    {/* BUTTONS */}

                    <div className="flex items-end justify-end gap-2 md:col-span-1">

                      <button
                        type="button"
                        onClick={() => {
                          setShowProgramForm(
                            false
                          );
                          setEditingProgram(
                            null
                          );
                        }}
                        disabled={
                          savingProgram
                        }
                        className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={
                          savingProgram
                        }
                        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {savingProgram
                          ? "Saving..."
                          : editingProgram
                          ? "Update"
                          : "Save"}
                      </button>

                    </div>

                  </form>

                </div>

              )}

              {/* ==================================================
                  PROGRAMS TABLE
              ================================================== */}

              <div className="mt-6">

                {loadingPrograms ? (

                  <div className="py-10 text-center text-sm text-indigo-300">
                    Loading programs...
                  </div>

                ) : programs.length === 0 ? (

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center">

                    <div className="text-4xl">
                      📚
                    </div>

                    <h4 className="mt-3 font-semibold text-white">
                      No Programs Found
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Add the first program for this university.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto rounded-xl border border-slate-800">

                    <table className="w-full min-w-[1100px] text-left text-sm">

                      <thead className="border-b border-slate-800 bg-slate-950">

                        <tr>

                          <th className="px-4 py-3 text-xs uppercase text-slate-400">
                            Program
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-slate-400">
                            Degree / Department
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-slate-400">
                            Duration / Mode
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-slate-400">
                            Admission
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-slate-400">
                            Entry Test
                          </th>

                          <th className="px-4 py-3 text-right text-xs uppercase text-slate-400">
                            Actions
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-800 bg-slate-900/50">

                        {programs.map(
                          (program) => (

                            <tr
                              key={program.id}
                              className="hover:bg-slate-800/40"
                            >

                              {/* PROGRAM */}

                              <td className="px-4 py-4">

                                <p className="font-semibold text-white">
                                  {program.program_name}
                                </p>

                                {program.campus && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {program.campus}
                                  </p>
                                )}

                              </td>

                              {/* DEGREE */}

                              <td className="px-4 py-4">

                                <p className="text-slate-300">
                                  {program.degree_level ||
                                    "—"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {program.department ||
                                    "No department"}
                                </p>

                              </td>

                              {/* DURATION */}

                              <td className="px-4 py-4">

                                <p className="text-slate-300">
                                  {program.duration ||
                                    "—"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {program.study_mode ||
                                    "—"}
                                </p>

                              </td>

                              {/* ADMISSION */}

                              <td className="px-4 py-4">

                                <span className="rounded-full bg-indigo-950/60 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                                  {program.admission_status ||
                                    "Not Set"}
                                </span>

                                {program.academic_session && (
                                  <p className="mt-2 text-xs text-slate-500">
                                    {program.academic_session}
                                  </p>
                                )}

                              </td>

                              {/* ENTRY TEST */}

                              <td className="px-4 py-4">

                                {Boolean(
                                  program.entry_test_required
                                ) ? (

                                  <span className="rounded-full bg-amber-950/60 px-2.5 py-1 text-xs font-semibold text-amber-400">
                                    Required
                                  </span>

                                ) : (

                                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-500">
                                    Not Required
                                  </span>

                                )}

                              </td>

                              {/* ACTIONS */}

                              <td className="px-4 py-4">

                                <div className="flex justify-end gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditProgram(
                                        program
                                      )
                                    }
                                    className="rounded border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteProgram(
                                        program
                                      )
                                    }
                                    disabled={
                                      deletingProgramId ===
                                      program.id
                                    }
                                    className="rounded border border-red-900/60 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/50 disabled:opacity-50"
                                  >
                                    {deletingProgramId ===
                                    program.id
                                      ? "..."
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

                )}

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default AdminUniversities;