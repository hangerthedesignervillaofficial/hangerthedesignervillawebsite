"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Users, Eye, Clock, Activity, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VisitorState {
  online_at: string;
  pathname: string;
  is_logged_in: boolean;
  user_email: string;
}

interface Visitor {
  id: string;
  state: VisitorState;
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    const handlePresenceSync = (e: any) => {
      const state = e.detail;
      if (!state) return;
        
      // Flatten the presence state into an array of visitors
      const currentVisitors: Visitor[] = [];
        
      for (const [key, presences] of Object.entries(state)) {
        const presenceArray = presences as any[];
        if (presenceArray && presenceArray.length > 0) {
          // Get the most recent state for this user/key
          const latestState = presenceArray[presenceArray.length - 1] as unknown as VisitorState;
          currentVisitors.push({
            id: key,
            state: latestState,
          });
        }
      }
        
      // Sort by most recently active
      currentVisitors.sort((a, b) => 
        new Date(b.state.online_at).getTime() - new Date(a.state.online_at).getTime()
      );
        
      setVisitors(currentVisitors);
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

  const getPageName = (pathname: string) => {
    if (pathname === '/') return 'Home Page';
    if (pathname === '/shop') return 'Shop / All Products';
    if (pathname.startsWith('/products/')) return `Product Details: ${pathname.split('/').pop()}`;
    if (pathname === '/cart') return 'Shopping Cart';
    if (pathname === '/checkout') return 'Checkout Page';
    if (pathname === '/profile') return 'User Profile';
    if (pathname === '/contact') return 'Contact Us';
    return pathname;
  };

  const loggedInCount = visitors.filter(v => v.state.is_logged_in).length;
  const guestCount = visitors.length - loggedInCount;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Visitors</h1>
          <p className="text-muted-foreground mt-2">
            Real-time tracking of active users on your boutique.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="font-bold">{visitors.length} Active Now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Online</p>
              <p className="text-3xl font-bold text-[#2C1810]">{visitors.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Logged In Customers</p>
              <p className="text-3xl font-bold text-[#2C1810]">{loggedInCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Anonymous Guests</p>
              <p className="text-3xl font-bold text-[#2C1810]">{guestCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-gray-800">Active Sessions</h2>
        </div>
        
        {visitors.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <Activity className="w-12 h-12 mb-4 text-slate-300" />
            <p>No active visitors right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {visitors.map((visitor) => (
              <div key={visitor.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${visitor.state.is_logged_in ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                    {visitor.state.is_logged_in ? <UserIcon className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2C1810] flex items-center gap-2">
                      {visitor.state.is_logged_in ? visitor.state.user_email : 'Guest User'}
                      {!visitor.state.is_logged_in && (
                        <span className="text-[10px] text-slate-400 font-mono">#{visitor.id.split('-')[1]}</span>
                      )}
                    </h4>
                    <p className="text-sm text-[#7A6B5D] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Viewing: {getPageName(visitor.state.pathname)}
                    </p>
                  </div>
                </div>
                
                <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  <Clock className="w-3.5 h-3.5" />
                  Active {formatDistanceToNow(new Date(visitor.state.online_at), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
