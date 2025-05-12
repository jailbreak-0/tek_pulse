"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AccountSetup() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  //const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profiles?.full_name && profiles?.student_id) {
        router.push("/");
      } else {
        setLoading(false); // show the form
      }
    };

    checkProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
   
    // Checks if user exists

    if (!user) {
      alert("User not found. Please log in again.");
      return;
    }

    console.log("User ID:", user.id);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      student_id: studentId,
      //profile_picture: profilePicture,
    });

    if (!error) {
      router.push("/");
    } else {
      console.error("Upsert error:", error.message);
      alert("Error saving profile: " + error.message);
    }
  };

  if (loading) return <p>Checking profile...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Set Up Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {/* <input
          type="image"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          className="w-full p-2 border rounded-full"
        /> */}
        <button type="submit" className="w-full bg-[#22AB39] text-white p-2 rounded cursor-pointer hover:bg-green-700">
          Save & Continue
        </button>
      </form>
    </div>
  );
}
