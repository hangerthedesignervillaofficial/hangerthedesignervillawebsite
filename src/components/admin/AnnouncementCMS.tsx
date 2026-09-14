"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Megaphone,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  Palette,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AnnouncementSettings } from "@/types";

export const DEFAULT_ANNOUNCEMENT: AnnouncementSettings = {
  is_active: true,
  text: "FREE SHIPPING ON ALL DOMESTIC ORDERS OVER ₹1,999",
  link: "/clothing",
  link_text: "SHOP NOW",
  bg_color: "#1A0A0E",
  text_color: "#FDFBF7",
  allow_dismiss: true,
};

const COLOR_PRESETS = [
  { name: "Atelier Noir", bg: "#1A0A0E", text: "#FDFBF7" },
  { name: "Royal Burgundy", bg: "#4A0E17", text: "#FDFBF7" },
  { name: "Atelier Gold", bg: "#D4AF37", text: "#1A0A0E" },
  { name: "Espresso Silk", bg: "#2C1810", text: "#F5E6C8" },
  { name: "Onyx Black", bg: "#0B0B0B", text: "#FFFFFF" },
  { name: "Deep Emerald", bg: "#1A2E22", text: "#FDFBF7" },
];

const TEMPLATE_PRESETS = [
  {
    label: "Free Shipping",
    text: "FREE SHIPPING ON ALL DOMESTIC ORDERS OVER ₹1,999",
    link: "/clothing",
    link_text: "SHOP NOW",
  },
  {
    label: "Festive Edit",
    text: "FESTIVE COUTURE: COMPLIMENTARY LUXURY PACKAGING ON ALL ATELIER ORDERS",
    link: "/clothing",
    link_text: "EXPLORE",
  },
  {
    label: "New Collection",
    text: "THE NEW AUTUMN / WINTER LUXURY ATELIER COLLECTION IS NOW LIVE",
    link: "/clothing",
    link_text: "VIEW COLLECTION",
  },
  {
    label: "Exclusive Privilege",
    text: "ENJOY 15% OFF YOUR FIRST ORDER WITH CODE: ATELIER15",
    link: "/clothing",
    link_text: "CLAIM PRIVILEGE",
  },
];

export function AnnouncementCMS() {
  const [settings, setSettings] = useState<AnnouncementSettings>(DEFAULT_ANNOUNCEMENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncementSettings();
  }, []);

  async function fetchAnnouncementSettings() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "announcement_bar")
        .single();

      if (data?.value) {
        setSettings({ ...DEFAULT_ANNOUNCEMENT, ...data.value });
      }
    } catch (err) {
      console.warn("Announcement settings not found, using default.", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!settings.text.trim()) {
      toast.error("Announcement text cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").upsert({
        key: "announcement_bar",
        value: settings,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success("Announcement bar updated successfully and live on the website!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save announcement bar settings.");
    } finally {
      setSaving(false);
    }
  }

  const handleApplyTemplate = (tpl: (typeof TEMPLATE_PRESETS)[0]) => {
    setSettings((prev) => ({
      ...prev,
      text: tpl.text,
      link: tpl.link,
      link_text: tpl.link_text,
    }));
    toast.success(`Applied "${tpl.label}" template`);
  };

  const handleApplyColorPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    setSettings((prev) => ({
      ...prev,
      bg_color: preset.bg,
      text_color: preset.text,
    }));
  };

  const handleResetToDefault = () => {
    if (window.confirm("Reset announcement bar to default settings?")) {
      setSettings(DEFAULT_ANNOUNCEMENT);
      toast.info("Reset to default announcement settings.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <h2 className="font-serif text-2xl text-[#2C1810] flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-[#D4AF37]" />
            Top Announcement Bar
          </h2>
          <p className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-widest mt-1">
            Customize the prominent announcement banner displayed across all store pages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-4 py-2.5 border border-[#D4AF37]/30 text-[#7A6B5D] hover:text-[#2C1810] hover:border-[#2C1810] font-sans text-[10px] font-bold tracking-[0.15em] uppercase transition-colors flex items-center gap-1.5"
            title="Reset to initial default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#2C1810] text-[#D4AF37] px-6 py-2.5 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#4A0E17] hover:text-white transition-all disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saving ? "Publishing..." : "Publish Live"}
          </button>
        </div>
      </div>

      {/* Live Store Preview Banner */}
      <div className="bg-[#FAF8F5] border border-[#D4AF37]/30 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            Live Storefront Preview
          </span>
          <span
            className={`font-sans text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
              settings.is_active
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                : "bg-amber-50 text-amber-700 border border-amber-300"
            }`}
          >
            {settings.is_active ? "● Status: Active & Visible" : "○ Status: Hidden"}
          </span>
        </div>

        {/* The actual preview bar */}
        <div
          className="relative w-full rounded-sm overflow-hidden transition-all duration-300 shadow-sm border border-black/5"
          style={{
            backgroundColor: settings.bg_color,
            color: settings.text_color,
            opacity: settings.is_active ? 1 : 0.45,
          }}
        >
          <div className="py-2.5 px-8 flex items-center justify-center relative min-h-[38px]">
            <div className="flex items-center justify-center flex-wrap gap-2 text-center w-full pr-6 pl-2">
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.22em] uppercase font-medium">
                {settings.text || "PREVIEW ANNOUNCEMENT TEXT"}
              </span>
              {settings.link && settings.link_text && (
                <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] uppercase underline underline-offset-4 cursor-pointer hover:opacity-80">
                  {settings.link_text}
                </span>
              )}
            </div>
            {settings.allow_dismiss && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70">
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </div>
            )}
          </div>
        </div>

        {!settings.is_active && (
          <p className="text-[10px] text-amber-700 font-sans tracking-wide">
            Note: The announcement bar is currently turned off. Switch the toggle below to activate it on the live store.
          </p>
        )}
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Content & Links */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Switch & Quick Templates */}
          <div className="bg-white border border-[#D4AF37]/20 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/15">
              <div>
                <label className="font-serif text-base text-[#2C1810] block">
                  Enable Announcement Bar
                </label>
                <span className="font-sans text-[10px] text-[#7A6B5D] tracking-wide">
                  Show or hide this announcement banner on the top of the website
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, is_active: !settings.is_active })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  settings.is_active ? "bg-[#2C1810]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.is_active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                One-Click Quick Message Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEMPLATE_PRESETS.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="text-left p-2.5 border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#FDFBF7] transition-all group"
                  >
                    <div className="font-serif text-xs text-[#2C1810] font-medium group-hover:text-[#4A0E17]">
                      {tpl.label}
                    </div>
                    <div className="text-[9px] font-sans text-[#7A6B5D] truncate mt-0.5">
                      {tpl.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div>
              <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">
                Announcement Message Text <span className="text-red-500">*</span>
              </label>
              <textarea
                value={settings.text}
                onChange={(e) => setSettings({ ...settings, text: e.target.value })}
                rows={2}
                placeholder="e.g. FREE SHIPPING ON ALL DOMESTIC ORDERS OVER ₹1,999"
                className="w-full border border-[#D4AF37]/30 bg-[#FDFBF7] p-3 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#2C1810] font-sans"
              />
              <span className="font-sans text-[9px] text-[#7A6B5D] tracking-wider uppercase mt-1 block">
                Recommended: Keep between 40 - 100 characters for optimal mobile display
              </span>
            </div>

            {/* CTA Link & Link Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-[#D4AF37]" />
                  Action Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={settings.link || ""}
                  onChange={(e) => setSettings({ ...settings, link: e.target.value })}
                  placeholder="/clothing or /collections"
                  className="w-full border border-[#D4AF37]/30 bg-[#FDFBF7] h-10 px-3 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#2C1810]"
                />
              </div>

              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                  Action Link Text (Optional)
                </label>
                <input
                  type="text"
                  value={settings.link_text || ""}
                  onChange={(e) => setSettings({ ...settings, link_text: e.target.value })}
                  placeholder="SHOP NOW or EXPLORE"
                  className="w-full border border-[#D4AF37]/30 bg-[#FDFBF7] h-10 px-3 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#2C1810]"
                />
              </div>
            </div>

            {/* Allow Dismissal Switch */}
            <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/15">
              <div>
                <label className="font-sans text-[11px] font-bold text-[#2C1810] uppercase tracking-wider block">
                  Allow Customer to Close Banner
                </label>
                <span className="font-sans text-[10px] text-[#7A6B5D] tracking-wide">
                  Display an "X" dismiss button on the right edge
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    allow_dismiss: !settings.allow_dismiss,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  settings.allow_dismiss ? "bg-[#2C1810]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.allow_dismiss ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Styling & Colors */}
        <div className="space-y-6">
          <div className="bg-white border border-[#D4AF37]/20 p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="font-serif text-base text-[#2C1810] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#D4AF37]" />
                Palette & Appearance
              </h3>
              <p className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-wider mt-0.5">
                Select luxury color theme or pick custom colors
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block">
                Curated Atelier Palettes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PRESETS.map((preset, idx) => {
                  const isSelected =
                    settings.bg_color.toLowerCase() === preset.bg.toLowerCase() &&
                    settings.text_color.toLowerCase() === preset.text.toLowerCase();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyColorPreset(preset)}
                      className={`flex items-center gap-2 p-2 border text-left transition-all ${
                        isSelected
                          ? "border-[#D4AF37] ring-1 ring-[#D4AF37] bg-[#FDFBF7]"
                          : "border-gray-200 hover:border-[#D4AF37]/50"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                        style={{ backgroundColor: preset.bg }}
                      />
                      <span className="font-sans text-[10px] text-[#2C1810] font-medium truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="space-y-4 pt-4 border-t border-[#D4AF37]/15">
              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.bg_color}
                    onChange={(e) => setSettings({ ...settings, bg_color: e.target.value })}
                    className="w-10 h-10 p-0.5 border border-[#D4AF37]/30 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.bg_color}
                    onChange={(e) => setSettings({ ...settings, bg_color: e.target.value })}
                    className="flex-1 border border-[#D4AF37]/30 bg-[#FDFBF7] h-10 px-3 text-xs font-mono uppercase focus:ring-1 focus:ring-[#D4AF37] text-[#2C1810]"
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-1.5">
                  Text & Icon Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.text_color}
                    onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                    className="w-10 h-10 p-0.5 border border-[#D4AF37]/30 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.text_color}
                    onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                    className="flex-1 border border-[#D4AF37]/30 bg-[#FDFBF7] h-10 px-3 text-xs font-mono uppercase focus:ring-1 focus:ring-[#D4AF37] text-[#2C1810]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
