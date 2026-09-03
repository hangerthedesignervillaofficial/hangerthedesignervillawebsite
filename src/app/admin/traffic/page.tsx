"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Users, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function LiveTrafficPage() {
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  useEffect(() => {
    const handlePresenceSync = (e: any) => {
      const presenceState = e.detail;
      if (!presenceState) return;
      
      const users = Object.keys(presenceState).map((presenceId) => {
        const presences = presenceState[presenceId] as any[];
        // Get the most recent presence state for this user/guest
        const latest = presences[presences.length - 1];
        
        return {
          id: presenceId,
          user: latest.user_email || 'Guest',
          current_page: latest.page_name || latest.pathname || '/',
          location: 'Unknown',
          active_time: formatDistanceToNow(new Date(latest.online_at), { addSuffix: false }),
          status: 'active',
          online_at: latest.online_at
        };
      });

      // Sort by online_at descending
      users.sort((a, b) => new Date(b.online_at).getTime() - new Date(a.online_at).getTime());
      setActiveUsers(users);
    };

    window.addEventListener('hanger-presence-sync', handlePresenceSync);

    // Initial fetch if channel already exists
    const existingChannel = supabase.getChannels().find(c => c.topic === 'realtime:online-visitors');
    if (existingChannel && existingChannel.state === 'joined') {
        const state = existingChannel.presenceState();
        if (state && Object.keys(state).length > 0) {
            handlePresenceSync({ detail: state });
        }
    }

    return () => {
      window.removeEventListener('hanger-presence-sync', handlePresenceSync);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1810] tracking-wide mb-2 flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </span>
            Live Traffic
          </h1>
          <p className="font-sans text-[11px] text-[#7A6B5D] uppercase tracking-widest">
            Monitor active visitors across your boutique in real-time.
          </p>
        </div>
        <div className="bg-[#2C1810] text-[#D4AF37] px-6 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
          <Users className="w-4 h-4" /> {activeUsers.length} Active Now
        </div>
      </div>

      <div className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFFCF7] border-b border-[#D4AF37]/20">
                <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Visitor</th>
                <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Current Page</th>
                <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Time Active</th>
                <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#D4AF37]/10 hover:bg-[#FFFCF7]/50 transition-colors">
                  <td className="px-6 py-4 font-sans text-xs font-semibold text-[#2C1810]">
                    {user.user}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-sans font-medium text-xs text-[#2C1810]">
                      {user.current_page}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-sans text-xs text-[#7A6B5D] flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {user.active_time}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[8px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 bg-green-50 text-green-700 border border-green-200">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
              {activeUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#7A6B5D] font-sans text-sm">
                    No active visitors right now. Stay tuned!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
