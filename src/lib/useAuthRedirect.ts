// lib/useAuthRedirect.ts
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If user is not logged in, redirect to auth page
      if (!session) {
        router.replace("/auth");
      }
    };

    checkSession();
  }, [router]);
}