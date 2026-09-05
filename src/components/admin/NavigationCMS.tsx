"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Save, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export type NavSubItem = {
  id: string;
  title: string;
  href: string;
};

export type NavItem = {
  id: string;
  title: string;
  href: string;
  icon: string;
  hasSub: boolean;
  subItems: NavSubItem[];
};

const AVAILABLE_ICONS = [
  "Home", "Shirt", "Sparkles", "Star", "Footprints", "Gem", "ShoppingBag", "FolderHeart"
];

export function NavigationCMS() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNavigation();
  }, []);

  async function fetchNavigation() {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "navigation_menu")
        .single();
        
      if (data && data.value) {
        setNavItems(data.value);
      } else {
        // Fallback default
        setNavItems([{
          id: "1", title: "HOME", href: "/", icon: "Home", hasSub: false, subItems: []
        }]);
      }
    } catch (err) {
      console.error("Failed to load navigation", err);
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
          key: 'navigation_menu', 
          value: navItems,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      toast.success("Navigation menu saved successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save navigation.");
    } finally {
      setSaving(false);
    }
  }

  const addMainItem = () => {
    setNavItems([
      ...navItems,
      { id: Date.now().toString(), title: "NEW CATEGORY", href: "/category", icon: "FolderHeart", hasSub: false, subItems: [] }
    ]);
  };

  const updateMainItem = (id: string, field: keyof NavItem, value: any) => {
    setNavItems(navItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeMainItem = (id: string) => {
    setNavItems(navItems.filter(item => item.id !== id));
  };

  const moveMainItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...navItems];
    if (direction === 'up' && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    }
    setNavItems(newItems);
  };

  const addSubItem = (parentId: string) => {
    setNavItems(navItems.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          hasSub: true,
          subItems: [...item.subItems, { id: Date.now().toString(), title: "New Subcategory", href: "/category?sub=new" }]
        };
      }
      return item;
    }));
  };

  const updateSubItem = (parentId: string, subId: string, field: keyof NavSubItem, value: string) => {
    setNavItems(navItems.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          subItems: item.subItems.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub)
        };
      }
      return item;
    }));
  };

  const removeSubItem = (parentId: string, subId: string) => {
    setNavItems(navItems.map(item => {
      if (item.id === parentId) {
        const newSubs = item.subItems.filter(sub => sub.id !== subId);
        return {
          ...item,
          subItems: newSubs,
          hasSub: newSubs.length > 0
        };
      }
      return item;
    }));
  };

  if (loading) return <div className="p-10"><LoadingSpinner /></div>;

  return (
    <div className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
      <div className="bg-[#FDFBF7] p-5 border-b border-[#D4AF37]/15 flex justify-between items-center">
        <div>
          <h2 className="font-serif text-xl text-[#2C1810] tracking-wide">Navigation Menu Builder</h2>
          <p className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-widest mt-1">Manage Categories and Subcategories shown in the Sidebar and Navbar</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2C1810] text-[#D4AF37] px-6 py-2.5 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#4A0E17] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Menu'}
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-6 bg-[#FDFBF7]">
        {navItems.map((item, index) => (
          <div key={item.id} className="bg-white border border-[#D4AF37]/30 p-4 relative shadow-sm transition-all group">
            
            {/* Move Up / Down */}
            <div className="absolute top-4 right-4 flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveMainItem(index, 'up')} disabled={index === 0} className="p-1 text-[#7A6B5D] hover:text-[#2C1810] disabled:opacity-30"><MoveUp className="w-4 h-4" /></button>
              <button onClick={() => moveMainItem(index, 'down')} disabled={index === navItems.length - 1} className="p-1 text-[#7A6B5D] hover:text-[#2C1810] disabled:opacity-30"><MoveDown className="w-4 h-4" /></button>
              <button onClick={() => removeMainItem(item.id)} className="p-1 text-red-400 hover:text-red-600 ml-2"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-24">
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1">Category Title</label>
                <input
                  value={item.title}
                  onChange={(e) => updateMainItem(item.id, 'title', e.target.value)}
                  className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-8 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810] font-semibold"
                />
              </div>
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1">Link (URL)</label>
                <input
                  value={item.href}
                  onChange={(e) => updateMainItem(item.id, 'href', e.target.value)}
                  className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-8 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                  placeholder="/clothing"
                />
              </div>
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1">Icon</label>
                <select
                  value={item.icon}
                  onChange={(e) => updateMainItem(item.id, 'icon', e.target.value)}
                  className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-8 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                >
                  {AVAILABLE_ICONS.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub Items */}
            <div className="mt-4 pl-4 border-l-2 border-[#D4AF37]/20">
              <div className="flex justify-between items-center mb-3">
                <span className="font-sans text-[10px] font-bold tracking-[0.15em] text-[#2C1810] uppercase">Subcategories</span>
                <button
                  onClick={() => addSubItem(item.id)}
                  className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#D4AF37] hover:text-[#4A0E17] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Subcategory
                </button>
              </div>

              {item.subItems.length === 0 ? (
                <p className="text-[10px] text-[#7A6B5D] italic">No subcategories.</p>
              ) : (
                <div className="space-y-2">
                  {item.subItems.map((sub, sIndex) => (
                    <div key={sub.id} className="flex items-center gap-3 bg-[#FDFBF7] p-2 border border-[#D4AF37]/10">
                      <span className="text-[10px] font-bold text-[#D4AF37] w-4">{sIndex + 1}.</span>
                      <input
                        value={sub.title}
                        onChange={(e) => updateSubItem(item.id, sub.id, 'title', e.target.value)}
                        placeholder="Subcategory Name"
                        className="flex-1 bg-transparent border-b border-[#D4AF37]/25 text-xs focus:outline-none focus:border-[#D4AF37] px-1 py-1 text-[#2C1810]"
                      />
                      <input
                        value={sub.href}
                        onChange={(e) => updateSubItem(item.id, sub.id, 'href', e.target.value)}
                        placeholder="Link (e.g. /clothing?sub=sarees)"
                        className="flex-1 bg-transparent border-b border-[#D4AF37]/25 text-xs focus:outline-none focus:border-[#D4AF37] px-1 py-1 text-[#2C1810]"
                      />
                      <button onClick={() => removeSubItem(item.id, sub.id)} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ))}

        <button
          onClick={addMainItem}
          className="w-full py-4 border-2 border-dashed border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-all flex justify-center items-center gap-2 uppercase tracking-[0.2em] text-[10px] font-bold"
        >
          <Plus className="w-4 h-4" /> Add Main Category
        </button>

      </div>
    </div>
  );
}
