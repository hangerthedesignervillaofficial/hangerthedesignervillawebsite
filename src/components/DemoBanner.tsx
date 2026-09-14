"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { AnnouncementSettings } from "@/types";

const DEFAULT_ANNOUNCEMENT: AnnouncementSettings = {
  is_active: true,
  text: "FREE SHIPPING ON ALL DOMESTIC ORDERS OVER ₹1,999",
  link: "/clothing",
  link_text: "SHOP NOW",
  bg_color: "#1A0A0E",
  text_color: "#FDFBF7",
  allow_dismiss: true,
};

export function DemoBanner() {
  const [settings, setSettings] = useState<AnnouncementSettings>(DEFAULT_ANNOUNCEMENT);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if previously dismissed in current session
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem("hanger_announcement_dismissed") === "true") {
        setIsDismissed(true);
      }
    } catch (e) {
      // ignore storage errors
    }

    let isSubscribed = true;

    // Fetch live settings from Supabase
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "announcement_bar")
          .single();

        if (data?.value && isSubscribed) {
          setSettings({ ...DEFAULT_ANNOUNCEMENT, ...data.value });
        }
      } catch (err) {
        // graceful fallback to default
      }
    }

    loadSettings();

    // Subscribe to realtime updates on site_settings
    const channel = supabase
      .channel("realtime_announcement_bar")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "key=eq.announcement_bar",
        },
        (payload) => {
          if (payload.new && (payload.new as any).value) {
            const updated = (payload.new as any).value as AnnouncementSettings;
            setSettings({ ...DEFAULT_ANNOUNCEMENT, ...updated });
            // Reset dismissal on live update so customer sees newly broadcast message
            setIsDismissed(false);
            try {
              sessionStorage.removeItem("hanger_announcement_dismissed");
            } catch (e) {}
          }
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("hanger_announcement_dismissed", "true");
    } catch (e) {}
  };

  const isVisible = settings.is_active && !isDismissed;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: settings.bg_color || "#1A0A0E",
            color: settings.text_color || "#FDFBF7",
          }}
          className="relative w-full overflow-hidden z-40 transition-colors duration-300"
        >
          <div className="py-2 sm:py-2.5 flex items-center justify-center px-6 sm:px-8 relative max-w-[1400px] mx-auto min-h-[36px]">
            <div className="flex items-center justify-center flex-wrap gap-x-2.5 gap-y-1 text-center w-full pr-6 pl-2 sm:px-8">
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.22em] uppercase font-medium">
                {settings.text}
              </span>

              {settings.link && settings.link_text && (
                <Link
                  href={settings.link}
                  className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] uppercase underline underline-offset-4 decoration-current/40 hover:decoration-current hover:opacity-90 transition-all inline-flex items-center gap-1 group whitespace-nowrap ml-1"
                >
                  <span>{settings.link_text}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-70" />
                </Link>
              )}
            </div>

            {settings.allow_dismiss !== false && (
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-current opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all"
                aria-label="Close announcement"
              >
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
