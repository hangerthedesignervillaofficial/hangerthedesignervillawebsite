const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const testimonials = [
  {
    content: "The quality, the fit, the details. Everything is beyond perfect. Hanger never disappoints!",
    name: "ANANYA S.",
    rating: 5,
    status: 'approved'
  },
  {
    content: "My new go-to for festive and everyday looks. So elegant and well-curated.",
    name: "RIDDHI M.",
    rating: 5,
    status: 'approved'
  },
  {
    content: "Finally a brand that gets contemporary Indian fashion so right.",
    name: "NEHA K.",
    rating: 5,
    status: 'approved'
  }
];

async function seed() {
  const { data, error } = await supabase.from('testimonials').insert(testimonials);
  if (error) console.error(error);
  else console.log('Successfully seeded testimonials!');
}
seed();
