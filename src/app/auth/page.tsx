// pages/auth.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import SupabaseImage from "@/components/Images";

export default function AuthPage() {
  // State for input fields and auth handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Auto-login if user is already authenticated
  useEffect(() => {
  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) router.replace("/");
  };
  checkSession();
  }, [router]);

  // Handles login or sign-up with Supabase
  const handleAuth = async () => {
    setLoading(true);
    setError("");
    const method = isLogin ? "signInWithPassword" : "signUp";

  // Calls Supabase auth method
  const { data, error } = await supabase.auth[method]({
    email,
    password,
  });

  // Handle errors or navigate to dashboard
  if (error) setError(error.message);
  else router.push("/");

  setLoading(false);
};

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white px-8 pb-8 rounded shadow max-w-md w-full">
        <SupabaseImage 
          path="logo.jpeg"
          bucket="pictures/image"
          isPublic={true}
          alt="logo"
          className="relative mx-auto mb-1 w-30 h-30"
        />
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? "Welcome Back!" : "Welcome to TekPulse!"}
        </h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#22AB39]">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 text-black border rounded-lg border-[#AEE6B9] placeholder:text-gray-400"
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 text-black border rounded-lg border-[#AEE6B9] placeholder:text-gray-400"
        />

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Submit button */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-[#22AB39] text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
        </button>

        {/* Toggle login/signup mode */}
        <p className="mt-4 text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-[#22AB39] hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>

        {/* Forgot password link */}
        {isLogin && (
          <p className="mt-2 text-sm text-center">
            <a href="auth/forgot-password" className="text-[#22AB39] hover:underline">
              Forgot Password?
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
