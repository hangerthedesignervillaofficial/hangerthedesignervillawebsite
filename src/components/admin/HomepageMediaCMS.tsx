"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { uploadMediaToSupabase } from "@/utils/uploadMedia";
import { Loader2, Image as ImageIcon, Video, Save } from "lucide-react";

export function HomepageMediaCMS() {
  const [mediaData, setMediaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const defaultData = {
    category_grid: [
      { id: 'cat1', title: 'CLOTHING', mediaUrl: '/images/clothing.jpg', type: 'image', link: '/clothing' },
      { id: 'cat2', title: 'FOOTWEAR', mediaUrl: '/images/footwear.jpg', type: 'image', link: '/footwear' },
      { id: 'cat3', title: 'JEWELLERY', mediaUrl: '/images/jewellery.jpg', type: 'image', link: '/jewellery' },
      { id: 'cat4', title: 'ACCESSORIES', mediaUrl: '/images/accessories.jpg', type: 'image', link: '/accessories' }
    ],
    asymmetrical: [
      { id: 'asym1', title: 'CLOTHING', subtitle: 'CONTEMPORARY INDIAN SILHOUETTES', mediaUrl: '/images/clothing.jpg', type: 'image', link: '/clothing' },
      { id: 'asym2', title: 'JEWELLERY', subtitle: 'MAKE THE DETAIL COUNT', mediaUrl: '/images/jewellery.jpg', type: 'image', link: '/jewellery' },
      { id: 'asym3', title: 'FOOTWEAR', subtitle: 'STEP INTO SOMETHING EXTRAORDINARY', mediaUrl: '/images/footwear.jpg', type: 'image', link: '/footwear' }
    ],
    moods: [
      { id: 'mood1', title: 'EVERYDAY EDIT', mediaUrl: '/images/clothing.jpg', type: 'image', link: '/mood/everyday-edit' },
      { id: 'mood2', title: 'FESTIVE EDIT', mediaUrl: '/images/moments-banner.jpg', type: 'image', link: '/mood/festive-edit' },
      { id: 'mood3', title: 'OCCASION EDIT', mediaUrl: '/images/curated-couch.jpg', type: 'image', link: '/mood/occasion-edit' },
      { id: 'mood4', title: 'STATEMENT EDIT', mediaUrl: '/images/hero-banner.jpg', type: 'image', link: '/mood/statement-edit' }
    ],
    instagram: [
      { id: 'ig1', mediaUrl: '/images/instagram/instagram1.jpg', type: 'image', link: 'https://instagram.com' },
      { id: 'ig2', mediaUrl: '/images/instagram/instagram2.jpg', type: 'image', link: 'https://instagram.com' },
      { id: 'ig3', mediaUrl: '/images/instagram/instagram3.jpg', type: 'image', link: 'https://instagram.com' },
      { id: 'ig4', mediaUrl: '/images/instagram/instagram4.jpg', type: 'image', link: 'https://instagram.com' },
      { id: 'ig5', mediaUrl: '/images/instagram/instagram1.jpg', type: 'image', link: 'https://instagram.com' },
      { id: 'ig6', mediaUrl: '/images/instagram/instagram2.jpg', type: 'image', link: 'https://instagram.com' }
    ],
    moments: { mediaUrl: '/images/moments-banner.jpg', type: 'image' },
    impression_portrait: { mediaUrl: '/images/clothing.jpg', type: 'image' },
    impression_landscape: { mediaUrl: '/images/hero-banner.jpg', type: 'image' },
    couch: { mediaUrl: '/images/curated-couch.jpg', type: 'image' }
  };

  useEffect(() => {
    fetchMediaData();
  }, []);

  async function fetchMediaData() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'homepage_media')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.value) {
        setMediaData({ ...defaultData, ...data.value });
      } else {
        setMediaData(defaultData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load homepage media settings.");
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
          key: 'homepage_media', 
          value: mediaData,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      toast.success("Homepage media saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save homepage media.");
    } finally {
      setSaving(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(path);
    try {
      const publicUrl = await uploadMediaToSupabase(file);
      if (publicUrl) {
        const isVideo = file.type.startsWith('video/');
        
        // Path can be a direct key like 'moments' or an array item like 'category_grid.0'
        const pathParts = path.split('.');
        
        setMediaData((prev: any) => {
          const newData = { ...prev };
          if (pathParts.length === 1) {
            newData[pathParts[0]] = { ...newData[pathParts[0]], mediaUrl: publicUrl, type: isVideo ? 'video' : 'image' };
          } else if (pathParts.length === 2) {
            const arrName = pathParts[0];
            const index = parseInt(pathParts[1]);
            const newArr = [...newData[arrName]];
            newArr[index] = { ...newArr[index], mediaUrl: publicUrl, type: isVideo ? 'video' : 'image' };
            newData[arrName] = newArr;
          }
          return newData;
        });
      }
    } finally {
      setUploadingField(null);
    }
  };

  if (loading || !mediaData) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#D4AF37]" /></div>;
  }

  const renderUploadField = (label: string, path: string, currentData: any) => (
    <div className="bg-white p-4 border border-[#D4AF37]/20 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#2C1810]">{label}</span>
        {currentData?.type === 'video' ? <Video size={16} className="text-[#D4AF37]" /> : <ImageIcon size={16} className="text-[#D4AF37]" />}
      </div>
      
      {currentData?.mediaUrl ? (
        <div className="w-full h-32 relative bg-gray-100 overflow-hidden border border-[#D4AF37]/10">
          {currentData.type === 'video' ? (
            <video src={currentData.mediaUrl} className="w-full h-full object-cover" muted autoPlay loop playsInline />
          ) : (
            <img src={currentData.mediaUrl} className="w-full h-full object-cover" alt={label} />
          )}
        </div>
      ) : (
        <div className="w-full h-32 bg-[#FDFBF7] flex items-center justify-center border border-dashed border-[#D4AF37]/40">
          <span className="text-[#7A6B5D] text-xs">No media uploaded</span>
        </div>
      )}

      <div>
        <label className={`block w-full text-center py-2 px-4 border border-[#D4AF37] text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-colors ${uploadingField === path ? 'bg-gray-100 text-gray-400' : 'hover:bg-[#D4AF37] hover:text-white text-[#2C1810]'}`}>
          {uploadingField === path ? 'Uploading...' : 'Upload Media'}
          <input 
            type="file" 
            accept="image/*,video/*" 
            className="hidden" 
            onChange={(e) => handleFileUpload(e, path)}
            disabled={uploadingField === path}
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-4">
        <h2 className="font-serif text-2xl text-[#2C1810]">Homepage Media Sections</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2C1810] text-[#D4AF37] px-6 py-2 hover:bg-[#1A0A0E] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span className="text-xs uppercase tracking-widest font-bold">Save All</span>
        </button>
      </div>

      <section>
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810] mb-4 border-l-2 border-[#D4AF37] pl-3">Standalone Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderUploadField("Moments Banner", "moments", mediaData.moments)}
          {renderUploadField("Editorial (Portrait)", "impression_portrait", mediaData.impression_portrait)}
          {renderUploadField("Editorial (Landscape)", "impression_landscape", mediaData.impression_landscape)}
          {renderUploadField("Testimonial Couch", "couch", mediaData.couch)}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810] mb-4 border-l-2 border-[#D4AF37] pl-3">Shop By Mood</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaData.moods.map((mood: any, i: number) => (
            <div key={mood.id}>
              {renderUploadField(mood.title, `moods.${i}`, mood)}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810] mb-4 border-l-2 border-[#D4AF37] pl-3">Asymmetrical Feature Grid</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaData.asymmetrical.map((item: any, i: number) => (
            <div key={item.id}>
              {renderUploadField(item.title, `asymmetrical.${i}`, item)}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810] mb-4 border-l-2 border-[#D4AF37] pl-3">Category Grid (4 items)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaData.category_grid.map((item: any, i: number) => (
            <div key={item.id}>
              {renderUploadField(item.title, `category_grid.${i}`, item)}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#2C1810] mb-4 border-l-2 border-[#D4AF37] pl-3">Instagram Grid</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mediaData.instagram.map((item: any, i: number) => (
            <div key={item.id}>
              {renderUploadField(`Slot ${i+1}`, `instagram.${i}`, item)}
            </div>
          ))}
        </div>
      </section>

      <div className="pt-8 border-t border-[#D4AF37]/20 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2C1810] text-[#D4AF37] px-8 py-3 hover:bg-[#1A0A0E] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span className="text-xs uppercase tracking-widest font-bold">Save All Changes</span>
        </button>
      </div>
    </div>
  );
}
