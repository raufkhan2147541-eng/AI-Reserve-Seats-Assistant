const API_BASE_URL = "https://ai-reserve-seats-assistant.onrender.com";

// ============================================================
// TYPES
// ============================================================

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

  created_at?: string;
  updated_at?: string;
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

  created_at?: string;
  updated_at?: string;
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

  created_at?: string;
  updated_at?: string;
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

  created_at?: string;
  updated_at?: string;
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

  created_at?: string;
  updated_at?: string;
}

// ============================================================
// CREATE REQUEST TYPES
// ============================================================

export interface UniversityCreateRequest {
  name: string;

  university_type?: string | null;
  province?: string | null;
  city?: string | null;
  campus?: string | null;

  official_website?: string | null;
  admission_portal?: string | null;

  hec_recognized?: boolean;
  hec_recognition_source?: string | null;

  description?: string | null;
  academic_session?: string | null;
}

export interface ProgramCreateRequest {
  university_id: number;

  program_name: string;

  degree_level?: string | null;
  department?: string | null;
  campus?: string | null;

  duration?: string | null;
  study_mode?: string | null;

  eligibility?: string | null;

  entry_test_required?: boolean;

  admission_status?: string | null;
  academic_session?: string | null;

  source_url?: string | null;
  last_verified?: string | null;
}

export interface FeeCreateRequest {
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

  currency?: string;

  source_url?: string | null;
  last_verified?: string | null;
}

export interface DeadlineCreateRequest {
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

export interface RequirementCreateRequest {
  university_id: number;

  program_id?: number | null;

  requirement_type?: string | null;
  requirement_title?: string | null;
  requirement_description?: string | null;

  minimum_percentage?: number | null;

  required_subjects?: string | null;
  required_documents?: string | null;

  domicile_required?: boolean;
  entry_test_required?: boolean;

  source_url?: string | null;
  last_verified?: string | null;
}

export interface SourceCreateRequest {
  university_id: number;

  source_title: string;
  source_url: string;

  source_type?: string | null;
  academic_session?: string | null;

  verification_status?: string;

  last_checked?: string | null;
  notes?: string | null;
}

// ============================================================
// UPDATE REQUEST TYPES
// ============================================================

export interface UniversityUpdateRequest {
  name?: string | null;

  university_type?: string | null;
  province?: string | null;
  city?: string | null;
  campus?: string | null;

  official_website?: string | null;
  admission_portal?: string | null;

  hec_recognized?: boolean | null;
  hec_recognition_source?: string | null;

  description?: string | null;
  academic_session?: string | null;

  is_active?: boolean | null;
}

export interface ProgramUpdateRequest {
  program_name?: string | null;

  degree_level?: string | null;
  department?: string | null;
  campus?: string | null;

  duration?: string | null;
  study_mode?: string | null;

  eligibility?: string | null;

  entry_test_required?: boolean | null;

  admission_status?: string | null;
  academic_session?: string | null;

  source_url?: string | null;
  last_verified?: string | null;
}

export interface FeeUpdateRequest {
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

export interface DeadlineUpdateRequest {
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

export interface RequirementUpdateRequest {
  program_id?: number | null;

  requirement_type?: string | null;
  requirement_title?: string | null;
  requirement_description?: string | null;

  minimum_percentage?: number | null;

  required_subjects?: string | null;
  required_documents?: string | null;

  domicile_required?: boolean | null;
  entry_test_required?: boolean | null;

  source_url?: string | null;
  last_verified?: string | null;
}

export interface SourceUpdateRequest {
  source_title?: string | null;
  source_url?: string | null;

  source_type?: string | null;
  academic_session?: string | null;

  verification_status?: string | null;

  last_checked?: string | null;
  notes?: string | null;
}

// ============================================================
// RESPONSE TYPES
// ============================================================

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

export interface UniversityDetailsResponse {
  success: boolean;

  university: University;

  programs: UniversityProgram[];
  fees: UniversityFee[];
  deadlines: AdmissionDeadline[];
  requirements: AdmissionRequirement[];
  sources: UniversitySource[];
}

// ============================================================
// GENERIC API RESPONSE
// ============================================================

interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}

// ============================================================
// API HELPER
// ============================================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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
// UNIVERSITIES - GET
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
): Promise<{
  success: boolean;
  university: University;
}> {
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
// UNIVERSITIES - CREATE
// ============================================================

export async function createUniversity(
  data: UniversityCreateRequest
): Promise<{
  success: boolean;
  message: string;
  university: University;
}> {
  return apiRequest("/universities/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================================
// UNIVERSITIES - UPDATE
// ============================================================

export async function updateUniversity(
  universityId: number,
  data: UniversityUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  university: University;
}> {
  return apiRequest(`/universities/${universityId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============================================================
// UNIVERSITIES - DELETE
// ============================================================

export async function deleteUniversity(
  universityId: number
): Promise<ApiSuccessResponse & { university_id: number }> {
  return apiRequest(`/universities/${universityId}`, {
    method: "DELETE",
  });
}

// ============================================================
// PROGRAMS - GET
// ============================================================

export async function getUniversityPrograms(
  universityId: number
): Promise<ProgramListResponse> {
  return apiRequest<ProgramListResponse>(
    `/universities/${universityId}/programs`
  );
}

// ============================================================
// PROGRAMS - CREATE
// ============================================================

export async function createProgram(
  data: ProgramCreateRequest
): Promise<{
  success: boolean;
  message: string;
  program: UniversityProgram;
}> {
  return apiRequest("/universities/programs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================================
// PROGRAMS - UPDATE
// ============================================================

export async function updateProgram(
  programId: number,
  data: ProgramUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  program: UniversityProgram;
}> {
  return apiRequest(`/universities/programs/${programId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============================================================
// PROGRAMS - DELETE
// ============================================================

export async function deleteProgram(
  programId: number
): Promise<ApiSuccessResponse> {
  return apiRequest(`/universities/programs/${programId}`, {
    method: "DELETE",
  });
}

// ============================================================
// FEES - GET
// ============================================================

export async function getUniversityFees(
  universityId: number
): Promise<FeeListResponse> {
  return apiRequest<FeeListResponse>(
    `/universities/${universityId}/fees`
  );
}

// ============================================================
// FEES - CREATE
// ============================================================

export async function createFee(
  data: FeeCreateRequest
): Promise<{
  success: boolean;
  message: string;
  fee: UniversityFee;
}> {
  return apiRequest("/universities/fees", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================================
// FEES - UPDATE
// ============================================================

export async function updateFee(
  feeId: number,
  data: FeeUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  fee: UniversityFee;
}> {
  return apiRequest(`/universities/fees/${feeId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============================================================
// FEES - DELETE
// ============================================================

export async function deleteFee(
  feeId: number
): Promise<ApiSuccessResponse> {
  return apiRequest(`/universities/fees/${feeId}`, {
    method: "DELETE",
  });
}

// ============================================================
// ADMISSION DEADLINES - GET
// ============================================================

export async function getUniversityDeadlines(
  universityId: number
): Promise<DeadlineListResponse> {
  return apiRequest<DeadlineListResponse>(
    `/universities/${universityId}/deadlines`
  );
}

// ============================================================
// ADMISSION DEADLINES - CREATE
// ============================================================

export async function createDeadline(
  data: DeadlineCreateRequest
): Promise<{
  success: boolean;
  message: string;
  deadline: AdmissionDeadline;
}> {
  return apiRequest("/universities/deadlines", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================================
// ADMISSION DEADLINES - UPDATE
// ============================================================

export async function updateDeadline(
  deadlineId: number,
  data: DeadlineUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  deadline: AdmissionDeadline;
}> {
  return apiRequest(`/universities/deadlines/${deadlineId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============================================================
// ADMISSION DEADLINES - DELETE
// ============================================================

export async function deleteDeadline(
  deadlineId: number
): Promise<ApiSuccessResponse> {
  return apiRequest(`/universities/deadlines/${deadlineId}`, {
    method: "DELETE",
  });
}

// ============================================================
// ADMISSION REQUIREMENTS - GET
// ============================================================

export async function getUniversityRequirements(
  universityId: number
): Promise<RequirementListResponse> {
  return apiRequest<RequirementListResponse>(
    `/universities/${universityId}/requirements`
  );
}

// ============================================================
// ADMISSION REQUIREMENTS - CREATE
// ============================================================

export async function createRequirement(
  data: RequirementCreateRequest
): Promise<{
  success: boolean;
  message: string;
  requirement: AdmissionRequirement;
}> {
  return apiRequest("/universities/requirements", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================================
// ADMISSION REQUIREMENTS - UPDATE
// ============================================================

export async function updateRequirement(
  requirementId: number,
  data: RequirementUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  requirement: AdmissionRequirement;
}> {
  return apiRequest(`/universities/requirements/${requirementId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============================================================
// ADMISSION REQUIREMENTS - DELETE
// ============================================================

export async function deleteRequirement(
  requirementId: number
): Promise<ApiSuccessResponse> {
  return apiRequest(`/universities/requirements/${requirementId}`, {
    method: "DELETE",
  });
}

// ============================================================
// UNIVERSITY SOURCES - GET
// ============================================================

export async function getUniversitySources(
  universityId: number
): Promise<SourceListResponse> {
  return apiRequest<SourceListResponse>(
    `/universities/${universityId}/sources`
  );
}

// ============================================================
// UNIVERSITY SOURCES - CREATE
// ============================================================

export async function createSource(
  data: SourceCreateRequest
): Promise<{
  success: boolean;
  message: string;
  source: UniversitySource;
}> {
  return apiRequest("/universities/sources", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================================
// UNIVERSITY SOURCES - UPDATE
// ============================================================

export async function updateSource(
  sourceId: number,
  data: SourceUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  source: UniversitySource;
}> {
  return apiRequest(`/universities/sources/${sourceId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============================================================
// UNIVERSITY SOURCES - DELETE
// ============================================================

export async function deleteSource(
  sourceId: number
): Promise<ApiSuccessResponse> {
  return apiRequest("/universities/sources/" + sourceId, {
    method: "DELETE",
  });
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

const universityApi = {
  // Universities
  getUniversities,
  searchUniversities,
  getUniversity,
  getUniversityDetails,
  createUniversity,
  updateUniversity,
  deleteUniversity,

  // Programs
  getUniversityPrograms,
  createProgram,
  updateProgram,
  deleteProgram,

  // Fees
  getUniversityFees,
  createFee,
  updateFee,
  deleteFee,

  // Deadlines
  getUniversityDeadlines,
  createDeadline,
  updateDeadline,
  deleteDeadline,

  // Requirements
  getUniversityRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,

  // Sources
  getUniversitySources,
  createSource,
  updateSource,
  deleteSource,
};

export default universityApi;