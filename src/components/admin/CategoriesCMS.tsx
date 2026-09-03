"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Trash2, Edit, Save, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { CategoryType } from "@/types";

export function CategoriesCMS() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // For editing or adding new
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (cat: CategoryType) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || "" });
  };

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({ name: "", description: "" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    
    setSaving(true);
    try {
      if (editingId === 'new') {
        const { error } = await supabase
          .from('categories')
          .insert([{ name: formData.name.trim(), description: formData.description.trim() }]);
        if (error) throw error;
        toast.success("Category created successfully!");
      } else {
        const { error } = await supabase
          .from('categories')
          .update({ name: formData.name.trim(), description: formData.description.trim() })
          .eq('id', editingId);
        if (error) throw error;
        toast.success("Category updated successfully!");
      }
      
      await fetchCategories();
      handleCancel();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category? This might affect products linked to it.")) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) {
        if (error.code === '23503') { // Foreign key constraint violation
          throw new Error("Cannot delete this category because it is currently assigned to one or more products. Please remove the category from those products first.");
        }
        throw error;
      }
      
      toast.success("Category deleted successfully!");
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete category.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#7A6B5D] text-xs uppercase tracking-widest">Loading categories...</div>;
  }

  return (
    <div className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
      <div className="bg-[#FDFBF7] p-5 border-b border-[#D4AF37]/15 flex justify-between items-center">
        <div>
            <h2 className="font-serif text-xl text-[#2C1810] tracking-wide">Website Categories</h2>
            <p className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-widest mt-1">Manage categories shown in Navbar and Products</p>
        </div>
        
        {editingId === null && (
            <button 
                onClick={handleAddNew}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37] hover:text-[#4A0E17] transition-colors cursor-pointer"
            >
                <Plus className="w-4 h-4" /> Add Category
            </button>
        )}
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Form for new/edit */}
        {editingId !== null && (
          <div className="bg-[#FFFCF7] border border-[#D4AF37]/30 p-6 mb-8">
            <h3 className="font-serif text-lg text-[#2C1810] mb-4">
              {editingId === 'new' ? "Add New Category" : "Edit Category"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Category Name <span className="text-[#D4AF37]">*</span></label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                  placeholder="e.g. GOGGLES"
                />
              </div>
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Description</label>
                <input
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                  placeholder="Brief description for mega menu"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6 pt-6 border-t border-[#D4AF37]/10">
              <button 
                onClick={handleCancel}
                className="px-6 py-2 border border-[#D4AF37]/25 text-[#7A6B5D] hover:text-[#2C1810] text-[10px] uppercase font-bold tracking-widest transition-colors cursor-pointer"
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
                disabled={saving}
              >
                {saving ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} 
                Save Category
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="divide-y divide-[#D4AF37]/10 border border-[#D4AF37]/10">
          <div className="grid grid-cols-12 gap-4 p-4 bg-[#FDFBF7] font-sans text-[9px] font-bold tracking-[0.15em] text-[#7A6B5D] uppercase">
            <div className="col-span-1">ID</div>
            <div className="col-span-4">Name</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
          {categories.length === 0 ? (
            <div className="p-8 text-center text-[#7A6B5D] text-sm">No categories found.</div>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-[#FFFCF7] transition-colors">
                <div className="col-span-1 font-sans text-xs text-[#7A6B5D]">{cat.id}</div>
                <div className="col-span-4 font-sans text-sm font-semibold text-[#2C1810] uppercase">{cat.name}</div>
                <div className="col-span-5 font-sans text-xs text-[#7A6B5D] truncate">{cat.description || "—"}</div>
                <div className="col-span-2 flex justify-end gap-3">
                  <button 
                    onClick={() => handleEdit(cat)}
                    className="text-[#7A6B5D] hover:text-[#2C1810] transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
