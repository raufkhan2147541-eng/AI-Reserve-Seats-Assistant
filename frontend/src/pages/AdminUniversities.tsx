import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// API
// ============================================================

const API_URL = "https://ai-reserve-seats-assistant.onrender.com";

// ============================================================
// TYPES
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
  hec_recognized?: number | boolean | null;
  hec_recognition_source?: string | null;
  description?: string | null;
  last_verified?: string | null;
  academic_session?: string | null;
  is_active?: number | boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface Program {
  id: number;
  university_id: number;
  program_name: string;
  degree_level?: string | null;
  department?: string | null;
  campus?: string | null;
  duration?: string | null;
  study_mode?: string | null;
  eligibility?: string | null;
  entry_test_required?: number | boolean | null;
  admission_status?: string | null;
  academic_session?: string | null;
  source_url?: string | null;
  last_verified?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface FeeStructure {
  id: number;
  university_id: number;
  program_id?: number | null;
  program_name?: string | null;
  admission_fee?: number | null;
  tuition_fee?: number | null;
  semester_fee?: number | null;
  examination_fee?: number | null;
  hostel_fee?: number | null;
  transport_fee?: number | null;
  other_fee?: number | null;
  total_fee?: number | null;
  fee_frequency?: string | null;
  academic_session?: string | null;
  currency?: string | null;
  source_url?: string | null;
  last_verified?: string | null;
}

interface Deadline {
  id: number;
  university_id: number;
  program_id?: number | null;
  admission_title?: string | null;
  admission_session?: string | null;
  application_open_date?: string | null;
  application_deadline?: string | null;
  entry_test_date?: string | null;
  interview_date?: string | null;
  merit_list_date?: string | null;
  fee_submission_deadline?: string | null;
  admission_status?: string | null;
  source_url?: string | null;
  last_verified?: string | null;
}

interface Requirement {
  id: number;
  university_id: number;
  program_id?: number | null;
  requirement_type?: string | null;
  requirement_title?: string | null;
  requirement_description?: string | null;
  minimum_percentage?: number | null;
  required_subjects?: string | null;
  required_documents?: string | null;
  domicile_required?: number | boolean | null;
  entry_test_required?: number | boolean | null;
  source_url?: string | null;
  last_verified?: string | null;
}

interface Source {
  id: number;
  university_id: number;
  source_title: string;
  source_url: string;
  source_type?: string | null;
  academic_session?: string | null;
  verification_status?: string | null;
  last_checked?: string | null;
  notes?: string | null;
}

interface UniversityDetails {
  university: University;
  programs: Program[];
  fees: FeeStructure[];
  deadlines: Deadline[];
  requirements: Requirement[];
  sources: Source[];
}

// ============================================================
// FORM TYPES
// ============================================================

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
  last_verified: string;
  academic_session: string;
  is_active: boolean;
}

interface ProgramForm {
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

interface FeeForm {
  program_id: string;
  program_name: string;
  admission_fee: string;
  tuition_fee: string;
  semester_fee: string;
  examination_fee: string;
  hostel_fee: string;
  transport_fee: string;
  other_fee: string;
  total_fee: string;
  fee_frequency: string;
  academic_session: string;
  currency: string;
  source_url: string;
  last_verified: string;
}

interface DeadlineForm {
  program_id: string;
  admission_title: string;
  admission_session: string;
  application_open_date: string;
  application_deadline: string;
  entry_test_date: string;
  interview_date: string;
  merit_list_date: string;
  fee_submission_deadline: string;
  admission_status: string;
  source_url: string;
  last_verified: string;
}

interface RequirementForm {
  program_id: string;
  requirement_type: string;
  requirement_title: string;
  requirement_description: string;
  minimum_percentage: string;
  required_subjects: string;
  required_documents: string;
  domicile_required: boolean;
  entry_test_required: boolean;
  source_url: string;
  last_verified: string;
}

interface SourceForm {
  source_title: string;
  source_url: string;
  source_type: string;
  academic_session: string;
  verification_status: string;
  last_checked: string;
  notes: string;
}

// ============================================================
// EMPTY FORMS
// ============================================================

const emptyUniversityForm: UniversityForm = {
  name: "",
  university_type: "Public",
  province: "",
  city: "",
  campus: "",
  official_website: "",
  admission_portal: "",
  hec_recognized: false,
  hec_recognition_source: "",
  description: "",
  last_verified: "",
  academic_session: "",
  is_active: true,
};

const emptyProgramForm: ProgramForm = {
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

const emptyFeeForm: FeeForm = {
  program_id: "",
  program_name: "",
  admission_fee: "",
  tuition_fee: "",
  semester_fee: "",
  examination_fee: "",
  hostel_fee: "",
  transport_fee: "",
  other_fee: "",
  total_fee: "",
  fee_frequency: "Per Semester",
  academic_session: "",
  currency: "PKR",
  source_url: "",
  last_verified: "",
};

const emptyDeadlineForm: DeadlineForm = {
  program_id: "",
  admission_title: "",
  admission_session: "",
  application_open_date: "",
  application_deadline: "",
  entry_test_date: "",
  interview_date: "",
  merit_list_date: "",
  fee_submission_deadline: "",
  admission_status: "Open",
  source_url: "",
  last_verified: "",
};

const emptyRequirementForm: RequirementForm = {
  program_id: "",
  requirement_type: "General",
  requirement_title: "",
  requirement_description: "",
  minimum_percentage: "",
  required_subjects: "",
  required_documents: "",
  domicile_required: false,
  entry_test_required: false,
  source_url: "",
  last_verified: "",
};

const emptySourceForm: SourceForm = {
  source_title: "",
  source_url: "",
  source_type: "Official Website",
  academic_session: "",
  verification_status: "pending",
  last_checked: "",
  notes: "",
};

// ============================================================
// HELPERS
// ============================================================

function getAdminToken(): string | null {
  return (
    localStorage.getItem("admin_access_token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function numberValue(value: string): number | null {
  if (value.trim() === "") return null;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function boolValue(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

function getErrorMessage(data: any, fallback: string): string {
  if (!data) return fallback;

  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item: any) => item?.msg || JSON.stringify(item))
      .join(", ");
  }

  return fallback;
}

// ============================================================
// COMPONENT
// ============================================================

export default function AdminUniversities() {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // UNIVERSITY STATE
  // ----------------------------------------------------------

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [showUniversityForm, setShowUniversityForm] = useState(false);
  const [editingUniversity, setEditingUniversity] =
    useState<University | null>(null);

  const [universityForm, setUniversityForm] =
    useState<UniversityForm>(emptyUniversityForm);

  // ----------------------------------------------------------
  // OPEN UNIVERSITY STATE
  // ----------------------------------------------------------

  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  const [showDetails, setShowDetails] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [sources, setSources] = useState<Source[]>([]);

  const [activeSection, setActiveSection] = useState<
    "programs" | "fees" | "deadlines" | "requirements" | "sources"
  >("programs");

  // ----------------------------------------------------------
  // CHILD FORM STATE
  // ----------------------------------------------------------

  const [showChildForm, setShowChildForm] = useState(false);

  const [editingProgram, setEditingProgram] =
    useState<Program | null>(null);

  const [editingFee, setEditingFee] =
    useState<FeeStructure | null>(null);

  const [editingDeadline, setEditingDeadline] =
    useState<Deadline | null>(null);

  const [editingRequirement, setEditingRequirement] =
    useState<Requirement | null>(null);

  const [editingSource, setEditingSource] =
    useState<Source | null>(null);

  const [programForm, setProgramForm] =
    useState<ProgramForm>(emptyProgramForm);

  const [feeForm, setFeeForm] =
    useState<FeeForm>(emptyFeeForm);

  const [deadlineForm, setDeadlineForm] =
    useState<DeadlineForm>(emptyDeadlineForm);

  const [requirementForm, setRequirementForm] =
    useState<RequirementForm>(emptyRequirementForm);

  const [sourceForm, setSourceForm] =
    useState<SourceForm>(emptySourceForm);

  const [savingChild, setSavingChild] = useState(false);

  const [deletingChildId, setDeletingChildId] =
    useState<number | null>(null);

  // ----------------------------------------------------------
  // GLOBAL MESSAGES
  // ----------------------------------------------------------

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // AUTH
  // ==========================================================

  const handleUnauthorized = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  const authHeaders = (json = false): HeadersInit => {
    const token = getAdminToken();

    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(json ? { "Content-Type": "application/json" } : {}),
    };
  };

  // ==========================================================
  // API REQUEST HELPER
  // ==========================================================

  const request = async (
    url: string,
    options: RequestInit = {}
  ): Promise<any> => {
    const token = getAdminToken();

    if (!token) {
      handleUnauthorized();
      throw new Error("Admin authentication required.");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...authHeaders(Boolean(options.body)),
        ...(options.headers || {}),
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
      throw new Error("Your session has expired.");
    }

    if (response.status === 403) {
      throw new Error("You do not have permission to perform this action.");
    }

    if (!response.ok) {
      throw new Error(
        getErrorMessage(data, `Request failed (${response.status}).`)
      );
    }

    return data;
  };

  // ==========================================================
  // LOAD UNIVERSITIES
  // ==========================================================

  const loadUniversities = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await request(`${API_URL}/universities/`);

      const list = Array.isArray(data)
        ? data
        : data?.universities || data?.data || data?.items || [];

      setUniversities(list);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load universities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredUniversities = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return universities;

    return universities.filter((university) => {
      return (
        university.name?.toLowerCase().includes(value) ||
        university.city?.toLowerCase().includes(value) ||
        university.province?.toLowerCase().includes(value) ||
        university.university_type?.toLowerCase().includes(value) ||
        university.campus?.toLowerCase().includes(value)
      );
    });
  }, [universities, search]);

  // ==========================================================
  // UNIVERSITY FORM
  // ==========================================================

  const openAddUniversity = () => {
    setEditingUniversity(null);
    setUniversityForm(emptyUniversityForm);
    setError("");
    setSuccess("");
    setShowUniversityForm(true);
  };

  const openEditUniversity = (university: University) => {
    setEditingUniversity(university);

    setUniversityForm({
      name: university.name || "",
      university_type: university.university_type || "Public",
      province: university.province || "",
      city: university.city || "",
      campus: university.campus || "",
      official_website: university.official_website || "",
      admission_portal: university.admission_portal || "",
      hec_recognized: boolValue(university.hec_recognized),
      hec_recognition_source:
        university.hec_recognition_source || "",
      description: university.description || "",
      last_verified: university.last_verified
        ? university.last_verified.split("T")[0]
        : "",
      academic_session: university.academic_session || "",
      is_active: boolValue(university.is_active),
    });

    setShowUniversityForm(true);
    setError("");
    setSuccess("");
  };

  const handleUniversityChange = (
    field: keyof UniversityForm,
    value: string | boolean
  ) => {
    setUniversityForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const submitUniversity = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!universityForm.name.trim()) {
      setError("University name is required.");
      return;
    }

    if (!universityForm.province.trim()) {
      setError("Province is required.");
      return;
    }

    if (!universityForm.city.trim()) {
      setError("City is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const editing = Boolean(editingUniversity);

      const url = editing
        ? `${API_URL}/universities/${editingUniversity!.id}`
        : `${API_URL}/universities/`;

      const body = {
        name: universityForm.name.trim(),
        university_type: universityForm.university_type.trim(),
        province: universityForm.province.trim(),
        city: universityForm.city.trim(),
        campus: universityForm.campus.trim(),
        official_website: universityForm.official_website.trim(),
        admission_portal: universityForm.admission_portal.trim(),
        hec_recognized: universityForm.hec_recognized ? 1 : 0,
        hec_recognition_source:
          universityForm.hec_recognition_source.trim(),
        description: universityForm.description.trim(),
        last_verified:
          universityForm.last_verified || null,
        academic_session:
          universityForm.academic_session.trim(),
        is_active: universityForm.is_active ? 1 : 0,
      };

      await request(url, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(body),
      });

      setShowUniversityForm(false);
      setEditingUniversity(null);
      setUniversityForm(emptyUniversityForm);

      setSuccess(
        editing
          ? "University updated successfully."
          : "University saved successfully."
      );

      await loadUniversities();
    } catch (err) {
      console.error(err);

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
  // ==========================================================

  const deleteUniversity = async (university: University) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${university.name}"?\n\nAll related Programs, Fees, Deadlines, Requirements and Sources will also be deleted.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(university.id);
      setError("");
      setSuccess("");

      await request(`${API_URL}/universities/${university.id}`, {
        method: "DELETE",
      });

      setUniversities((previous) =>
        previous.filter((item) => item.id !== university.id)
      );

      setSuccess("University deleted successfully.");
    } catch (err) {
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
  // OPEN UNIVERSITY
  // ==========================================================

  const openUniversity = async (university: University) => {
    try {
      setSelectedUniversity(university);
      setShowDetails(true);
      setLoadingDetails(true);
      setError("");

      const data = await request(
        `${API_URL}/universities/${university.id}/details`
      );

      const details: UniversityDetails =
        data?.university
          ? data
          : data?.data || data;

      setSelectedUniversity(
        details?.university || university
      );

      setPrograms(details?.programs || []);
      setFees(details?.fees || []);
      setDeadlines(details?.deadlines || []);
      setRequirements(details?.requirements || []);
      setSources(details?.sources || []);

      setActiveSection("programs");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to open university."
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  // ==========================================================
  // CHILD FORM RESET
  // ==========================================================

  const closeChildForm = () => {
    if (savingChild) return;

    setShowChildForm(false);

    setEditingProgram(null);
    setEditingFee(null);
    setEditingDeadline(null);
    setEditingRequirement(null);
    setEditingSource(null);
  };

  // ==========================================================
  // PROGRAMS
  // ==========================================================

  const addProgram = () => {
    setEditingProgram(null);

    setProgramForm({
      ...emptyProgramForm,
      academic_session:
        selectedUniversity?.academic_session || "",
    });

    setShowChildForm(true);
  };

  const editProgram = (item: Program) => {
    setEditingProgram(item);

    setProgramForm({
      program_name: item.program_name || "",
      degree_level: item.degree_level || "BS",
      department: item.department || "",
      campus: item.campus || "",
      duration: item.duration || "",
      study_mode: item.study_mode || "",
      eligibility: item.eligibility || "",
      entry_test_required: boolValue(item.entry_test_required),
      admission_status: item.admission_status || "Open",
      academic_session: item.academic_session || "",
      source_url: item.source_url || "",
      last_verified: item.last_verified
        ? item.last_verified.split("T")[0]
        : "",
    });

    setShowChildForm(true);
  };

  const saveProgram = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedUniversity) return;

    if (!programForm.program_name.trim()) {
      setError("Program name is required.");
      return;
    }

    try {
      setSavingChild(true);
      setError("");

      const editing = Boolean(editingProgram);

      const url = editing
        ? `${API_URL}/programs/${editingProgram!.id}`
        : `${API_URL}/universities/${selectedUniversity.id}/programs`;

      await request(url, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({
          program_name: programForm.program_name.trim(),
          degree_level: programForm.degree_level.trim(),
          department: programForm.department.trim(),
          campus: programForm.campus.trim(),
          duration: programForm.duration.trim(),
          study_mode: programForm.study_mode.trim(),
          eligibility: programForm.eligibility.trim(),
          entry_test_required:
            programForm.entry_test_required ? 1 : 0,
          admission_status:
            programForm.admission_status.trim(),
          academic_session:
            programForm.academic_session.trim(),
          source_url: programForm.source_url.trim(),
          last_verified:
            programForm.last_verified || null,
        }),
      });

      setSuccess(
        editing
          ? "Program updated successfully."
          : "Program added successfully."
      );

      closeChildForm();

      await openUniversity(selectedUniversity);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save program."
      );
    } finally {
      setSavingChild(false);
    }
  };

  const deleteProgram = async (item: Program) => {
    if (!window.confirm(`Delete "${item.program_name}"?`)) return;

    try {
      setDeletingChildId(item.id);
      setError("");

      await request(`${API_URL}/programs/${item.id}`, {
        method: "DELETE",
      });

      setPrograms((previous) =>
        previous.filter((program) => program.id !== item.id)
      );

      setSuccess("Program deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete program."
      );
    } finally {
      setDeletingChildId(null);
    }
  };

  // ==========================================================
  // FEES
  // ==========================================================

  const addFee = () => {
    setEditingFee(null);

    setFeeForm({
      ...emptyFeeForm,
      academic_session:
        selectedUniversity?.academic_session || "",
    });

    setShowChildForm(true);
  };

  const editFee = (item: FeeStructure) => {
    setEditingFee(item);

    setFeeForm({
      program_id: item.program_id
        ? String(item.program_id)
        : "",
      program_name: item.program_name || "",
      admission_fee:
        item.admission_fee != null
          ? String(item.admission_fee)
          : "",
      tuition_fee:
        item.tuition_fee != null
          ? String(item.tuition_fee)
          : "",
      semester_fee:
        item.semester_fee != null
          ? String(item.semester_fee)
          : "",
      examination_fee:
        item.examination_fee != null
          ? String(item.examination_fee)
          : "",
      hostel_fee:
        item.hostel_fee != null
          ? String(item.hostel_fee)
          : "",
      transport_fee:
        item.transport_fee != null
          ? String(item.transport_fee)
          : "",
      other_fee:
        item.other_fee != null
          ? String(item.other_fee)
          : "",
      total_fee:
        item.total_fee != null
          ? String(item.total_fee)
          : "",
      fee_frequency: item.fee_frequency || "Per Semester",
      academic_session: item.academic_session || "",
      currency: item.currency || "PKR",
      source_url: item.source_url || "",
      last_verified: item.last_verified
        ? item.last_verified.split("T")[0]
        : "",
    });

    setShowChildForm(true);
  };

  const calculateTotalFee = () => {
    const values = [
      feeForm.admission_fee,
      feeForm.tuition_fee,
      feeForm.semester_fee,
      feeForm.examination_fee,
      feeForm.hostel_fee,
      feeForm.transport_fee,
      feeForm.other_fee,
    ];

    const total = values.reduce((sum, value) => {
      return sum + (Number(value) || 0);
    }, 0);

    setFeeForm((previous) => ({
      ...previous,
      total_fee: total > 0 ? String(total) : "",
    }));
  };

  const saveFee = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedUniversity) return;

    try {
      setSavingChild(true);
      setError("");

      const editing = Boolean(editingFee);

      const url = editing
        ? `${API_URL}/fees/${editingFee!.id}`
        : `${API_URL}/universities/${selectedUniversity.id}/fees`;

      await request(url, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({
          program_id: feeForm.program_id
            ? Number(feeForm.program_id)
            : null,
          program_name: feeForm.program_name.trim(),

          admission_fee: numberValue(
            feeForm.admission_fee
          ),
          tuition_fee: numberValue(
            feeForm.tuition_fee
          ),
          semester_fee: numberValue(
            feeForm.semester_fee
          ),
          examination_fee: numberValue(
            feeForm.examination_fee
          ),
          hostel_fee: numberValue(
            feeForm.hostel_fee
          ),
          transport_fee: numberValue(
            feeForm.transport_fee
          ),
          other_fee: numberValue(
            feeForm.other_fee
          ),
          total_fee: numberValue(
            feeForm.total_fee
          ),

          fee_frequency:
            feeForm.fee_frequency.trim(),
          academic_session:
            feeForm.academic_session.trim(),
          currency:
            feeForm.currency.trim() || "PKR",
          source_url:
            feeForm.source_url.trim(),
          last_verified:
            feeForm.last_verified || null,
        }),
      });

      setSuccess(
        editing
          ? "Fee structure updated successfully."
          : "Fee structure added successfully."
      );

      closeChildForm();

      await openUniversity(selectedUniversity);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save fee structure."
      );
    } finally {
      setSavingChild(false);
    }
  };

  const deleteFee = async (item: FeeStructure) => {
    if (!window.confirm("Delete this fee structure?")) return;

    try {
      setDeletingChildId(item.id);

      await request(`${API_URL}/fees/${item.id}`, {
        method: "DELETE",
      });

      setFees((previous) =>
        previous.filter((fee) => fee.id !== item.id)
      );

      setSuccess("Fee structure deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete fee structure."
      );
    } finally {
      setDeletingChildId(null);
    }
  };

  // ==========================================================
  // DEADLINES
  // ==========================================================

  const addDeadline = () => {
    setEditingDeadline(null);

    setDeadlineForm({
      ...emptyDeadlineForm,
      admission_session:
        selectedUniversity?.academic_session || "",
    });

    setShowChildForm(true);
  };

  const editDeadline = (item: Deadline) => {
    setEditingDeadline(item);

    const dateOnly = (value?: string | null) =>
      value ? value.split("T")[0] : "";

    setDeadlineForm({
      program_id: item.program_id
        ? String(item.program_id)
        : "",
      admission_title: item.admission_title || "",
      admission_session:
        item.admission_session || "",
      application_open_date:
        dateOnly(item.application_open_date),
      application_deadline:
        dateOnly(item.application_deadline),
      entry_test_date:
        dateOnly(item.entry_test_date),
      interview_date:
        dateOnly(item.interview_date),
      merit_list_date:
        dateOnly(item.merit_list_date),
      fee_submission_deadline:
        dateOnly(item.fee_submission_deadline),
      admission_status:
        item.admission_status || "Open",
      source_url: item.source_url || "",
      last_verified:
        dateOnly(item.last_verified),
    });

    setShowChildForm(true);
  };

  const saveDeadline = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedUniversity) return;

    try {
      setSavingChild(true);
      setError("");

      const editing = Boolean(editingDeadline);

      const url = editing
        ? `${API_URL}/deadlines/${editingDeadline!.id}`
        : `${API_URL}/universities/${selectedUniversity.id}/deadlines`;

      await request(url, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({
          program_id: deadlineForm.program_id
            ? Number(deadlineForm.program_id)
            : null,

          admission_title:
            deadlineForm.admission_title.trim(),

          admission_session:
            deadlineForm.admission_session.trim(),

          application_open_date:
            deadlineForm.application_open_date || null,

          application_deadline:
            deadlineForm.application_deadline || null,

          entry_test_date:
            deadlineForm.entry_test_date || null,

          interview_date:
            deadlineForm.interview_date || null,

          merit_list_date:
            deadlineForm.merit_list_date || null,

          fee_submission_deadline:
            deadlineForm.fee_submission_deadline || null,

          admission_status:
            deadlineForm.admission_status.trim(),

          source_url:
            deadlineForm.source_url.trim(),

          last_verified:
            deadlineForm.last_verified || null,
        }),
      });

      setSuccess(
        editing
          ? "Deadline updated successfully."
          : "Deadline added successfully."
      );

      closeChildForm();

      await openUniversity(selectedUniversity);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save deadline."
      );
    } finally {
      setSavingChild(false);
    }
  };

  const deleteDeadline = async (item: Deadline) => {
    if (!window.confirm("Delete this deadline?")) return;

    try {
      setDeletingChildId(item.id);

      await request(`${API_URL}/deadlines/${item.id}`, {
        method: "DELETE",
      });

      setDeadlines((previous) =>
        previous.filter((deadline) => deadline.id !== item.id)
      );

      setSuccess("Deadline deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete deadline."
      );
    } finally {
      setDeletingChildId(null);
    }
  };

  // ==========================================================
  // REQUIREMENTS
  // ==========================================================

  const addRequirement = () => {
    setEditingRequirement(null);

    setRequirementForm({
      ...emptyRequirementForm,
    });

    setShowChildForm(true);
  };

  const editRequirement = (item: Requirement) => {
    setEditingRequirement(item);

    setRequirementForm({
      program_id: item.program_id
        ? String(item.program_id)
        : "",
      requirement_type:
        item.requirement_type || "General",
      requirement_title:
        item.requirement_title || "",
      requirement_description:
        item.requirement_description || "",
      minimum_percentage:
        item.minimum_percentage != null
          ? String(item.minimum_percentage)
          : "",
      required_subjects:
        item.required_subjects || "",
      required_documents:
        item.required_documents || "",
      domicile_required:
        boolValue(item.domicile_required),
      entry_test_required:
        boolValue(item.entry_test_required),
      source_url: item.source_url || "",
      last_verified: item.last_verified
        ? item.last_verified.split("T")[0]
        : "",
    });

    setShowChildForm(true);
  };

  const saveRequirement = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedUniversity) return;

    try {
      setSavingChild(true);
      setError("");

      const editing = Boolean(editingRequirement);

      const url = editing
        ? `${API_URL}/requirements/${editingRequirement!.id}`
        : `${API_URL}/universities/${selectedUniversity.id}/requirements`;

      await request(url, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({
          program_id: requirementForm.program_id
            ? Number(requirementForm.program_id)
            : null,

          requirement_type:
            requirementForm.requirement_type.trim(),

          requirement_title:
            requirementForm.requirement_title.trim(),

          requirement_description:
            requirementForm.requirement_description.trim(),

          minimum_percentage:
            numberValue(
              requirementForm.minimum_percentage
            ),

          required_subjects:
            requirementForm.required_subjects.trim(),

          required_documents:
            requirementForm.required_documents.trim(),

          domicile_required:
            requirementForm.domicile_required ? 1 : 0,

          entry_test_required:
            requirementForm.entry_test_required ? 1 : 0,

          source_url:
            requirementForm.source_url.trim(),

          last_verified:
            requirementForm.last_verified || null,
        }),
      });

      setSuccess(
        editing
          ? "Requirement updated successfully."
          : "Requirement added successfully."
      );

      closeChildForm();

      await openUniversity(selectedUniversity);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save requirement."
      );
    } finally {
      setSavingChild(false);
    }
  };

  const deleteRequirement = async (
    item: Requirement
  ) => {
    if (!window.confirm("Delete this requirement?")) return;

    try {
      setDeletingChildId(item.id);

      await request(
        `${API_URL}/requirements/${item.id}`,
        {
          method: "DELETE",
        }
      );

      setRequirements((previous) =>
        previous.filter(
          (requirement) =>
            requirement.id !== item.id
        )
      );

      setSuccess("Requirement deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete requirement."
      );
    } finally {
      setDeletingChildId(null);
    }
  };

  // ==========================================================
  // SOURCES
  // ==========================================================

  const addSource = () => {
    setEditingSource(null);

    setSourceForm({
      ...emptySourceForm,
      academic_session:
        selectedUniversity?.academic_session || "",
    });

    setShowChildForm(true);
  };

  const editSource = (item: Source) => {
    setEditingSource(item);

    setSourceForm({
      source_title: item.source_title || "",
      source_url: item.source_url || "",
      source_type:
        item.source_type || "Official Website",
      academic_session:
        item.academic_session || "",
      verification_status:
        item.verification_status || "pending",
      last_checked: item.last_checked
        ? item.last_checked.split("T")[0]
        : "",
      notes: item.notes || "",
    });

    setShowChildForm(true);
  };

  const saveSource = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedUniversity) return;

    if (!sourceForm.source_title.trim()) {
      setError("Source title is required.");
      return;
    }

    if (!sourceForm.source_url.trim()) {
      setError("Source URL is required.");
      return;
    }

    try {
      setSavingChild(true);
      setError("");

      const editing = Boolean(editingSource);

      const url = editing
        ? `${API_URL}/sources/${editingSource!.id}`
        : `${API_URL}/universities/${selectedUniversity.id}/sources`;

      await request(url, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({
          source_title:
            sourceForm.source_title.trim(),

          source_url:
            sourceForm.source_url.trim(),

          source_type:
            sourceForm.source_type.trim(),

          academic_session:
            sourceForm.academic_session.trim(),

          verification_status:
            sourceForm.verification_status.trim(),

          last_checked:
            sourceForm.last_checked || null,

          notes:
            sourceForm.notes.trim(),
        }),
      });

      setSuccess(
        editing
          ? "Source updated successfully."
          : "Source added successfully."
      );

      closeChildForm();

      await openUniversity(selectedUniversity);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save source."
      );
    } finally {
      setSavingChild(false);
    }
  };

  const deleteSource = async (item: Source) => {
    if (!window.confirm("Delete this source?")) return;

    try {
      setDeletingChildId(item.id);

      await request(`${API_URL}/sources/${item.id}`, {
        method: "DELETE",
      });

      setSources((previous) =>
        previous.filter((source) => source.id !== item.id)
      );

      setSuccess("Source deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete source."
      );
    } finally {
      setDeletingChildId(null);
    }
  };

  // ==========================================================
  // COMMON INPUT
  // ==========================================================

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-300";

  const sectionButtonClass = (
    active: boolean
  ) =>
    `rounded-xl px-4 py-3 text-sm font-semibold transition ${
      active
        ? "bg-indigo-600 text-white"
        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
    }`;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-2xl">
              🎓
            </div>

            <div>
              <h1 className="text-xl font-bold">
                University Management
              </h1>

              <p className="text-sm text-slate-400">
                Universities, Programs, Fees & Admissions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* PAGE HEADER */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Administration
            </p>

            <h2 className="text-3xl font-bold">
              Universities
            </h2>

            <p className="mt-2 text-slate-400">
              Manage complete university admission information.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddUniversity}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + Add University
          </button>
        </div>

        {/* MESSAGES */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-300">
            <div className="flex items-start justify-between gap-4">
              <span>{error}</span>

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

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-4 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {/* ====================================================
            UNIVERSITY FORM
        ==================================================== */}

        {showUniversityForm && (
          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-xl font-bold">
                  {editingUniversity
                    ? "Edit University"
                    : "Add University"}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Enter complete university information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowUniversityForm(false)
                }
                disabled={saving}
                className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={submitUniversity}
              className="grid gap-5 md:grid-cols-2"
            >
              {/* NAME */}

              <div className="md:col-span-2">
                <label className={labelClass}>
                  University Name *
                </label>

                <input
                  value={universityForm.name}
                  onChange={(e) =>
                    handleUniversityChange(
                      "name",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="University of Okara"
                  disabled={saving}
                />
              </div>

              {/* TYPE */}

              <div>
                <label className={labelClass}>
                  University Type
                </label>

                <select
                  value={universityForm.university_type}
                  onChange={(e) =>
                    handleUniversityChange(
                      "university_type",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  disabled={saving}
                >
                  <option>Public</option>
                  <option>Private</option>
                  <option>Federal</option>
                  <option>Military</option>
                  <option>Other</option>
                </select>
              </div>

              {/* PROVINCE */}

              <div>
                <label className={labelClass}>
                  Province *
                </label>

                <input
                  value={universityForm.province}
                  onChange={(e) =>
                    handleUniversityChange(
                      "province",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="Punjab"
                  disabled={saving}
                />
              </div>

              {/* CITY */}

              <div>
                <label className={labelClass}>
                  City *
                </label>

                <input
                  value={universityForm.city}
                  onChange={(e) =>
                    handleUniversityChange(
                      "city",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="Okara"
                  disabled={saving}
                />
              </div>

              {/* CAMPUS */}

              <div>
                <label className={labelClass}>
                  Campus
                </label>

                <input
                  value={universityForm.campus}
                  onChange={(e) =>
                    handleUniversityChange(
                      "campus",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="Main Campus"
                  disabled={saving}
                />
              </div>

              {/* WEBSITE */}

              <div>
                <label className={labelClass}>
                  Official Website
                </label>

                <input
                  type="url"
                  value={universityForm.official_website}
                  onChange={(e) =>
                    handleUniversityChange(
                      "official_website",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="https://university.edu.pk"
                  disabled={saving}
                />
              </div>

              {/* ADMISSION PORTAL */}

              <div>
                <label className={labelClass}>
                  Admission Portal
                </label>

                <input
                  type="url"
                  value={universityForm.admission_portal}
                  onChange={(e) =>
                    handleUniversityChange(
                      "admission_portal",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="https://admissions.university.edu.pk"
                  disabled={saving}
                />
              </div>

              {/* HEC */}

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      universityForm.hec_recognized
                    }
                    onChange={(e) =>
                      handleUniversityChange(
                        "hec_recognized",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-indigo-600"
                    disabled={saving}
                  />

                  <span className="text-sm font-semibold">
                    HEC Recognized
                  </span>
                </label>
              </div>

              {/* HEC SOURCE */}

              <div>
                <label className={labelClass}>
                  HEC Recognition Source
                </label>

                <input
                  value={
                    universityForm.hec_recognition_source
                  }
                  onChange={(e) =>
                    handleUniversityChange(
                      "hec_recognition_source",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="HEC official website / notification"
                  disabled={saving}
                />
              </div>

              {/* SESSION */}

              <div>
                <label className={labelClass}>
                  Academic Session
                </label>

                <input
                  value={universityForm.academic_session}
                  onChange={(e) =>
                    handleUniversityChange(
                      "academic_session",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="2026-27"
                  disabled={saving}
                />
              </div>

              {/* VERIFIED */}

              <div>
                <label className={labelClass}>
                  Last Verified
                </label>

                <input
                  type="date"
                  value={universityForm.last_verified}
                  onChange={(e) =>
                    handleUniversityChange(
                      "last_verified",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  disabled={saving}
                />
              </div>

              {/* ACTIVE */}

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={universityForm.is_active}
                    onChange={(e) =>
                      handleUniversityChange(
                        "is_active",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-indigo-600"
                    disabled={saving}
                  />

                  <span className="text-sm font-semibold">
                    Active University
                  </span>
                </label>
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Description
                </label>

                <textarea
                  rows={4}
                  value={universityForm.description}
                  onChange={(e) =>
                    handleUniversityChange(
                      "description",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="University description..."
                  disabled={saving}
                />
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowUniversityForm(false)
                  }
                  disabled={saving}
                  className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingUniversity
                    ? "Update University"
                    : "Save University"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ====================================================
            SEARCH
        ==================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className={inputClass}
              placeholder="Search university, city, province..."
            />

            <div className="flex items-center rounded-xl bg-slate-950 px-5 text-sm text-slate-400">
              {filteredUniversities.length} Universities
            </div>
          </div>
        </section>

        {/* ====================================================
            UNIVERSITY TABLE
        ==================================================== */}

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
            <p className="mt-4 text-sm text-slate-400">
              Loading universities...
            </p>
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <div className="text-5xl">🎓</div>

            <h3 className="mt-4 text-lg font-bold">
              No Universities Found
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Add a university or change your search.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="border-b border-slate-800 bg-slate-950">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                      University
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                      HEC
                    </th>

                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                      Session
                    </th>

                    <th className="px-5 py-4 text-right text-xs uppercase tracking-wider text-slate-500">
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
                        <td className="px-5 py-5">
                          <div className="font-semibold text-white">
                            {university.name}
                          </div>

                          {university.campus && (
                            <div className="mt-1 text-xs text-slate-500">
                              {university.campus}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-300">
                          {university.university_type ||
                            "—"}
                        </td>

                        <td className="px-5 py-5">
                          <div className="text-sm text-slate-200">
                            {university.city || "—"}
                          </div>

                          <div className="text-xs text-slate-500">
                            {university.province || "—"}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          {boolValue(
                            university.hec_recognized
                          ) ? (
                            <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400">
                              Recognized
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-950 px-3 py-1 text-xs font-semibold text-red-400">
                              Not Verified
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-400">
                          {university.academic_session ||
                            "—"}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-2">
                            {/* OPEN */}

                            <button
                              type="button"
                              onClick={() =>
                                openUniversity(
                                  university
                                )
                              }
                              className="rounded-lg bg-indigo-600/20 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white"
                            >
                              Open
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                openEditUniversity(
                                  university
                                )
                              }
                              disabled={
                                deletingId ===
                                university.id
                              }
                              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                            >
                              Edit
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteUniversity(
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
      </main>

      {/* ======================================================
          UNIVERSITY DETAILS MODAL
      ====================================================== */}

      {showDetails && selectedUniversity && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 max-w-7xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            {/* DETAILS HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-5">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedUniversity.name}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {selectedUniversity.city},{" "}
                  {selectedUniversity.province}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDetails(false);
                  setShowChildForm(false);
                }}
                className="rounded-xl border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            {loadingDetails ? (
              <div className="p-16 text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

                <p className="mt-4 text-sm text-slate-400">
                  Loading complete university profile...
                </p>
              </div>
            ) : (
              <div className="p-6">
                {/* UNIVERSITY SUMMARY */}

                <div className="mb-6 grid gap-4 md:grid-cols-4">
                  <InfoCard
                    title="University Type"
                    value={
                      selectedUniversity.university_type ||
                      "—"
                    }
                  />

                  <InfoCard
                    title="Campus"
                    value={
                      selectedUniversity.campus || "—"
                    }
                  />

                  <InfoCard
                    title="Academic Session"
                    value={
                      selectedUniversity.academic_session ||
                      "—"
                    }
                  />

                  <InfoCard
                    title="HEC Status"
                    value={
                      boolValue(
                        selectedUniversity.hec_recognized
                      )
                        ? "Recognized"
                        : "Not Verified"
                    }
                  />
                </div>

                {/* QUICK LINKS */}

                <div className="mb-6 grid gap-3 md:grid-cols-2">
                  {selectedUniversity.official_website && (
                    <a
                      href={
                        selectedUniversity.official_website
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-indigo-300 hover:border-indigo-500"
                    >
                      🌐 Official Website
                    </a>
                  )}

                  {selectedUniversity.admission_portal && (
                    <a
                      href={
                        selectedUniversity.admission_portal
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-indigo-300 hover:border-indigo-500"
                    >
                      📝 Admission Portal
                    </a>
                  )}
                </div>

                {/* DESCRIPTION */}

                {selectedUniversity.description && (
                  <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <h3 className="font-semibold">
                      Description
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                      {selectedUniversity.description}
                    </p>
                  </div>
                )}

                {/* ==================================================
                    TABS
                ================================================== */}

                <div className="mb-6 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection("programs")
                    }
                    className={sectionButtonClass(
                      activeSection === "programs"
                    )}
                  >
                    📚 Programs ({programs.length})
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection("fees")
                    }
                    className={sectionButtonClass(
                      activeSection === "fees"
                    )}
                  >
                    💰 Fees ({fees.length})
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection("deadlines")
                    }
                    className={sectionButtonClass(
                      activeSection === "deadlines"
                    )}
                  >
                    📅 Deadlines ({deadlines.length})
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection("requirements")
                    }
                    className={sectionButtonClass(
                      activeSection === "requirements"
                    )}
                  >
                    📋 Requirements (
                    {requirements.length})
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection("sources")
                    }
                    className={sectionButtonClass(
                      activeSection === "sources"
                    )}
                  >
                    🔗 Sources ({sources.length})
                  </button>
                </div>

                {/* ==================================================
                    CHILD FORM
                ================================================== */}

                {showChildForm && (
                  <div className="mb-6 rounded-2xl border border-indigo-900/50 bg-indigo-950/10 p-6">
                    {/* PROGRAM FORM */}

                    {activeSection === "programs" && (
                      <form
                        onSubmit={saveProgram}
                        className="grid gap-5 md:grid-cols-2"
                      >
                        <div className="md:col-span-2">
                          <h3 className="text-lg font-bold">
                            {editingProgram
                              ? "Edit Program"
                              : "Add Program"}
                          </h3>
                        </div>

                        <FormField
                          label="Program Name *"
                          value={
                            programForm.program_name
                          }
                          onChange={(value) =>
                            setProgramForm((p) => ({
                              ...p,
                              program_name: value,
                            }))
                          }
                          placeholder="BS Software Engineering"
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Degree Level
                          </label>

                          <select
                            value={
                              programForm.degree_level
                            }
                            onChange={(e) =>
                              setProgramForm((p) => ({
                                ...p,
                                degree_level:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                          >
                            <option>BS</option>
                            <option>MS</option>
                            <option>MPhil</option>
                            <option>PhD</option>
                            <option>ADP</option>
                            <option>Diploma</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <FormField
                          label="Department"
                          value={
                            programForm.department
                          }
                          onChange={(value) =>
                            setProgramForm((p) => ({
                              ...p,
                              department: value,
                            }))
                          }
                          placeholder="Department of Computer Science"
                          inputClass={inputClass}
                        />

                        <FormField
                          label="Campus"
                          value={programForm.campus}
                          onChange={(value) =>
                            setProgramForm((p) => ({
                              ...p,
                              campus: value,
                            }))
                          }
                          placeholder="Main Campus"
                          inputClass={inputClass}
                        />

                        <FormField
                          label="Duration"
                          value={programForm.duration}
                          onChange={(value) =>
                            setProgramForm((p) => ({
                              ...p,
                              duration: value,
                            }))
                          }
                          placeholder="4 Years"
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Study Mode
                          </label>

                          <select
                            value={
                              programForm.study_mode
                            }
                            onChange={(e) =>
                              setProgramForm((p) => ({
                                ...p,
                                study_mode:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                          >
                            <option>Morning</option>
                            <option>Evening</option>
                            <option>Weekend</option>
                            <option>Regular</option>
                            <option>Online</option>
                            <option>Hybrid</option>
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Admission Status
                          </label>

                          <select
                            value={
                              programForm.admission_status
                            }
                            onChange={(e) =>
                              setProgramForm((p) => ({
                                ...p,
                                admission_status:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                          >
                            <option>Open</option>
                            <option>Closed</option>
                            <option>Upcoming</option>
                            <option>Expected</option>
                          </select>
                        </div>

                        <FormField
                          label="Academic Session"
                          value={
                            programForm.academic_session
                          }
                          onChange={(value) =>
                            setProgramForm((p) => ({
                              ...p,
                              academic_session: value,
                            }))
                          }
                          placeholder="2026-27"
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Last Verified
                          </label>

                          <input
                            type="date"
                            value={
                              programForm.last_verified
                            }
                            onChange={(e) =>
                              setProgramForm((p) => ({
                                ...p,
                                last_verified:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                          />
                        </div>

                        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                          <label className="flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={
                                programForm.entry_test_required
                              }
                              onChange={(e) =>
                                setProgramForm((p) => ({
                                  ...p,
                                  entry_test_required:
                                    e.target.checked,
                                }))
                              }
                              className="h-5 w-5"
                            />

                            <span className="text-sm font-semibold">
                              Entry Test Required
                            </span>
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <label className={labelClass}>
                            Eligibility
                          </label>

                          <textarea
                            rows={4}
                            value={
                              programForm.eligibility
                            }
                            onChange={(e) =>
                              setProgramForm((p) => ({
                                ...p,
                                eligibility:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                            placeholder="Minimum percentage, subjects, qualification..."
                          />
                        </div>

                        <FormField
                          label="Source URL"
                          value={
                            programForm.source_url
                          }
                          onChange={(value) =>
                            setProgramForm((p) => ({
                              ...p,
                              source_url: value,
                            }))
                          }
                          placeholder="https://university.edu.pk"
                          inputClass={inputClass}
                        />

                        <div className="flex items-end justify-end gap-3">
                          <button
                            type="button"
                            onClick={closeChildForm}
                            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={savingChild}
                            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {savingChild
                              ? "Saving..."
                              : editingProgram
                              ? "Update Program"
                              : "Save Program"}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* ==================================================
                        FEE FORM
                    ================================================== */}

                    {activeSection === "fees" && (
                      <form
                        onSubmit={saveFee}
                        className="grid gap-5 md:grid-cols-3"
                      >
                        <div className="md:col-span-3">
                          <h3 className="text-lg font-bold">
                            {editingFee
                              ? "Edit Fee Structure"
                              : "Add Fee Structure"}
                          </h3>
                        </div>

                        <ProgramSelect
                          value={feeForm.program_id}
                          programs={programs}
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              program_id: value,
                              program_name:
                                programs.find(
                                  (x) =>
                                    String(x.id) ===
                                    value
                                )?.program_name ||
                                p.program_name,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <FormField
                          label="Program Name"
                          value={
                            feeForm.program_name
                          }
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              program_name: value,
                            }))
                          }
                          placeholder="BS Software Engineering"
                          inputClass={inputClass}
                        />

                        <FormField
                          label="Currency"
                          value={feeForm.currency}
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              currency: value,
                            }))
                          }
                          placeholder="PKR"
                          inputClass={inputClass}
                        />

                        <NumberField
                          label="Admission Fee"
                          value={
                            feeForm.admission_fee
                          }
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              admission_fee: value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <NumberField
                          label="Tuition Fee"
                          value={
                            feeForm.tuition_fee
                          }
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              tuition_fee: value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <NumberField
                          label="Semester Fee"
                          value={
                            feeForm.semester_fee
                          }
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              semester_fee: value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <NumberField
                          label="Examination Fee"
                          value={
                            feeForm.examination_fee
                          }
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              examination_fee:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <NumberField
                          label="Hostel Fee"
                          value={feeForm.hostel_fee}
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              hostel_fee: value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <NumberField
                          label="Transport Fee"
                          value={
                            feeForm.transport_fee
                          }
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              transport_fee:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <NumberField
                          label="Other Fee"
                          value={feeForm.other_fee}
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              other_fee: value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <NumberField
                          label="Total Fee"
                          value={feeForm.total_fee}
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              total_fee: value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={calculateTotalFee}
                            className="w-full rounded-xl border border-indigo-700 px-4 py-3 text-sm font-semibold text-indigo-300 hover:bg-indigo-950"
                          >
                            Calculate Total
                          </button>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Fee Frequency
                          </label>

                          <select
                            value={
                              feeForm.fee_frequency
                            }
                            onChange={(e) =>
                              setFeeForm((p) => ({
                                ...p,
                                fee_frequency:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                          >
                            <option>
                              Per Semester
                            </option>
                            <option>Per Year</option>
                            <option>One Time</option>
                            <option>Monthly</option>
                          </select>
                        </div>

                        <FormField
                          label="Academic Session"
                          value={
                            feeForm.academic_session
                          }
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              academic_session:
                                value,
                            }))
                          }
                          placeholder="2026-27"
                          inputClass={inputClass}
                        />

                        <FormField
                          label="Source URL"
                          value={
                            feeForm.source_url
                          }
                          onChange={(value) =>
                            setFeeForm((p) => ({
                              ...p,
                              source_url: value,
                            }))
                          }
                          placeholder="https://..."
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Last Verified
                          </label>

                          <input
                            type="date"
                            value={
                              feeForm.last_verified
                            }
                            onChange={(e) =>
                              setFeeForm((p) => ({
                                ...p,
                                last_verified:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                          />
                        </div>

                        <div className="flex items-end justify-end gap-3 md:col-span-3">
                          <button
                            type="button"
                            onClick={closeChildForm}
                            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={savingChild}
                            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {savingChild
                              ? "Saving..."
                              : editingFee
                              ? "Update Fee"
                              : "Save Fee"}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* ==================================================
                        DEADLINE FORM
                    ================================================== */}

                    {activeSection === "deadlines" && (
                      <form
                        onSubmit={saveDeadline}
                        className="grid gap-5 md:grid-cols-2"
                      >
                        <div className="md:col-span-2">
                          <h3 className="text-lg font-bold">
                            {editingDeadline
                              ? "Edit Admission Deadline"
                              : "Add Admission Deadline"}
                          </h3>
                        </div>

                        <ProgramSelect
                          value={
                            deadlineForm.program_id
                          }
                          programs={programs}
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              program_id: value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <FormField
                          label="Admission Title"
                          value={
                            deadlineForm.admission_title
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              admission_title:
                                value,
                            }))
                          }
                          placeholder="BS Admissions Fall 2026"
                          inputClass={inputClass}
                        />

                        <FormField
                          label="Admission Session"
                          value={
                            deadlineForm.admission_session
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              admission_session:
                                value,
                            }))
                          }
                          placeholder="Fall 2026"
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Admission Status
                          </label>

                          <select
                            value={
                              deadlineForm.admission_status
                            }
                            onChange={(e) =>
                              setDeadlineForm((p) => ({
                                ...p,
                                admission_status:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                          >
                            <option>Open</option>
                            <option>Closed</option>
                            <option>Upcoming</option>
                            <option>Expected</option>
                          </select>
                        </div>

                        <DateField
                          label="Application Open Date"
                          value={
                            deadlineForm.application_open_date
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              application_open_date:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <DateField
                          label="Application Deadline"
                          value={
                            deadlineForm.application_deadline
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              application_deadline:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <DateField
                          label="Entry Test Date"
                          value={
                            deadlineForm.entry_test_date
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              entry_test_date:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <DateField
                          label="Interview Date"
                          value={
                            deadlineForm.interview_date
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              interview_date:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <DateField
                          label="Merit List Date"
                          value={
                            deadlineForm.merit_list_date
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              merit_list_date:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <DateField
                          label="Fee Submission Deadline"
                          value={
                            deadlineForm.fee_submission_deadline
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              fee_submission_deadline:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <FormField
                          label="Source URL"
                          value={
                            deadlineForm.source_url
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              source_url: value,
                            }))
                          }
                          placeholder="https://..."
                          inputClass={inputClass}
                        />

                        <DateField
                          label="Last Verified"
                          value={
                            deadlineForm.last_verified
                          }
                          onChange={(value) =>
                            setDeadlineForm((p) => ({
                              ...p,
                              last_verified:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <div className="flex justify-end gap-3 md:col-span-2">
                          <button
                            type="button"
                            onClick={closeChildForm}
                            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={savingChild}
                            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {savingChild
                              ? "Saving..."
                              : editingDeadline
                              ? "Update Deadline"
                              : "Save Deadline"}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* ==================================================
                        REQUIREMENT FORM
                    ================================================== */}

                    {activeSection === "requirements" && (
                      <form
                        onSubmit={saveRequirement}
                        className="grid gap-5 md:grid-cols-2"
                      >
                        <div className="md:col-span-2">
                          <h3 className="text-lg font-bold">
                            {editingRequirement
                              ? "Edit Requirement"
                              : "Add Requirement"}
                          </h3>
                        </div>

                        <ProgramSelect
                          value={
                            requirementForm.program_id
                          }
                          programs={programs}
                          onChange={(value) =>
                            setRequirementForm(
                              (p) => ({
                                ...p,
                                program_id: value,
                              })
                            )
                          }
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Requirement Type
                          </label>

                          <select
                            value={
                              requirementForm.requirement_type
                            }
                            onChange={(e) =>
                              setRequirementForm(
                                (p) => ({
                                  ...p,
                                  requirement_type:
                                    e.target.value,
                                })
                              )
                            }
                            className={inputClass}
                          >
                            <option>General</option>
                            <option>Academic</option>
                            <option>Document</option>
                            <option>Domicile</option>
                            <option>Entry Test</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <FormField
                          label="Requirement Title"
                          value={
                            requirementForm.requirement_title
                          }
                          onChange={(value) =>
                            setRequirementForm(
                              (p) => ({
                                ...p,
                                requirement_title:
                                  value,
                              })
                            )
                          }
                          placeholder="Minimum Qualification"
                          inputClass={inputClass}
                        />

                        <NumberField
                          label="Minimum Percentage"
                          value={
                            requirementForm.minimum_percentage
                          }
                          onChange={(value) =>
                            setRequirementForm(
                              (p) => ({
                                ...p,
                                minimum_percentage:
                                  value,
                              })
                            )
                          }
                          inputClass={inputClass}
                        />

                        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                          <label className="flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={
                                requirementForm.domicile_required
                              }
                              onChange={(e) =>
                                setRequirementForm(
                                  (p) => ({
                                    ...p,
                                    domicile_required:
                                      e.target.checked,
                                  })
                                )
                              }
                              className="h-5 w-5"
                            />

                            <span className="text-sm font-semibold">
                              Domicile Required
                            </span>
                          </label>
                        </div>

                        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                          <label className="flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={
                                requirementForm.entry_test_required
                              }
                              onChange={(e) =>
                                setRequirementForm(
                                  (p) => ({
                                    ...p,
                                    entry_test_required:
                                      e.target.checked,
                                  })
                                )
                              }
                              className="h-5 w-5"
                            />

                            <span className="text-sm font-semibold">
                              Entry Test Required
                            </span>
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <label className={labelClass}>
                            Required Subjects
                          </label>

                          <textarea
                            rows={3}
                            value={
                              requirementForm.required_subjects
                            }
                            onChange={(e) =>
                              setRequirementForm(
                                (p) => ({
                                  ...p,
                                  required_subjects:
                                    e.target.value,
                                })
                              )
                            }
                            className={inputClass}
                            placeholder="Mathematics, Physics, Chemistry..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className={labelClass}>
                            Required Documents
                          </label>

                          <textarea
                            rows={3}
                            value={
                              requirementForm.required_documents
                            }
                            onChange={(e) =>
                              setRequirementForm(
                                (p) => ({
                                  ...p,
                                  required_documents:
                                    e.target.value,
                                })
                              )
                            }
                            className={inputClass}
                            placeholder="CNIC, Domicile, Matric Certificate, Intermediate Certificate..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className={labelClass}>
                            Requirement Description
                          </label>

                          <textarea
                            rows={4}
                            value={
                              requirementForm.requirement_description
                            }
                            onChange={(e) =>
                              setRequirementForm(
                                (p) => ({
                                  ...p,
                                  requirement_description:
                                    e.target.value,
                                })
                              )
                            }
                            className={inputClass}
                            placeholder="Complete requirement details..."
                          />
                        </div>

                        <FormField
                          label="Source URL"
                          value={
                            requirementForm.source_url
                          }
                          onChange={(value) =>
                            setRequirementForm(
                              (p) => ({
                                ...p,
                                source_url: value,
                              })
                            )
                          }
                          placeholder="https://..."
                          inputClass={inputClass}
                        />

                        <DateField
                          label="Last Verified"
                          value={
                            requirementForm.last_verified
                          }
                          onChange={(value) =>
                            setRequirementForm(
                              (p) => ({
                                ...p,
                                last_verified:
                                  value,
                              })
                          }
                          inputClass={inputClass}
                        />

                        <div className="flex justify-end gap-3 md:col-span-2">
                          <button
                            type="button"
                            onClick={closeChildForm}
                            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={savingChild}
                            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {savingChild
                              ? "Saving..."
                              : editingRequirement
                              ? "Update Requirement"
                              : "Save Requirement"}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* ==================================================
                        SOURCE FORM
                    ================================================== */}

                    {activeSection === "sources" && (
                      <form
                        onSubmit={saveSource}
                        className="grid gap-5 md:grid-cols-2"
                      >
                        <div className="md:col-span-2">
                          <h3 className="text-lg font-bold">
                            {editingSource
                              ? "Edit Source"
                              : "Add Source"}
                          </h3>
                        </div>

                        <FormField
                          label="Source Title *"
                          value={
                            sourceForm.source_title
                          }
                          onChange={(value) =>
                            setSourceForm((p) => ({
                              ...p,
                              source_title: value,
                            }))
                          }
                          placeholder="Official Admission Advertisement"
                          inputClass={inputClass}
                        />

                        <FormField
                          label="Source URL *"
                          value={
                            sourceForm.source_url
                          }
                          onChange={(value) =>
                            setSourceForm((p) => ({
                              ...p,
                              source_url: value,
                            }))
                          }
                          placeholder="https://..."
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Source Type
                          </label>

                          <select
                            value={
                              sourceForm.source_type
                            }
                            onChange={(e) =>
                              setSourceForm((p) => ({
                                ...p,
                                source_type:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                          >
                            <option>
                              Official Website
                            </option>
                            <option>
                              Admission Portal
                            </option>
                            <option>
                              Admission Advertisement
                            </option>
                            <option>
                              HEC
                            </option>
                            <option>
                              Prospectus
                            </option>
                            <option>
                              Notification
                            </option>
                            <option>
                              Other
                            </option>
                          </select>
                        </div>

                        <FormField
                          label="Academic Session"
                          value={
                            sourceForm.academic_session
                          }
                          onChange={(value) =>
                            setSourceForm((p) => ({
                              ...p,
                              academic_session:
                                value,
                            }))
                          }
                          placeholder="2026-27"
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Verification Status
                          </label>

                          <select
                            value={
                              sourceForm.verification_status
                            }
                            onChange={(e) =>
                              setSourceForm((p) => ({
                                ...p,
                                verification_status:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                          >
                            <option value="pending">
                              Pending
                            </option>
                            <option value="verified">
                              Verified
                            </option>
                            <option value="expired">
                              Expired
                            </option>
                            <option value="rejected">
                              Rejected
                            </option>
                          </select>
                        </div>

                        <DateField
                          label="Last Checked"
                          value={
                            sourceForm.last_checked
                          }
                          onChange={(value) =>
                            setSourceForm((p) => ({
                              ...p,
                              last_checked:
                                value,
                            }))
                          }
                          inputClass={inputClass}
                        />

                        <div className="md:col-span-2">
                          <label className={labelClass}>
                            Notes
                          </label>

                          <textarea
                            rows={4}
                            value={sourceForm.notes}
                            onChange={(e) =>
                              setSourceForm((p) => ({
                                ...p,
                                notes:
                                  e.target.value,
                              }))
                            }
                            className={inputClass}
                            placeholder="Source verification notes..."
                          />
                        </div>

                        <div className="flex justify-end gap-3 md:col-span-2">
                          <button
                            type="button"
                            onClick={closeChildForm}
                            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={savingChild}
                            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {savingChild
                              ? "Saving..."
                              : editingSource
                              ? "Update Source"
                              : "Save Source"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* ==================================================
                    PROGRAMS TABLE
                ================================================== */}

                {activeSection === "programs" && (
                  <DataSection
                    title="Programs"
                    icon="📚"
                    onAdd={addProgram}
                    addText="Add Program"
                  >
                    {programs.length === 0 ? (
                      <EmptyData text="No programs found." />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px]">
                          <thead className="border-b border-slate-800 bg-slate-950">
                            <tr>
                              <TableHead text="Program" />
                              <TableHead text="Degree" />
                              <TableHead text="Department" />
                              <TableHead text="Duration" />
                              <TableHead text="Mode" />
                              <TableHead text="Status" />
                              <TableHead text="Actions" alignRight />
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-800">
                            {programs.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-4 font-semibold">
                                  {item.program_name}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.degree_level || "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.department || "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.duration || "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.study_mode || "—"}
                                </td>

                                <td className="px-4 py-4">
                                  <span className="rounded-full bg-indigo-950 px-3 py-1 text-xs text-indigo-300">
                                    {item.admission_status ||
                                      "—"}
                                  </span>
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex justify-end gap-2">
                                    <SmallButton
                                      text="Edit"
                                      onClick={() =>
                                        editProgram(item)
                                      }
                                    />

                                    <SmallButton
                                      text={
                                        deletingChildId ===
                                        item.id
                                          ? "Deleting..."
                                          : "Delete"
                                      }
                                      danger
                                      disabled={
                                        deletingChildId ===
                                        item.id
                                      }
                                      onClick={() =>
                                        deleteProgram(item)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DataSection>
                )}

                {/* ==================================================
                    FEES TABLE
                ================================================== */}

                {activeSection === "fees" && (
                  <DataSection
                    title="Fee Structures"
                    icon="💰"
                    onAdd={addFee}
                    addText="Add Fee"
                  >
                    {fees.length === 0 ? (
                      <EmptyData text="No fee structures found." />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
                          <thead className="border-b border-slate-800 bg-slate-950">
                            <tr>
                              <TableHead text="Program" />
                              <TableHead text="Admission" />
                              <TableHead text="Semester" />
                              <TableHead text="Exam" />
                              <TableHead text="Hostel" />
                              <TableHead text="Total" />
                              <TableHead text="Frequency" />
                              <TableHead text="Actions" alignRight />
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-800">
                            {fees.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-4 font-semibold">
                                  {item.program_name || "General"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.admission_fee ?? "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.semester_fee ?? "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.examination_fee ?? "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.hostel_fee ?? "—"}
                                </td>

                                <td className="px-4 py-4 font-semibold text-emerald-400">
                                  {item.currency || "PKR"}{" "}
                                  {item.total_fee ?? "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.fee_frequency || "—"}
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex justify-end gap-2">
                                    <SmallButton
                                      text="Edit"
                                      onClick={() =>
                                        editFee(item)
                                      }
                                    />

                                    <SmallButton
                                      text={
                                        deletingChildId ===
                                        item.id
                                          ? "Deleting..."
                                          : "Delete"
                                      }
                                      danger
                                      disabled={
                                        deletingChildId ===
                                        item.id
                                      }
                                      onClick={() =>
                                        deleteFee(item)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DataSection>
                )}

                {/* ==================================================
                    DEADLINES TABLE
                ================================================== */}

                {activeSection === "deadlines" && (
                  <DataSection
                    title="Admission Deadlines"
                    icon="📅"
                    onAdd={addDeadline}
                    addText="Add Deadline"
                  >
                    {deadlines.length === 0 ? (
                      <EmptyData text="No admission deadlines found." />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
                          <thead className="border-b border-slate-800 bg-slate-950">
                            <tr>
                              <TableHead text="Title" />
                              <TableHead text="Session" />
                              <TableHead text="Application Open" />
                              <TableHead text="Deadline" />
                              <TableHead text="Entry Test" />
                              <TableHead text="Status" />
                              <TableHead text="Actions" alignRight />
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-800">
                            {deadlines.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-4 font-semibold">
                                  {item.admission_title ||
                                    "Admission"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.admission_session ||
                                    "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {formatDate(
                                    item.application_open_date
                                  )}
                                </td>

                                <td className="px-4 py-4 font-semibold text-red-400">
                                  {formatDate(
                                    item.application_deadline
                                  )}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {formatDate(
                                    item.entry_test_date
                                  )}
                                </td>

                                <td className="px-4 py-4">
                                  <span className="rounded-full bg-indigo-950 px-3 py-1 text-xs text-indigo-300">
                                    {item.admission_status ||
                                      "—"}
                                  </span>
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex justify-end gap-2">
                                    <SmallButton
                                      text="Edit"
                                      onClick={() =>
                                        editDeadline(item)
                                      }
                                    />

                                    <SmallButton
                                      text={
                                        deletingChildId ===
                                        item.id
                                          ? "Deleting..."
                                          : "Delete"
                                      }
                                      danger
                                      disabled={
                                        deletingChildId ===
                                        item.id
                                      }
                                      onClick={() =>
                                        deleteDeadline(item)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DataSection>
                )}

                {/* ==================================================
                    REQUIREMENTS TABLE
                ================================================== */}

                {activeSection === "requirements" && (
                  <DataSection
                    title="Admission Requirements"
                    icon="📋"
                    onAdd={addRequirement}
                    addText="Add Requirement"
                  >
                    {requirements.length === 0 ? (
                      <EmptyData text="No requirements found." />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
                          <thead className="border-b border-slate-800 bg-slate-950">
                            <tr>
                              <TableHead text="Title" />
                              <TableHead text="Type" />
                              <TableHead text="Minimum %" />
                              <TableHead text="Domicile" />
                              <TableHead text="Entry Test" />
                              <TableHead text="Documents" />
                              <TableHead text="Actions" alignRight />
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-800">
                            {requirements.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-4 font-semibold">
                                  {item.requirement_title ||
                                    "Requirement"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.requirement_type ||
                                    "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.minimum_percentage !=
                                  null
                                    ? `${item.minimum_percentage}%`
                                    : "—"}
                                </td>

                                <td className="px-4 py-4">
                                  {boolValue(
                                    item.domicile_required
                                  ) ? (
                                    <span className="text-emerald-400">
                                      Yes
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">
                                      No
                                    </span>
                                  )}
                                </td>

                                <td className="px-4 py-4">
                                  {boolValue(
                                    item.entry_test_required
                                  ) ? (
                                    <span className="text-emerald-400">
                                      Yes
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">
                                      No
                                    </span>
                                  )}
                                </td>

                                <td className="max-w-[250px] px-4 py-4 text-sm text-slate-400">
                                  <div className="truncate">
                                    {item.required_documents ||
                                      "—"}
                                  </div>
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex justify-end gap-2">
                                    <SmallButton
                                      text="Edit"
                                      onClick={() =>
                                        editRequirement(item)
                                      }
                                    />

                                    <SmallButton
                                      text={
                                        deletingChildId ===
                                        item.id
                                          ? "Deleting..."
                                          : "Delete"
                                      }
                                      danger
                                      disabled={
                                        deletingChildId ===
                                        item.id
                                      }
                                      onClick={() =>
                                        deleteRequirement(
                                          item
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DataSection>
                )}

                {/* ==================================================
                    SOURCES TABLE
                ================================================== */}

                {activeSection === "sources" && (
                  <DataSection
                    title="Sources"
                    icon="🔗"
                    onAdd={addSource}
                    addText="Add Source"
                  >
                    {sources.length === 0 ? (
                      <EmptyData text="No sources found." />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                          <thead className="border-b border-slate-800 bg-slate-950">
                            <tr>
                              <TableHead text="Source" />
                              <TableHead text="Type" />
                              <TableHead text="Session" />
                              <TableHead text="Status" />
                              <TableHead text="Last Checked" />
                              <TableHead text="Actions" alignRight />
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-800">
                            {sources.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-4">
                                  <div className="font-semibold">
                                    {item.source_title}
                                  </div>

                                  <a
                                    href={
                                      item.source_url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-1 block max-w-[400px] truncate text-xs text-indigo-400 hover:text-indigo-300"
                                  >
                                    {item.source_url}
                                  </a>
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.source_type ||
                                    "—"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {item.academic_session ||
                                    "—"}
                                </td>

                                <td className="px-4 py-4">
                                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                    {item.verification_status ||
                                      "pending"}
                                  </span>
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-400">
                                  {formatDate(
                                    item.last_checked
                                  )}
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex justify-end gap-2">
                                    <SmallButton
                                      text="Edit"
                                      onClick={() =>
                                        editSource(item)
                                      }
                                    />

                                    <SmallButton
                                      text={
                                        deletingChildId ===
                                        item.id
                                          ? "Deleting..."
                                          : "Delete"
                                      }
                                      danger
                                      disabled={
                                        deletingChildId ===
                                        item.id
                                      }
                                      onClick={() =>
                                        deleteSource(item)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DataSection>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <p className="mt-2 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  inputClass,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClass: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  inputClass,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputClass: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={inputClass}
      />
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
  inputClass,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputClass: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={inputClass}
      />
    </div>
  );
}

function ProgramSelect({
  value,
  programs,
  onChange,
  inputClass,
}: {
  value: string;
  programs: Program[];
  onChange: (value: string) => void;
  inputClass: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        Program
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={inputClass}
      >
        <option value="">
          General / All Programs
        </option>

        {programs.map((program) => (
          <option
            key={program.id}
            value={program.id}
          >
            {program.program_name}
          </option>
        ))}
      </select>
    </div>
  );
}

function TableHead({
  text,
  alignRight = false,
}: {
  text: string;
  alignRight?: boolean;
}) {
  return (
    <th
      className={`px-4 py-4 text-xs uppercase tracking-wider text-slate-500 ${
        alignRight ? "text-right" : "text-left"
      }`}
    >
      {text}
    </th>
  );
}

function SmallButton({
  text,
  onClick,
  danger = false,
  disabled = false,
}: {
  text: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
        danger
          ? "border-red-900/70 text-red-400 hover:bg-red-950/50"
          : "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {text}
    </button>
  );
}

function EmptyData({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-10 text-center">
      <div className="text-4xl">📭</div>

      <p className="mt-3 text-sm text-slate-400">
        {text}
      </p>
    </div>
  );
}

function DataSection({
  title,
  icon,
  onAdd,
  addText,
  children,
}: {
  title: string;
  icon: string;
  onAdd: () => void;
  addText: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">
            {icon}
          </span>

          <h3 className="text-lg font-bold">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700"
        >
          + {addText}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800">
        {children}
      </div>
    </section>
  );
}