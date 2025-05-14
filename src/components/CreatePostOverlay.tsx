"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

type Props = {
  post?: {
    id: string;
    content: string;
    image_url: string | null;
  };
  onClose: () => void;
};

export default function CreatePostOverlay({ post, onClose }: Props) {
  const [content, setContent] = useState(post?.content || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(post?.image_url || null);
  const [uploading, setUploading] = useState(false);

  // Handle image selection and preview generation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  // Handles both create and update logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    let imageUrl = previewUrl;

    // Upload image if a new one was selected
    if (imageFile) {
      const filePath = `posts/${uuidv4()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("pictures")
        .upload(filePath, imageFile);

      if (error) {
        alert("Image upload failed: " + error.message);
        setUploading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("pictures")
        .getPublicUrl(filePath);
      imageUrl = publicData?.publicUrl;
    }

    // Create or update post
    if (post?.id) {
      // 🔄 Update
      const { error } = await supabase
        .from("posts")
        .update({ content, image_url: imageUrl })
        .eq("id", post.id);

      if (error) alert("Update failed: " + error.message);
    } else {
      // ➕ Create
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content,
        image_url: imageUrl,
      });

      if (error) alert("Post failed: " + error.message);
    }

    setUploading(false);
    onClose(); // Close the overlay
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">
          {post?.id ? "Edit Post" : "Create Post"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            required
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full border rounded p-2"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
          />

          {previewUrl && (
            <div>
              <p className="text-sm mb-1">Image Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-w-sm rounded border"
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:underline"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {uploading
                ? post?.id
                  ? "Updating..."
                  : "Posting..."
                : post?.id
                ? "Update Post"
                : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
