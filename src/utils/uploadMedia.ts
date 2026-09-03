import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export const uploadMediaToSupabase = async (file: File): Promise<string | null> => {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "video/mp4", "video/webm"];
  if (!validTypes.includes(file.type)) {
    toast.error("Please upload a valid image or video (JPG, PNG, WebP, MP4, WebM)");
    return null;
  }
  if (file.size > 50 * 1024 * 1024) {
    toast.error("File must be under 50MB");
    return null;
  }

  const ext = file.name.split(".").pop();
  const fileName = `media/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("site-assets")
    .upload(fileName, file, { upsert: false });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    toast.error("Upload failed. Make sure the 'site-assets' bucket exists.");
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("site-assets")
    .getPublicUrl(fileName);

  return urlData?.publicUrl || null;
};
