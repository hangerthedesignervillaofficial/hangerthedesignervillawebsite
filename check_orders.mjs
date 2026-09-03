import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        env[match[1]] = match[2];
    }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    console.log("Fetching orders...");
    const { data, error } = await supabase.from('orders').select('*, profiles(username, email), addresses(street)');
    console.log("Error:", error);
    console.log("Data count:", data?.length);
    console.log("First order:", JSON.stringify(data?.[0], null, 2));
}

check();
