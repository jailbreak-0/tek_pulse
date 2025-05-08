"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

type UserData = {
  full_name: string;
  student_id: string;
  profile_picture: string;
};

type UserContextType = {
  userData: UserData | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({ userData: null, loading: true });

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, student_id, profile_picture")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setUserData(data);
        }
      }

      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  );
};
