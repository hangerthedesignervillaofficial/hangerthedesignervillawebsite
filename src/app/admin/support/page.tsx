"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { format } from "date-fns";
import { Mail, CheckCircle, Clock } from "lucide-react";

interface SupportMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  created_at: string;
}

export default function AdminSupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, this will throw, but we handle it gracefully
        console.error("Fetch error (maybe table not created yet):", error);
        return;
      }
      
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('admin_support')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
        },
        () => {
          toast.success("New support message received!");
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('support_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.map(m => m.id === id ? { ...m, status: status as any } : m));
      toast.success("Message status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Support</h1>
          <p className="text-muted-foreground mt-2">
            Manage incoming messages and inquiries from customers.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {messages.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#D4AF37]/20 p-12 text-center shadow-sm">
            <Mail className="w-12 h-12 mx-auto text-[#D4AF37]/50 mb-4" />
            <h3 className="text-xl font-medium text-[#2C1810] mb-2">No Messages Yet</h3>
            <p className="text-[#7A6B5D]">Your inbox is completely clear.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`bg-white rounded-xl border p-6 transition-all shadow-sm hover:shadow-md ${msg.status === 'unread' ? 'border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/10' : 'border-gray-200 opacity-75'}`}>
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-[#2C1810]">{msg.name}</h3>
                    {msg.status === 'unread' && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-[#7A6B5D] hover:text-[#4A0E17] text-sm font-medium transition-colors">
                    {msg.email}
                  </a>
                </div>
                <div className="text-right text-xs text-[#7A6B5D] font-medium flex items-center md:justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(msg.created_at), "MMM dd, yyyy 'at' hh:mm a")}
                </div>
              </div>
              
              <div className="bg-[#f4f0ea]/50 p-4 rounded-lg mb-6 text-[#2C1810] whitespace-pre-wrap text-sm leading-relaxed border border-[#D4AF37]/10">
                {msg.message}
              </div>
              
              <div className="flex gap-3 border-t border-gray-100 pt-4 mt-auto">
                {msg.status === 'unread' && (
                  <button 
                    onClick={() => handleUpdateStatus(msg.id, 'read')}
                    className="text-xs font-bold tracking-wider uppercase px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
                {msg.status !== 'resolved' && (
                  <button 
                    onClick={() => handleUpdateStatus(msg.id, 'resolved')}
                    className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase px-4 py-2 bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] rounded transition-colors ml-auto"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Resolve Issue
                  </button>
                )}
                {msg.status === 'resolved' && (
                  <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase flex items-center gap-2 ml-auto">
                    <CheckCircle className="w-4 h-4" /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
