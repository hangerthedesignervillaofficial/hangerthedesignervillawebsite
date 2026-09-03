import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Fetching categories...");
  const { data: categories, error: catError } = await supabase.from('categories').select('*');
  
  if (catError) {
    console.error("Error fetching categories:", catError);
    return;
  }
  
  console.log("Categories found:", categories.map(c => c.name));
  
  const clothingCategory = categories.find(c => c.name.toLowerCase() === 'clothing')?.id;
  const footwearCategory = categories.find(c => c.name.toLowerCase() === 'footwear')?.id;
  const jewelleryCategory = categories.find(c => c.name.toLowerCase() === 'jewellery')?.id;
  const accessoriesCategory = categories.find(c => c.name.toLowerCase() === 'accessories')?.id;

  const dummyProducts = [
    // CLOTHING
    {
      title: "Royal Crimson Silk Lehenga",
      description: "An exquisite crimson silk lehenga with intricate zardosi hand-embroidery. Perfect for evening galas and festive celebrations.",
      price: 18500,
      stock: 15,
      category_id: clothingCategory,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
      display_tags: ["bestseller", "new_arrival"]
    },
    {
      title: "Midnight Blue Velvet Anarkali",
      description: "Luxurious velvet anarkali suit featuring silver gota patti work and a flowing silhouette.",
      price: 12999,
      stock: 20,
      category_id: clothingCategory,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop",
      display_tags: ["bestseller"]
    },
    {
      title: "Ivory Organza Saree",
      description: "A breathtaking ivory organza saree with pearl embellishments and delicate scalloped borders. The epitome of modern grace.",
      price: 14500,
      stock: 10,
      category_id: clothingCategory,
      image: "https://images.unsplash.com/photo-1610189014167-3e11043015a9?q=80&w=1000&auto=format&fit=crop",
      display_tags: ["new_arrival"]
    },

    // FOOTWEAR
    {
      title: "Handcrafted Zari Juttis",
      description: "Premium leather juttis adorned with traditional zari work and beads. Padded soles for all-day comfort.",
      price: 3499,
      stock: 30,
      category_id: footwearCategory,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
      display_tags: ["bestseller"]
    },
    {
      title: "Rose Gold Embellished Heels",
      description: "Stunning rose gold stiletto heels featuring crystal embellishments. A statement piece for any party wear.",
      price: 5999,
      stock: 25,
      category_id: footwearCategory,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
      display_tags: ["new_arrival"]
    },

    // JEWELLERY
    {
      title: "Kundan & Emerald Choker Set",
      description: "A regal choker set crafted with uncut Kundan stones and deep green emerald drops. Comes with matching jhumkas.",
      price: 24500,
      stock: 5,
      category_id: jewelleryCategory,
      image: "https://images.unsplash.com/photo-1599643478524-fb66f7f6f59c?q=80&w=1000&auto=format&fit=crop",
      display_tags: ["bestseller", "new_arrival"]
    },
    {
      title: "Polki Diamond Chandbalis",
      description: "Oversized, statement chandbalis featuring fine Polki diamonds set in 22k gold plating.",
      price: 8999,
      stock: 12,
      category_id: jewelleryCategory,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
      display_tags: []
    },

    // ACCESSORIES
    {
      title: "Signature Pearl Minaudière",
      description: "An elegant hard-case clutch adorned with faux pearls and gold-tone hardware. The perfect evening companion.",
      price: 4500,
      stock: 18,
      category_id: accessoriesCategory,
      image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop",
      display_tags: ["new_arrival"]
    }
  ];

  const validProducts = dummyProducts.filter(p => p.category_id);

  console.log(`Inserting ${validProducts.length} dummy products...`);

  const { data, error } = await supabase.from('products').insert(validProducts).select();

  if (error) {
    console.error("Error inserting products:", error);
  } else {
    console.log("Successfully inserted products!", data.map(d => d.title));
  }
}

seed();
