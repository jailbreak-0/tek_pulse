"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import LostItemCard from "@/components/LostItemCard";
import Link from "next/link";

type LostItem = {
  id: string;
  title: string;
  description: string;
  type: "lost" | "found";
  is_claimed: boolean;
  created_at: string;
};

export default function LostAndFoundPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("lost_and_found")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching lost and found:", error);
        return;
      }

      setItems(data || []);
    };

    fetchItems();
  }, []);

  return (
    <div className="p-4">
      <nav>
        <button className="rounded bg-[#22AB39] text-white py-2 px-4 font-semibold mb-4">
          <Link href="../lost-and-found/add">
            Add Lost/Found Item
          </Link>
        </button>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Lost & Found</h1>
      <div className="grid gap-4">
        {items.length > 0 ? (
          items.map((item) => <LostItemCard key={item.id} item={item} />)
        ) : (
          <p>No items yet.</p>
        )}
      </div>
    </div>
  );
}
