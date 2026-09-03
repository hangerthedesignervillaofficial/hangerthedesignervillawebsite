import fs from 'fs';

const file = 'src/components/admin/ProductFormModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update uploadImageToSupabase to handle video uploads
content = content.replace(
  /const validTypes = \["image\/jpeg", "image\/png", "image\/webp", "image\/gif", "image\/avif"\];/,
  `const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "video/mp4", "video/webm"];`
);

content = content.replace(
  /toast.error\("Please upload a valid image \(JPG, PNG, WebP, GIF\)"\);/,
  `toast.error("Please upload a valid image or video (JPG, PNG, WebP, MP4)");`
);

content = content.replace(
  /toast.error\("Image must be under 5MB"\);/,
  `toast.error("File must be under 20MB");`
);

content = content.replace(
  /if \(file\.size > 5 \* 1024 \* 1024\) \{/,
  `if (file.size > 20 * 1024 * 1024) {`
);

// 2. Change 'product-images' bucket to 'site-assets' for videos/images OR just keep 'product-images'
// The user already has 'product-images' for products. Let's keep it.

// 3. Add videoUpload logic
content = content.replace(
  /const \[uploading, setUploading\] = useState\(false\);/,
  `const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);`
);

content = content.replace(
  /setImagePreview\(null\);\n    \}\n    setErrors\(\{\}\);\n  \}, \[product, isOpen\]\);/,
  `setImagePreview(null);
      setVideoPreview(null);
    }
    setErrors({});
  }, [product, isOpen]);`
);

content = content.replace(
  /setImagePreview\(product\.image \|\| null\);/,
  `setImagePreview(product.image || null);
      setVideoPreview(product.video_url || null);`
);

// Add handleVideoSelect
const handleVideoSelectCode = `
  const handleVideoSelect = useCallback(async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setVideoPreview(localUrl);
    setVideoUploading(true);

    try {
      const publicUrl = await uploadImageToSupabase(file);
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, video_url: publicUrl }));
        setVideoPreview(publicUrl);
        toast.success("Video uploaded successfully");
      } else {
        setVideoPreview(formData.video_url || null);
      }
    } finally {
      setVideoUploading(false);
    }
  }, [formData.video_url]);

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleVideoSelect(file);
    e.target.value = "";
  };

  const clearVideo = () => {
    setVideoPreview(null);
    setFormData((prev) => ({ ...prev, video_url: "" }));
  };
`;

content = content.replace(
  /const handleFileInputChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{/,
  `${handleVideoSelectCode}\n  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {`
);

// Add video_url to submitData
content = content.replace(
  /image: formData\.image\.trim\(\) \|\| undefined,/,
  `image: formData.image.trim() || undefined,\n        video_url: formData.video_url?.trim() || undefined,`
);

// Add video upload UI
const videoUI = `
          {/* Video Upload Zone */}
          <div>
            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
              Product Video (Optional)
            </Label>
            {videoPreview ? (
              <div className="relative group">
                <video
                  src={videoPreview}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-48 object-cover border border-[#D4AF37]/20 bg-black"
                />
                {videoUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-[10px] tracking-wider uppercase">Uploading...</span>
                    </div>
                  </div>
                )}
                {!videoUploading && (
                  <button
                    type="button"
                    onClick={clearVideo}
                    className="absolute top-2 right-2 w-7 h-7 bg-[#2C1810]/80 hover:bg-[#4A0E17] text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={() => videoInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-[#D4AF37]/25 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/3 bg-[#FFFDFC] flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-2.5 text-center px-4">
                  <div className="w-8 h-8 border border-[#D4AF37]/25 flex items-center justify-center">
                    {videoUploading ? (
                      <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#D4AF37] stroke-[1.5]" />
                    )}
                  </div>
                  <div>
                    <p className="font-sans text-[10px] font-semibold text-[#2C1810]">
                      Upload MP4 Video
                    </p>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={handleVideoInputChange}
            />
          </div>
`;

content = content.replace(
  /<div>\s*<Label className="font-sans text-\[9px\] font-bold tracking-\[0.18em\] text-\[#7A6B5D\] uppercase block mb-2">\s*Product Title/,
  `${videoUI}\n          <div>\n            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">\n              Product Title`
);

// Fix disabled states
content = content.replace(
  /disabled={loading \|\| uploading}/g,
  `disabled={loading || uploading || videoUploading}`
);

fs.writeFileSync(file, content);
console.log("Updated ProductFormModal.tsx");
