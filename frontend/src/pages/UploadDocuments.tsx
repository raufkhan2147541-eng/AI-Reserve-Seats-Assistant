import { useEffect, useState } from "react";

interface KnowledgeDocument {
  id: number;
  title: string;
  file_name: string;
  file_type: string;
  created_at: string;
}

const UploadDocuments = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDocuments, setLoadingDocuments] =
    useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "https://ai-reserve-seats-assistant.onrender.com";

  // ==========================================
  // Get Access Token
  // ==========================================

  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  // ==========================================
  // Load Knowledge Documents
  // ==========================================

  const loadDocuments = async () => {
    try {
      setLoadingDocuments(true);
      setError("");

      const token = getAccessToken();

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/knowledge/documents`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to load documents."
        );
      }

      setDocuments(data.documents || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load documents."
      );
    } finally {
      setLoadingDocuments(false);
    }
  };

  // ==========================================
  // Load Documents When Page Opens
  // ==========================================

  useEffect(() => {
    loadDocuments();
  }, []);

  // ==========================================
  // Select File
  // ==========================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] || null;

    setSelectedFile(file);
    setMessage("");
    setError("");
  };

  // ==========================================
  // Upload Document
  // ==========================================

  const handleUpload = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // ------------------------------------------
    // Check File
    // ------------------------------------------

    if (!selectedFile) {
      setError(
        "Please select a PDF or TXT file."
      );
      return;
    }

    // ------------------------------------------
    // Check Extension
    // ------------------------------------------

    const extension =
      "." +
      selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      extension !== ".pdf" &&
      extension !== ".txt"
    ) {
      setError(
        "Only PDF and TXT files are supported."
      );
      return;
    }

    // ------------------------------------------
    // Get Token
    // ------------------------------------------

    const token = getAccessToken();

    if (!token) {
      setError(
        "Authentication token not found. Please login again."
      );
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------
      // Create Form Data
      // ----------------------------------------

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      // ----------------------------------------
      // Send Request
      // ----------------------------------------

      const response = await fetch(
        `${API_URL}/knowledge/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      // ----------------------------------------
      // Handle Error
      // ----------------------------------------

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Document upload failed."
        );
      }

      // ----------------------------------------
      // Success
      // ----------------------------------------

      setMessage(
        "Document uploaded successfully."
      );

      setSelectedFile(null);

      // Clear file input

      const fileInput =
        document.getElementById(
          "document-file"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      // Reload documents

      await loadDocuments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Document upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ========================================
          Header
      ======================================== */}

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-xl font-bold">
              Knowledge Base
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Directorate Reserve Seats
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/admin/dashboard")
            }
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            ← Dashboard
          </button>

        </div>
      </header>

      {/* ========================================
          Main
      ======================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Page Heading */}

        <section>
          <p className="text-sm font-semibold text-blue-400">
            Administration Portal
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Upload Knowledge Documents
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400">
            Upload official PDF or TXT documents
            that will be used as knowledge sources
            for the AI Student Assistant.
          </p>
        </section>

        {/* ========================================
            Upload Card
        ======================================== */}

        <section className="mt-10">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/20 text-2xl">
              📄
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Select Document
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Supported file types: PDF and TXT
            </p>

            <form
              onSubmit={handleUpload}
              className="mt-6"
            >

              {/* File Input */}

              <input
                id="document-file"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-700"
              />

              {/* Selected File */}

              {selectedFile && (
                <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800 p-4">

                  <p className="text-sm font-semibold text-white">
                    Selected File
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(
                      selectedFile.size /
                      1024
                    ).toFixed(2)}{" "}
                    KB
                  </p>

                </div>
              )}

              {/* Success */}

              {message && (
                <div className="mt-5 rounded-lg border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-400">
                  {message}
                </div>
              )}

              {/* Error */}

              {error && (
                <div className="mt-5 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Upload */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !selectedFile
                }
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Uploading..."
                  : "Upload Document"}
              </button>

            </form>

          </div>

        </section>

        {/* ========================================
            Documents
        ======================================== */}

        <section className="mt-10">

          <div className="rounded-2xl border border-slate-800 bg-slate-900">

            {/* Header */}

            <div className="border-b border-slate-800 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-bold">
                    Knowledge Documents
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Documents currently stored
                    in the knowledge base.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadDocuments}
                  disabled={
                    loadingDocuments
                  }
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {loadingDocuments
                    ? "Loading..."
                    : "Refresh"}
                </button>

              </div>

            </div>

            {/* Documents Table */}

            <div className="overflow-x-auto">

              {loadingDocuments ? (

                <div className="p-8 text-center text-sm text-slate-400">
                  Loading documents...
                </div>

              ) : documents.length === 0 ? (

                <div className="p-8 text-center">

                  <div className="text-4xl">
                    📂
                  </div>

                  <p className="mt-3 font-semibold text-slate-300">
                    No documents found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload your first knowledge
                    document above.
                  </p>

                </div>

              ) : (

                <table className="w-full min-w-[700px]">

                  <thead>
                    <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">

                      <th className="px-6 py-4">
                        ID
                      </th>

                      <th className="px-6 py-4">
                        Document
                      </th>

                      <th className="px-6 py-4">
                        File Type
                      </th>

                      <th className="px-6 py-4">
                        Created
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {documents.map(
                      (document) => (
                        <tr
                          key={document.id}
                          className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50"
                        >

                          <td className="px-6 py-4 text-sm text-slate-400">
                            #{document.id}
                          </td>

                          <td className="px-6 py-4">

                            <p className="font-medium text-white">
                              {document.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                document.file_name
                              }
                            </p>

                          </td>

                          <td className="px-6 py-4">

                            <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold uppercase text-blue-400">
                              {
                                document.file_type
                              }
                            </span>

                          </td>

                          <td className="px-6 py-4 text-sm text-slate-400">
                            {
                              document.created_at
                            }
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default UploadDocuments;