"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import PostActions from "@/components/PostActions";
import { Trash2, SquarePen } from "lucide-react"

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
  shares?: { user_id: string }[];
};

type Props = {
  post: Post;
  currentUserId: string | null;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onToggleLike: (postId: string, liked: boolean) => void;
  onShare: (postId: string) => void;
};

export default function PostCard({
  post,
  currentUserId,
  onEdit,
  onDelete,
  onToggleLike,
  onShare
}: Props) {
  const router = useRouter();
  const userLiked = !!post.likes?.some((like) => like.user_id === currentUserId);

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
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
        <div className="flex mt-2 gap-6 text-sm items-center text-gray-500 dark:text-gray-400">
        <PostActions
          postId={post.id}
          liked={userLiked}
          likeCount={post.likes?.length || 0}
          shareCount={post.shares?.length || 0}
          onLike={onToggleLike}
          onComment={(id) => router.push(`/feed/${id}`)}
          onShare={onShare}
        />



          {post.user_id === currentUserId && (
            <div className="ml-auto space-x-3 text-sm">
              <button
                onClick={() => onEdit(post)}
                className="text-gray-600 hover:text-blue-600 cursor-pointer"
              >
                <SquarePen className="w-4 h-4 inline-block mr-1" />
                {/* Edit */}
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="text-gray-600 hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 inline-block mr-1" />
                {/* Delete */}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
