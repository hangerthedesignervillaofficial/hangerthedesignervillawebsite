import fs from 'fs';

const file = 'src/app/admin/visitors/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldUseEffect = `  useEffect(() => {
    const channel = supabase.channel('online-visitors');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        
        // Flatten the presence state into an array of visitors
        const currentVisitors: Visitor[] = [];
        
        for (const [key, presences] of Object.entries(state)) {
          if (presences && presences.length > 0) {
            // Get the most recent state for this user/key
            const latestState = presences[0] as unknown as VisitorState;
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
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);`;

const newUseEffect = `  useEffect(() => {
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
  }, []);`;

content = content.replace(oldUseEffect, newUseEffect);

fs.writeFileSync(file, content);
console.log("Updated visitors/page.tsx");
