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

const supabaseAdmin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE);

async function check() {
    const { data, error } = await supabaseAdmin.from('orders').select('*');
    console.log("Error:", error);
    console.log("Total Orders (bypassing RLS):", data?.length);
    console.log("First order:", JSON.stringify(data?.[0], null, 2));
}
check();
