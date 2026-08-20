import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ==========================================
// Types
// ==========================================

interface KnowledgeDocument {
  id: number;
  title: string;
  file_name: string;
  file_type: string;
  created_at: string;
}

interface DocumentsResponse {
  success: boolean;
  count: number;
  documents: KnowledgeDocument[];
}

// ==========================================
// Component
// ==========================================

const AdminDocuments = () => {
  const navigate = useNavigate();

  // ==========================================
  // Documents State
  // ==========================================

  const [documents, setDocuments] = useState<
    KnowledgeDocument[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // Delete State
  // ==========================================

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // ==========================================
  // Get Admin Token
  // ==========================================

  const getAdminToken = () => {
    return (
      localStorage.getItem(
        "admin_access_token"
      ) ||
      localStorage.getItem(
        "adminToken"
      ) ||
      localStorage.getItem(
        "access_token"
      ) ||
      localStorage.getItem(
        "token"
      )
    );
  };

  // ==========================================
  // Load Documents
  // ==========================================

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      // --------------------------------------
      // Token Check
      // --------------------------------------

      if (!token) {
        navigate("/admin/login");
        return;
      }

      // --------------------------------------
      // API Request
      // --------------------------------------

      const response = await fetch(
        "https://ai-reserve-seats-assistant.onrender.com/admin/documents",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data =
        await response.json();

      // --------------------------------------
      // Unauthorized
      // --------------------------------------

      if (response.status === 401) {
        localStorage.removeItem(
          "admin_access_token"
        );

        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "token"
        );

        navigate("/admin/login");

        return;
      }

      // --------------------------------------
      // Forbidden
      // --------------------------------------

      if (response.status === 403) {
        setError(
          "Admin access is required."
        );

        return;
      }

      // --------------------------------------
      // Other Error
      // --------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to load documents."
        );
      }

      // --------------------------------------
      // Success
      // --------------------------------------

      const result =
        data as DocumentsResponse;

      setDocuments(
        result.documents || []
      );

    } catch (error) {
      console.error(
        "Documents loading error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect to backend."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Delete Document
  // ==========================================

  const handleDeleteDocument = async (
    documentId: number,
    fileName: string
  ) => {
    // ----------------------------------------
    // Confirmation
    // ----------------------------------------

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${fileName}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(documentId);
      setError("");

      const token = getAdminToken();

      // --------------------------------------
      // Token Check
      // --------------------------------------

      if (!token) {
        navigate("/admin/login");
        return;
      }

      // --------------------------------------
      // Delete API
      // --------------------------------------

      const response = await fetch(
        `https://ai-reserve-seats-assistant.onrender.com/admin/documents/${documentId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      // --------------------------------------
      // Unauthorized
      // --------------------------------------

      if (response.status === 401) {
        localStorage.removeItem(
          "admin_access_token"
        );

        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "token"
        );

        navigate("/admin/login");

        return;
      }

      // --------------------------------------
      // Forbidden
      // --------------------------------------

      if (response.status === 403) {
        setError(
          "Admin access is required."
        );

        return;
      }

      // --------------------------------------
      // Delete Error
      // --------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Document deletion failed."
        );
      }

      // --------------------------------------
      // Remove from Current List
      // --------------------------------------

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (document) =>
            document.id !== documentId
        )
      );

    } catch (error) {
      console.error(
        "Document deletion error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete document."
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // Load on Page Open
  // ==========================================

  useEffect(() => {
    loadDocuments();
  }, []);

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

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-2xl">
              🗂️
            </div>

            <div>

              <h1 className="font-bold">
                Knowledge Documents
              </h1>

              <p className="text-xs text-slate-400">
                Directorate Reserve Seats
              </p>

            </div>

          </div>

          {/* Dashboard Button */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
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

        {/* ====================================
            Page Heading
        ==================================== */}

        <section>

          <p className="text-sm font-semibold text-blue-400">
            Administration
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Knowledge Base Documents
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400">
            View and manage the documents currently
            stored in the AI knowledge base.
          </p>

        </section>

        {/* ====================================
            Error
        ==================================== */}

        {error && (

          <div className="mt-8 rounded-xl border border-red-800 bg-red-950/40 p-5">

            <p className="font-semibold text-red-300">
              Error
            </p>

            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDocuments}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>

          </div>

        )}

        {/* ====================================
            Loading
        ==================================== */}

        {loading && (

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="mt-4 text-sm text-slate-400">
              Loading documents...
            </p>

          </div>

        )}

        {/* ====================================
            Documents
        ==================================== */}

        {!loading && !error && (

          <section className="mt-8">

            {/* ==================================
                Count + Refresh
            ================================== */}

            <div className="mb-5 flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  Total Documents
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {documents.length}
                </p>

              </div>

              <button
                type="button"
                onClick={loadDocuments}
                disabled={loading}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↻ Refresh
              </button>

            </div>

            {/* ==================================
                Empty State
            ================================== */}

            {documents.length === 0 && (

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

                <div className="text-4xl">
                  📄
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  No Documents Found
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  No knowledge documents have been
                  uploaded yet.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/dashboard"
                    )
                  }
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Upload Document
                </button>

              </div>

            )}

            {/* ==================================
                Document Table
            ================================== */}

            {documents.length > 0 && (

              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    {/* ==========================
                        Table Header
                    ========================== */}

                    <thead className="border-b border-slate-800 bg-slate-800/50">

                      <tr>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          #
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Document
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          File Name
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Type
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Created
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Action
                        </th>

                      </tr>

                    </thead>

                    {/* ==========================
                        Table Body
                    ========================== */}

                    <tbody>

                      {documents.map(
                        (
                          document,
                          index
                        ) => (

                          <tr
                            key={
                              document.id
                            }
                            className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40"
                          >

                            {/* Number */}

                            <td className="px-6 py-5 text-sm text-slate-500">
                              {index + 1}
                            </td>

                            {/* Document */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-xl">
                                  {document.file_type ===
                                  "pdf"
                                    ? "📕"
                                    : "📄"}
                                </div>

                                <div>

                                  <p className="font-semibold text-white">
                                    {
                                      document.title
                                    }
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    ID:{" "}
                                    {
                                      document.id
                                    }
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* File Name */}

                            <td className="px-6 py-5">

                              <p className="max-w-xs break-all text-sm text-slate-300">
                                {
                                  document.file_name
                                }
                              </p>

                            </td>

                            {/* Type */}

                            <td className="px-6 py-5">

                              <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold uppercase text-blue-400">
                                {
                                  document.file_type
                                }
                              </span>

                            </td>

                            {/* Created */}

                            <td className="px-6 py-5 text-sm text-slate-400">
                              {
                                document.created_at
                              }
                            </td>

                            {/* Delete */}

                            <td className="px-6 py-5">

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteDocument(
                                    document.id,
                                    document.file_name
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  document.id
                                }
                                className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-900/50 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingId ===
                                document.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

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

        )}

      </main>

    </div>
  );
};

export default AdminDocuments;

