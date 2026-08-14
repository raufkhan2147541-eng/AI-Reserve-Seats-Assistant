import { useState } from "react";
import Button from "../components/Button";

const API_URL = "http://127.0.0.1:8000";

const StudentRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ------------------------------------------
    // Password Validation
    // ------------------------------------------

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      // ------------------------------------------
      // Register Student
      // ------------------------------------------

      const response = await fetch(
        `${API_URL}/auth/student/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            full_name: fullName,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      // ------------------------------------------
      // Handle Error
      // ------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Student registration failed."
        );
      }

      // ------------------------------------------
      // Success
      // ------------------------------------------

      setSuccess(
        "Student account created successfully! Redirecting to login..."
      );

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">

      <div className="mx-auto w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">

          <h1 className="text-2xl font-bold text-slate-900">
            Directorate Reserve Seats
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Student AI Assistant
          </p>

        </div>

        {/* Registration Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-slate-900">
              Create Student Account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create your account to access the AI student assistant
              and official guidance.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Full Name */}
            <div>

              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Enter your full name"
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

            </div>

            {/* Email */}
            <div>

              <label
                htmlFor="registerEmail"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="registerEmail"
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

              <label
                htmlFor="registerPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="registerPassword"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Create a password"
                required
                minLength={8}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Password must contain at least 8 characters.
              </p>

            </div>

            {/* Confirm Password */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your password"
                required
                minLength={8}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Student Account"}
            </Button>

          </form>

          {/* Login Link */}
          <div className="mt-6 border-t border-slate-200 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Already have an account?{" "}

              <a
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Student Login
              </a>

            </p>

          </div>

        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Your account is securely connected to the student
          authentication system.
        </p>

      </div>

    </div>
  );
};

export default StudentRegister;