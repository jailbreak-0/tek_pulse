"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft } from "lucide-react";

export default function AddMarketplaceItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to post.");
      return;
    }

    let imageUrl = null;

    if (imageFile) {
      const filePath = `marketplace/${uuidv4()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("pictures")
        .upload(filePath, imageFile);

      if (error) {
        console.error("Image upload error:", error.message);
        alert("Failed to upload image.");
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("pictures")
        .getPublicUrl(filePath);
      imageUrl = publicUrlData?.publicUrl;
    }

    const { error } = await supabase.from("marketplace_items").insert({
      user_id: user.id,
      title,
      description,
      price: parseFloat(price),
      image_url: imageUrl,
    });

    if (error) {
      console.error("Error submitting item:", error.message);
      alert("Something went wrong: " + error.message);
    } else {
      alert("Item posted!");
      router.push("/marketplace");
    }

    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
        <nav className="mb-4">
            <a
                href="../marketplace"
                className="hover:text-[#22AB39] flex items-center"
            >  
                <ArrowLeft className="inline mr-2" strokeWidth={4} size={16} />
                <span className="font-semibold">Back</span>
            </a>
        </nav>
        <h1 className="text-2xl font-bold mb-4">Post an Item for Sale</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            type="text"
            required
            placeholder="Item title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            />
            <textarea
            required
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            />
            <input
            type="number"
            required
            placeholder="Price (GH₵)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            />
            <input
            type="file"
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
                } else {
                setImageFile(null);
                setPreviewUrl(null);
                }
            }}
            className="w-full border p-2 rounded"
            />

            {previewUrl && (
            <div className="mt-2">
                <p className="text-sm mb-1">Preview:</p>
                <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-w-xs rounded border"
                />
            </div>
            )}

            <button
            type="submit"
            disabled={uploading}
            className="bg-[#22AB39] text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
            >
            {uploading ? "Posting..." : "Post Item"}
            </button>
        </form>
    </div>
  );
}
