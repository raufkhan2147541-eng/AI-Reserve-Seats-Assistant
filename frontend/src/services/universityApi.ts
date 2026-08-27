// universityApi.tsx

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

  last_verified?: string | null;
  academic_session?: string | null;

  is_active?: boolean | number;

  created_at?: string;
  updated_at?: string;
}

// ============================================================
// PROGRAM
// ============================================================

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

// ============================================================
// FEE
// ============================================================

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

// ============================================================
// ADMISSION DEADLINE
// ============================================================

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

// ============================================================
// ADMISSION REQUIREMENT
// ============================================================

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

// ============================================================
// UNIVERSITY SOURCE
// ============================================================

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
// UNIVERSITY CREATE REQUEST
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

  last_verified?: string | null;
  academic_session?: string | null;

  is_active?: boolean;
}

// ============================================================
// PROGRAM CREATE REQUEST
// ============================================================

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

// ============================================================
// FEE CREATE REQUEST
// ============================================================

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
  currency?: string | null;

  source_url?: string | null;
  last_verified?: string | null;
}

// ============================================================
// DEADLINE CREATE REQUEST
// ============================================================

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

// ============================================================
// REQUIREMENT CREATE REQUEST
// ============================================================

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

// ============================================================
// SOURCE CREATE REQUEST
// ============================================================

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
// UNIVERSITY UPDATE REQUEST
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

  last_verified?: string | null;
  academic_session?: string | null;

  is_active?: boolean | null;
}

// ============================================================
// PROGRAM UPDATE REQUEST
// ============================================================

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

// ============================================================
// FEE UPDATE REQUEST
// ============================================================

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

// ============================================================
// DEADLINE UPDATE REQUEST
// ============================================================

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

// ============================================================
// REQUIREMENT UPDATE REQUEST
// ============================================================

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

// ============================================================
// SOURCE UPDATE REQUEST
// ============================================================

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
// COMMON RESPONSE
// ============================================================

export interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}

// ============================================================
// LIST RESPONSES
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

// ============================================================
// UNIVERSITY DETAILS
// ============================================================

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
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

// ============================================================
// UNIVERSITIES
// ============================================================

// GET ALL UNIVERSITIES

export async function getUniversities(): Promise<UniversityListResponse> {
  return apiRequest<UniversityListResponse>("/universities/");
}

// SEARCH UNIVERSITIES

export async function searchUniversities(params?: {
  query?: string;
  province?: string;
  city?: string;
  university_type?: string;
}): Promise<UniversityListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.query?.trim()) {
    searchParams.append("query", params.query.trim());
  }

  if (params?.province?.trim()) {
    searchParams.append("province", params.province.trim());
  }

  if (params?.city?.trim()) {
    searchParams.append("city", params.city.trim());
  }

  if (params?.university_type?.trim()) {
    searchParams.append(
      "university_type",
      params.university_type.trim()
    );
  }

  const queryString = searchParams.toString();

  return apiRequest<UniversityListResponse>(
    `/universities/search${queryString ? `?${queryString}` : ""}`
  );
}

// GET SINGLE UNIVERSITY

export async function getUniversity(
  universityId: number
): Promise<{
  success: boolean;
  university: University;
}> {
  return apiRequest<{
    success: boolean;
    university: University;
  }>(`/universities/${universityId}`);
}

// GET UNIVERSITY COMPLETE DETAILS

export async function getUniversityDetails(
  universityId: number
): Promise<UniversityDetailsResponse> {
  return apiRequest<UniversityDetailsResponse>(
    `/universities/${universityId}/details`
  );
}

// CREATE UNIVERSITY

export async function createUniversity(
  data: UniversityCreateRequest
): Promise<{
  success: boolean;
  message: string;
  university: University;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    university: University;
  }>("/universities/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// UPDATE UNIVERSITY

export async function updateUniversity(
  universityId: number,
  data: UniversityUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  university: University;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    university: University;
  }>(`/universities/${universityId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE UNIVERSITY

export async function deleteUniversity(
  universityId: number
): Promise<
  ApiSuccessResponse & {
    university_id?: number;
  }
> {
  return apiRequest<
    ApiSuccessResponse & {
      university_id?: number;
    }
  >(`/universities/${universityId}`, {
    method: "DELETE",
  });
}

// ============================================================
// PROGRAMS
// ============================================================

// GET PROGRAMS

export async function getUniversityPrograms(
  universityId: number
): Promise<ProgramListResponse> {
  return apiRequest<ProgramListResponse>(
    `/universities/${universityId}/programs`
  );
}

// CREATE PROGRAM

export async function createProgram(
  data: ProgramCreateRequest
): Promise<{
  success: boolean;
  message: string;
  program: UniversityProgram;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    program: UniversityProgram;
  }>("/universities/programs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// UPDATE PROGRAM

export async function updateProgram(
  programId: number,
  data: ProgramUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  program: UniversityProgram;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    program: UniversityProgram;
  }>(`/universities/programs/${programId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE PROGRAM

export async function deleteProgram(
  programId: number
): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(
    `/universities/programs/${programId}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// FEES
// ============================================================

// GET FEES

export async function getUniversityFees(
  universityId: number
): Promise<FeeListResponse> {
  return apiRequest<FeeListResponse>(
    `/universities/${universityId}/fees`
  );
}

// CREATE FEE

export async function createFee(
  data: FeeCreateRequest
): Promise<{
  success: boolean;
  message: string;
  fee: UniversityFee;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    fee: UniversityFee;
  }>("/universities/fees", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// UPDATE FEE

export async function updateFee(
  feeId: number,
  data: FeeUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  fee: UniversityFee;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    fee: UniversityFee;
  }>(`/universities/fees/${feeId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE FEE

export async function deleteFee(
  feeId: number
): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(
    `/universities/fees/${feeId}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// ADMISSION DEADLINES
// ============================================================

// GET DEADLINES

export async function getUniversityDeadlines(
  universityId: number
): Promise<DeadlineListResponse> {
  return apiRequest<DeadlineListResponse>(
    `/universities/${universityId}/deadlines`
  );
}

// CREATE DEADLINE

export async function createDeadline(
  data: DeadlineCreateRequest
): Promise<{
  success: boolean;
  message: string;
  deadline: AdmissionDeadline;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    deadline: AdmissionDeadline;
  }>("/universities/deadlines", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// UPDATE DEADLINE

export async function updateDeadline(
  deadlineId: number,
  data: DeadlineUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  deadline: AdmissionDeadline;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    deadline: AdmissionDeadline;
  }>(`/universities/deadlines/${deadlineId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE DEADLINE

export async function deleteDeadline(
  deadlineId: number
): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(
    `/universities/deadlines/${deadlineId}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// ADMISSION REQUIREMENTS
// ============================================================

// GET REQUIREMENTS

export async function getUniversityRequirements(
  universityId: number
): Promise<RequirementListResponse> {
  return apiRequest<RequirementListResponse>(
    `/universities/${universityId}/requirements`
  );
}

// CREATE REQUIREMENT

export async function createRequirement(
  data: RequirementCreateRequest
): Promise<{
  success: boolean;
  message: string;
  requirement: AdmissionRequirement;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    requirement: AdmissionRequirement;
  }>("/universities/requirements", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// UPDATE REQUIREMENT

export async function updateRequirement(
  requirementId: number,
  data: RequirementUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  requirement: AdmissionRequirement;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    requirement: AdmissionRequirement;
  }>(`/universities/requirements/${requirementId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE REQUIREMENT

export async function deleteRequirement(
  requirementId: number
): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(
    `/universities/requirements/${requirementId}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// UNIVERSITY SOURCES
// ============================================================

// GET SOURCES

export async function getUniversitySources(
  universityId: number
): Promise<SourceListResponse> {
  return apiRequest<SourceListResponse>(
    `/universities/${universityId}/sources`
  );
}

// CREATE SOURCE

export async function createSource(
  data: SourceCreateRequest
): Promise<{
  success: boolean;
  message: string;
  source: UniversitySource;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    source: UniversitySource;
  }>("/universities/sources", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// UPDATE SOURCE

export async function updateSource(
  sourceId: number,
  data: SourceUpdateRequest
): Promise<{
  success: boolean;
  message: string;
  source: UniversitySource;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    source: UniversitySource;
  }>(`/universities/sources/${sourceId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE SOURCE

export async function deleteSource(
  sourceId: number
): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(
    `/universities/sources/${sourceId}`,
    {
      method: "DELETE",
    }
  );
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