"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CreateProductData,
  ProductWithDetails,
} from "@/services/admin/adminProductService";
import { useCategories } from "@/hooks/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductData) => Promise<void>;
  product?: ProductWithDetails | null;
  title: string;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  image: string;
  video_url: string;
  stock: string;
  sku: string;
  category_id: string;
  tags: string[];
  is_bestseller: boolean;
  is_new_arrival: boolean;
  sizes: string;
  display_tags: string[];
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  title,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    image: "",
    video_url: "",
    stock: "",
    sku: "",
    category_id: "no-category",
    tags: [],
    is_bestseller: false,
    is_new_arrival: false,
    sizes: "",
    display_tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,

  } = useCategories();

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        image: product.image || "",
        video_url: product.video_url || "",
        stock: product.stock?.toString() || "",
        sku: product.sku || "",
        category_id: product.category_id?.toString() || "no-category",
        tags: product.tags || [],
        is_bestseller: product.is_bestseller || false,
        is_new_arrival: product.is_new_arrival || false,
        sizes: (product.sizes || []).join(", "),
        display_tags: product.display_tags || [],
      });
      setImagePreview(product.image || null);
      setVideoPreview(product.video_url || null);
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        image: "",
        video_url: "",
        stock: "",
        sku: "",
        category_id: "",
        tags: [],
        display_tags: [],
        is_bestseller: false,
        is_new_arrival: false,
        sizes: "",
      });
      setImagePreview(null);
      setVideoPreview(null);
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Price must be a positive number";
      }
    }
    if (!formData.stock.trim()) {
      newErrors.stock = "Stock is required";
    } else {
      const stock = parseInt(formData.stock);
      if (isNaN(stock) || stock < 0) {
        newErrors.stock = "Stock must be a non-negative number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "video/mp4", "video/webm"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image or video (JPG, PNG, WebP, MP4)");
      return null;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB");
      return null;
    }

    const ext = file.name.split(".").pop();
    const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { upsert: false });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Image upload failed. Make sure the 'product-images' bucket exists in Supabase Storage.");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return urlData?.publicUrl || null;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setUploading(true);

    try {
      const publicUrl = await uploadImageToSupabase(file);
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, image: publicUrl }));
        setImagePreview(publicUrl);
        toast.success("Image uploaded successfully");
      } else {
        setImagePreview(formData.image || null);
      }
    } finally {
      setUploading(false);
    }
  }, [formData.image]);

  
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const sizesArray = formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim()).filter((s) => s !== "")
        : [];

      const submitData: CreateProductData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: formData.image.trim() || undefined,
        video_url: formData.video_url?.trim() || undefined,
        stock: parseInt(formData.stock),
        sku: formData.sku.trim() || undefined,
        category_id:
          formData.category_id && formData.category_id !== "no-category"
            ? parseInt(formData.category_id)
            : undefined,
        tags: formData.tags,
        is_bestseller: formData.is_bestseller,
        is_new_arrival: formData.is_new_arrival,
        sizes: sizesArray,
        display_tags: formData.display_tags,
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-[#D4AF37]/20 bg-[#FDFBF7] rounded-none p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#D4AF37]/15">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-[1px] bg-[#D4AF37]" />
            <span className="text-[8px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              Admin Panel
            </span>
          </div>
          <DialogTitle
            className="font-serif text-lg text-[#2C1810] tracking-wide font-normal"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            {title}
          </DialogTitle>
          <DialogDescription className="font-sans text-[10px] text-[#7A6B5D] tracking-wide">
            {product ? "Update product details and imagery" : "Add a new product to the designer collection"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Image Upload Zone */}
          <div>
            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
              Product Image
            </Label>
            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-48 object-cover border border-[#D4AF37]/20"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-[10px] tracking-wider uppercase">Uploading...</span>
                    </div>
                  </div>
                )}
                {!uploading && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-7 h-7 bg-[#2C1810]/80 hover:bg-[#4A0E17] text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                )}
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 px-3 py-1.5 bg-[#2C1810]/80 hover:bg-[#4A0E17] text-[#D4AF37] font-sans text-[9px] font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer"
                  >
                    Change
                  </button>
                )}
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-40 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-[#D4AF37] bg-[#D4AF37]/5"
                    : "border-[#D4AF37]/25 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/3 bg-[#FFFDFC]"
                }`}
              >
                <div className="flex flex-col items-center gap-2.5 text-center px-4">
                  <div className="w-10 h-10 border border-[#D4AF37]/25 flex items-center justify-center">
                    {uploading ? (
                      <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5 text-[#D4AF37] stroke-[1.5]" />
                    )}
                  </div>
                  <div>
                    <p className="font-sans text-[11px] font-semibold text-[#2C1810]">
                      Tap to upload from Gallery
                    </p>
                    <p className="font-sans text-[9px] text-[#7A6B5D] mt-0.5">
                      or drag & drop an image here
                    </p>
                    <p className="font-sans text-[8px] text-[#7A6B5D]/60 mt-1">
                      JPG, PNG, WebP — max 5MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <div className="mt-2">
              <p className="font-sans text-[8px] text-[#7A6B5D]/60 mb-1 tracking-wide">
                Or paste an image URL:
              </p>
              <Input
                value={formData.image}
                onChange={(e) => {
                  handleInputChange("image", e.target.value);
                  setImagePreview(e.target.value || null);
                }}
                placeholder="https://example.com/image.jpg"
                className="border-b border-[#D4AF37]/20 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent h-8 px-0 text-[11px] focus-visible:ring-0 focus:border-[#D4AF37] text-[#2C1810] placeholder:text-[#7A6B5D]/30"
              />
            </div>
          </div>
          
          
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

          <div>
            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
              Product Title <span className="text-[#D4AF37]">•</span>
            </Label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g. Embroidered Silk Kurta"
              className={`border-b border-t-0 border-l-0 border-r-0 rounded-none bg-transparent h-10 px-0 text-sm focus-visible:ring-0 focus:border-[#D4AF37] text-[#2C1810] placeholder:text-[#7A6B5D]/30 ${
                errors.title ? "border-red-400" : "border-[#D4AF37]/25"
              }`}
            />
            {errors.title && <p className="mt-1 text-[10px] text-red-500">{errors.title}</p>}
          </div>

          <div>
            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
              Description <span className="text-[#D4AF37]">•</span>
            </Label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the product..."
              rows={3}
              className={`w-full bg-transparent border-b border-t-0 border-l-0 border-r-0 px-0 py-2 font-sans text-sm text-[#2C1810] placeholder:text-[#7A6B5D]/30 focus:outline-none resize-none focus:border-[#D4AF37] transition-colors ${
                errors.description ? "border-red-400" : "border-[#D4AF37]/25"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
                Price (₹) <span className="text-[#D4AF37]">•</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                className={`border-b border-t-0 border-l-0 border-r-0 rounded-none bg-transparent h-10 px-0 text-sm focus-visible:ring-0 focus:border-[#D4AF37] text-[#2C1810] placeholder:text-[#7A6B5D]/30 ${
                  errors.price ? "border-red-400" : "border-[#D4AF37]/25"
                }`}
              />
            </div>
            <div>
              <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
                Stock <span className="text-[#D4AF37]">•</span>
              </Label>
              <Input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="0"
                className={`border-b border-t-0 border-l-0 border-r-0 rounded-none bg-transparent h-10 px-0 text-sm focus-visible:ring-0 focus:border-[#D4AF37] text-[#2C1810] placeholder:text-[#7A6B5D]/30 ${
                  errors.stock ? "border-red-400" : "border-[#D4AF37]/25"
                }`}
              />
            </div>
          </div>

          <div>
            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
              Category
            </Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => handleInputChange("category_id", value ?? "")}
              disabled={categoriesLoading || !!categoriesError}
            >
              <SelectTrigger className="border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent h-10 px-0 text-sm focus:ring-0 text-[#2C1810]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-[#D4AF37]/20">
                <SelectItem value="no-category">No category</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
              Sizes (Comma separated)
            </Label>
            <Input
              value={formData.sizes}
              onChange={(e) => handleInputChange("sizes", e.target.value)}
              placeholder="e.g. XS, S, M, L, XL"
              className="border-b border-t-0 border-l-0 border-r-0 rounded-none bg-transparent h-10 px-0 text-sm focus-visible:ring-0 focus:border-[#D4AF37] text-[#2C1810] placeholder:text-[#7A6B5D]/30 border-[#D4AF37]/25"
            />
          </div>


          <div>
            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
              Display Locations
            </Label>
            <div className="flex flex-wrap gap-4 mt-3">
              {["Everyday Edit", "Festive Edit", "Occasion Edit", "Statement Edit", "The Hanger Edit"].map(tag => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.display_tags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange("display_tags", [...formData.display_tags, tag]);
                      } else {
                        handleInputChange("display_tags", formData.display_tags.filter(t => t !== tag));
                      }
                    }}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span className="font-sans text-xs text-[#2C1810]">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
              Collections
            </Label>
            <div className="flex gap-6 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.is_new_arrival}
                  onChange={(e) => handleInputChange("is_new_arrival", e.target.checked)}
                  className="accent-[#D4AF37] w-4 h-4"
                />
                <span className="font-sans text-sm text-[#2C1810]">New Arrival</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.is_bestseller}
                  onChange={(e) => handleInputChange("is_bestseller", e.target.checked)}
                  className="accent-[#D4AF37] w-4 h-4"
                />
                <span className="font-sans text-sm text-[#2C1810]">Bestseller</span>
              </label>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-[#D4AF37]/10 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || uploading || videoUploading}
              className="flex-1 rounded-none border-[#D4AF37]/25 text-[#7A6B5D] hover:border-[#D4AF37]/50 hover:text-[#2C1810] font-sans text-[9px] font-bold tracking-[0.18em] uppercase h-11 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading || videoUploading}
              className="flex-1 rounded-none bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] hover:text-white border border-[#D4AF37]/35 font-sans text-[9px] font-bold tracking-[0.18em] uppercase h-11 cursor-pointer transition-all"
            >
              {uploading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Uploading...</>
              ) : loading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Saving...</>
              ) : (
                product ? "Update Product" : "Add to Collection"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
