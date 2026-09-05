"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Save, Image as ImageIcon, Type, RefreshCcw, Plus, Trash2, Upload } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { CategoriesCMS } from "@/components/admin/CategoriesCMS";
import { HomepageMediaCMS } from "@/components/admin/HomepageMediaCMS";
import { NavigationCMS } from "@/components/admin/NavigationCMS";

export default function CMSPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'general' | 'categories' | 'navigation' | 'media'>('navigation');
  const [generalSettings, setGeneralSettings] = useState({
    dressed_subtitle: "THE HANGER SPIRIT",
    dressed_title: "DRESSED TO MAKE AN IMPRESSION.",
    dressed_desc: "At Hanger, we believe fashion is an extension of who you are. Our collections bring together contemporary Indian elegance and timeless craftsmanship, handpicked for the modern woman who values the luxury of detail.",
    moments_subtitle: "STYLE FOR EVERY OCCASION",
    moments_title: "MOMENTS",
    moments_desc: "Discover our curated edits for your special moments."
  });
  
  // Now it's an array of slides
  const [heroSlides, setHeroSlides] = useState([
    {
      id: Date.now().toString(),
      type: 'image',
      mediaUrl: '',
      title: '',
      subtitle: '',
      showText: true
    }
  ]);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'hero_banner')
        .single();
      
      if (data && data.value) {
        // Fetch general settings as well
        const { data: generalData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "general_settings")
          .single();
          
        if (generalData && generalData.value) {
          setGeneralSettings({...generalSettings, ...generalData.value});
        }
        
        // Handle migration from single object to array
        if (Array.isArray(data.value)) {
          // Add IDs to existing slides if missing
          const slides = data.value.map((s: any) => ({
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

  async function handleSaveGeneral() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'general_settings', 
          value: generalSettings,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      toast.success("General settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save general settings.");
    } finally {
      setSaving(false);
    }
  }

  const uploadMediaToSupabase = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please upload a valid image or video file.");
      return null;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB");
      return null;
    }

    const ext = file.name.split(".").pop();
    const fileName = `hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

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
      subtitle: '',
      showText: true
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
    setHeroSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
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
          
          <div className="flex gap-4 border-b border-[#D4AF37]/20 mb-8">
            <button 
              onClick={() => setActiveTab('hero')}
              className={`pb-3 px-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase ${activeTab === 'hero' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#7A6B5D] hover:text-[#2C1810]'}`}
            >
              Hero Banner Slider
            </button>
            <button 
              onClick={() => setActiveTab('general')}
              className={`pb-3 px-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase ${activeTab === 'general' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#7A6B5D] hover:text-[#2C1810]'}`}
            >
              General Texts
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`pb-3 px-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase ${activeTab === 'categories' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#7A6B5D] hover:text-[#2C1810]'}`}
            >
              Category Table
            </button>
            <button 
              onClick={() => setActiveTab('navigation')}
              className={`pb-3 px-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase ${activeTab === 'navigation' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#7A6B5D] hover:text-[#2C1810]'}`}
            >
              Navigation Builder
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`pb-3 px-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase ${activeTab === 'media' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#7A6B5D] hover:text-[#2C1810]'}`}
            >
              Homepage Media
            </button>
          </div>

          {activeTab === 'hero' ? (
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
                              accept="image/*,video/*"
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
                            <Type className="w-3 h-3" /> Subtitle / Badge Label
                          </label>
                          <input 
                            type="text"
                            value={slide.subtitle}
                            onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                            placeholder="e.g. NEW COLLECTION"
                            className="w-full border border-[#D4AF37]/30 p-3 font-sans text-sm focus:outline-none focus:border-[#D4AF37] bg-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#7A6B5D] font-bold flex items-center gap-1">
                            <Type className="w-3 h-3" /> Body Description Text
                          </label>
                          <textarea 
                            rows={3}
                            value={(slide as any).description || ''}
                            onChange={(e) => updateSlide(slide.id, 'description', e.target.value)}
                            placeholder="Short description shown below the title..."
                            className="w-full border border-[#D4AF37]/30 p-3 font-sans text-sm focus:outline-none focus:border-[#D4AF37] bg-white resize-none"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#D4AF37]/10">
                          <input
                            type="checkbox"
                            id={`showText-${slide.id}`}
                            checked={(slide as any).showText !== false}
                            onChange={(e) => updateSlide(slide.id, 'showText', e.target.checked)}
                            className="w-4 h-4 text-[#D4AF37] border-[#D4AF37]/30 focus:ring-[#D4AF37] rounded-sm cursor-pointer accent-[#D4AF37]"
                          />
                          <label htmlFor={`showText-${slide.id}`} className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#2C1810] font-bold cursor-pointer">
                            Show text and button over this media
                          </label>
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
                          <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${slide.mediaUrl})` }} />
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
          ) : activeTab === 'general' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-serif text-2xl text-[#2C1810]">General Texts</h2>
                  <p className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-widest mt-1">Manage static text blocks across the homepage</p>
                </div>
                <button
                  onClick={handleSaveGeneral}
                  disabled={saving || loading}
                  className="bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white px-6 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Texts</>}
                </button>
              </div>

              <div className="bg-white border border-[#D4AF37]/20 p-6 space-y-6 shadow-sm">
                <h3 className="font-serif text-lg text-[#2C1810] border-b border-[#D4AF37]/10 pb-2">"Dressed To Make An Impression" Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Subtitle</label>
                    <input
                      value={generalSettings.dressed_subtitle}
                      onChange={(e) => setGeneralSettings({...generalSettings, dressed_subtitle: e.target.value})}
                      className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Title</label>
                    <input
                      value={generalSettings.dressed_title}
                      onChange={(e) => setGeneralSettings({...generalSettings, dressed_title: e.target.value})}
                      className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Description</label>
                    <textarea
                      value={generalSettings.dressed_desc}
                      onChange={(e) => setGeneralSettings({...generalSettings, dressed_desc: e.target.value})}
                      rows={3}
                      className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810] resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#D4AF37]/20 p-6 space-y-6 shadow-sm">
                <h3 className="font-serif text-lg text-[#2C1810] border-b border-[#D4AF37]/10 pb-2">"Moments" Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Subtitle</label>
                    <input
                      value={generalSettings.moments_subtitle}
                      onChange={(e) => setGeneralSettings({...generalSettings, moments_subtitle: e.target.value})}
                      className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Title</label>
                    <input
                      value={generalSettings.moments_title}
                      onChange={(e) => setGeneralSettings({...generalSettings, moments_title: e.target.value})}
                      className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'categories' ? (
            <div className="bg-white p-6 md:p-10 shadow-[0_4px_20px_rgba(212,175,55,0.05)]">
              <CategoriesCMS />
            </div>
          ) : activeTab === 'navigation' ? (
            <div className="bg-white p-6 md:p-10 shadow-[0_4px_20px_rgba(212,175,55,0.05)]">
              <NavigationCMS />
            </div>
          ) : activeTab === 'media' ? (
            <div className="bg-white p-6 md:p-10 shadow-[0_4px_20px_rgba(212,175,55,0.05)]">
              <HomepageMediaCMS />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
