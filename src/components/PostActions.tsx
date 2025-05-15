"use client";
import { Heart, MessageCircle, Share2 } from "lucide-react"

type PostActionsProps = {
    postId: string;
    liked: boolean;
    likeCount: number;
    shareCount: number;
    onLike: (postId: string, liked: boolean) => void;
    onComment: (postId: string) => void;
    onShare: (postId: string) => void;
  };
  
  export default function PostActions({
    postId,
    liked,
    likeCount,
    shareCount,
    onLike,
    onComment,
    onShare,
  }: PostActionsProps) {
  return (
    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mt-3">
      {/* Comment */}
      <button onClick={() => onComment(postId)} className="hover:text-blue-500 flex justify-center gap-1 cursor-pointer">
        <MessageCircle className="w-4 h-4" />
        Comment
      </button>

      {/* Like */}
      <button
        onClick={() => onLike(postId, liked)}
        className={`hover:text-pink-500 ${liked ? "text-pink-500" : ""} flex justify-center gap-1 cursor-pointer`}
      >
        <Heart className="w-4 h-4"/>
        {likeCount}
      </button>

      {/* Share */}
      <button
        onClick={() => onShare?.(postId)}
        className="hover:text-green-500 flex justify-center gap-1 cursor-pointer"
      >
        <Share2 className="w-4 h-4"/>
        {shareCount || 0}
      </button>
    </div>
  );
}
