"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const CreatePostOverlay = dynamic(() => import("@/components/CreatePostOverlay"), { ssr: false });

type Post = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
  likes?: { user_id: string }[];
};

export default function FeedPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Get current user ID
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    getUser();
  }, []);
  

  // Fetch posts with profile and like info
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(full_name, avatar_url), likes(user_id)")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching posts:", error.message);
      else setPosts(data || []);

      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Helper to fetch full post with joins
  const fetchFullPost = async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(full_name, avatar_url), likes(user_id)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Failed to fetch full post:", error.message);
      return null;
    }
    return data;
  };

  // Real-time listener with full post fetch
  useEffect(() => {
    const channel = supabase
      .channel("posts_feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, async (payload) => {
        const fullPost = await fetchFullPost(payload.new.id);
        if (!fullPost) return;
        setPosts((prev) => [fullPost, ...prev]);
        setNotification("A new post was added");
        setTimeout(() => setNotification(null), 3000);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "posts" }, async (payload) => {
        const fullPost = await fetchFullPost(payload.new.id);
        if (!fullPost) return;
        setPosts((prev) => [fullPost, ...prev.filter((p) => p.id !== fullPost.id)]);
        setNotification("A post was updated");
        setTimeout(() => setNotification(null), 3000);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "posts" }, (payload) => {
        const deletedId = payload.old.id;
        setPosts((prev) => prev.filter((p) => p.id !== deletedId));
        setNotification("A post was removed");
        setTimeout(() => setNotification(null), 3000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("posts").delete().eq("id", id);
  };

  const toggleLike = async (postId: string, liked: boolean) => {
    if (!currentUserId) return;
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, post_id: postId });
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, post_id: postId });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campus Feed</h1>
        <button
          onClick={() => setShowOverlay(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Post
        </button>
      </div>

      {notification && (
        <div className="mb-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow">
          {notification}
        </div>
      )}

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const userLiked = !!post.likes?.some((l) => l.user_id === currentUserId);
            return (
              <div
                key={post.id}
                className="flex gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {post.profiles?.avatar_url ? (
                    <Image
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {post.profiles?.full_name?.[0] || "?"}
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {post.profiles?.full_name || "Anonymous"}
                    </span>
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {post.image_url && (
                    <div className="relative w-full h-64 mt-3 rounded-lg overflow-hidden border">
                      <Image
                        src={post.image_url}
                        alt="Post image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex mt-3 gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => router.push(`/feed/${post.id}`)}
                      className="hover:text-blue-500"
                    >
                      💬 Comment
                    </button>

                    <button
                      onClick={() => toggleLike(post.id, userLiked)}
                      className={`hover:text-pink-500 ${userLiked ? "text-pink-500" : ""}`}
                    >
                      ❤️ {post.likes?.length || 0}
                    </button>

                    <button className="hover:text-green-500">↗️ Share</button>

                    {post.user_id === currentUserId && (
                      <div className="ml-auto space-x-3 text-xs">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(showOverlay || editingPost) && (
        <CreatePostOverlay
          post={editingPost || undefined}
          onClose={() => {
            setShowOverlay(false);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}