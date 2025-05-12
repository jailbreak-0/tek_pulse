// pages/reset-password.tsx
"use client";
// This component allows users to reset their password after receiving a reset link via email.
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import SupabaseImage from "@/components/Images";

export default function ResetPassword() {
  // State variables for user input, feedback messages, and loading state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle the password reset process
  const handleReset = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    // Ensure both entered passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Call Supabase to update the password for the current session
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    // Handle the result
    if (error) setError(error.message);
    else {
      setMessage("Password updated successfully. Redirecting to login...");
      setTimeout(() => router.push("/auth"), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SupabaseImage
        path="background.webp"
        bucket="pictures/image"
        isPublic={true}
        alt="background"
        className="absolute object-cover w-screen h-full blur-xs"
      />
      <div className="bg-white p-8 rounded shadow max-w-md w-full z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#22AB39]">Reset Password</h2>

        {/* New password input */}
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded border-[#AEE6B9] placeholder:text-gray-400"
        />

        {/* Confirm new password input */}
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded border-[#AEE6B9] placeholder:text-gray-400"
        />

        {/* Feedback messages */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

        {/* Submit button */}
        <button
          onClick={handleReset}
          disabled={loading || !newPassword || !confirmPassword}
          className="w-full bg-[#22AB39] text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
