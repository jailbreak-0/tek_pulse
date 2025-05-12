// components/SupabaseImage.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface SupabaseImageProps {
  path: string;                // The file path within the bucket
  alt?: string;                // Alt text for the image
  bucket?: string;            // Optional: specify a different bucket
  isPublic?: boolean;         // Whether the bucket is public or private
  className?: string;         // Optional styling classes
  width?: number;        // Optional width for the image
  height?: number;       // Optional height for the image
}

const SupabaseImage = ({
  path,
  alt = "Supabase image",
  bucket = "user-uploads",
  isPublic = false,
  className = "",
  width = 300,
  height = 300,
}: SupabaseImageProps) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (isPublic) {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
        setImgUrl(url);
      } else {
        const { data } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 60); // 60 seconds signed URL

        if (data?.signedUrl) setImgUrl(data.signedUrl);
      }
    };

    fetchImageUrl();
  }, [path, bucket, isPublic]);

  return imgUrl ? (
    <Image src={imgUrl} alt={alt} className={className} width={width} height={height}/>
  ) : (
    <div className="text-sm text-gray-500">Loading image...</div>
  );
};

export default SupabaseImage;