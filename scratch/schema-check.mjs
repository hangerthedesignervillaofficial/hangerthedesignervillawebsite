import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: categories, error: categoryError } = await supabase.from("categories").select("*").order("id");
  console.log('Categories:', categories, categoryError)

  const { data: products, error: productError } = await supabase.from("products").select("*").limit(1);
  console.log('Products:', products, productError)
}
test()
