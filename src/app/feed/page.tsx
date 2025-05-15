"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import PostCard from "@/components/PostCard";
import SkeletonPost from "@/components/SkeletonPost";
import { Post } from "@/types";
import Link from "next/link";

const CreatePostOverlay = dynamic(() => import("@/components/CreatePostOverlay"), { ssr: false });

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Infinite scroll states
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Get logged in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  // Fetch paginated posts
  const fetchPostsPage = async (pageIndex: number, pageSize = 10) => {
    const from = pageIndex * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(full_name, avatar_url), likes(user_id), shares(user_id)")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error) {
      if (data.length < pageSize) setHasMore(false);
      setPosts((prev) => [...prev, ...data]);
    }

    setInitialLoading(false);
    setIsFetchingMore(false);
  };

  useEffect(() => {
    fetchPostsPage(0); // first page
  }, []);

  // Fetch one full post for realtime updates
  const fetchFullPost = async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(full_name, avatar_url), likes(user_id), shares(user_id)")
      .eq("id", id)
      .single();
    return error ? null : data;
  };

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("posts_feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
        fetchFullPost(payload.new.id).then((fullPost) => {
          if (!fullPost) return;
          setPosts((prev) => [fullPost, ...prev]);
          setNotification("A new post was added");
          setTimeout(() => setNotification(null), 3000);
        });
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "posts" }, (payload) => {
        fetchFullPost(payload.new.id).then((fullPost) => {
          if (!fullPost) return;
          setPosts((prev) => [fullPost, ...prev.filter((p) => p.id !== fullPost.id)]);
          setNotification("A post was updated");
          setTimeout(() => setNotification(null), 3000);
        });
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

  // Handle like toggle
  const handleLikeToggle = async (postId: string, liked: boolean) => {
    if (!currentUserId) return;
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, post_id: postId });
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, post_id: postId });
    }
  };

  // Handle share
  const handleShare = async (postId: string) => {
    if (!currentUserId) return;
    await supabase.from("shares").insert({ user_id: currentUserId, post_id: postId });
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    await supabase.from("posts").delete().eq("id", id);
  };

  // Infinite scroll logic
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingMore || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsFetchingMore(true);
          setPage((prev) => {
            const next = prev + 1;
            fetchPostsPage(next);
            return next;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingMore, hasMore]
  );

  return (
    <div className="max-w-xl mx-auto p-4">
      <nav className="flex items-center justify-center">
        <div className='max-w-xl h-12 flex justify-between gap-30 font-bold text-gray-400 border-b-1px border-gray-200'>
          <Link className='flex items-center justify-center w-lg h-full border-b-4 border-green-500' href='/'>For You</Link>
          <Link className='flex items-center justify-center w-lg h-full' href='/'>Following</Link>
        </div>
      </nav>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowOverlay(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Post
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="mb-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow">
          {notification}
        </div>
      )}

      {/* Loading Skeletons */}
      {initialLoading ? (
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post, i) => {
            const isLast = i === posts.length - 1;
            return (
              <div ref={isLast ? lastPostRef : null} key={post.id}>
                <PostCard
                  post={post}
                  currentUserId={currentUserId}
                  onEdit={(p) => setEditingPost(p)}
                  onDelete={handleDelete}
                  onToggleLike={handleLikeToggle}
                  onShare={handleShare}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite loading indicator */}
      {isFetchingMore && (
        <div className="text-center text-gray-500 py-4">Loading more posts...</div>
      )}

      {/* Overlay for creating or editing post */}
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
