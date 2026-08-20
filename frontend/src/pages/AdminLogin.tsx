import { useState } from "react";
import Button from "../components/Button";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "https://ai-reserve-seats-assistant.onrender.com";

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ==========================================
      // Admin Login Request
      // ==========================================

      const response = await fetch(
        `${API_URL}/admin/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // ==========================================
      // Read Response
      // ==========================================

      const data = await response.json();

      console.log("Admin login response:", data);

      // ==========================================
      // Handle Login Error
      // ==========================================

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Invalid admin email or password."
        );
      }

      // ==========================================
      // Get Access Token
      // ==========================================

      const accessToken = data?.access_token;

      if (!accessToken) {
        throw new Error(
          "Login successful, but access token was not returned by the server."
        );
      }

      // ==========================================
      // Save Access Token
      // ==========================================

      localStorage.setItem(
        "access_token",
        accessToken
      );

      // Also keep an admin-specific token
      // for compatibility with admin pages.

      localStorage.setItem(
        "admin_access_token",
        accessToken
      );

      // ==========================================
      // Save Admin Information
      // ==========================================

      if (data?.admin) {
        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );
      }

      // ==========================================
      // Redirect to Admin Dashboard
      // ==========================================

      window.location.href =
        "/admin/dashboard";

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Admin login failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">

      {/* ======================================
          Brand
      ====================================== */}

      <div className="mx-auto max-w-md">

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-3xl">
            🛡️
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Directorate Reserve Seats
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Administration Portal
          </p>

        </div>

        {/* ======================================
            Login Card
        ====================================== */}

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-white">
              Admin Login
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sign in to manage documents,
              knowledge base and AI assistant
              settings.
            </p>

          </div>

          {/* ====================================
              Error Message
          ==================================== */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-700 bg-red-950/50 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* ====================================
              Form
          ==================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Admin Email */}

            <div>

              <label
                htmlFor="adminEmail"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Admin Email
              </label>

              <input
                id="adminEmail"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
              />

            </div>

            {/* Password */}

            <div>

              <label
                htmlFor="adminPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
              />

            </div>

            {/* Submit */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign in to Admin Portal"}
            </Button>

          </form>

          {/* ====================================
              Security Notice
          ==================================== */}

          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/60 p-4">

            <div className="flex gap-3">

              <span className="text-lg">
                🔒
              </span>

              <p className="text-xs leading-5 text-slate-400">
                This area is restricted to
                authorized administration users.
                Do not share your administrator
                credentials.
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <p className="mt-6 text-center text-xs text-slate-500">
          Directorate Reserve Seats of Balochistan
        </p>

      </div>

    </div>
  );
};

export default AdminLogin;