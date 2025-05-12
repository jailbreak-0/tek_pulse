// pages/forgot-password.tsx
"use client";
import { useState } from "react";
import { sendPasswordReset } from "@/lib/sendPasswordReset";
import SupabaseImage from "@/components/Images";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await sendPasswordReset(email);

    if (error) setError(error.message);
    else setMessage("Check your email for a password reset link.");

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SupabaseImage
        path="background.webp"
        bucket="pictures/image"
        isPublic={true}
        alt="background"
        className="absolute object-cover w-full h-full blur-xs"
      />
      <div className="bg-white p-8 rounded shadow max-w-md w-full z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#22AB39]">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 text-black placeholder:text-gray-400 border rounded border-[#AEE6B9]"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-yellow-600 text-sm mb-4">{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full bg-[#22AB39] text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-sm text-center text-gray-400 mt-4">
            Remembered your password?{" "}
            <a href="/auth" className="text-[#22AB39] hover:underline">
                Back to Login.
            </a>
        </p>
      </div>
    </div>
  );
}
