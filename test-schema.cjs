const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const productId = '56ba6c06-8fe6-4b40-a676-289cf54e56e7';
  const { data, error } = await supabase
    .from("products")
    .update({
        title: "Test Title",
    })
    .eq("product_id", productId)
    .select()
    .single();

  console.log("Update Error:", error);
}
test();
