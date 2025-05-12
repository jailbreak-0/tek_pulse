"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function LostAndFoundSubmitPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !type.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log("User:", user);

    setSubmitting(true);

    const { data, error } = await supabase.from("lost_and_found").insert([
      {
        title,
        description,
        type,  
        location,
      },
    ]);

    setSubmitting(false);

    if (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } else {
      alert("Item submitted successfully!");
      router.push("/lost-and-found");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Submit Lost or Found Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2"
          rows={4}
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded p-2"
          required
        >
          <option value="" disabled className="text-gray-500">Select Type</option>
          <option value="lost" className="text-black">Lost</option>
          <option value="found" className="text-black">Found</option>
        </select>

        <div className="flex flex-col items-start">
          <label className="block font-medium mb-2">
            Select Pickup Location:
          </label>
            <input
                type="text"
                placeholder="Input Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded p-2"
                required
            />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#22AB39] text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}