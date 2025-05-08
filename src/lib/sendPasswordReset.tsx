// utils/sendPasswordReset.ts
import { supabase } from "@/lib/supabaseClient";

export const sendPasswordReset = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });
};
