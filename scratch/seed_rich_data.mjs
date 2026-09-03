import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const dummyProducts = [
    {
      product_id: "rich_prod_1",
      title: "Hand-Embroidered Silk Lehenga",
      description: "Experience the epitome of luxury with this handcrafted silk lehenga featuring intricate zardozi work and Swarovski crystals. Designed for the modern bride seeking timeless elegance.",
      price: 185000,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      stock: 5,
      sku: "HNGR-LEH-001",
      category_id: 1, // Clothing
      is_bestseller: true,
      is_new_arrival: true,
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      product_id: "rich_prod_2",
      title: "Kundan & Emerald Choker Set",
      description: "A royal statement piece crafted in 22kt gold plating, featuring uncut Kundan stones and magnificent Zambian emerald drops. Perfect for heritage celebrations.",
      price: 45000,
      image: "https://images.unsplash.com/photo-1599643478524-fb66f7ca0f80?w=800&q=80",
      stock: 12,
      sku: "HNGR-JEW-002",
      category_id: 2, // Jewellery
      is_bestseller: true,
      is_new_arrival: false,
      sizes: [] // One size
    },
    {
      product_id: "rich_prod_3",
      title: "Velvet Zardozi Potli Bag",
      description: "Carry luxury in your hands. This plush velvet potli is embellished with antique gold dabka and zari, finished with pearl-tasseled drawstrings.",
      price: 8500,
      image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80",
      stock: 20,
      sku: "HNGR-ACC-003",
      category_id: 3, // Accessories
      is_bestseller: false,
      is_new_arrival: true,
      sizes: []
    },
    {
      product_id: "rich_prod_4",
      title: "Hand-Stitched Leather Mojaris",
      description: "Step into tradition with these meticulously handcrafted mojaris. Premium leather lining ensures comfort, while the silk brocade upper adds a regal touch.",
      price: 12500,
      image: "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&q=80",
      stock: 15,
      sku: "HNGR-FTW-004",
      category_id: 4, // Footwear
      is_bestseller: true,
      is_new_arrival: true,
      sizes: ["38", "39", "40", "41", "42"]
    },
    {
      product_id: "rich_prod_5",
      title: "Organza Silk Saree with Pearl Details",
      description: "Ethereal and lightweight, this pure organza saree features scalloped borders and hand-sewn pearl embellishments. A sophisticated choice for daytime soirées.",
      price: 42000,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      stock: 8,
      sku: "HNGR-CLO-005",
      category_id: 1, // Clothing
      is_bestseller: false,
      is_new_arrival: true,
      sizes: ["Free Size"]
    }
  ];

  console.log("Seeding rich dummy data...");

  for (const product of dummyProducts) {
    const { error } = await supabase
      .from("products")
      .upsert(product, { onConflict: "product_id" });

    if (error) {
      console.error(`Error inserting ${product.title}:`, error);
    } else {
      console.log(`Inserted ${product.title}`);
    }
  }

  console.log("Seeding complete!");
}

seed();
