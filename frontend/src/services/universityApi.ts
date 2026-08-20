const API_BASE_URL = "https://ai-reserve-seats-assistant.onrender.com";

export interface University {
  id: number;
  name: string;
  university_type?: string | null;
  province?: string | null;
  city?: string | null;
  campus?: string | null;
  official_website?: string | null;
  admission_portal?: string | null;
  hec_recognized: boolean | number;
  hec_recognition_source?: string | null;
  description?: string | null;
  academic_session?: string | null;
  is_active?: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface UniversityProgram {
  id: number;
  university_id: number;
  program_name: string;
  degree_level?: string | null;
  department?: string | null;
  campus?: string | null;
  duration?: string | null;
  study_mode?: string | null;
  eligibility?: string | null;
  entry_test_required: boolean | number;
  admission_status?: string | null;
  academic_session?: string | null;
  source_url?: string | null;
  last_verified?: string | null;
}

export interface UniversityFee {
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

export interface AdmissionDeadline {
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

export interface AdmissionRequirement {
  id: number;
  university_id: number;
  program_id?: number | null;
  requirement_type?: string | null;
  requirement_title?: string | null;
  requirement_description?: string | null;
  minimum_percentage?: number | null;
  required_subjects?: string | null;
  required_documents?: string | null;
  domicile_required: boolean | number;
  entry_test_required: boolean | number;
  source_url?: string | null;
  last_verified?: string | null;
}

export interface UniversitySource {
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

export interface UniversityDetailsResponse {
  success: boolean;
  university: University;
  programs: UniversityProgram[];
  fees: UniversityFee[];
  deadlines: AdmissionDeadline[];
  requirements: AdmissionRequirement[];
  sources: UniversitySource[];
}

export interface UniversityListResponse {
  success: boolean;
  count: number;
  universities: University[];
}

export interface ProgramListResponse {
  success: boolean;
  count: number;
  programs: UniversityProgram[];
}

export interface FeeListResponse {
  success: boolean;
  count: number;
  fees: UniversityFee[];
}

export interface DeadlineListResponse {
  success: boolean;
  count: number;
  deadlines: AdmissionDeadline[];
}

export interface RequirementListResponse {
  success: boolean;
  count: number;
  requirements: AdmissionRequirement[];
}

export interface SourceListResponse {
  success: boolean;
  count: number;
  sources: UniversitySource[];
}

// ============================================================
// Helper
// ============================================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

  return data as T;
}

// ============================================================
// UNIVERSITIES
// ============================================================

export async function getUniversities(): Promise<UniversityListResponse> {
  return apiRequest<UniversityListResponse>("/universities/");
}

export async function searchUniversities(params?: {
  query?: string;
  province?: string;
  city?: string;
  university_type?: string;
}): Promise<UniversityListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.query) {
    searchParams.append("query", params.query);
  }

  if (params?.province) {
    searchParams.append("province", params.province);
  }

  if (params?.city) {
    searchParams.append("city", params.city);
  }

  if (params?.university_type) {
    searchParams.append("university_type", params.university_type);
  }

  const queryString = searchParams.toString();

  return apiRequest<UniversityListResponse>(
    `/universities/search${queryString ? `?${queryString}` : ""}`
  );
}

export async function getUniversity(
  universityId: number
): Promise<{ success: boolean; university: University }> {
  return apiRequest(`/universities/${universityId}`);
}

export async function getUniversityDetails(
  universityId: number
): Promise<UniversityDetailsResponse> {
  return apiRequest<UniversityDetailsResponse>(
    `/universities/${universityId}/details`
  );
}

// ============================================================
// PROGRAMS
// ============================================================

export async function getUniversityPrograms(
  universityId: number
): Promise<ProgramListResponse> {
  return apiRequest<ProgramListResponse>(
    `/universities/${universityId}/programs`
  );
}

// ============================================================
// FEES
// ============================================================

export async function getUniversityFees(
  universityId: number
): Promise<FeeListResponse> {
  return apiRequest<FeeListResponse>(
    `/universities/${universityId}/fees`
  );
}

// ============================================================
// ADMISSION DEADLINES
// ============================================================

export async function getUniversityDeadlines(
  universityId: number
): Promise<DeadlineListResponse> {
  return apiRequest<DeadlineListResponse>(
    `/universities/${universityId}/deadlines`
  );
}

// ============================================================
// ADMISSION REQUIREMENTS
// ============================================================

export async function getUniversityRequirements(
  universityId: number
): Promise<RequirementListResponse> {
  return apiRequest<RequirementListResponse>(
    `/universities/${universityId}/requirements`
  );
}

// ============================================================
// UNIVERSITY SOURCES
// ============================================================

export async function getUniversitySources(
  universityId: number
): Promise<SourceListResponse> {
  return apiRequest<SourceListResponse>(
    `/universities/${universityId}/sources`
  );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

const universityApi = {
  getUniversities,
  searchUniversities,
  getUniversity,
  getUniversityDetails,
  getUniversityPrograms,
  getUniversityFees,
  getUniversityDeadlines,
  getUniversityRequirements,
  getUniversitySources,
};

export default universityApi;