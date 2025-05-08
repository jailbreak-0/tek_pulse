// lib/logout.ts
"use client";
import { supabase } from "./supabaseClient";

export const logout = async () => {
  // Sign out from Supabase
  await supabase.auth.signOut();

  // Clear saved credentials from localStorage
  localStorage.removeItem("savedEmail");
  localStorage.removeItem("savedPassword");

  // Redirect to login page
  window.location.href = "/auth";
};
