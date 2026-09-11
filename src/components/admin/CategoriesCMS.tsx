"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCcw,
  FolderTree,
  CornerDownRight,
  Layers,
  Tag,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { CategoryType } from "@/types";

export function CategoriesCMS() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [productCounts, setProductCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For editing or adding new
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    parent_id: number | null;
  }>({
    name: "",
    description: "",
    parent_id: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("products").select("category_id"),
      ]);

      if (catRes.error) throw catRes.error;
      setCategories(catRes.data || []);

      const counts: Record<number, number> = {};
      (prodRes.data || []).forEach((p: any) => {
        if (p.category_id) {
          counts[p.category_id] = (counts[p.category_id] || 0) + 1;
        }
      });
      setProductCounts(counts);
    } catch (err) {
      console.error("Failed to load categories:", err);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  // Filter main categories and child subcategories
  const mainCategories = categories.filter((c) => !c.parent_id);
  const getSubcategories = (parentId: number) =>
    categories.filter((c) => c.parent_id === parentId);

  const handleEdit = (cat: CategoryType) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      parent_id: cat.parent_id ?? null,
    });
  };

  const handleAddNewMain = () => {
    setEditingId("new");
    setFormData({ name: "", description: "", parent_id: null });
  };

  const handleAddSubcategory = (parentId: number) => {
    setEditingId("new");
    setFormData({ name: "", description: "", parent_id: parentId });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", parent_id: null });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId === "new") {
        const { error } = await supabase.from("categories").insert([
          {
            name: formData.name.trim(),
            description: formData.description.trim(),
            parent_id: formData.parent_id,
          },
        ]);
        if (error) throw error;
        toast.success(
          formData.parent_id
            ? "Subcategory created successfully!"
            : "Main Category created successfully!",
        );
      } else {
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name.trim(),
            description: formData.description.trim(),
            parent_id: formData.parent_id,
          })
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Category updated successfully!");
      }

      await fetchData();
      handleCancel();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryType) => {
    const isMain = !cat.parent_id;
    const subs = getSubcategories(cat.id);

    if (isMain && subs.length > 0) {
      if (
        !window.confirm(
          `This main category has ${subs.length} subcategories. Please reassign or delete its subcategories first before deleting this parent category.`,
        )
      ) {
        return;
      }
    }

    const assignedCount = productCounts[cat.id] || 0;
    if (assignedCount > 0) {
      if (
        !window.confirm(
          `Warning: ${assignedCount} products are currently assigned to this ${
            isMain ? "category" : "subcategory"
          }. Deleting it may fail or unassign them. Do you still want to proceed?`,
        )
      ) {
        return;
      }
    } else {
      if (
        !window.confirm(
          `Are you sure you want to delete "${cat.name}"?`,
        )
      ) {
        return;
      }
    }

    try {
      const { error } = await supabase.from("categories").delete().eq("id", cat.id);

      if (error) {
        if (error.code === "23503") {
          throw new Error(
            "Cannot delete this category because products or subcategories are still linked to it. Please reassign them first.",
          );
        }
        throw error;
      }

      toast.success("Category deleted successfully!");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete category.");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#7A6B5D] text-xs uppercase tracking-widest flex items-center justify-center gap-2">
        <RefreshCcw className="w-4 h-4 animate-spin text-[#D4AF37]" />
        Loading categories & hierarchy...
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#FDFBF7] p-5 md:p-6 border-b border-[#D4AF37]/15 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderTree className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="font-serif text-xl md:text-2xl text-[#2C1810] tracking-wide">
              Categories & Subcategories
            </h2>
          </div>
          <p className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-widest">
            Organize main collections and child subcategories for navigation and product assignments
          </p>
        </div>

        {editingId === null && (
          <button
            onClick={handleAddNewMain}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white transition-all text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Main Category
          </button>
        )}
      </div>

      <div className="p-5 md:p-8 space-y-6">
        {/* Editor Form Modal / Inline Box */}
        {editingId !== null && (
          <div className="bg-[#FFFDF9] border-2 border-[#D4AF37]/40 p-6 shadow-md relative">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#D4AF37]/20">
              <h3 className="font-serif text-lg text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D4AF37]" />
                {editingId === "new"
                  ? formData.parent_id
                    ? `Add Subcategory to "${
                        categories.find((c) => c.id === formData.parent_id)?.name || "Parent"
                      }"`
                    : "Add New Main Category"
                  : `Edit Category: ${formData.name}`}
              </h3>
              <span className="text-[9px] font-sans uppercase font-bold tracking-widest text-[#D4AF37] px-2 py-1 bg-[#D4AF37]/10">
                {formData.parent_id ? "Subcategory" : "Main Category"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Name */}
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
                  Category / Subcategory Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-b border-[#D4AF37]/30 bg-white h-10 px-3 text-sm focus:border-[#D4AF37] focus:outline-none text-[#2C1810]"
                  placeholder="e.g. School Bag / Kurtas / Handbags"
                />
              </div>

              {/* Parent Category Selector */}
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
                  Parent Category (Hierarchy)
                </label>
                <select
                  value={formData.parent_id ? formData.parent_id.toString() : "none"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parent_id: e.target.value === "none" ? null : parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full border-b border-[#D4AF37]/30 bg-white h-10 px-3 text-sm focus:border-[#D4AF37] focus:outline-none text-[#2C1810] cursor-pointer"
                >
                  <option value="none">— None (Top-Level Main Category) —</option>
                  {mainCategories
                    .filter((c) => editingId === "new" || c.id !== editingId)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        Subcategory of: {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
                  Short Description
                </label>
                <input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border-b border-[#D4AF37]/30 bg-white h-10 px-3 text-sm focus:border-[#D4AF37] focus:outline-none text-[#2C1810]"
                  placeholder="Optional brief line for boutique navigation"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#D4AF37]/15">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 border border-[#D4AF37]/30 text-[#7A6B5D] hover:text-[#2C1810] text-[9px] uppercase font-bold tracking-widest transition-colors cursor-pointer"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] text-[9px] uppercase font-bold tracking-widest transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                disabled={saving}
              >
                {saving ? (
                  <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Category
              </button>
            </div>
          </div>
        )}

        {/* Hierarchical Category List */}
        <div className="space-y-4">
          {mainCategories.length === 0 ? (
            <div className="p-8 text-center text-[#7A6B5D] text-sm">
              No main categories found. Click &quot;Add Main Category&quot; above to begin.
            </div>
          ) : (
            mainCategories.map((mainCat) => {
              const subCats = getSubcategories(mainCat.id);
              const totalMainProds = productCounts[mainCat.id] || 0;
              const subTotalProds = subCats.reduce(
                (sum, s) => sum + (productCounts[s.id] || 0),
                0,
              );

              return (
                <div
                  key={mainCat.id}
                  className="border border-[#D4AF37]/25 bg-white shadow-xs overflow-hidden"
                >
                  {/* Main Category Header Row */}
                  <div className="bg-[#FFFDF9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/15">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2C1810] text-[#D4AF37] flex items-center justify-center font-serif text-xs font-bold shrink-0">
                        {mainCat.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif text-base text-[#2C1810] font-bold uppercase tracking-wide">
                            {mainCat.name}
                          </span>
                          <span className="text-[8px] font-sans font-bold tracking-[0.15em] uppercase px-2 py-0.5 bg-[#D4AF37]/15 text-[#2C1810] border border-[#D4AF37]/30">
                            Main Category
                          </span>
                          <span className="text-[9px] text-[#7A6B5D] font-sans flex items-center gap-1">
                            <Package className="w-3 h-3 text-[#D4AF37]" />
                            {totalMainProds} direct products ({totalMainProds + subTotalProds} total)
                          </span>
                        </div>
                        {mainCat.description && (
                          <p className="font-sans text-xs text-[#7A6B5D] mt-0.5">
                            {mainCat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleAddSubcategory(mainCat.id)}
                        className="text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 border border-[#D4AF37] text-[#2C1810] hover:bg-[#D4AF37]/15 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Add subcategory under this category"
                      >
                        <Plus className="w-3 h-3 text-[#D4AF37]" /> Add Subcategory
                      </button>
                      <button
                        onClick={() => handleEdit(mainCat)}
                        className="p-1.5 text-[#7A6B5D] hover:text-[#2C1810] transition-colors cursor-pointer"
                        title="Edit Main Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(mainCat)}
                        className="p-1.5 text-red-400 hover:text-red-700 transition-colors cursor-pointer"
                        title="Delete Main Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories List */}
                  <div className="p-3 sm:p-4 bg-white space-y-2">
                    {subCats.length === 0 ? (
                      <div className="py-3 px-4 text-[11px] text-[#7A6B5D]/70 font-sans italic flex items-center gap-2">
                        <CornerDownRight className="w-3.5 h-3.5 text-[#D4AF37]/60" />
                        No subcategories created yet under {mainCat.name}. Click &quot;Add Subcategory&quot; to add types like School Bag, Purse, etc.
                      </div>
                    ) : (
                      subCats.map((subCat) => {
                        const subProdCount = productCounts[subCat.id] || 0;
                        return (
                          <div
                            key={subCat.id}
                            className="flex items-center justify-between p-3 bg-[#FDFBF7] hover:bg-[#FFFDF9] border border-[#D4AF37]/15 transition-colors ml-3 sm:ml-6"
                          >
                            <div className="flex items-center gap-2.5">
                              <CornerDownRight className="w-4 h-4 text-[#D4AF37] shrink-0" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-sans text-xs font-semibold text-[#2C1810] uppercase tracking-wider">
                                    {subCat.name}
                                  </span>
                                  <span className="text-[8px] font-sans font-medium tracking-widest px-1.5 py-0.2 bg-white text-[#7A6B5D] border border-[#D4AF37]/20">
                                    Subcategory
                                  </span>
                                  <span className="text-[9px] text-[#7A6B5D] font-sans">
                                    ({subProdCount} products)
                                  </span>
                                </div>
                                {subCat.description && (
                                  <p className="font-sans text-[11px] text-[#7A6B5D] mt-0.5">
                                    {subCat.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleEdit(subCat)}
                                className="p-1 text-[#7A6B5D] hover:text-[#2C1810] transition-colors cursor-pointer"
                                title="Edit Subcategory"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(subCat)}
                                className="p-1 text-red-400 hover:text-red-700 transition-colors cursor-pointer"
                                title="Delete Subcategory"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
