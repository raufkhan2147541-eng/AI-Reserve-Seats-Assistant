import { useState } from "react";
import Button from "../components/Button";

const API_URL = "http://127.0.0.1:8000";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/student/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed. Please try again."
        );
      }

      // ------------------------------------------
      // Save JWT Token
      // ------------------------------------------

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // ------------------------------------------
      // Save Student Information
      // ------------------------------------------

      localStorage.setItem(
        "student",
        JSON.stringify(data.student)
      );

      setSuccess("Login successful! Redirecting...");

      // ------------------------------------------
      // Redirect to Student Dashboard
      // ------------------------------------------

      setTimeout(() => {
        window.location.href = "/student/dashboard";
      }, 800);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Directorate Reserve Seats
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Student AI Assistant
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Student Login
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Login to access the AI student assistant and get
              guidance from official information.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="student@example.com"
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </a>

              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login to Student Portal"}
            </Button>

          </form>

          {/* Register */}
          <div className="mt-6 border-t border-slate-200 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Don't have an account?{" "}

              <a
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create Account
              </a>
            </p>

          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Use your registered student account to access the AI
          Student Assistant.
        </p>

      </div>
    </div>
  );
};

export default StudentLogin;