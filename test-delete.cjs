const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const tables = ['order_items', 'reviews', 'wishlist_items', 'cart_items'];
  for (const table of tables) {
    try {
      const { data, error: selectError } = await supabase.from(table).select('product_id').limit(1);
      if (selectError) {
        console.log(`Error checking ${table}:`, selectError.message);
        continue;
      }
      if (data && data.length > 0) {
        console.log(`Found product in ${table}:`, data[0].product_id);
        const { error } = await supabase.from('products').delete().eq('product_id', data[0].product_id);
        if (error) {
           console.log(`Delete error for ${table} product:`, error);
        } else {
           console.log(`Successfully deleted ${table} product!`);
        }
      } else {
        console.log(`No items found in ${table}`);
      }
    } catch (e) {
      console.log(`Caught error for ${table}:`, e.message);
    }
  }
}
test();
