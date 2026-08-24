import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import universityApi from "../services/universityApi";
import type {
  University,
  UniversityProgram,
  UniversityFee,
  AdmissionDeadline,
  AdmissionRequirement,
  UniversitySource,
} from "../services/universityApi";

type TabType =
  | "overview"
  | "programs"
  | "fees"
  | "deadlines"
  | "requirements"
  | "sources";

const StudentUniversityDetails = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const navigate = useNavigate();

  const [university, setUniversity] = useState<University | null>(null);

  const [programs, setPrograms] = useState<UniversityProgram[]>([]);
  const [fees, setFees] = useState<UniversityFee[]>([]);
  const [deadlines, setDeadlines] = useState<AdmissionDeadline[]>([]);
  const [requirements, setRequirements] = useState<
    AdmissionRequirement[]
  >([]);
  const [sources, setSources] = useState<UniversitySource[]>([]);

  const [activeTab, setActiveTab] =
    useState<TabType>("overview");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Load University Details
  // ==========================================

  useEffect(() => {
    const loadUniversityDetails = async () => {
      if (!universityId) {
        setError("University ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await universityApi.getUniversityDetails(
            Number(universityId)
          );

        setUniversity(response.university);
        setPrograms(response.programs || []);
        setFees(response.fees || []);
        setDeadlines(response.deadlines || []);
        setRequirements(response.requirements || []);
        setSources(response.sources || []);
      } catch (error) {
        console.error(
          "University details loading error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load university details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUniversityDetails();
  }, [universityId]);

  // ==========================================
  // Helpers
  // ==========================================

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatCurrency = (
    amount?: number | null,
    currency?: string | null
  ) => {
    if (
      amount === null ||
      amount === undefined
    ) {
      return "Not available";
    }

    const currencyCode =
      currency || "PKR";

    return `${currencyCode} ${amount.toLocaleString()}`;
  };

  const booleanText = (
    value?: boolean | number
  ) => {
    return Boolean(value) ? "Yes" : "No";
  };

  const openExternalLink = (
    url?: string | null
  ) => {
    if (!url) return;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading university details...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error || !university) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="text-4xl">
              ⚠️
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to Load University
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error ||
                "University information is not available."}
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Tabs
  // ==========================================

  const tabs: {
    id: TabType;
    label: string;
    count?: number;
  }[] = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "programs",
      label: "Programs",
      count: programs.length,
    },
    {
      id: "fees",
      label: "Fee Structure",
      count: fees.length,
    },
    {
      id: "deadlines",
      label: "Deadlines",
      count: deadlines.length,
    },
    {
      id: "requirements",
      label: "Requirements",
      count: requirements.length,
    },
    {
      id: "sources",
      label: "Sources",
      count: sources.length,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================
          Header
      ====================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">

          <div className="flex items-center justify-between gap-4">

            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Back to Universities
              </button>

              <h1 className="text-xl font-bold text-slate-900">
                University Details
              </h1>

              <p className="text-sm text-slate-500">
                Directorate Reserve Seats
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/student/dashboard")
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Dashboard
            </button>

          </div>

        </div>
      </header>

      {/* ======================================
          Main Content
      ====================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* ====================================
            University Hero
        ==================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex gap-5">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
                🎓
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="text-2xl font-bold text-slate-900">
                    {university.name}
                  </h2>

                  {Boolean(
                    university.hec_recognized
                  ) && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      ✓ HEC Recognized
                    </span>
                  )}

                </div>

                {university.university_type && (
                  <p className="mt-2 text-sm font-semibold text-blue-600">
                    {university.university_type}
                  </p>
                )}

                {(university.city ||
                  university.province) && (
                  <p className="mt-3 text-sm text-slate-600">
                    📍{" "}
                    {[
                      university.city,
                      university.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {university.campus && (
                  <p className="mt-2 text-sm text-slate-600">
                    🏫 {university.campus}
                  </p>
                )}

                {university.academic_session && (
                  <p className="mt-2 text-sm text-slate-600">
                    📅 Academic Session:{" "}
                    {university.academic_session}
                  </p>
                )}

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              {university.official_website && (
                <button
                  type="button"
                  onClick={() =>
                    openExternalLink(
                      university.official_website
                    )
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Official Website ↗
                </button>
              )}

              {university.admission_portal && (
                <button
                  type="button"
                  onClick={() =>
                    openExternalLink(
                      university.admission_portal
                    )
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Admission Portal ↗
                </button>
              )}

            </div>

          </div>

          {university.description && (
            <div className="mt-6 border-t border-slate-200 pt-6">

              <h3 className="text-sm font-bold text-slate-900">
                About University
              </h3>

              <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
                {university.description}
              </p>

            </div>
          )}

        </section>

        {/* ====================================
            Statistics
        ==================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Programs
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {programs.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Fee Records
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {fees.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Deadlines
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-600">
              {deadlines.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Requirements
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-600">
              {requirements.length}
            </p>
          </div>

        </section>

        {/* ====================================
            Tabs
        ==================================== */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto border-b border-slate-200">

            <div className="flex min-w-max">

              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}

                  {tab.count !== undefined && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}

            </div>

          </div>

          <div className="p-6">

            {/* ==================================
                OVERVIEW
            ================================== */}

            {activeTab === "overview" && (
              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  University Overview
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Important information about this university.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      University Type
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                      {university.university_type ||
                        "Not available"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Location
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                      {[
                        university.city,
                        university.province,
                      ]
                        .filter(Boolean)
                        .join(", ") ||
                        "Not available"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      HEC Recognition
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                      {Boolean(
                        university.hec_recognized
                      )
                        ? "Recognized"
                        : "Not recognized / Not available"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Academic Session
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                      {university.academic_session ||
                        "Not available"}
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* ==================================
                PROGRAMS
            ================================== */}

            {activeTab === "programs" && (
              <div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Available Programs
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Programs and eligibility information.
                    </p>
                  </div>
                </div>

                {programs.length === 0 ? (
                  <EmptyState
                    icon="📚"
                    title="No programs available"
                    description="Program information has not been added yet."
                  />
                ) : (
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">

                    {programs.map((program) => (
                      <div
                        key={program.id}
                        className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-sm"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              {program.program_name}
                            </h4>

                            {program.degree_level && (
                              <p className="mt-1 text-sm font-semibold text-blue-600">
                                {program.degree_level}
                              </p>
                            )}
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                              program.admission_status
                                ?.toLowerCase()
                                .includes("open")
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {program.admission_status ||
                              "Status unavailable"}
                          </span>

                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">

                          {program.department && (
                            <InfoItem
                              label="Department"
                              value={
                                program.department
                              }
                            />
                          )}

                          {program.duration && (
                            <InfoItem
                              label="Duration"
                              value={
                                program.duration
                              }
                            />
                          )}

                          {program.study_mode && (
                            <InfoItem
                              label="Study Mode"
                              value={
                                program.study_mode
                              }
                            />
                          )}

                          {program.campus && (
                            <InfoItem
                              label="Campus"
                              value={
                                program.campus
                              }
                            />
                          )}

                          <InfoItem
                            label="Entry Test"
                            value={booleanText(
                              program.entry_test_required
                            )}
                          />

                        </div>

                        {program.eligibility && (
                          <div className="mt-5 rounded-lg bg-blue-50 p-4">
                            <p className="text-xs font-bold uppercase text-blue-700">
                              Eligibility
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                              {program.eligibility}
                            </p>
                          </div>
                        )}

                        {program.academic_session && (
                          <p className="mt-4 text-xs text-slate-400">
                            Academic Session:{" "}
                            {program.academic_session}
                          </p>
                        )}

                        {program.source_url && (
                          <button
                            type="button"
                            onClick={() =>
                              openExternalLink(
                                program.source_url
                              )
                            }
                            className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                          >
                            View Source ↗
                          </button>
                        )}

                      </div>
                    ))}

                  </div>
                )}

              </div>
            )}

            {/* ==================================
                FEES
            ================================== */}

            {activeTab === "fees" && (
              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  Fee Structure
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Available fee information for university programs.
                </p>

                {fees.length === 0 ? (
                  <EmptyState
                    icon="💰"
                    title="No fee information available"
                    description="Fee details have not been added yet."
                  />
                ) : (
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">

                    {fees.map((fee) => (
                      <div
                        key={fee.id}
                        className="rounded-xl border border-slate-200 p-5"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <h4 className="font-bold text-slate-900">
                              {fee.program_name ||
                                "General Fee Structure"}
                            </h4>

                            {fee.academic_session && (
                              <p className="mt-1 text-xs text-slate-500">
                                {fee.academic_session}
                              </p>
                            )}
                          </div>

                          {fee.total_fee !==
                            null &&
                            fee.total_fee !==
                              undefined && (
                              <div className="text-right">
                                <p className="text-xs text-slate-500">
                                  Total
                                </p>

                                <p className="font-bold text-green-600">
                                  {formatCurrency(
                                    fee.total_fee,
                                    fee.currency
                                  )}
                                </p>
                              </div>
                            )}

                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">

                          <FeeItem
                            label="Admission Fee"
                            value={formatCurrency(
                              fee.admission_fee,
                              fee.currency
                            )}
                          />

                          <FeeItem
                            label="Tuition Fee"
                            value={formatCurrency(
                              fee.tuition_fee,
                              fee.currency
                            )}
                          />

                          <FeeItem
                            label="Semester Fee"
                            value={formatCurrency(
                              fee.semester_fee,
                              fee.currency
                            )}
                          />

                          <FeeItem
                            label="Examination Fee"
                            value={formatCurrency(
                              fee.examination_fee,
                              fee.currency
                            )}
                          />

                          <FeeItem
                            label="Hostel Fee"
                            value={formatCurrency(
                              fee.hostel_fee,
                              fee.currency
                            )}
                          />

                          <FeeItem
                            label="Transport Fee"
                            value={formatCurrency(
                              fee.transport_fee,
                              fee.currency
                            )}
                          />

                          <FeeItem
                            label="Other Fee"
                            value={formatCurrency(
                              fee.other_fee,
                              fee.currency
                            )}
                          />

                          {fee.fee_frequency && (
                            <FeeItem
                              label="Frequency"
                              value={
                                fee.fee_frequency
                              }
                            />
                          )}

                        </div>

                        {fee.source_url && (
                          <button
                            type="button"
                            onClick={() =>
                              openExternalLink(
                                fee.source_url
                              )
                            }
                            className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                          >
                            View Fee Source ↗
                          </button>
                        )}

                      </div>
                    ))}

                  </div>
                )}

              </div>
            )}

            {/* ==================================
                DEADLINES
            ================================== */}

            {activeTab === "deadlines" && (
              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  Admission Deadlines
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Important dates related to admissions.
                </p>

                {deadlines.length === 0 ? (
                  <EmptyState
                    icon="📅"
                    title="No deadlines available"
                    description="Admission deadline information has not been added yet."
                  />
                ) : (
                  <div className="mt-6 space-y-5">

                    {deadlines.map((deadline) => (
                      <div
                        key={deadline.id}
                        className="rounded-xl border border-slate-200 p-5"
                      >

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              {deadline.admission_title ||
                                "Admission"}
                            </h4>

                            {deadline.admission_session && (
                              <p className="mt-1 text-sm text-slate-500">
                                Session:{" "}
                                {
                                  deadline.admission_session
                                }
                              </p>
                            )}
                          </div>

                          {deadline.admission_status && (
                            <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              {
                                deadline.admission_status
                              }
                            </span>
                          )}

                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                          <DateItem
                            label="Applications Open"
                            date={
                              deadline.application_open_date
                            }
                          />

                          <DateItem
                            label="Application Deadline"
                            date={
                              deadline.application_deadline
                            }
                            highlight
                          />

                          <DateItem
                            label="Entry Test"
                            date={
                              deadline.entry_test_date
                            }
                          />

                          <DateItem
                            label="Interview"
                            date={
                              deadline.interview_date
                            }
                          />

                          <DateItem
                            label="Merit List"
                            date={
                              deadline.merit_list_date
                            }
                          />

                          <DateItem
                            label="Fee Submission"
                            date={
                              deadline.fee_submission_deadline
                            }
                          />

                        </div>

                        {deadline.source_url && (
                          <button
                            type="button"
                            onClick={() =>
                              openExternalLink(
                                deadline.source_url
                              )
                            }
                            className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                          >
                            View Official Source ↗
                          </button>
                        )}

                      </div>
                    ))}

                  </div>
                )}

              </div>
            )}

            {/* ==================================
                REQUIREMENTS
            ================================== */}

            {activeTab === "requirements" && (
              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  Admission Requirements
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Eligibility criteria and required documents.
                </p>

                {requirements.length === 0 ? (
                  <EmptyState
                    icon="📋"
                    title="No requirements available"
                    description="Admission requirement information has not been added yet."
                  />
                ) : (
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">

                    {requirements.map(
                      (requirement) => (
                        <div
                          key={requirement.id}
                          className="rounded-xl border border-slate-200 p-5"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>
                              <p className="text-xs font-semibold uppercase text-purple-600">
                                {requirement.requirement_type ||
                                  "Admission Requirement"}
                              </p>

                              <h4 className="mt-1 text-lg font-bold text-slate-900">
                                {requirement.requirement_title ||
                                  "Requirement"}
                              </h4>
                            </div>

                          </div>

                          {requirement.requirement_description && (
                            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {
                                requirement.requirement_description
                              }
                            </p>
                          )}

                          <div className="mt-5 space-y-3">

                            {requirement.minimum_percentage !==
                              null &&
                              requirement.minimum_percentage !==
                                undefined && (
                                <RequirementItem
                                  label="Minimum Percentage"
                                  value={`${requirement.minimum_percentage}%`}
                                />
                              )}

                            {requirement.required_subjects && (
                              <RequirementItem
                                label="Required Subjects"
                                value={
                                  requirement.required_subjects
                                }
                              />
                            )}

                            {requirement.required_documents && (
                              <RequirementItem
                                label="Required Documents"
                                value={
                                  requirement.required_documents
                                }
                              />
                            )}

                            <RequirementItem
                              label="Domicile Required"
                              value={booleanText(
                                requirement.domicile_required
                              )}
                            />

                            <RequirementItem
                              label="Entry Test Required"
                              value={booleanText(
                                requirement.entry_test_required
                              )}
                            />

                          </div>

                          {requirement.source_url && (
                            <button
                              type="button"
                              onClick={() =>
                                openExternalLink(
                                  requirement.source_url
                                )
                              }
                              className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                              View Official Source ↗
                            </button>
                          )}

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            )}

            {/* ==================================
                SOURCES
            ================================== */}

            {activeTab === "sources" && (
              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  Official Sources
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Sources used to verify university information.
                </p>

                {sources.length === 0 ? (
                  <EmptyState
                    icon="🔗"
                    title="No sources available"
                    description="Source information has not been added yet."
                  />
                ) : (
                  <div className="mt-6 space-y-4">

                    {sources.map((source) => (
                      <div
                        key={source.id}
                        className="rounded-xl border border-slate-200 p-5"
                      >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div>

                            <h4 className="font-bold text-slate-900">
                              {source.source_title}
                            </h4>

                            {source.source_type && (
                              <p className="mt-1 text-xs font-medium text-blue-600">
                                {source.source_type}
                              </p>
                            )}

                            {source.academic_session && (
                              <p className="mt-2 text-sm text-slate-500">
                                Academic Session:{" "}
                                {
                                  source.academic_session
                                }
                              </p>
                            )}

                            {source.verification_status && (
                              <p className="mt-2 text-sm text-slate-500">
                                Verification:{" "}
                                <span className="font-semibold text-green-600">
                                  {
                                    source.verification_status
                                  }
                                </span>
                              </p>
                            )}

                            {source.notes && (
                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {source.notes}
                              </p>
                            )}

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              openExternalLink(
                                source.source_url
                              )
                            }
                            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            Open Source ↗
                          </button>

                        </div>

                        {source.last_checked && (
                          <p className="mt-4 text-xs text-slate-400">
                            Last checked:{" "}
                            {formatDate(
                              source.last_checked
                            )}
                          </p>
                        )}

                      </div>
                    ))}

                  </div>
                )}

              </div>
            )}

          </div>

        </section>

        {/* ====================================
            Bottom Help
        ==================================== */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Need more information?
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Ask the AI Student Assistant about
                eligibility, programs, fees, deadlines
                or admission requirements.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/student/chat")
              }
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Ask AI Assistant →
            </button>

          </div>

        </section>

      </main>

    </div>
  );
};

// ==========================================================
// Reusable Components
// ==========================================================

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({
  label,
  value,
}: InfoItemProps) => {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
};

// ==========================================================
// Fee Item
// ==========================================================

const FeeItem = ({
  label,
  value,
}: InfoItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
};

// ==========================================================
// Date Item
// ==========================================================

interface DateItemProps {
  label: string;
  date?: string | null;
  highlight?: boolean;
}

const DateItem = ({
  label,
  date,
  highlight = false,
}: DateItemProps) => {
  const formatDate = (
    value?: string | null
  ) => {
    if (!value) return "Not available";

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div
      className={`rounded-xl p-4 ${
        highlight
          ? "bg-red-50"
          : "bg-slate-50"
      }`}
    >
      <p className="text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-bold ${
          highlight
            ? "text-red-700"
            : "text-slate-900"
        }`}
      >
        {formatDate(date)}
      </p>
    </div>
  );
};

// ==========================================================
// Requirement Item
// ==========================================================

const RequirementItem = ({
  label,
  value,
}: InfoItemProps) => {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
};

// ==========================================================
// Empty State
// ==========================================================

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

const EmptyState = ({
  icon,
  title,
  description,
}: EmptyStateProps) => {
  return (
    <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

      <div className="text-4xl">
        {icon}
      </div>

      <h4 className="mt-3 font-semibold text-slate-800">
        {title}
      </h4>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
};

export default StudentUniversityDetails;