import { CategoryType, ProductType } from "@/types";

export const mockCategories: CategoryType[] = [
  {
    id: 1,
    name: "Clothing",
    description: "Premium designer apparel for all occasions",
  },
  {
    id: 2,
    name: "Jewellery",
    description: "Luxury traditional and contemporary jewelry",
  },
  {
    id: 3,
    name: "Accessories",
    description: "Luxury designer bags and accessories",
  },
  {
    id: 4,
    name: "Footwear",
    description: "Traditional designer footwear and juttis",
  }
];

export const mockProducts: ProductType[] = [
  {
    product_id: "prod_1",
    title: "Lavender Bloom Co-ord Set",
    description: "An exquisite lavender blossom ensemble tailored from premium breathable linen. Features hand-placed delicate floral embellishments, a modern structured silhouette, and loose matching trousers designed for effortless daylight elegance.",
    price: 4990,
    category_id: 1,
    stock: 10,
    image: "/images/products/product1.jpg",
    created_at: new Date().toISOString(),
  },
  {
    product_id: "prod_2",
    title: "Ivory Chikankari Saree",
    description: "A masterfully hand-woven pure ivory organza saree. Detailed with intricate Lucknowi Chikankari shadow work embroidery and finished with a delicate silver zari border, embodying traditional heritage with contemporary grace.",
    price: 6990,
    category_id: 1,
    stock: 8,
    image: "/images/products/product2.jpg",
    created_at: new Date().toISOString(),
  },
  {
    product_id: "prod_3",
    title: "Mustard Embroidered Kurta Set",
    description: "Artisan-crafted mustard silk-cotton flared kurta paired with straight-cut pants and an organza dupatta. Embellished with subtle gold Gota Patti work along the neckline, perfect for festive celebrations.",
    price: 3990,
    category_id: 1,
    stock: 12,
    image: "/images/products/product3.jpg",
    created_at: new Date().toISOString(),
  },
  {
    product_id: "prod_4",
    title: "Blush Anarkali Set",
    description: "A royal blush pink georgette Anarkali silhouette boasting a dramatic 24-kali flare. Features exquisite micro-pleating, hand-embroidered thread work, and a sheer dupatta with gold scalloped borders.",
    price: 7390,
    category_id: 1,
    stock: 5,
    image: "/images/products/product4.jpg",
    created_at: new Date().toISOString(),
  },
  {
    product_id: "prod_5",
    title: "Pink Phulkari Kurta Set",
    description: "A vibrant celebratory pink straight kurta set adorned with authentic hand-stitched Punjabi Phulkari geometric embroidery. Complemented by soft silk trousers and a contrasting heavy embroidered dupatta.",
    price: 4290,
    category_id: 1,
    stock: 15,
    image: "/images/products/product5.jpg",
    created_at: new Date().toISOString(),
  },
  {
    product_id: "prod_6",
    title: "Meera Jadau Earrings",
    description: "Stunning heirloom-quality gold-plated Jadau chandelier earrings. Set with premium raw uncut Kundan stones, real pearls, and delicate emerald beads drop, capturing the regal majesty of Rajasthan.",
    price: 2990,
    category_id: 2,
    stock: 4,
    image: "/images/products/product6.jpg",
    created_at: new Date().toISOString(),
  },
  {
    product_id: "prod_7",
    title: "Traditional Juttis",
    description: "Handcrafted pure leather Mojris featuring gold Dabka wirework, floral thread embroidery, and cushioned insoles. A perfect blend of cultural luxury and all-day walking comfort.",
    price: 2150,
    category_id: 4,
    stock: 20,
    image: "/images/products/product7.jpg",
    created_at: new Date().toISOString(),
  },
  {
    product_id: "prod_8",
    title: "Ivory Organza Saree",
    description: "A sheer luxury ivory silk-organza saree adorned with hand-painted pastel botanical motifs. Highlighted with fine pearl border embroidery and paired with an unstitched ivory satin blouse fabric.",
    price: 9450,
    category_id: 1,
    stock: 6,
    image: "/images/products/product8.jpg",
    created_at: new Date().toISOString(),
  }
];

export const getProductsWithCategories = () => {
  return mockProducts.map(product => ({
    ...product,
    category: mockCategories.find(c => c.id === product.category_id)
  }));
};
