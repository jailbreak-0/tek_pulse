"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(full_name, avatar_url), likes(user_id)")
        .eq("id", id)
        .single();

      if (!error) setPost(data);
    };
    fetchPost();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Post Details</h1>
      {post ? (
        <pre className="text-sm">{JSON.stringify(post, null, 2)}</pre>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
}
