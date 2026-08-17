import { useState } from "react";
import Button from "../components/Button";

const API_URL = "https://ai-reserve-seats-assistant-yompsp34o-minhaj-solution.vercel.app";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetMode, setResetMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // Request Password Reset
  // ==========================================

  const handleForgotPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/student/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to process password reset request."
        );
      }

      // ------------------------------------------
      // Store token internally
      // ------------------------------------------

      if (!data.reset_token) {
        throw new Error(
          "Reset token was not received from the server."
        );
      }

      setResetToken(data.reset_token);

      // ------------------------------------------
      // Show password fields
      // ------------------------------------------

      setResetMode(true);

      setSuccess(
        "Your account was found. Please create a new password below."
      );
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

  // ==========================================
  // Reset Password
  // ==========================================

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ------------------------------------------
    // Validate Password
    // ------------------------------------------

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!resetToken) {
      setError(
        "Reset session is missing. Please request a new password reset."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/student/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Password reset failed. Please try again."
        );
      }

      // ------------------------------------------
      // Success
      // ------------------------------------------

      setSuccess(
        "Password reset successfully! You can now login with your new password."
      );

      // ------------------------------------------
      // Clear Password Fields
      // ------------------------------------------

      setNewPassword("");
      setConfirmPassword("");

      // ------------------------------------------
      // Clear Reset Token
      // ------------------------------------------

      setResetToken("");

      // ------------------------------------------
      // Hide Password Form
      // ------------------------------------------

      setResetMode(false);
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

        {/* ==========================================
            Brand
        ========================================== */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Directorate Reserve Seats
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Student AI Assistant
          </p>
        </div>

        {/* ==========================================
            Forgot Password Card
        ========================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

          {/* Header */}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Forgot Password?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your registered student email address
              to reset your password.
            </p>
          </div>

          {/* ==========================================
              Error Message
          ========================================== */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}

          {/* ==========================================
              Success Message
          ========================================== */}

          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
              {success}
            </div>
          )}

          {/* ==========================================
              Email Form
          ========================================== */}

          {!resetMode && (
            <form
              onSubmit={handleForgotPassword}
              className="space-y-5"
            >

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Registered Email Address
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

              {/* Submit */}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Checking Account..."
                  : "Continue"}
              </Button>
            </form>
          )}

          {/* ==========================================
              New Password Form
          ========================================== */}

          {resetMode && (
            <form
              onSubmit={handleResetPassword}
              className="space-y-5"
            >

              {/* New Password */}

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  New Password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              {/* Confirm Password */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              {/* Reset Button */}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Resetting Password..."
                  : "Reset Password"}
              </Button>
            </form>
          )}

          {/* ==========================================
              Back to Login
          ========================================== */}

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Remember your password?{" "}

              <a
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Back to Login
              </a>
            </p>
          </div>
        </div>

        {/* ==========================================
            Footer Note
        ========================================== */}

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Your password is securely updated in your
          student account.
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;