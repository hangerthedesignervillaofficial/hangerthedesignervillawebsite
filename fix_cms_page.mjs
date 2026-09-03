import fs from 'fs';

const file = 'src/app/admin/cms/page.tsx';
const content = `"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Save, Image as ImageIcon, Type, RefreshCcw, Plus, Trash2, Upload, GripVertical } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";

export default function CMSPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Now it's an array of slides
  const [heroSlides, setHeroSlides] = useState([
    {
      id: Date.now().toString(),
      type: 'image',
      mediaUrl: '',
      title: '',
      subtitle: ''
    }
  ]);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'hero_banner')
        .single();
      
      if (data && data.value) {
        // Handle migration from single object to array
        if (Array.isArray(data.value)) {
          // Add IDs to existing slides if missing
          const slides = data.value.map(s => ({
            ...s,
            id: s.id || Math.random().toString(36).substr(2, 9)
          }));
          setHeroSlides(slides.length > 0 ? slides : heroSlides);
        } else {
          // It was a single object, convert to array
          setHeroSlides([{ ...data.value, id: Date.now().toString() }]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'hero_banner', 
          value: heroSlides,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      toast.success("CMS updated successfully! Slides are now live.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  const uploadMediaToSupabase = async (file: File): Promise<string | null> => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "video/mp4", "video/webm"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image or video (JPG, PNG, WebP, MP4, WebM)");
      return null;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB");
      return null;
    }

    const ext = file.name.split(".").pop();
    const fileName = \`hero/\${Date.now()}-\${Math.random().toString(36).slice(2)}.\${ext}\`;

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

  const handleFileUpload = async (file: File, slideId: string) => {
    setUploading(true);
    try {
      const publicUrl = await uploadMediaToSupabase(file);
      if (publicUrl) {
        updateSlide(slideId, 'mediaUrl', publicUrl);
        // Automatically guess type
        if (file.type.startsWith('video/')) {
          updateSlide(slideId, 'type', 'video');
        } else {
          updateSlide(slideId, 'type', 'image');
        }
        toast.success("Media uploaded successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const addSlide = () => {
    setHeroSlides([...heroSlides, {
      id: Date.now().toString(),
      type: 'image',
      mediaUrl: '',
      title: '',
      subtitle: ''
    }]);
  };

  const removeSlide = (id: string) => {
    if (heroSlides.length <= 1) {
      toast.error("You must have at least one slide.");
      return;
    }
    setHeroSlides(heroSlides.filter(s => s.id !== id));
  };

  const updateSlide = (id: string, field: string, value: any) => {
    setHeroSlides(heroSlides.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1810] tracking-wide mb-2">Website CMS</h1>
          <p className="font-sans text-[11px] text-[#7A6B5D] uppercase tracking-widest">
            Manage the content, banners, and layout of the live website.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading || uploading}
          className="flex items-center gap-2 bg-[#2C1810] text-[#D4AF37] px-6 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#4A0E17] transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-8">
          
          <section className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
            <div className="bg-[#FDFBF7] p-5 border-b border-[#D4AF37]/15 flex justify-between items-center">
              <h2 className="font-serif text-xl text-[#2C1810] tracking-wide flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                Hero Banner Slides
              </h2>
              <button 
                onClick={addSlide}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37] hover:text-[#4A0E17] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Slide
              </button>
            </div>
            
            <div className="divide-y divide-[#D4AF37]/10">
              {heroSlides.map((slide, index) => (
                <div key={slide.id} className="p-6 md:p-8 space-y-6 bg-white relative group">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="text-[10px] font-bold text-[#7A6B5D] bg-[#FDFBF7] border border-[#D4AF37]/20 px-2 py-1 rounded">
                      SLIDE {index + 1}
                    </span>
                    <button 
                      onClick={() => removeSlide(slide.id)}
                      className="text-red-400 hover:text-red-600 p-1 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold">Media File (Direct Upload)</label>
                        
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer flex items-center gap-2 bg-[#FDFBF7] border border-[#D4AF37]/30 hover:border-[#D4AF37] px-4 py-2 transition-colors">
                            <Upload className="w-4 h-4 text-[#D4AF37]" />
                            <span className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-[#2C1810]">
                              {uploading ? 'Uploading...' : 'Choose File'}
                            </span>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*,video/mp4,video/webm"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], slide.id);
                                }
                              }}
                              disabled={uploading}
                            />
                          </label>
                          <span className="text-[9px] text-[#7A6B5D] uppercase tracking-wider">OR PASTE URL BELOW</span>
                        </div>
                        
                        <input 
                          type="text"
                          value={slide.mediaUrl}
                          onChange={(e) => updateSlide(slide.id, 'mediaUrl', e.target.value)}
                          placeholder="https://example.com/banner.jpg"
                          className="w-full border border-[#D4AF37]/30 p-3 font-sans text-sm focus:outline-none focus:border-[#D4AF37] bg-white mt-2"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold">Media Type</label>
                        <select
                          value={slide.type}
                          onChange={(e) => updateSlide(slide.id, 'type', e.target.value)}
                          className="w-full border border-[#D4AF37]/30 p-3 font-sans text-sm focus:outline-none focus:border-[#D4AF37] bg-white"
                        >
                          <option value="image">Static Image</option>
                          <option value="video">Autoplay Video</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold flex items-center gap-1">
                          <Type className="w-3 h-3" /> Main Title
                        </label>
                        <input 
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                          className="w-full border border-[#D4AF37]/30 p-3 font-sans text-sm focus:outline-none focus:border-[#D4AF37] bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold flex items-center gap-1">
                          <Type className="w-3 h-3" /> Subtitle
                        </label>
                        <textarea 
                          rows={3}
                          value={slide.subtitle}
                          onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                          className="w-full border border-[#D4AF37]/30 p-3 font-sans text-sm focus:outline-none focus:border-[#D4AF37] bg-white resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Slide Live Preview Mini */}
                  {slide.mediaUrl && (
                    <div className="mt-4 border border-[#D4AF37]/15 p-2 bg-gray-50">
                      <div className="relative w-full aspect-[21/9] md:aspect-[16/6] bg-black overflow-hidden shadow-sm">
                        {slide.type === 'video' ? (
                          <video src={slide.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        ) : (
                          <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: \`url(\${slide.mediaUrl})\` }} />
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/20">
                          <h2 className="text-white font-serif text-2xl md:text-4xl tracking-widest uppercase mb-2 shadow-sm">
                            {slide.title || 'YOUR TITLE HERE'}
                          </h2>
                          <p className="text-white/90 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase max-w-2xl">
                            {slide.subtitle || 'Your subtitle goes here.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>

          </section>

        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(file, content);
console.log("Updated CMS page");
