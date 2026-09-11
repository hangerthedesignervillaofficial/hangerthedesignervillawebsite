"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreateProductData,
  ProductWithDetails,
} from "@/services/admin/adminProductService";
import { useCategories } from "@/hooks/queries";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Upload,
  X,
  Loader2,
  Check,
  Sparkles,
  Gem,
  Tag,
  ShoppingBag,
  Film,
  Layers,
  Info,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

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
  gallery: string[];
  video_url: string;
  stock: string;
  sku: string;
  category_id: string;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  sizes: string[];
  display_tags: string[];
  fabric_fit: string;
  shipping_returns: string;
}

const DEFAULT_CATEGORIES = [
  { id: 1, name: "CLOTHING", description: "Luxury clothing" },
  { id: 2, name: "FOOTWEAR", description: "Premium footwear" },
  { id: 3, name: "JEWELLERY", description: "Fine jewellery" },
  { id: 5, name: "ACCESSORIES", description: "Premium accessories" },
];

const AVAILABLE_SIZES = [
  "Free Size",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "36 (S)",
  "37 (M)",
  "38 (L)",
  "39 (XL)",
  "40 (XXL)",
];

const DISPLAY_TAGS = [
  "Everyday Edit",
  "Festive Edit",
  "Occasion Edit",
  "Statement Edit",
  "The Hanger Edit",
];

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
    gallery: [],
    video_url: "",
    stock: "",
    sku: "",
    category_id: "no-category",
    is_bestseller: false,
    is_new_arrival: false,
    sizes: [],
    display_tags: [],
    fabric_fit: "",
    shipping_returns: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { data: fetchedCategories, isLoading: categoriesLoading } = useCategories();

  // Unified categories list: combine fetched with guaranteed defaults so list is never empty
  const categoriesList = useMemo(() => {
    if (fetchedCategories && fetchedCategories.length > 0) {
      return fetchedCategories;
    }
    return DEFAULT_CATEGORIES;
  }, [fetchedCategories]);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price !== undefined && product.price !== null ? product.price.toString() : "",
        image: product.image || "",
        gallery: Array.isArray(product.gallery) ? product.gallery : [],
        video_url: product.video_url || "",
        stock: product.stock !== undefined && product.stock !== null ? product.stock.toString() : "",
        sku: product.sku || "",
        category_id: product.category_id ? product.category_id.toString() : "no-category",
        is_bestseller: !!product.is_bestseller,
        is_new_arrival: !!product.is_new_arrival,
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
        display_tags: Array.isArray(product.display_tags) ? product.display_tags : [],
        fabric_fit: product.fabric_fit || "",
        shipping_returns: product.shipping_returns || "",
      });
      setImagePreview(product.image || null);
      setVideoPreview(product.video_url || null);
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        image: "",
        gallery: [],
        video_url: "",
        stock: "",
        sku: "",
        category_id: "no-category",
        is_bestseller: false,
        is_new_arrival: false,
        sizes: [],
        display_tags: [],
        fabric_fit: "",
        shipping_returns: "",
      });
      setImagePreview(null);
      setVideoPreview(null);
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Enter a valid positive price";
      }
    }
    if (!formData.stock.trim()) {
      newErrors.stock = "Stock quantity is required";
    } else {
      const stock = parseInt(formData.stock, 10);
      if (isNaN(stock) || stock < 0) {
        newErrors.stock = "Enter a valid non-negative stock count";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
      "video/mp4",
      "video/webm",
    ];
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
      toast.error("Upload failed. Ensure Supabase storage bucket 'product-images' is active.");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return urlData?.publicUrl || null;
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
      setUploading(true);

      try {
        const publicUrl = await uploadImageToSupabase(file);
        if (publicUrl) {
          setFormData((prev) => ({ ...prev, image: publicUrl }));
          setImagePreview(publicUrl);
          toast.success("Hero image updated successfully");
        } else {
          setImagePreview(formData.image || null);
        }
      } finally {
        setUploading(false);
      }
    },
    [formData.image]
  );

  const handleVideoSelect = useCallback(
    async (file: File) => {
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
    },
    [formData.video_url]
  );

  const handleGalleryFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setGalleryUploading(true);
    try {
      const uploadPromises = files.map((file) => uploadImageToSupabase(file));
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);

      if (validUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...validUrls],
        }));
        toast.success(`${validUrls.length} image(s) added to gallery`);
      }
    } finally {
      setGalleryUploading(false);
      e.target.value = "";
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove),
    }));
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

  const clearVideo = () => {
    setVideoPreview(null);
    setFormData((prev) => ({ ...prev, video_url: "" }));
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const toggleDisplayTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.display_tags.includes(tag);
      return {
        ...prev,
        display_tags: exists
          ? prev.display_tags.filter((t) => t !== tag)
          : [...prev.display_tags, tag],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    setLoading(true);
    try {
      // Parse category: if numeric string, parse to number; if "no-category" or empty, send null
      const resolvedCategoryId =
        formData.category_id &&
        formData.category_id !== "no-category" &&
        formData.category_id !== ""
          ? parseInt(formData.category_id, 10)
          : null;

      const submitData: CreateProductData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: formData.image.trim() || undefined,
        gallery: formData.gallery.length > 0 ? formData.gallery : undefined,
        video_url: formData.video_url?.trim() || undefined,
        stock: parseInt(formData.stock, 10),
        sku: formData.sku.trim() || undefined,
        category_id: resolvedCategoryId,
        is_bestseller: formData.is_bestseller,
        is_new_arrival: formData.is_new_arrival,
        sizes: formData.sizes,
        display_tags: formData.display_tags,
        fabric_fit: formData.fabric_fit.trim() || undefined,
        shipping_returns: formData.shipping_returns.trim() || undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Find currently selected category object for visual highlight
  const currentCategory = useMemo(() => {
    if (!formData.category_id || formData.category_id === "no-category") return null;
    return categoriesList.find((c) => c.id.toString() === formData.category_id.toString());
  }, [formData.category_id, categoriesList]);

  const getCategoryIcon = (catName: string) => {
    const upper = catName.toUpperCase();
    if (upper.includes("CLOTH")) return <ShirtIcon className="w-4 h-4" />;
    if (upper.includes("JEWEL")) return <Gem className="w-4 h-4" />;
    if (upper.includes("FOOT")) return <Sparkles className="w-4 h-4" />;
    if (upper.includes("ACCESS")) return <ShoppingBag className="w-4 h-4" />;
    return <Tag className="w-4 h-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[96vw] max-w-[96vw] sm:max-w-3xl md:max-w-4xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col gap-0 p-0 bg-[#FDFBF7] border border-[#D4AF37]/30 shadow-2xl rounded-none overflow-hidden"
      >
        {/* Sticky Luxury Header */}
        <DialogHeader className="px-5 sm:px-8 py-4 pr-12 border-b border-[#D4AF37]/20 bg-[#FAF7F2] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-[1px] bg-[#D4AF37]" />
                <span className="text-[9px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                  Hanger Atelier • Admin Suite
                </span>
              </div>
              <DialogTitle
                className="font-serif text-xl sm:text-2xl text-[#2C1810] tracking-wide font-normal"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                {title}
              </DialogTitle>
              <DialogDescription className="font-sans text-[11px] text-[#7A6B5D] tracking-wide mt-0.5">
                {product
                  ? `Editing: "${product.title}" — SKU: ${product.sku || "N/A"}`
                  : "Add a bespoke luxury item to the curated collection"}
              </DialogDescription>
            </div>
            {currentCategory && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#2C1810] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-sans tracking-widest uppercase shadow-sm">
                <Check className="w-3 h-3 text-[#D4AF37]" />
                <span>{currentCategory.name}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form
          id="product-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-8 scrollbar-thin scrollbar-thumb-[#D4AF37]/30"
        >
          {/* SECTION 1: PRODUCT IDENTITY */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[#D4AF37]/15">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <h3 className="font-serif text-sm font-medium tracking-wider text-[#2C1810] uppercase">
                1. Product Identity & Pricing
              </h3>
            </div>

            <div>
              <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                Product Title <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. Royal Emerald Zari Embroidered Festive Suit"
                className={`border bg-white h-11 px-3 text-sm text-[#2C1810] rounded-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] placeholder:text-[#7A6B5D]/40 ${
                  errors.title ? "border-red-400" : "border-[#D4AF37]/25"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-[11px] text-red-500 font-sans">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                  Price (₹ INR) <span className="text-[#D4AF37]">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-sans font-semibold text-[#D4AF37] text-sm">
                    ₹
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="2499.00"
                    className={`pl-8 bg-white h-11 text-sm text-[#2C1810] rounded-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                      errors.price ? "border-red-400" : "border-[#D4AF37]/25"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-[11px] text-red-500 font-sans">{errors.price}</p>
                )}
              </div>

              <div>
                <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                  Stock Units <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="25"
                  className={`bg-white h-11 text-sm text-[#2C1810] rounded-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                    errors.stock ? "border-red-400" : "border-[#D4AF37]/25"
                  }`}
                />
                {errors.stock && (
                  <p className="mt-1 text-[11px] text-red-500 font-sans">{errors.stock}</p>
                )}
              </div>

              <div>
                <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                  SKU Identifier
                </Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value.toUpperCase())}
                  placeholder="HGR-SLK-001"
                  className="bg-white h-11 text-sm text-[#2C1810] rounded-none border-[#D4AF37]/25 focus-visible:ring-1 focus-visible:ring-[#D4AF37] uppercase tracking-wider"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: CATEGORY & TAXONOMY (PRIMARY FIX) */}
          <div className="space-y-4 p-4 sm:p-5 bg-[#FAF7F2] border border-[#D4AF37]/25 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D4AF37]/15">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif text-sm font-semibold tracking-wider text-[#2C1810] uppercase">
                  2. Category Classification
                </h3>
              </div>
              <span className="text-[10px] font-sans text-[#7A6B5D] tracking-wide">
                Tap a luxury card or select from the dropdown below
              </span>
            </div>

            {/* Interactive Luxury Category Cards */}
            <div>
              <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
                Select Luxury Category
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {categoriesList.map((cat) => {
                  const isSelected = formData.category_id === cat.id.toString();
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleInputChange("category_id", cat.id.toString())}
                      className={`relative flex flex-col items-center justify-center p-3.5 transition-all duration-200 border cursor-pointer text-center group ${
                        isSelected
                          ? "bg-[#2C1810] border-[#D4AF37] text-white shadow-md ring-1 ring-[#D4AF37]"
                          : "bg-white border-[#D4AF37]/25 text-[#2C1810] hover:border-[#D4AF37]/70 hover:bg-[#FDFBF7]"
                      }`}
                    >
                      {/* Check badge when selected */}
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#D4AF37] text-[#2C1810] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}

                      <div
                        className={`mb-1.5 transition-transform duration-200 group-hover:scale-110 ${
                          isSelected ? "text-[#D4AF37]" : "text-[#7A6B5D]"
                        }`}
                      >
                        {getCategoryIcon(cat.name)}
                      </div>
                      <span className="font-sans text-xs font-bold tracking-widest uppercase">
                        {cat.name}
                      </span>
                      {cat.description && (
                        <span
                          className={`text-[9px] font-sans mt-0.5 line-clamp-1 ${
                            isSelected ? "text-[#D4AF37]/80" : "text-[#7A6B5D]/60"
                          }`}
                        >
                          {cat.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reset to unassigned button */}
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleInputChange("category_id", "no-category")}
                  className={`text-[10px] font-sans tracking-wider uppercase underline transition-colors ${
                    formData.category_id === "no-category"
                      ? "text-[#4A0E17] font-bold"
                      : "text-[#7A6B5D] hover:text-[#2C1810]"
                  }`}
                >
                  {formData.category_id === "no-category" ? "✓ No Category Assigned" : "Clear Category (Unassigned)"}
                </button>
                {categoriesLoading && (
                  <span className="text-[10px] text-[#D4AF37] flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Syncing categories...
                  </span>
                )}
              </div>
            </div>

            {/* Synchronized Native Luxury Dropdown for 100% Mobile & Laptop Reliability */}
            <div className="pt-2 border-t border-[#D4AF37]/10">
              <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                Category Dropdown
              </Label>
              <div className="relative">
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange("category_id", e.target.value)}
                  className="w-full bg-white border border-[#D4AF37]/30 h-11 px-3 text-sm text-[#2C1810] font-sans tracking-wide rounded-none focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] cursor-pointer appearance-none"
                >
                  <option value="no-category">No Category (Unassigned)</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                      {cat.name} {cat.description ? `— ${cat.description}` : ""}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37]">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: MEDIA & VISUALS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[#D4AF37]/15">
              <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
              <h3 className="font-serif text-sm font-medium tracking-wider text-[#2C1810] uppercase">
                3. Imagery & Media
              </h3>
            </div>

            {/* Hero Image */}
            <div>
              <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                Primary Masterpiece Image
              </Label>
              {imagePreview ? (
                <div className="relative group border border-[#D4AF37]/30 bg-black/5 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Hero Preview"
                    className="w-full h-56 object-contain bg-[#1A1A1A]"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white gap-2">
                      <Loader2 className="w-7 h-7 animate-spin text-[#D4AF37]" />
                      <span className="font-sans text-[11px] tracking-widest uppercase">
                        Uploading to Supabase...
                      </span>
                    </div>
                  )}
                  {!uploading && (
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#2C1810]/90 hover:bg-[#4A0E17] text-[#D4AF37] font-sans text-[9px] font-bold tracking-[0.15em] uppercase transition-colors"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="w-8 h-8 bg-[#2C1810]/90 hover:bg-[#4A0E17] text-white flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-44 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-[#D4AF37]/30 hover:border-[#D4AF37] bg-white hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-center px-4">
                    <div className="w-10 h-10 border border-[#D4AF37]/40 flex items-center justify-center bg-[#FDFBF7]">
                      {uploading ? (
                        <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5 text-[#D4AF37]" />
                      )}
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold text-[#2C1810]">
                        Click to upload hero image or drag & drop here
                      </p>
                      <p className="font-sans text-[10px] text-[#7A6B5D] mt-0.5">
                        High resolution JPG, PNG, or WebP (max 20MB)
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
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                  e.target.value = "";
                }}
              />

              {/* Direct URL input fallback */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-sans text-[#7A6B5D] shrink-0">Or Image URL:</span>
                <Input
                  value={formData.image}
                  onChange={(e) => {
                    handleInputChange("image", e.target.value);
                    setImagePreview(e.target.value || null);
                  }}
                  placeholder="https://..."
                  className="h-8 text-xs bg-white rounded-none border-[#D4AF37]/25"
                />
              </div>
            </div>

            {/* Gallery Multi-Photos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase">
                  Additional Gallery Images ({formData.gallery.length})
                </Label>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={galleryUploading}
                  className="text-[10px] font-sans font-bold text-[#D4AF37] hover:text-[#2C1810] tracking-widest uppercase flex items-center gap-1 cursor-pointer"
                >
                  {galleryUploading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </>
                  ) : (
                    "+ Add Gallery Photos"
                  )}
                </button>
              </div>

              {formData.gallery.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {formData.gallery.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square bg-[#f4f0ea] border border-[#D4AF37]/25 overflow-hidden"
                    >
                      <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 bg-[#2C1810]/90 hover:bg-[#4A0E17] text-white flex items-center justify-center transition-opacity opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37] bg-white flex flex-col items-center justify-center cursor-pointer text-center p-2 hover:bg-[#FAF7F2] transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#D4AF37] mb-1" />
                    <span className="text-[9px] font-sans font-bold tracking-wider text-[#7A6B5D] uppercase">
                      + Add
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full h-20 border-2 border-dashed border-[#D4AF37]/25 hover:border-[#D4AF37] bg-white flex items-center justify-center cursor-pointer gap-2 hover:bg-[#FAF7F2] transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-sans text-xs font-medium text-[#7A6B5D]">
                    Upload multiple showcase photos for product gallery
                  </span>
                </div>
              )}

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryFileInputChange}
              />
            </div>

            {/* Video Showcase (Optional) */}
            <div>
              <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                Product Video Reel (Optional)
              </Label>
              {videoPreview ? (
                <div className="relative group border border-[#D4AF37]/30 bg-black overflow-hidden max-h-52">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-48 object-cover mx-auto"
                  />
                  <button
                    type="button"
                    onClick={clearVideo}
                    className="absolute top-2 right-2 w-7 h-7 bg-[#2C1810]/90 hover:bg-[#4A0E17] text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full h-20 border-2 border-dashed border-[#D4AF37]/25 hover:border-[#D4AF37] bg-white flex items-center justify-center cursor-pointer gap-2 hover:bg-[#FAF7F2] transition-colors"
                >
                  {videoUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  ) : (
                    <Film className="w-4 h-4 text-[#D4AF37]" />
                  )}
                  <span className="font-sans text-xs font-medium text-[#7A6B5D]">
                    {videoUploading ? "Uploading video..." : "Upload MP4 / WebM video reel"}
                  </span>
                </div>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleVideoSelect(f);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          {/* SECTION 4: CURATED EDITS & HIGHLIGHTS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[#D4AF37]/15">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <h3 className="font-serif text-sm font-medium tracking-wider text-[#2C1810] uppercase">
                4. Collections & Editorial Placements
              </h3>
            </div>

            {/* New Arrival & Bestseller Luxury Toggle Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange("is_new_arrival", !formData.is_new_arrival)}
                className={`flex items-center justify-between p-3.5 border transition-all cursor-pointer ${
                  formData.is_new_arrival
                    ? "bg-[#2C1810] border-[#D4AF37] text-white ring-1 ring-[#D4AF37]"
                    : "bg-white border-[#D4AF37]/25 text-[#2C1810] hover:border-[#D4AF37]/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      formData.is_new_arrival ? "bg-[#D4AF37] text-[#2C1810]" : "border border-[#D4AF37]"
                    }`}
                  >
                    {formData.is_new_arrival && "✓"}
                  </span>
                  <div className="text-left">
                    <p className="font-sans text-xs font-bold tracking-widest uppercase">
                      New Arrival Tag
                    </p>
                    <p
                      className={`text-[9px] font-sans ${
                        formData.is_new_arrival ? "text-[#D4AF37]" : "text-[#7A6B5D]"
                      }`}
                    >
                      Featured in latest seasonal arrivals
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-sans font-bold uppercase px-2 py-0.5 border ${
                    formData.is_new_arrival
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-gray-200 text-gray-400"
                  }`}
                >
                  {formData.is_new_arrival ? "ACTIVE" : "OFF"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange("is_bestseller", !formData.is_bestseller)}
                className={`flex items-center justify-between p-3.5 border transition-all cursor-pointer ${
                  formData.is_bestseller
                    ? "bg-[#2C1810] border-[#D4AF37] text-white ring-1 ring-[#D4AF37]"
                    : "bg-white border-[#D4AF37]/25 text-[#2C1810] hover:border-[#D4AF37]/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      formData.is_bestseller ? "bg-[#D4AF37] text-[#2C1810]" : "border border-[#D4AF37]"
                    }`}
                  >
                    {formData.is_bestseller && "✓"}
                  </span>
                  <div className="text-left">
                    <p className="font-sans text-xs font-bold tracking-widest uppercase">
                      Bestseller Tag
                    </p>
                    <p
                      className={`text-[9px] font-sans ${
                        formData.is_bestseller ? "text-[#D4AF37]" : "text-[#7A6B5D]"
                      }`}
                    >
                      Featured in most coveted luxury pieces
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-sans font-bold uppercase px-2 py-0.5 border ${
                    formData.is_bestseller
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-gray-200 text-gray-400"
                  }`}
                >
                  {formData.is_bestseller ? "ACTIVE" : "OFF"}
                </span>
              </button>
            </div>

            {/* Display Locations / Editorial Edits */}
            <div>
              <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
                Display Edits & Collections
              </Label>
              <div className="flex flex-wrap gap-2">
                {DISPLAY_TAGS.map((tag) => {
                  const active = formData.display_tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDisplayTag(tag)}
                      className={`px-3.5 py-1.5 text-xs font-sans font-medium tracking-wide transition-all border cursor-pointer ${
                        active
                          ? "bg-[#2C1810] border-[#D4AF37] text-[#D4AF37] shadow-sm font-semibold"
                          : "bg-white border-[#D4AF37]/25 text-[#7A6B5D] hover:border-[#D4AF37]/70"
                      }`}
                    >
                      {active ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 5: SIZES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[#D4AF37]/15">
              <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
              <h3 className="font-serif text-sm font-medium tracking-wider text-[#2C1810] uppercase">
                5. Available Sizes
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((sz) => {
                const isSelected = formData.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`min-w-[54px] px-3 py-2 text-xs font-sans tracking-wider uppercase transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-[#2C1810] text-[#D4AF37] border-[#D4AF37] font-bold shadow-sm"
                        : "bg-white text-[#2C1810] border-[#D4AF37]/25 hover:border-[#D4AF37]"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 6: DESCRIPTIONS & POLICIES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[#D4AF37]/15">
              <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
              <h3 className="font-serif text-sm font-medium tracking-wider text-[#2C1810] uppercase">
                6. Details, Specifications & Care
              </h3>
            </div>

            <div>
              <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                Product Story & Description <span className="text-[#D4AF37]">*</span>
              </Label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the fabric, craft, embroidery, silhouette, and story behind this masterpiece..."
                className={`w-full p-3 bg-white text-sm text-[#2C1810] border rounded-none focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] ${
                  errors.description ? "border-red-400" : "border-[#D4AF37]/25"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-[11px] text-red-500 font-sans">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                  Fabric & Fit Specifications
                </Label>
                <textarea
                  rows={3}
                  value={formData.fabric_fit}
                  onChange={(e) => handleInputChange("fabric_fit", e.target.value)}
                  placeholder="e.g. Pure Mulberry Silk, Relaxed royal fit, Dry Clean only..."
                  className="w-full p-3 bg-white text-sm text-[#2C1810] border border-[#D4AF37]/25 rounded-none focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <Label className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                  Shipping & Return Policy
                </Label>
                <textarea
                  rows={3}
                  value={formData.shipping_returns}
                  onChange={(e) => handleInputChange("shipping_returns", e.target.value)}
                  placeholder="e.g. Dispatched in 2-3 business days. 7-day complimentary return & exchange..."
                  className="w-full p-3 bg-white text-sm text-[#2C1810] border border-[#D4AF37]/25 rounded-none focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Luxury Footer (Always visible on mobile & desktop) */}
        <div className="px-4 sm:px-8 py-3.5 bg-[#FAF7F2] border-t border-[#D4AF37]/20 flex items-center justify-between gap-3 shrink-0">
          <div className="hidden sm:block text-[11px] font-sans text-[#7A6B5D]">
            {formData.category_id && formData.category_id !== "no-category" ? (
              <span className="flex items-center gap-1.5 text-[#2C1810]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                Category: <strong>{currentCategory?.name || formData.category_id}</strong>
              </span>
            ) : (
              <span className="text-[#7A6B5D]/60 italic">No category assigned yet</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || uploading || galleryUploading || videoUploading}
              className="flex-1 sm:flex-none px-6 h-11 rounded-none border-[#D4AF37]/30 text-[#7A6B5D] hover:text-[#2C1810] hover:border-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="product-form"
              disabled={loading || uploading || galleryUploading || videoUploading}
              className="flex-1 sm:flex-none px-8 h-11 rounded-none bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] hover:text-white border border-[#D4AF37]/50 font-sans text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all shadow-md active:translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : product ? (
                "Update Product"
              ) : (
                "Add to Collection"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Fallback shirt icon component for luxury styling
function ShirtIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
    </svg>
  );
}
