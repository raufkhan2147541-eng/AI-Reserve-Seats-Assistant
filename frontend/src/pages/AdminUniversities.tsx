import React, { useEffect, useState } from "react";

/*
|--------------------------------------------------------------------------
| API CONFIG
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const API_PREFIX = `${API_BASE_URL}/universities`;

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

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
  academic_session?: string | null;
  is_active?: number | boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface Program {
  id: number;
  university_id: number;
  university_name?: string;
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

interface Fee {
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
  created_at?: string | null;
  updated_at?: string | null;
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
  created_at?: string | null;
  updated_at?: string | null;
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
  created_at?: string | null;
  updated_at?: string | null;
}

interface UniversitySource {
  id: number;
  university_id: number;
  source_title: string;
  source_url: string;
  source_type?: string | null;
  academic_session?: string | null;
  verification_status?: string | null;
  last_checked?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/*
|--------------------------------------------------------------------------
| FORM TYPES
|--------------------------------------------------------------------------
*/

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

interface ProgramForm {
  university_id: number;
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
  university_id: number;
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
  university_id: number;
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
  university_id: number;
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
  university_id: number;
  source_title: string;
  source_url: string;
  source_type: string;
  academic_session: string;
  verification_status: string;
  last_checked: string;
  notes: string;
}

/*
|--------------------------------------------------------------------------
| INITIAL FORMS
|--------------------------------------------------------------------------
*/

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

const emptyProgramForm: ProgramForm = {
  university_id: 0,
  program_name: "",
  degree_level: "",
  department: "",
  campus: "",
  duration: "",
  study_mode: "",
  eligibility: "",
  entry_test_required: false,
  admission_status: "",
  academic_session: "",
  source_url: "",
  last_verified: "",
};

const emptyFeeForm: FeeForm = {
  university_id: 0,
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
  fee_frequency: "",
  academic_session: "",
  currency: "PKR",
  source_url: "",
  last_verified: "",
};

const emptyDeadlineForm: DeadlineForm = {
  university_id: 0,
  program_id: "",
  admission_title: "",
  admission_session: "",
  application_open_date: "",
  application_deadline: "",
  entry_test_date: "",
  interview_date: "",
  merit_list_date: "",
  fee_submission_deadline: "",
  admission_status: "",
  source_url: "",
  last_verified: "",
};

const emptyRequirementForm: RequirementForm = {
  university_id: 0,
  program_id: "",
  requirement_type: "",
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
  university_id: 0,
  source_title: "",
  source_url: "",
  source_type: "",
  academic_session: "",
  verification_status: "pending",
  last_checked: "",
  notes: "",
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const isTrue = (value: unknown) =>
  value === true || value === 1 || value === "1";

const formatMoney = (value?: number | null, currency = "PKR") => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `${currency} ${Number(value).toLocaleString()}`;
};

const safeNumber = (value: string): number | null => {
  if (value.trim() === "") return null;

  const parsed = Number(value);

  return Number.isNaN(parsed) ? null : parsed;
};

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

const AdminUniversities: React.FC = () => {
  /*
  |--------------------------------------------------------------------------
  | GENERAL STATE
  |--------------------------------------------------------------------------
  */

  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [sources, setSources] = useState<UniversitySource[]>([]);

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | ACTIVE TAB
  |--------------------------------------------------------------------------
  */

  const [activeTab, setActiveTab] = useState<
    | "universities"
    | "programs"
    | "fees"
    | "deadlines"
    | "requirements"
    | "sources"
  >("universities");

  /*
  |--------------------------------------------------------------------------
  | MODALS
  |--------------------------------------------------------------------------
  */

  const [universityModal, setUniversityModal] = useState(false);
  const [programModal, setProgramModal] = useState(false);
  const [feeModal, setFeeModal] = useState(false);
  const [deadlineModal, setDeadlineModal] = useState(false);
  const [requirementModal, setRequirementModal] = useState(false);
  const [sourceModal, setSourceModal] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | EDITING IDS
  |--------------------------------------------------------------------------
  */

  const [editingUniversityId, setEditingUniversityId] =
    useState<number | null>(null);

  const [editingProgramId, setEditingProgramId] =
    useState<number | null>(null);

  const [editingFeeId, setEditingFeeId] =
    useState<number | null>(null);

  const [editingDeadlineId, setEditingDeadlineId] =
    useState<number | null>(null);

  const [editingRequirementId, setEditingRequirementId] =
    useState<number | null>(null);

  const [editingSourceId, setEditingSourceId] =
    useState<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | FORM STATES
  |--------------------------------------------------------------------------
  */

  const [universityForm, setUniversityForm] =
    useState<UniversityForm>(emptyUniversityForm);

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

  /*
  |--------------------------------------------------------------------------
  | API HELPER
  |--------------------------------------------------------------------------
  */

  const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const response = await fetch(`${API_PREFIX}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    let data: any = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        `Request failed with status ${response.status}`;

      throw new Error(message);
    }

    return data;
  };

  /*
  |--------------------------------------------------------------------------
  | NOTIFICATIONS
  |--------------------------------------------------------------------------
  */

  const showSuccess = (message: string) => {
    setSuccess(message);
    setError("");

    setTimeout(() => {
      setSuccess("");
    }, 4000);
  };

  const showError = (message: string) => {
    setError(message);
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD UNIVERSITIES
  |--------------------------------------------------------------------------
  */

  const loadUniversities = async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/");

      setUniversities(data.universities || []);
    } catch (err: any) {
      showError(err.message || "Failed to load universities.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH UNIVERSITIES
  |--------------------------------------------------------------------------
  */

  const searchUniversities = async () => {
    setLoading(true);

    try {
      const endpoint =
        search.trim().length > 0
          ? `/search?query=${encodeURIComponent(search.trim())}`
          : "/";

      const data = await apiRequest(endpoint);

      setUniversities(data.universities || []);
    } catch (err: any) {
      showError(err.message || "Failed to search universities.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD UNIVERSITY DETAILS
  |--------------------------------------------------------------------------
  */

  const loadUniversityDetails = async (
    universityId: number,
    keepTab = true
  ) => {
    setDetailLoading(true);

    try {
      const data = await apiRequest(
        `/${universityId}/details`
      );

      setSelectedUniversity(data.university || null);
      setPrograms(data.programs || []);
      setFees(data.fees || []);
      setDeadlines(data.deadlines || []);
      setRequirements(data.requirements || []);
      setSources(data.sources || []);

      if (!keepTab) {
        setActiveTab("programs");
      }
    } catch (err: any) {
      showError(
        err.message || "Failed to load university details."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadUniversities();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SELECT UNIVERSITY
  |--------------------------------------------------------------------------
  */

  const handleSelectUniversity = async (
    university: University
  ) => {
    setSelectedUniversity(university);

    await loadUniversityDetails(university.id);
  };

  /*
  |--------------------------------------------------------------------------
  | UNIVERSITY CREATE
  |--------------------------------------------------------------------------
  */

  const openCreateUniversity = () => {
    setEditingUniversityId(null);
    setUniversityForm(emptyUniversityForm);
    setUniversityModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | UNIVERSITY EDIT
  |--------------------------------------------------------------------------
  */

  const openEditUniversity = (university: University) => {
    setEditingUniversityId(university.id);

    setUniversityForm({
      name: university.name || "",
      university_type: university.university_type || "",
      province: university.province || "",
      city: university.city || "",
      campus: university.campus || "",
      official_website: university.official_website || "",
      admission_portal: university.admission_portal || "",
      hec_recognized: isTrue(university.hec_recognized),
      hec_recognition_source:
        university.hec_recognition_source || "",
      description: university.description || "",
      academic_session: university.academic_session || "",
    });

    setUniversityModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | UNIVERSITY SAVE
  |--------------------------------------------------------------------------
  */

  const saveUniversity = async () => {
    if (!universityForm.name.trim()) {
      showError("University name is required.");
      return;
    }

    setLoading(true);

    try {
      if (editingUniversityId) {
        await apiRequest(`/${editingUniversityId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: universityForm.name,
            university_type:
              universityForm.university_type || null,
            province: universityForm.province || null,
            city: universityForm.city || null,
            campus: universityForm.campus || null,
            official_website:
              universityForm.official_website || null,
            admission_portal:
              universityForm.admission_portal || null,
            hec_recognized: universityForm.hec_recognized,
            hec_recognition_source:
              universityForm.hec_recognition_source || null,
            description:
              universityForm.description || null,
            academic_session:
              universityForm.academic_session || null,
          }),
        });

        showSuccess("University updated successfully.");
      } else {
        await apiRequest("/", {
          method: "POST",
          body: JSON.stringify({
            name: universityForm.name,
            university_type:
              universityForm.university_type || null,
            province: universityForm.province || null,
            city: universityForm.city || null,
            campus: universityForm.campus || null,
            official_website:
              universityForm.official_website || null,
            admission_portal:
              universityForm.admission_portal || null,
            hec_recognized: universityForm.hec_recognized,
            hec_recognition_source:
              universityForm.hec_recognition_source || null,
            description:
              universityForm.description || null,
            academic_session:
              universityForm.academic_session || null,
          }),
        });

        showSuccess("University added successfully.");
      }

      setUniversityModal(false);
      await loadUniversities();

      if (selectedUniversity) {
        await loadUniversityDetails(selectedUniversity.id);
      }
    } catch (err: any) {
      showError(err.message || "Failed to save university.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE UNIVERSITY
  |--------------------------------------------------------------------------
  */

  const deleteUniversity = async (id: number) => {
    const university = universities.find(
      (item) => item.id === id
    );

    if (
      !window.confirm(
        `Are you sure you want to delete ${
          university?.name || "this university"
        }?`
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      await apiRequest(`/${id}`, {
        method: "DELETE",
      });

      if (selectedUniversity?.id === id) {
        setSelectedUniversity(null);
        setPrograms([]);
        setFees([]);
        setDeadlines([]);
        setRequirements([]);
        setSources([]);
      }

      showSuccess("University deleted successfully.");

      await loadUniversities();
    } catch (err: any) {
      showError(err.message || "Failed to delete university.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PROGRAM CREATE
  |--------------------------------------------------------------------------
  */

  const openCreateProgram = () => {
    if (!selectedUniversity) {
      showError("Please select a university first.");
      return;
    }

    setEditingProgramId(null);

    setProgramForm({
      ...emptyProgramForm,
      university_id: selectedUniversity.id,
    });

    setProgramModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | PROGRAM EDIT
  |--------------------------------------------------------------------------
  */

  const openEditProgram = (program: Program) => {
    setEditingProgramId(program.id);

    setProgramForm({
      university_id: program.university_id,
      program_name: program.program_name || "",
      degree_level: program.degree_level || "",
      department: program.department || "",
      campus: program.campus || "",
      duration: program.duration || "",
      study_mode: program.study_mode || "",
      eligibility: program.eligibility || "",
      entry_test_required: isTrue(
        program.entry_test_required
      ),
      admission_status: program.admission_status || "",
      academic_session: program.academic_session || "",
      source_url: program.source_url || "",
      last_verified: program.last_verified || "",
    });

    setProgramModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | PROGRAM SAVE
  |--------------------------------------------------------------------------
  */

  const saveProgram = async () => {
    if (!programForm.program_name.trim()) {
      showError("Program name is required.");
      return;
    }

    if (!programForm.university_id) {
      showError("University is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        program_name: programForm.program_name,
        degree_level:
          programForm.degree_level || null,
        department:
          programForm.department || null,
        campus:
          programForm.campus || null,
        duration:
          programForm.duration || null,
        study_mode:
          programForm.study_mode || null,
        eligibility:
          programForm.eligibility || null,
        entry_test_required:
          programForm.entry_test_required,
        admission_status:
          programForm.admission_status || null,
        academic_session:
          programForm.academic_session || null,
        source_url:
          programForm.source_url || null,
        last_verified:
          programForm.last_verified || null,
      };

      if (editingProgramId) {
        await apiRequest(
          `/programs/${editingProgramId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        showSuccess("Program updated successfully.");
      } else {
        await apiRequest("/programs", {
          method: "POST",
          body: JSON.stringify({
            university_id:
              programForm.university_id,
            ...payload,
          }),
        });

        showSuccess("Program added successfully.");
      }

      setProgramModal(false);

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(err.message || "Failed to save program.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PROGRAM DELETE
  |--------------------------------------------------------------------------
  */

  const deleteProgram = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this program?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      await apiRequest(`/programs/${id}`, {
        method: "DELETE",
      });

      showSuccess("Program deleted successfully.");

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(err.message || "Failed to delete program.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FEE CREATE
  |--------------------------------------------------------------------------
  */

  const openCreateFee = () => {
    if (!selectedUniversity) {
      showError("Please select a university first.");
      return;
    }

    setEditingFeeId(null);

    setFeeForm({
      ...emptyFeeForm,
      university_id: selectedUniversity.id,
    });

    setFeeModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | FEE EDIT
  |--------------------------------------------------------------------------
  */

  const openEditFee = (fee: Fee) => {
    setEditingFeeId(fee.id);

    setFeeForm({
      university_id: fee.university_id,
      program_id:
        fee.program_id !== null &&
        fee.program_id !== undefined
          ? String(fee.program_id)
          : "",
      program_name: fee.program_name || "",
      admission_fee:
        fee.admission_fee !== null &&
        fee.admission_fee !== undefined
          ? String(fee.admission_fee)
          : "",
      tuition_fee:
        fee.tuition_fee !== null &&
        fee.tuition_fee !== undefined
          ? String(fee.tuition_fee)
          : "",
      semester_fee:
        fee.semester_fee !== null &&
        fee.semester_fee !== undefined
          ? String(fee.semester_fee)
          : "",
      examination_fee:
        fee.examination_fee !== null &&
        fee.examination_fee !== undefined
          ? String(fee.examination_fee)
          : "",
      hostel_fee:
        fee.hostel_fee !== null &&
        fee.hostel_fee !== undefined
          ? String(fee.hostel_fee)
          : "",
      transport_fee:
        fee.transport_fee !== null &&
        fee.transport_fee !== undefined
          ? String(fee.transport_fee)
          : "",
      other_fee:
        fee.other_fee !== null &&
        fee.other_fee !== undefined
          ? String(fee.other_fee)
          : "",
      total_fee:
        fee.total_fee !== null &&
        fee.total_fee !== undefined
          ? String(fee.total_fee)
          : "",
      fee_frequency: fee.fee_frequency || "",
      academic_session: fee.academic_session || "",
      currency: fee.currency || "PKR",
      source_url: fee.source_url || "",
      last_verified: fee.last_verified || "",
    });

    setFeeModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | FEE SAVE
  |--------------------------------------------------------------------------
  */

  const saveFee = async () => {
    if (!feeForm.university_id) {
      showError("University is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        program_id:
          feeForm.program_id !== ""
            ? Number(feeForm.program_id)
            : null,

        program_name:
          feeForm.program_name || null,

        admission_fee: safeNumber(
          feeForm.admission_fee
        ),

        tuition_fee: safeNumber(
          feeForm.tuition_fee
        ),

        semester_fee: safeNumber(
          feeForm.semester_fee
        ),

        examination_fee: safeNumber(
          feeForm.examination_fee
        ),

        hostel_fee: safeNumber(
          feeForm.hostel_fee
        ),

        transport_fee: safeNumber(
          feeForm.transport_fee
        ),

        other_fee: safeNumber(
          feeForm.other_fee
        ),

        total_fee: safeNumber(
          feeForm.total_fee
        ),

        fee_frequency:
          feeForm.fee_frequency || null,

        academic_session:
          feeForm.academic_session || null,

        currency:
          feeForm.currency || "PKR",

        source_url:
          feeForm.source_url || null,

        last_verified:
          feeForm.last_verified || null,
      };

      if (editingFeeId) {
        await apiRequest(`/fees/${editingFeeId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        showSuccess(
          "Fee structure updated successfully."
        );
      } else {
        await apiRequest("/fees", {
          method: "POST",
          body: JSON.stringify({
            university_id:
              feeForm.university_id,
            ...payload,
          }),
        });

        showSuccess(
          "Fee structure added successfully."
        );
      }

      setFeeModal(false);

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(err.message || "Failed to save fee.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FEE DELETE
  |--------------------------------------------------------------------------
  */

  const deleteFee = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this fee structure?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      await apiRequest(`/fees/${id}`, {
        method: "DELETE",
      });

      showSuccess(
        "Fee structure deleted successfully."
      );

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(err.message || "Failed to delete fee.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DEADLINE CREATE
  |--------------------------------------------------------------------------
  */

  const openCreateDeadline = () => {
    if (!selectedUniversity) {
      showError("Please select a university first.");
      return;
    }

    setEditingDeadlineId(null);

    setDeadlineForm({
      ...emptyDeadlineForm,
      university_id: selectedUniversity.id,
    });

    setDeadlineModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | DEADLINE EDIT
  |--------------------------------------------------------------------------
  */

  const openEditDeadline = (deadline: Deadline) => {
    setEditingDeadlineId(deadline.id);

    setDeadlineForm({
      university_id: deadline.university_id,
      program_id:
        deadline.program_id !== null &&
        deadline.program_id !== undefined
          ? String(deadline.program_id)
          : "",
      admission_title:
        deadline.admission_title || "",
      admission_session:
        deadline.admission_session || "",
      application_open_date:
        deadline.application_open_date || "",
      application_deadline:
        deadline.application_deadline || "",
      entry_test_date:
        deadline.entry_test_date || "",
      interview_date:
        deadline.interview_date || "",
      merit_list_date:
        deadline.merit_list_date || "",
      fee_submission_deadline:
        deadline.fee_submission_deadline || "",
      admission_status:
        deadline.admission_status || "",
      source_url:
        deadline.source_url || "",
      last_verified:
        deadline.last_verified || "",
    });

    setDeadlineModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | DEADLINE SAVE
  |--------------------------------------------------------------------------
  */

  const saveDeadline = async () => {
    if (!deadlineForm.university_id) {
      showError("University is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        program_id:
          deadlineForm.program_id !== ""
            ? Number(deadlineForm.program_id)
            : null,

        admission_title:
          deadlineForm.admission_title || null,

        admission_session:
          deadlineForm.admission_session || null,

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
          deadlineForm.admission_status || null,

        source_url:
          deadlineForm.source_url || null,

        last_verified:
          deadlineForm.last_verified || null,
      };

      if (editingDeadlineId) {
        await apiRequest(
          `/deadlines/${editingDeadlineId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        showSuccess(
          "Admission deadline updated successfully."
        );
      } else {
        await apiRequest("/deadlines", {
          method: "POST",
          body: JSON.stringify({
            university_id:
              deadlineForm.university_id,
            ...payload,
          }),
        });

        showSuccess(
          "Admission deadline added successfully."
        );
      }

      setDeadlineModal(false);

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(
        err.message ||
          "Failed to save admission deadline."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DEADLINE DELETE
  |--------------------------------------------------------------------------
  */

  const deleteDeadline = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this deadline?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      await apiRequest(`/deadlines/${id}`, {
        method: "DELETE",
      });

      showSuccess(
        "Admission deadline deleted successfully."
      );

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(
        err.message ||
          "Failed to delete admission deadline."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REQUIREMENT CREATE
  |--------------------------------------------------------------------------
  */

  const openCreateRequirement = () => {
    if (!selectedUniversity) {
      showError("Please select a university first.");
      return;
    }

    setEditingRequirementId(null);

    setRequirementForm({
      ...emptyRequirementForm,
      university_id: selectedUniversity.id,
    });

    setRequirementModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | REQUIREMENT EDIT
  |--------------------------------------------------------------------------
  */

  const openEditRequirement = (
    requirement: Requirement
  ) => {
    setEditingRequirementId(requirement.id);

    setRequirementForm({
      university_id: requirement.university_id,
      program_id:
        requirement.program_id !== null &&
        requirement.program_id !== undefined
          ? String(requirement.program_id)
          : "",
      requirement_type:
        requirement.requirement_type || "",
      requirement_title:
        requirement.requirement_title || "",
      requirement_description:
        requirement.requirement_description || "",
      minimum_percentage:
        requirement.minimum_percentage !== null &&
        requirement.minimum_percentage !== undefined
          ? String(requirement.minimum_percentage)
          : "",
      required_subjects:
        requirement.required_subjects || "",
      required_documents:
        requirement.required_documents || "",
      domicile_required:
        isTrue(requirement.domicile_required),
      entry_test_required:
        isTrue(requirement.entry_test_required),
      source_url:
        requirement.source_url || "",
      last_verified:
        requirement.last_verified || "",
    });

    setRequirementModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | REQUIREMENT SAVE
  |--------------------------------------------------------------------------
  */

  const saveRequirement = async () => {
    if (!requirementForm.university_id) {
      showError("University is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        program_id:
          requirementForm.program_id !== ""
            ? Number(requirementForm.program_id)
            : null,

        requirement_type:
          requirementForm.requirement_type || null,

        requirement_title:
          requirementForm.requirement_title || null,

        requirement_description:
          requirementForm.requirement_description ||
          null,

        minimum_percentage:
          safeNumber(
            requirementForm.minimum_percentage
          ),

        required_subjects:
          requirementForm.required_subjects || null,

        required_documents:
          requirementForm.required_documents || null,

        domicile_required:
          requirementForm.domicile_required,

        entry_test_required:
          requirementForm.entry_test_required,

        source_url:
          requirementForm.source_url || null,

        last_verified:
          requirementForm.last_verified || null,
      };

      if (editingRequirementId) {
        await apiRequest(
          `/requirements/${editingRequirementId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        showSuccess(
          "Admission requirement updated successfully."
        );
      } else {
        await apiRequest("/requirements", {
          method: "POST",
          body: JSON.stringify({
            university_id:
              requirementForm.university_id,
            ...payload,
          }),
        });

        showSuccess(
          "Admission requirement added successfully."
        );
      }

      setRequirementModal(false);

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(
        err.message ||
          "Failed to save admission requirement."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REQUIREMENT DELETE
  |--------------------------------------------------------------------------
  */

  const deleteRequirement = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this requirement?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      await apiRequest(`/requirements/${id}`, {
        method: "DELETE",
      });

      showSuccess(
        "Admission requirement deleted successfully."
      );

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(
        err.message ||
          "Failed to delete admission requirement."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SOURCE CREATE
  |--------------------------------------------------------------------------
  */

  const openCreateSource = () => {
    if (!selectedUniversity) {
      showError("Please select a university first.");
      return;
    }

    setEditingSourceId(null);

    setSourceForm({
      ...emptySourceForm,
      university_id: selectedUniversity.id,
    });

    setSourceModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | SOURCE EDIT
  |--------------------------------------------------------------------------
  */

  const openEditSource = (
    source: UniversitySource
  ) => {
    setEditingSourceId(source.id);

    setSourceForm({
      university_id: source.university_id,
      source_title: source.source_title || "",
      source_url: source.source_url || "",
      source_type: source.source_type || "",
      academic_session:
        source.academic_session || "",
      verification_status:
        source.verification_status || "pending",
      last_checked:
        source.last_checked || "",
      notes: source.notes || "",
    });

    setSourceModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | SOURCE SAVE
  |--------------------------------------------------------------------------
  */

  const saveSource = async () => {
    if (!sourceForm.source_title.trim()) {
      showError("Source title is required.");
      return;
    }

    if (!sourceForm.source_url.trim()) {
      showError("Source URL is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        source_title:
          sourceForm.source_title,
        source_url:
          sourceForm.source_url,
        source_type:
          sourceForm.source_type || null,
        academic_session:
          sourceForm.academic_session || null,
        verification_status:
          sourceForm.verification_status || "pending",
        last_checked:
          sourceForm.last_checked || null,
        notes:
          sourceForm.notes || null,
      };

      if (editingSourceId) {
        await apiRequest(
          `/sources/${editingSourceId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        showSuccess(
          "University source updated successfully."
        );
      } else {
        await apiRequest("/sources", {
          method: "POST",
          body: JSON.stringify({
            university_id:
              sourceForm.university_id,
            ...payload,
          }),
        });

        showSuccess(
          "University source added successfully."
        );
      }

      setSourceModal(false);

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(
        err.message ||
          "Failed to save university source."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SOURCE DELETE
  |--------------------------------------------------------------------------
  */

  const deleteSource = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this source?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      await apiRequest(`/sources/${id}`, {
        method: "DELETE",
      });

      showSuccess(
        "University source deleted successfully."
      );

      if (selectedUniversity) {
        await loadUniversityDetails(
          selectedUniversity.id
        );
      }
    } catch (err: any) {
      showError(
        err.message ||
          "Failed to delete university source."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INPUT COMPONENT
  |--------------------------------------------------------------------------
  */

  const Input = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
  }: {
    label: string;
    value: string | number;
    onChange: (
      event: React.ChangeEvent<HTMLInputElement>
    ) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) => (
    <div className="form-group">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );

  /*
  |--------------------------------------------------------------------------
  | SELECT COMPONENT
  |--------------------------------------------------------------------------
  */

  const Select = ({
    label,
    value,
    onChange,
    children,
  }: {
    label: string;
    value: string | number;
    onChange: (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => void;
    children: React.ReactNode;
  }) => (
    <div className="form-group">
      <label>{label}</label>

      <select value={value} onChange={onChange}>
        {children}
      </select>
    </div>
  );

  /*
  |--------------------------------------------------------------------------
  | TEXTAREA COMPONENT
  |--------------------------------------------------------------------------
  */

  const Textarea = ({
    label,
    value,
    onChange,
    placeholder = "",
  }: {
    label: string;
    value: string;
    onChange: (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => void;
    placeholder?: string;
  }) => (
    <div className="form-group full">
      <label>{label}</label>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
      />
    </div>
  );

  /*
  |--------------------------------------------------------------------------
  | CHECKBOX
  |--------------------------------------------------------------------------
  */

  const Checkbox = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (
      event: React.ChangeEvent<HTMLInputElement>
    ) => void;
  }) => (
    <label className="checkbox-row">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />

      <span>{label}</span>
    </label>
  );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="admin-universities">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-universities {
          min-height: 100vh;
          padding: 24px;
          background: #f5f7fb;
          color: #172033;
          font-family: Inter, Arial, sans-serif;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .page-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 750;
        }

        .page-header p {
          margin: 6px 0 0;
          color: #6b7280;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          border: none;
          cursor: pointer;
          border-radius: 9px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s;
        }

        button:hover {
          transform: translateY(-1px);
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #111827;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn-success {
          background: #059669;
          color: white;
        }

        .btn-small {
          padding: 7px 11px;
          font-size: 12px;
        }

        .alert {
          padding: 13px 16px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 600;
        }

        .alert-success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 20px;
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.04);
        }

        .sidebar {
          padding: 18px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .search-box {
          display: flex;
          gap: 8px;
          margin-bottom: 15px;
        }

        .search-box input {
          flex: 1;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          background: white;
          color: #111827;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        .university-list {
          max-height: calc(100vh - 260px);
          overflow-y: auto;
        }

        .university-item {
          padding: 13px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          margin-bottom: 9px;
          cursor: pointer;
          transition: 0.2s;
        }

        .university-item:hover {
          background: #f8fafc;
          border-color: #bfdbfe;
        }

        .university-item.active {
          background: #eff6ff;
          border-color: #2563eb;
        }

        .university-name {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .university-meta {
          color: #6b7280;
          font-size: 12px;
        }

        .content {
          min-width: 0;
        }

        .empty-state {
          padding: 70px 30px;
          text-align: center;
          color: #6b7280;
        }

        .university-overview {
          padding: 20px;
          margin-bottom: 18px;
        }

        .overview-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .overview-top h2 {
          margin: 0 0 7px;
          font-size: 23px;
        }

        .overview-info {
          color: #6b7280;
          line-height: 1.7;
          font-size: 14px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 5px 9px;
          font-size: 11px;
          font-weight: 700;
          background: #dbeafe;
          color: #1d4ed8;
          margin-right: 5px;
        }

        .badge.green {
          background: #dcfce7;
          color: #166534;
        }

        .badge.yellow {
          background: #fef3c7;
          color: #92400e;
        }

        .tabs {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          padding: 7px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 18px;
        }

        .tab {
          background: transparent;
          color: #6b7280;
        }

        .tab.active {
          background: #2563eb;
          color: white;
        }

        .section-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 18px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 17px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        th,
        td {
          text-align: left;
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
          vertical-align: top;
        }

        th {
          background: #f8fafc;
          color: #374151;
          font-weight: 700;
        }

        td {
          color: #4b5563;
        }

        .actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal {
          width: min(850px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 70px rgba(0,0,0,0.25);
        }

        .modal-header {
          padding: 18px 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          position: sticky;
          top: 0;
          background: white;
          z-index: 2;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 19px;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          padding: 15px 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          position: sticky;
          bottom: 0;
          background: white;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 650;
          color: #374151;
        }

        .required {
          color: #dc2626;
          margin-left: 3px;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 42px;
          padding: 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .checkbox-row input {
          width: auto;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 15px;
        }

        .detail-box {
          padding: 13px;
          background: #f8fafc;
          border-radius: 9px;
        }

        .detail-box strong {
          display: block;
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .detail-box span {
          font-size: 13px;
          color: #111827;
          word-break: break-word;
        }

        .loading {
          opacity: 0.65;
          pointer-events: none;
        }

        .no-data {
          padding: 35px;
          text-align: center;
          color: #6b7280;
        }

        @media (max-width: 1000px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
          }

          .university-list {
            max-height: 400px;
          }
        }

        @media (max-width: 700px) {
          .admin-universities {
            padding: 12px;
          }

          .page-header,
          .overview-top {
            flex-direction: column;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full {
            grid-column: auto;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="page-header">
        <div>
          <h1>University Management</h1>
          <p>
            Manage universities, programs, fees, admissions,
            requirements and sources.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              loadUniversities();
              if (selectedUniversity) {
                loadUniversityDetails(
                  selectedUniversity.id
                );
              }
            }}
          >
            ↻ Refresh
          </button>

          <button
            className="btn-primary"
            onClick={openCreateUniversity}
          >
            + Add University
          </button>
        </div>
      </div>

      {/* ======================================================
          ALERTS
      ====================================================== */}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* ======================================================
          MAIN LAYOUT
      ====================================================== */}

      <div className={loading ? "layout loading" : "layout"}>
        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <div className="card sidebar">
          <div className="search-box">
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchUniversities();
                }
              }}
              placeholder="Search university..."
            />

            <button
              className="btn-primary"
              onClick={searchUniversities}
            >
              Search
            </button>
          </div>

          <div className="university-list">
            {universities.length === 0 ? (
              <div className="no-data">
                No universities found.
              </div>
            ) : (
              universities.map((university) => (
                <div
                  key={university.id}
                  className={`university-item ${
                    selectedUniversity?.id ===
                    university.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectUniversity(
                      university
                    )
                  }
                >
                  <div className="university-name">
                    {university.name}
                  </div>

                  <div className="university-meta">
                    {university.city || "City not set"}
                    {university.province
                      ? `, ${university.province}`
                      : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div className="content">
          {!selectedUniversity ? (
            <div className="card empty-state">
              <h2>Select a University</h2>
              <p>
                Select a university from the left side to
                manage its programs, fees, deadlines,
                requirements and sources.
              </p>
            </div>
          ) : (
            <>
              {/* ==============================================
                  UNIVERSITY OVERVIEW
              ============================================== */}

              <div className="card university-overview">
                <div className="overview-top">
                  <div>
                    <h2>
                      {selectedUniversity.name}
                    </h2>

                    <div>
                      {selectedUniversity.university_type && (
                        <span className="badge">
                          {
                            selectedUniversity.university_type
                          }
                        </span>
                      )}

                      {isTrue(
                        selectedUniversity.hec_recognized
                      ) && (
                        <span className="badge green">
                          HEC Recognized
                        </span>
                      )}
                    </div>

                    <div className="overview-info">
                      {selectedUniversity.city ||
                        "City not available"}
                      {selectedUniversity.province
                        ? `, ${selectedUniversity.province}`
                        : ""}
                      {selectedUniversity.campus
                        ? ` • ${selectedUniversity.campus}`
                        : ""}
                    </div>
                  </div>

                  <div className="actions">
                    <button
                      className="btn-secondary btn-small"
                      onClick={() =>
                        openEditUniversity(
                          selectedUniversity
                        )
                      }
                    >
                      Edit University
                    </button>

                    <button
                      className="btn-danger btn-small"
                      onClick={() =>
                        deleteUniversity(
                          selectedUniversity.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-box">
                    <strong>Website</strong>
                    <span>
                      {selectedUniversity.official_website ||
                        "-"}
                    </span>
                  </div>

                  <div className="detail-box">
                    <strong>Admission Portal</strong>
                    <span>
                      {selectedUniversity.admission_portal ||
                        "-"}
                    </span>
                  </div>

                  <div className="detail-box">
                    <strong>Academic Session</strong>
                    <span>
                      {selectedUniversity.academic_session ||
                        "-"}
                    </span>
                  </div>
                </div>

                {selectedUniversity.description && (
                  <div
                    style={{
                      marginTop: 15,
                      color: "#4b5563",
                      lineHeight: 1.7,
                      fontSize: 14,
                    }}
                  >
                    {selectedUniversity.description}
                  </div>
                )}
              </div>

              {/* ==============================================
                  TABS
              ============================================== */}

              <div className="tabs">
                <button
                  className={`tab ${
                    activeTab === "programs"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("programs")
                  }
                >
                  Programs ({programs.length})
                </button>

                <button
                  className={`tab ${
                    activeTab === "fees"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("fees")
                  }
                >
                  Fees ({fees.length})
                </button>

                <button
                  className={`tab ${
                    activeTab === "deadlines"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("deadlines")
                  }
                >
                  Deadlines ({deadlines.length})
                </button>

                <button
                  className={`tab ${
                    activeTab === "requirements"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("requirements")
                  }
                >
                  Requirements (
                  {requirements.length})
                </button>

                <button
                  className={`tab ${
                    activeTab === "sources"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("sources")
                  }
                >
                  Sources ({sources.length})
                </button>
              </div>

              {/* ==============================================
                  PROGRAMS
              ============================================== */}

              {activeTab === "programs" && (
                <div className="section-card">
                  <div className="section-header">
                    <h3>University Programs</h3>

                    <button
                      className="btn-primary"
                      onClick={openCreateProgram}
                    >
                      + Add Program
                    </button>
                  </div>

                  {detailLoading ? (
                    <div className="no-data">
                      Loading programs...
                    </div>
                  ) : programs.length === 0 ? (
                    <div className="no-data">
                      No programs added yet.
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Program</th>
                            <th>Degree</th>
                            <th>Department</th>
                            <th>Duration</th>
                            <th>Mode</th>
                            <th>Entry Test</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {programs.map(
                            (program) => (
                              <tr key={program.id}>
                                <td>
                                  <strong>
                                    {
                                      program.program_name
                                    }
                                  </strong>
                                </td>

                                <td>
                                  {program.degree_level ||
                                    "-"}
                                </td>

                                <td>
                                  {program.department ||
                                    "-"}
                                </td>

                                <td>
                                  {program.duration ||
                                    "-"}
                                </td>

                                <td>
                                  {program.study_mode ||
                                    "-"}
                                </td>

                                <td>
                                  {isTrue(
                                    program.entry_test_required
                                  ) ? (
                                    <span className="badge yellow">
                                      Required
                                    </span>
                                  ) : (
                                    "No"
                                  )}
                                </td>

                                <td>
                                  {program.admission_status ||
                                    "-"}
                                </td>

                                <td>
                                  <div className="actions">
                                    <button
                                      className="btn-secondary btn-small"
                                      onClick={() =>
                                        openEditProgram(
                                          program
                                        )
                                      }
                                    >
                                      Edit
                                    </button>

                                    <button
                                      className="btn-danger btn-small"
                                      onClick={() =>
                                        deleteProgram(
                                          program.id
                                        )
                                      }
                                    >
                                      Delete
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
              )}

              {/* ==============================================
                  FEES
              ============================================== */}

              {activeTab === "fees" && (
                <div className="section-card">
                  <div className="section-header">
                    <h3>Fee Structures</h3>

                    <button
                      className="btn-primary"
                      onClick={openCreateFee}
                    >
                      + Add Fee
                    </button>
                  </div>

                  {fees.length === 0 ? (
                    <div className="no-data">
                      No fee structures added yet.
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Program</th>
                            <th>Admission</th>
                            <th>Tuition</th>
                            <th>Semester</th>
                            <th>Hostel</th>
                            <th>Total</th>
                            <th>Session</th>
                            <th>Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {fees.map((fee) => (
                            <tr key={fee.id}>
                              <td>
                                {fee.program_name ||
                                  "General"}
                              </td>

                              <td>
                                {formatMoney(
                                  fee.admission_fee,
                                  fee.currency ||
                                    "PKR"
                                )}
                              </td>

                              <td>
                                {formatMoney(
                                  fee.tuition_fee,
                                  fee.currency ||
                                    "PKR"
                                )}
                              </td>

                              <td>
                                {formatMoney(
                                  fee.semester_fee,
                                  fee.currency ||
                                    "PKR"
                                )}
                              </td>

                              <td>
                                {formatMoney(
                                  fee.hostel_fee,
                                  fee.currency ||
                                    "PKR"
                                )}
                              </td>

                              <td>
                                <strong>
                                  {formatMoney(
                                    fee.total_fee,
                                    fee.currency ||
                                      "PKR"
                                  )}
                                </strong>
                              </td>

                              <td>
                                {fee.academic_session ||
                                  "-"}
                              </td>

                              <td>
                                <div className="actions">
                                  <button
                                    className="btn-secondary btn-small"
                                    onClick={() =>
                                      openEditFee(
                                        fee
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="btn-danger btn-small"
                                    onClick={() =>
                                      deleteFee(
                                        fee.id
                                      )
                                    }
                                  >
                                    Delete
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
              )}

              {/* ==============================================
                  DEADLINES
              ============================================== */}

              {activeTab === "deadlines" && (
                <div className="section-card">
                  <div className="section-header">
                    <h3>Admission Deadlines</h3>

                    <button
                      className="btn-primary"
                      onClick={
                        openCreateDeadline
                      }
                    >
                      + Add Deadline
                    </button>
                  </div>

                  {deadlines.length === 0 ? (
                    <div className="no-data">
                      No admission deadlines added
                      yet.
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Session</th>
                            <th>Application Deadline</th>
                            <th>Entry Test</th>
                            <th>Merit List</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {deadlines.map(
                            (deadline) => (
                              <tr
                                key={deadline.id}
                              >
                                <td>
                                  <strong>
                                    {deadline.admission_title ||
                                      "Admission"}
                                  </strong>
                                </td>

                                <td>
                                  {deadline.admission_session ||
                                    "-"}
                                </td>

                                <td>
                                  {deadline.application_deadline ||
                                    "-"}
                                </td>

                                <td>
                                  {deadline.entry_test_date ||
                                    "-"}
                                </td>

                                <td>
                                  {deadline.merit_list_date ||
                                    "-"}
                                </td>

                                <td>
                                  {deadline.admission_status ||
                                    "-"}
                                </td>

                                <td>
                                  <div className="actions">
                                    <button
                                      className="btn-secondary btn-small"
                                      onClick={() =>
                                        openEditDeadline(
                                          deadline
                                        )
                                      }
                                    >
                                      Edit
                                    </button>

                                    <button
                                      className="btn-danger btn-small"
                                      onClick={() =>
                                        deleteDeadline(
                                          deadline.id
                                        )
                                      }
                                    >
                                      Delete
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
              )}

              {/* ==============================================
                  REQUIREMENTS
              ============================================== */}

              {activeTab === "requirements" && (
                <div className="section-card">
                  <div className="section-header">
                    <h3>Admission Requirements</h3>

                    <button
                      className="btn-primary"
                      onClick={
                        openCreateRequirement
                      }
                    >
                      + Add Requirement
                    </button>
                  </div>

                  {requirements.length === 0 ? (
                    <div className="no-data">
                      No requirements added yet.
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Minimum %</th>
                            <th>Subjects</th>
                            <th>Domicile</th>
                            <th>Entry Test</th>
                            <th>Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {requirements.map(
                            (requirement) => (
                              <tr
                                key={
                                  requirement.id
                                }
                              >
                                <td>
                                  {requirement.requirement_type ||
                                    "-"}
                                </td>

                                <td>
                                  <strong>
                                    {requirement.requirement_title ||
                                      "-"}
                                  </strong>
                                </td>

                                <td>
                                  {requirement.minimum_percentage !==
                                  null &&
                                  requirement.minimum_percentage !==
                                  undefined
                                    ? `${requirement.minimum_percentage}%`
                                    : "-"}
                                </td>

                                <td>
                                  {requirement.required_subjects ||
                                    "-"}
                                </td>

                                <td>
                                  {isTrue(
                                    requirement.domicile_required
                                  )
                                    ? "Required"
                                    : "No"}
                                </td>

                                <td>
                                  {isTrue(
                                    requirement.entry_test_required
                                  )
                                    ? "Required"
                                    : "No"}
                                </td>

                                <td>
                                  <div className="actions">
                                    <button
                                      className="btn-secondary btn-small"
                                      onClick={() =>
                                        openEditRequirement(
                                          requirement
                                        )
                                      }
                                    >
                                      Edit
                                    </button>

                                    <button
                                      className="btn-danger btn-small"
                                      onClick={() =>
                                        deleteRequirement(
                                          requirement.id
                                        )
                                      }
                                    >
                                      Delete
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
              )}

              {/* ==============================================
                  SOURCES
              ============================================== */}

              {activeTab === "sources" && (
                <div className="section-card">
                  <div className="section-header">
                    <h3>University Sources</h3>

                    <button
                      className="btn-primary"
                      onClick={openCreateSource}
                    >
                      + Add Source
                    </button>
                  </div>

                  {sources.length === 0 ? (
                    <div className="no-data">
                      No sources added yet.
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Source</th>
                            <th>URL</th>
                            <th>Type</th>
                            <th>Session</th>
                            <th>Status</th>
                            <th>Last Checked</th>
                            <th>Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {sources.map(
                            (source) => (
                              <tr
                                key={source.id}
                              >
                                <td>
                                  <strong>
                                    {
                                      source.source_title
                                    }
                                  </strong>
                                </td>

                                <td>
                                  <a
                                    href={
                                      source.source_url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      color:
                                        "#2563eb",
                                    }}
                                  >
                                    Open Source
                                  </a>
                                </td>

                                <td>
                                  {source.source_type ||
                                    "-"}
                                </td>

                                <td>
                                  {source.academic_session ||
                                    "-"}
                                </td>

                                <td>
                                  {source.verification_status ||
                                    "pending"}
                                </td>

                                <td>
                                  {source.last_checked ||
                                    "-"}
                                </td>

                                <td>
                                  <div className="actions">
                                    <button
                                      className="btn-secondary btn-small"
                                      onClick={() =>
                                        openEditSource(
                                          source
                                        )
                                      }
                                    >
                                      Edit
                                    </button>

                                    <button
                                      className="btn-danger btn-small"
                                      onClick={() =>
                                        deleteSource(
                                          source.id
                                        )
                                      }
                                    >
                                      Delete
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
              )}
            </>
          )}
        </div>
      </div>

      {/* ======================================================
          UNIVERSITY MODAL
      ====================================================== */}

      {universityModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setUniversityModal(false);
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingUniversityId
                  ? "Edit University"
                  : "Add University"}
              </h2>

              <button
                className="btn-secondary"
                onClick={() =>
                  setUniversityModal(false)
                }
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <Input
                  label="University Name"
                  required
                  value={universityForm.name}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. University of Punjab"
                />

                <Input
                  label="University Type"
                  value={
                    universityForm.university_type
                  }
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      university_type:
                        e.target.value,
                    })
                  }
                  placeholder="Public / Private"
                />

                <Input
                  label="Province"
                  value={
                    universityForm.province
                  }
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      province:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="City"
                  value={universityForm.city}
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      city: e.target.value,
                    })
                  }
                />

                <Input
                  label="Campus"
                  value={
                    universityForm.campus
                  }
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      campus:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Academic Session"
                  value={
                    universityForm.academic_session
                  }
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      academic_session:
                        e.target.value,
                    })
                  }
                  placeholder="2026-27"
                />

                <Input
                  label="Official Website"
                  value={
                    universityForm.official_website
                  }
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      official_website:
                        e.target.value,
                    })
                  }
                  placeholder="https://..."
                />

                <Input
                  label="Admission Portal"
                  value={
                    universityForm.admission_portal
                  }
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      admission_portal:
                        e.target.value,
                    })
                  }
                  placeholder="https://..."
                />

                <Input
                  label="HEC Recognition Source"
                  value={
                    universityForm.hec_recognition_source
                  }
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      hec_recognition_source:
                        e.target.value,
                    })
                  }
                />

                <div>
                  <Checkbox
                    label="HEC Recognized"
                    checked={
                      universityForm.hec_recognized
                    }
                    onChange={(e) =>
                      setUniversityForm({
                        ...universityForm,
                        hec_recognized:
                          e.target.checked,
                      })
                    }
                  />
                </div>

                <Textarea
                  label="Description"
                  value={
                    universityForm.description
                  }
                  onChange={(e) =>
                    setUniversityForm({
                      ...universityForm,
                      description:
                        e.target.value,
                    })
                  }
                  placeholder="University description..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() =>
                  setUniversityModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={saveUniversity}
              >
                {editingUniversityId
                  ? "Update University"
                  : "Add University"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          PROGRAM MODAL
      ====================================================== */}

      {programModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingProgramId
                  ? "Edit Program"
                  : "Add Program"}
              </h2>

              <button
                className="btn-secondary"
                onClick={() =>
                  setProgramModal(false)
                }
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <Select
                  label="University"
                  value={
                    programForm.university_id
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      university_id:
                        Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>
                    Select University
                  </option>

                  {universities.map(
                    (university) => (
                      <option
                        key={university.id}
                        value={university.id}
                      >
                        {university.name}
                      </option>
                    )
                  )}
                </Select>

                <Input
                  label="Program Name"
                  required
                  value={
                    programForm.program_name
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      program_name:
                        e.target.value,
                    })
                  }
                  placeholder="BS Software Engineering"
                />

                <Input
                  label="Degree Level"
                  value={
                    programForm.degree_level
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      degree_level:
                        e.target.value,
                    })
                  }
                  placeholder="BS / MS / PhD"
                />

                <Input
                  label="Department"
                  value={
                    programForm.department
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      department:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Campus"
                  value={programForm.campus}
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      campus:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Duration"
                  value={programForm.duration}
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      duration:
                        e.target.value,
                    })
                  }
                  placeholder="4 Years"
                />

                <Input
                  label="Study Mode"
                  value={
                    programForm.study_mode
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      study_mode:
                        e.target.value,
                    })
                  }
                  placeholder="Morning / Evening"
                />

                <Input
                  label="Admission Status"
                  value={
                    programForm.admission_status
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      admission_status:
                        e.target.value,
                    })
                  }
                  placeholder="Open / Closed"
                />

                <Input
                  label="Academic Session"
                  value={
                    programForm.academic_session
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      academic_session:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Source URL"
                  value={
                    programForm.source_url
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      source_url:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Last Verified"
                  value={
                    programForm.last_verified
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      last_verified:
                        e.target.value,
                    })
                  }
                  placeholder="2026-08-26"
                />

                <Checkbox
                  label="Entry Test Required"
                  checked={
                    programForm.entry_test_required
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      entry_test_required:
                        e.target.checked,
                    })
                  }
                />

                <Textarea
                  label="Eligibility"
                  value={
                    programForm.eligibility
                  }
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      eligibility:
                        e.target.value,
                    })
                  }
                  placeholder="Minimum qualification, percentage etc."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() =>
                  setProgramModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={saveProgram}
              >
                {editingProgramId
                  ? "Update Program"
                  : "Add Program"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          FEE MODAL
      ====================================================== */}

      {feeModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingFeeId
                  ? "Edit Fee Structure"
                  : "Add Fee Structure"}
              </h2>

              <button
                className="btn-secondary"
                onClick={() =>
                  setFeeModal(false)
                }
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <Select
                  label="University"
                  value={
                    feeForm.university_id
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      university_id:
                        Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>
                    Select University
                  </option>

                  {universities.map(
                    (university) => (
                      <option
                        key={university.id}
                        value={university.id}
                      >
                        {university.name}
                      </option>
                    )
                  )}
                </Select>

                <Select
                  label="Program"
                  value={feeForm.program_id}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    const program =
                      programs.find(
                        (item) =>
                          String(item.id) ===
                          value
                      );

                    setFeeForm({
                      ...feeForm,
                      program_id: value,
                      program_name:
                        program?.program_name ||
                        feeForm.program_name,
                    });
                  }}
                >
                  <option value="">
                    General / No Specific Program
                  </option>

                  {programs.map((program) => (
                    <option
                      key={program.id}
                      value={program.id}
                    >
                      {program.program_name}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Program Name"
                  value={
                    feeForm.program_name
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      program_name:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Admission Fee"
                  type="number"
                  value={
                    feeForm.admission_fee
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      admission_fee:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Tuition Fee"
                  type="number"
                  value={
                    feeForm.tuition_fee
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      tuition_fee:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Semester Fee"
                  type="number"
                  value={
                    feeForm.semester_fee
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      semester_fee:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Examination Fee"
                  type="number"
                  value={
                    feeForm.examination_fee
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      examination_fee:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Hostel Fee"
                  type="number"
                  value={
                    feeForm.hostel_fee
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      hostel_fee:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Transport Fee"
                  type="number"
                  value={
                    feeForm.transport_fee
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      transport_fee:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Other Fee"
                  type="number"
                  value={
                    feeForm.other_fee
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      other_fee:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Total Fee"
                  type="number"
                  value={
                    feeForm.total_fee
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      total_fee:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Fee Frequency"
                  value={
                    feeForm.fee_frequency
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      fee_frequency:
                        e.target.value,
                    })
                  }
                  placeholder="Per Semester"
                />

                <Input
                  label="Academic Session"
                  value={
                    feeForm.academic_session
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      academic_session:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Currency"
                  value={feeForm.currency}
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      currency:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Source URL"
                  value={feeForm.source_url}
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      source_url:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Last Verified"
                  value={
                    feeForm.last_verified
                  }
                  onChange={(e) =>
                    setFeeForm({
                      ...feeForm,
                      last_verified:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() =>
                  setFeeModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={saveFee}
              >
                {editingFeeId
                  ? "Update Fee"
                  : "Add Fee"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          DEADLINE MODAL
      ====================================================== */}

      {deadlineModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingDeadlineId
                  ? "Edit Admission Deadline"
                  : "Add Admission Deadline"}
              </h2>

              <button
                className="btn-secondary"
                onClick={() =>
                  setDeadlineModal(false)
                }
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <Select
                  label="University"
                  value={
                    deadlineForm.university_id
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      university_id:
                        Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>
                    Select University
                  </option>

                  {universities.map(
                    (university) => (
                      <option
                        key={university.id}
                        value={university.id}
                      >
                        {university.name}
                      </option>
                    )
                  )}
                </Select>

                <Select
                  label="Program"
                  value={
                    deadlineForm.program_id
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      program_id:
                        e.target.value,
                    })
                  }
                >
                  <option value="">
                    General Admission
                  </option>

                  {programs.map((program) => (
                    <option
                      key={program.id}
                      value={program.id}
                    >
                      {program.program_name}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Admission Title"
                  value={
                    deadlineForm.admission_title
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      admission_title:
                        e.target.value,
                    })
                  }
                  placeholder="Fall 2026 Admissions"
                />

                <Input
                  label="Admission Session"
                  value={
                    deadlineForm.admission_session
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      admission_session:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Application Open Date"
                  type="date"
                  value={
                    deadlineForm.application_open_date
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      application_open_date:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Application Deadline"
                  type="date"
                  value={
                    deadlineForm.application_deadline
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      application_deadline:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Entry Test Date"
                  type="date"
                  value={
                    deadlineForm.entry_test_date
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      entry_test_date:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Interview Date"
                  type="date"
                  value={
                    deadlineForm.interview_date
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      interview_date:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Merit List Date"
                  type="date"
                  value={
                    deadlineForm.merit_list_date
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      merit_list_date:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Fee Submission Deadline"
                  type="date"
                  value={
                    deadlineForm.fee_submission_deadline
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      fee_submission_deadline:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Admission Status"
                  value={
                    deadlineForm.admission_status
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      admission_status:
                        e.target.value,
                    })
                  }
                  placeholder="Open / Closed"
                />

                <Input
                  label="Source URL"
                  value={
                    deadlineForm.source_url
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      source_url:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Last Verified"
                  value={
                    deadlineForm.last_verified
                  }
                  onChange={(e) =>
                    setDeadlineForm({
                      ...deadlineForm,
                      last_verified:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() =>
                  setDeadlineModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={saveDeadline}
              >
                {editingDeadlineId
                  ? "Update Deadline"
                  : "Add Deadline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          REQUIREMENT MODAL
      ====================================================== */}

      {requirementModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingRequirementId
                  ? "Edit Admission Requirement"
                  : "Add Admission Requirement"}
              </h2>

              <button
                className="btn-secondary"
                onClick={() =>
                  setRequirementModal(false)
                }
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <Select
                  label="University"
                  value={
                    requirementForm.university_id
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      university_id:
                        Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>
                    Select University
                  </option>

                  {universities.map(
                    (university) => (
                      <option
                        key={university.id}
                        value={university.id}
                      >
                        {university.name}
                      </option>
                    )
                  )}
                </Select>

                <Select
                  label="Program"
                  value={
                    requirementForm.program_id
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      program_id:
                        e.target.value,
                    })
                  }
                >
                  <option value="">
                    General Requirement
                  </option>

                  {programs.map((program) => (
                    <option
                      key={program.id}
                      value={program.id}
                    >
                      {program.program_name}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Requirement Type"
                  value={
                    requirementForm.requirement_type
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      requirement_type:
                        e.target.value,
                    })
                  }
                  placeholder="Academic"
                />

                <Input
                  label="Requirement Title"
                  value={
                    requirementForm.requirement_title
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      requirement_title:
                        e.target.value,
                    })
                  }
                  placeholder="Minimum Qualification"
                />

                <Input
                  label="Minimum Percentage"
                  type="number"
                  value={
                    requirementForm.minimum_percentage
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      minimum_percentage:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Required Subjects"
                  value={
                    requirementForm.required_subjects
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      required_subjects:
                        e.target.value,
                    })
                  }
                  placeholder="Mathematics, Physics"
                />

                <Input
                  label="Required Documents"
                  value={
                    requirementForm.required_documents
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      required_documents:
                        e.target.value,
                    })
                  }
                  placeholder="CNIC, Domicile, Certificate"
                />

                <Input
                  label="Source URL"
                  value={
                    requirementForm.source_url
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      source_url:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Last Verified"
                  value={
                    requirementForm.last_verified
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      last_verified:
                        e.target.value,
                    })
                  }
                />

                <Checkbox
                  label="Domicile Required"
                  checked={
                    requirementForm.domicile_required
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      domicile_required:
                        e.target.checked,
                    })
                  }
                />

                <Checkbox
                  label="Entry Test Required"
                  checked={
                    requirementForm.entry_test_required
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      entry_test_required:
                        e.target.checked,
                    })
                  }
                />

                <Textarea
                  label="Requirement Description"
                  value={
                    requirementForm.requirement_description
                  }
                  onChange={(e) =>
                    setRequirementForm({
                      ...requirementForm,
                      requirement_description:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() =>
                  setRequirementModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={saveRequirement}
              >
                {editingRequirementId
                  ? "Update Requirement"
                  : "Add Requirement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          SOURCE MODAL
      ====================================================== */}

      {sourceModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingSourceId
                  ? "Edit University Source"
                  : "Add University Source"}
              </h2>

              <button
                className="btn-secondary"
                onClick={() =>
                  setSourceModal(false)
                }
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <Select
                  label="University"
                  value={
                    sourceForm.university_id
                  }
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      university_id:
                        Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>
                    Select University
                  </option>

                  {universities.map(
                    (university) => (
                      <option
                        key={university.id}
                        value={university.id}
                      >
                        {university.name}
                      </option>
                    )
                  )}
                </Select>

                <Input
                  label="Source Title"
                  required
                  value={
                    sourceForm.source_title
                  }
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      source_title:
                        e.target.value,
                    })
                  }
                  placeholder="Official Admission Advertisement"
                />

                <Input
                  label="Source URL"
                  required
                  value={
                    sourceForm.source_url
                  }
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      source_url:
                        e.target.value,
                    })
                  }
                  placeholder="https://..."
                />

                <Input
                  label="Source Type"
                  value={
                    sourceForm.source_type
                  }
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      source_type:
                        e.target.value,
                    })
                  }
                  placeholder="Official Website / Advertisement"
                />

                <Input
                  label="Academic Session"
                  value={
                    sourceForm.academic_session
                  }
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      academic_session:
                        e.target.value,
                    })
                  }
                />

                <Select
                  label="Verification Status"
                  value={
                    sourceForm.verification_status
                  }
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      verification_status:
                        e.target.value,
                    })
                  }
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="verified">
                    Verified
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                  <option value="expired">
                    Expired
                  </option>
                </Select>

                <Input
                  label="Last Checked"
                  value={
                    sourceForm.last_checked
                  }
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      last_checked:
                        e.target.value,
                    })
                  }
                  placeholder="2026-08-26"
                />

                <Textarea
                  label="Notes"
                  value={sourceForm.notes}
                  onChange={(e) =>
                    setSourceForm({
                      ...sourceForm,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() =>
                  setSourceModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={saveSource}
              >
                {editingSourceId
                  ? "Update Source"
                  : "Add Source"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUniversities;