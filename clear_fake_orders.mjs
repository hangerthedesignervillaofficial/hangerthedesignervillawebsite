import { createClient } from '@supabase/supabase-js';

// Read .env.local manually
import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = envFile.split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) acc[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function wipeOrders() {
  console.log("Wiping test orders...");
  // Delete all orders
  const { error } = await supabase.from('orders').delete().neq('id', 0);
  if (error) {
    console.error("Error wiping orders:", error);
  } else {
    console.log("Successfully wiped fake test orders!");
  }
}

wipeOrders();
