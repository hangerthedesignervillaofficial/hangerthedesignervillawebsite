import fs from 'fs';

const file = 'src/app/admin/traffic/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the useEffect in page.tsx
const oldUseEffect = `  useEffect(() => {
    const channel = supabase.channel('online-visitors');

    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      
      const users = Object.keys(presenceState).map((presenceId) => {
        const presences = presenceState[presenceId] as any[];
        // Get the most recent presence state for this user/guest
        const latest = presences[presences.length - 1];
        
        return {
          id: presenceId,
          user: latest.user_email || 'Guest',
          current_page: latest.pathname || '/',
          location: 'Unknown', // We would need IP geolocation for this
          active_time: formatDistanceToNow(new Date(latest.online_at), { addSuffix: false }),
          status: 'active',
          online_at: latest.online_at
        };
      });

      // Sort by online_at descending
      users.sort((a, b) => new Date(b.online_at).getTime() - new Date(a.online_at).getTime());
      setActiveUsers(users);
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);`;

const newUseEffect = `  useEffect(() => {
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
          current_page: latest.pathname || '/',
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
  }, []);`;

content = content.replace(oldUseEffect, newUseEffect);

fs.writeFileSync(file, content);
console.log("Updated traffic/page.tsx");
