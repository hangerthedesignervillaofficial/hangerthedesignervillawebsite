"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { uploadMediaToSupabase } from "@/utils/uploadMedia";
import {
  Loader2,
  Image as ImageIcon,
  Video,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Info,
  Upload,
} from "lucide-react";
import { CategoryType } from "@/types";

const HANGER_IG = "https://www.instagram.com/hanger_thedesignervilla";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function MediaPreview({ data }: { data: any }) {
  if (!data?.mediaUrl) return null;
  if (data.type === "video") {
    return (
      <video
        src={data.mediaUrl}
        className="w-full h-full object-cover"
        muted
        autoPlay
        loop
        playsInline
      />
    );
  }
  return <img src={data.mediaUrl} className="w-full h-full object-cover" alt="" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomepageMediaCMS() {
  const [mediaData, setMediaData] = useState<any>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const defaultData = {
    category_grid: [
      { id: "cat1", title: "CLOTHING", mediaUrl: "/images/clothing.jpg", type: "image", link: "/clothing" },
      { id: "cat2", title: "FOOTWEAR", mediaUrl: "/images/footwear.jpg", type: "image", link: "/footwear" },
      { id: "cat3", title: "JEWELLERY", mediaUrl: "/images/jewellery.jpg", type: "image", link: "/jewellery" },
      { id: "cat4", title: "ACCESSORIES", mediaUrl: "/images/accessories.jpg", type: "image", link: "/accessories" },
    ],
    asymmetrical: [
      { id: "asym1", title: "CLOTHING", subtitle: "CONTEMPORARY INDIAN SILHOUETTES", mediaUrl: "/images/clothing.jpg", type: "image", link: "/clothing" },
      { id: "asym2", title: "JEWELLERY", subtitle: "MAKE THE DETAIL COUNT", mediaUrl: "/images/jewellery.jpg", type: "image", link: "/jewellery" },
      { id: "asym3", title: "FOOTWEAR", subtitle: "STEP INTO SOMETHING EXTRAORDINARY", mediaUrl: "/images/footwear.jpg", type: "image", link: "/footwear" },
    ],
    moods: [
      { id: "mood1", title: "EVERYDAY EDIT", mediaUrl: "/images/clothing.jpg", type: "image", link: "/mood/everyday-edit" },
      { id: "mood2", title: "FESTIVE EDIT", mediaUrl: "/images/moments-banner.jpg", type: "image", link: "/mood/festive-edit" },
      { id: "mood3", title: "OCCASION EDIT", mediaUrl: "/images/curated-couch.jpg", type: "image", link: "/mood/occasion-edit" },
      { id: "mood4", title: "STATEMENT EDIT", mediaUrl: "/images/hero-banner.jpg", type: "image", link: "/mood/statement-edit" },
    ],
    instagram: [
      { id: "ig1", mediaUrl: "/images/instagram/instagram1.jpg", type: "image", link: HANGER_IG },
      { id: "ig2", mediaUrl: "/images/instagram/instagram2.jpg", type: "image", link: HANGER_IG },
      { id: "ig3", mediaUrl: "/images/instagram/instagram3.jpg", type: "image", link: HANGER_IG },
      { id: "ig4", mediaUrl: "/images/instagram/instagram4.jpg", type: "image", link: HANGER_IG },
    ],
    brand_story: { mediaUrl: "/images/moments-banner.jpg", type: "image" },
    moments: { mediaUrl: "/images/moments-banner.jpg", type: "image" },
    impression_portrait: { mediaUrl: "/images/clothing.jpg", type: "image" },
    impression_landscape: { mediaUrl: "/images/hero-banner.jpg", type: "image" },
    couch: { mediaUrl: "/images/curated-couch.jpg", type: "image" },
  };

  useEffect(() => {
    fetchMediaDataAndCategories();
  }, []);

  async function fetchMediaDataAndCategories() {
    try {
      setLoading(true);
      const [mediaRes, catRes] = await Promise.all([
        supabase.from("site_settings").select("*").eq("key", "homepage_media").single(),
        supabase.from("categories").select("*").order("id"),
      ]);
      setCategories(catRes.data || []);
      if (mediaRes.data?.value) {
        const saved = mediaRes.data.value;
        // Deep merge: keep defaults for any missing keys
        setMediaData({
          ...defaultData,
          ...saved,
          // Make sure instagram items always have a proper link
          instagram: (saved.instagram || defaultData.instagram).map((item: any) => ({
            ...item,
            link: item.link && item.link !== "https://instagram.com" ? item.link : HANGER_IG,
          })),
        });
      } else {
        setMediaData(defaultData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load homepage media settings.");
      setMediaData(defaultData);
    } finally {
      setLoading(false);
    }
  }

  // ── Link options ────────────────────────────────────────────────────────────
  const linkOptions = [
    { label: "Home", value: "/" },
    { label: "Shop All Products", value: "/products" },
    { label: "New Arrivals", value: "/new-arrivals" },
    { label: "Best Sellers", value: "/bestsellers" },
    { label: "About Us", value: "/about" },
    { label: "── Categories ──", value: "", disabled: true },
    { label: "Clothing", value: "/clothing" },
    { label: "Footwear", value: "/footwear" },
    { label: "Jewellery", value: "/jewellery" },
    { label: "Accessories", value: "/accessories" },
    ...categories.map((cat) => ({
      label: `↳ ${cat.name} (id:${cat.id})`,
      value: `/category/${cat.id}`,
    })),
    { label: "── Moods / Edits ──", value: "", disabled: true },
    { label: "Everyday Edit", value: "/mood/everyday-edit" },
    { label: "Festive Edit", value: "/mood/festive-edit" },
    { label: "Occasion Edit", value: "/mood/occasion-edit" },
    { label: "Statement Edit", value: "/mood/statement-edit" },
    { label: "The Hanger Edit", value: "/mood/the-hanger-edit" },
  ];

  // ── Setters ─────────────────────────────────────────────────────────────────
  const updateArrayItem = (arrKey: string, i: number, field: string, value: string) => {
    setMediaData((prev: any) => {
      const arr = [...prev[arrKey]];
      arr[i] = { ...arr[i], [field]: value };
      return { ...prev, [arrKey]: arr };
    });
  };

  const removeArrayItem = (arrKey: string, i: number) => {
    setMediaData((prev: any) => ({
      ...prev,
      [arrKey]: prev[arrKey].filter((_: any, idx: number) => idx !== i),
    }));
  };

  const addCategoryGridItem = () => {
    setMediaData((prev: any) => ({
      ...prev,
      category_grid: [
        ...prev.category_grid,
        { id: crypto.randomUUID(), title: "NEW CATEGORY", mediaUrl: "", type: "image", link: "/" },
      ],
    }));
  };

  const addInstagramItem = () => {
    setMediaData((prev: any) => ({
      ...prev,
      instagram: [
        ...prev.instagram,
        { id: crypto.randomUUID(), mediaUrl: "", type: "image", link: HANGER_IG },
      ],
    }));
  };

  // ── Upload ──────────────────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(path);
    try {
      const publicUrl = await uploadMediaToSupabase(file);
      if (publicUrl) {
        const isVideo = file.type.startsWith("video/");
        const pathParts = path.split(".");
        setMediaData((prev: any) => {
          const newData = { ...prev };
          if (pathParts.length === 1) {
            newData[pathParts[0]] = {
              ...newData[pathParts[0]],
              mediaUrl: publicUrl,
              type: isVideo ? "video" : "image",
            };
          } else if (pathParts.length === 2) {
            const arrName = pathParts[0];
            const index = parseInt(pathParts[1]);
            const newArr = [...newData[arrName]];
            newArr[index] = {
              ...newArr[index],
              mediaUrl: publicUrl,
              type: isVideo ? "video" : "image",
            };
            newData[arrName] = newArr;
          }
          return newData;
        });
        toast.success("Media uploaded!");
      }
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").upsert({
        key: "homepage_media",
        value: mediaData,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("✅ All changes saved — website is now updated live!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Sub-renderers ───────────────────────────────────────────────────────────
  const renderLinkDropdown = (
    value: string,
    onChange: (val: string) => void,
    allowCustom = false,
    isInstagram = false
  ) => (
    <div className="space-y-1.5">
      <select
        value={linkOptions.some((o) => o.value === value) ? value : "__custom__"}
        onChange={(e) => {
          if (e.target.value !== "__custom__") onChange(e.target.value);
        }}
        className="w-full text-[10px] uppercase font-bold tracking-widest border border-[#D4AF37]/30 p-2 focus:outline-none focus:border-[#D4AF37] bg-white text-[#2C1810] cursor-pointer"
      >
        <option value="">Select Destination...</option>
        {linkOptions.map((opt, idx) => (
          <option key={idx} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
        {isInstagram && (
          <option value="__custom__">Custom URL (paste below)</option>
        )}
        {!linkOptions.some((o) => o.value === value) && value && (
          <option value={value}>Current: {value}</option>
        )}
      </select>
      {isInstagram && (
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://www.instagram.com/p/PostID or Reel URL"
          className="w-full text-[11px] border border-[#D4AF37]/20 p-2 focus:outline-none focus:border-[#D4AF37] bg-white text-[#2C1810] placeholder:text-[#7A6B5D]/40"
        />
      )}
    </div>
  );

  const renderUploadField = (label: string, path: string, currentData: any) => (
    <div className="bg-white p-4 border border-[#D4AF37]/20 flex flex-col gap-3 relative">
      <div className="flex justify-between items-center">
        <span className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#2C1810]">
          {label}
        </span>
        {currentData?.type === "video" ? (
          <Video size={14} className="text-[#D4AF37]" />
        ) : (
          <ImageIcon size={14} className="text-[#D4AF37]" />
        )}
      </div>

      <div className="w-full h-28 relative bg-[#FDFBF7] overflow-hidden border border-[#D4AF37]/10">
        {currentData?.mediaUrl ? (
          <MediaPreview data={currentData} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-[#D4AF37]/40 gap-2">
            <Upload size={18} className="text-[#D4AF37]/60" />
            <span className="text-[#7A6B5D] text-[10px] uppercase tracking-widest">
              No media
            </span>
          </div>
        )}
        {uploadingField === path && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <Loader2 size={22} className="animate-spin text-[#D4AF37]" />
          </div>
        )}
      </div>

      <label
        className={`block w-full text-center py-2 px-4 border border-[#D4AF37] text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-colors ${
          uploadingField === path
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "hover:bg-[#D4AF37] hover:text-white text-[#2C1810]"
        }`}
      >
        {uploadingField === path ? "Uploading..." : "Upload Image / Video"}
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e, path)}
          disabled={uploadingField === path}
        />
      </label>

      {/* URL paste fallback */}
      <div>
        <p className="text-[9px] text-[#7A6B5D] uppercase tracking-wider mb-1">Or paste URL:</p>
        <input
          type="url"
          value={currentData?.mediaUrl || ""}
          onChange={(e) => {
            const pathParts = path.split(".");
            setMediaData((prev: any) => {
              const newData = { ...prev };
              if (pathParts.length === 1) {
                newData[pathParts[0]] = { ...newData[pathParts[0]], mediaUrl: e.target.value };
              } else if (pathParts.length === 2) {
                const arrName = pathParts[0];
                const index = parseInt(pathParts[1]);
                const newArr = [...newData[arrName]];
                newArr[index] = { ...newArr[index], mediaUrl: e.target.value };
                newData[arrName] = newArr;
              }
              return newData;
            });
          }}
          placeholder="https://..."
          className="w-full text-[10px] border border-[#D4AF37]/20 p-1.5 focus:outline-none focus:border-[#D4AF37] bg-white text-[#2C1810]"
        />
      </div>
    </div>
  );

  if (loading || !mediaData) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="animate-spin text-[#D4AF37]" size={28} />
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-14">
      {/* Sticky Save Button */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4 sticky top-0 bg-[#FDFBF7] z-10 pt-2">
        <div>
          <h2 className="font-serif text-2xl text-[#2C1810]">Homepage & Sections Media</h2>
          <p className="text-[11px] text-[#7A6B5D] font-sans mt-1">
            Upload or paste URLs for every section on the website. Save all when done.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2C1810] text-[#D4AF37] px-6 py-3 hover:bg-[#4A0E17] transition-colors disabled:opacity-50 font-sans text-[10px] uppercase tracking-widest font-bold shadow-md"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* ── 1. HERO SLIDER ─ handled in Hero tab above ── */}
      <div className="bg-[#FFF9EF] border border-[#D4AF37]/20 p-4 flex items-start gap-3">
        <Info size={14} className="text-[#D4AF37] mt-0.5 shrink-0" />
        <p className="text-[11px] font-sans text-[#7A6B5D]">
          <strong className="text-[#2C1810]">Hero Banner Slides</strong> are managed in the{" "}
          <em>Hero Slider</em> tab above. Come back here for all other sections below.
        </p>
      </div>

      {/* ── 2. CATEGORY GRID (4 photos after hero) ── */}
      <section>
        <div className="flex justify-between items-center mb-5 border-l-4 border-[#D4AF37] pl-3">
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810]">
              Category Grid — 4 Photos After Hero
            </h3>
            <p className="text-[10px] text-[#7A6B5D] font-sans mt-0.5">
              The 4 square photos (Clothing, Footwear, Jewellery, Accessories). Click a card to change its image and link.
            </p>
          </div>
          <button
            onClick={addCategoryGridItem}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] hover:text-[#2C1810] transition-colors border border-[#D4AF37]/40 px-3 py-1.5"
          >
            <Plus size={12} /> Add Tile
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaData.category_grid.map((item: any, i: number) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => removeArrayItem("category_grid", i)}
                className="absolute -top-2 -right-2 z-10 bg-white border border-[#4A0E17]/20 text-[#4A0E17] hover:bg-[#4A0E17] hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                title="Remove"
              >
                <Trash2 size={11} />
              </button>
              {renderUploadField(`${item.title || "Tile " + (i + 1)}`, `category_grid.${i}`, item)}
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateArrayItem("category_grid", i, "title", e.target.value)}
                  placeholder="Category Name"
                  className="w-full text-[11px] font-bold tracking-widest uppercase border border-[#D4AF37]/30 p-2 focus:outline-none focus:border-[#D4AF37] bg-white text-[#2C1810]"
                />
                {renderLinkDropdown(
                  item.link,
                  (val) => updateArrayItem("category_grid", i, "link", val)
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. SHOP BY MOOD ── */}
      <section>
        <div className="mb-5 border-l-4 border-[#D4AF37] pl-3">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810]">
            Shop By Mood / Edits
          </h3>
          <p className="text-[10px] text-[#7A6B5D] font-sans mt-0.5">
            Everyday Edit, Festive Edit, Occasion Edit, Statement Edit panels.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaData.moods.map((mood: any, i: number) => (
            <div key={mood.id}>
              {renderUploadField(mood.title || `Mood ${i + 1}`, `moods.${i}`, mood)}
              <div className="mt-2">
                {renderLinkDropdown(
                  mood.link,
                  (val) => updateArrayItem("moods", i, "link", val)
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. ASYMMETRICAL FEATURE GRID (3 banners above BrandStory) ── */}
      <section>
        <div className="mb-5 border-l-4 border-[#D4AF37] pl-3">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810]">
            Feature Banners — 3 Editorial Cards
          </h3>
          <p className="text-[10px] text-[#7A6B5D] font-sans mt-0.5">
            3 large editorial banners displayed before the brand story section.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaData.asymmetrical.map((item: any, i: number) => (
            <div key={item.id}>
              {renderUploadField(item.title || `Panel ${i + 1}`, `asymmetrical.${i}`, item)}
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={item.subtitle || ""}
                  onChange={(e) => updateArrayItem("asymmetrical", i, "subtitle", e.target.value)}
                  placeholder="Subtitle (e.g. CONTEMPORARY INDIAN SILHOUETTES)"
                  className="w-full text-[10px] border border-[#D4AF37]/20 p-2 focus:outline-none focus:border-[#D4AF37] bg-white text-[#2C1810] italic"
                />
                {renderLinkDropdown(
                  item.link,
                  (val) => updateArrayItem("asymmetrical", i, "link", val)
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. BRAND STORY / "THE ART OF LUXURY" SECTION ── */}
      <section>
        <div className="mb-5 border-l-4 border-[#D4AF37] pl-3">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810]">
            Brand Story — "The Art of Luxury / Curated for the Way You Live"
          </h3>
          <p className="text-[10px] text-[#7A6B5D] font-sans mt-0.5">
            The full-width dark cinematic section above Testimonials. Upload a lifestyle photo or video.
          </p>
        </div>
        <div className="max-w-sm">
          {renderUploadField("Brand Story Background", "brand_story", mediaData.brand_story)}
        </div>
      </section>

      {/* ── 6. STANDALONE SECTIONS ── */}
      <section>
        <div className="mb-5 border-l-4 border-[#D4AF37] pl-3">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810]">
            Other Page Sections
          </h3>
          <p className="text-[10px] text-[#7A6B5D] font-sans mt-0.5">
            Individual banner images used across various sections and pages.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderUploadField("Moments Banner", "moments", mediaData.moments)}
          {renderUploadField("Editorial Portrait", "impression_portrait", mediaData.impression_portrait)}
          {renderUploadField("Editorial Landscape", "impression_landscape", mediaData.impression_landscape)}
          {renderUploadField("Testimonial Couch Photo", "couch", mediaData.couch)}
        </div>
      </section>

      {/* ── 7. INSTAGRAM REELS / FEED GRID ── */}
      <section>
        <div className="flex justify-between items-center mb-5 border-l-4 border-[#D4AF37] pl-3">
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810]">
              Instagram Feed / Reels Grid
            </h3>
            <p className="text-[10px] text-[#7A6B5D] font-sans mt-0.5">
              Upload photos or videos for each Instagram slot. Set the click URL to the exact post/reel or leave as Hanger's profile.
            </p>
          </div>
          <button
            onClick={addInstagramItem}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] hover:text-[#2C1810] transition-colors border border-[#D4AF37]/40 px-3 py-1.5"
          >
            <Plus size={12} /> Add Slot
          </button>
        </div>

        {/* Profile link reminder */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-[#FFF9EF] border border-[#D4AF37]/20">
          <ExternalLink size={13} className="text-[#D4AF37] shrink-0" />
          <p className="text-[10px] font-sans text-[#7A6B5D]">
            Default link:{" "}
            <a
              href={HANGER_IG}
              target="_blank"
              className="text-[#D4AF37] underline font-bold"
            >
              @hanger_thedesignervilla
            </a>{" "}
            — Set a specific Reel/Post URL below for each slot to link directly to that content.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaData.instagram.map((item: any, i: number) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => removeArrayItem("instagram", i)}
                className="absolute -top-2 -right-2 z-10 bg-white border border-[#4A0E17]/20 text-[#4A0E17] hover:bg-[#4A0E17] hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                title="Remove"
              >
                <Trash2 size={11} />
              </button>
              {renderUploadField(`Reel / Post ${i + 1}`, `instagram.${i}`, item)}
              <div className="mt-2">
                <p className="text-[9px] font-sans text-[#7A6B5D] uppercase tracking-wider mb-1">
                  Click URL (Instagram Reel or Post):
                </p>
                <input
                  type="url"
                  value={item.link || HANGER_IG}
                  onChange={(e) => updateArrayItem("instagram", i, "link", e.target.value)}
                  placeholder="https://www.instagram.com/reel/XYZ..."
                  className="w-full text-[10px] border border-[#D4AF37]/20 p-2 focus:outline-none focus:border-[#D4AF37] bg-white text-[#2C1810]"
                />
                <button
                  type="button"
                  onClick={() => updateArrayItem("instagram", i, "link", HANGER_IG)}
                  className="mt-1 text-[9px] text-[#7A6B5D] hover:text-[#D4AF37] underline cursor-pointer"
                >
                  ↺ Reset to Hanger's Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Save */}
      <div className="pt-8 border-t border-[#D4AF37]/20 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2C1810] text-[#D4AF37] px-10 py-3.5 hover:bg-[#4A0E17] transition-colors disabled:opacity-50 font-sans text-[10px] uppercase tracking-widest font-bold shadow-lg"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
