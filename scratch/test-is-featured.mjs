import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("*")
    .order("is_featured", { ascending: false })
    .limit(5);
  console.log('Error:', productError)
}
test()
