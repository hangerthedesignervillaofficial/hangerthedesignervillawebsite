import fs from 'fs';

const file = 'src/context/CartContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add debounce function at the top
content = content.replace(
  /import \{ cartService \} from "@\/services\/cart\/cartService";/,
  `import { cartService } from "@/services/cart/cartService";\nimport { supabase } from "@/lib/supabase/client";`
);

// Add useEffect to sync abandoned carts
const syncCode = `
  // Sync abandoned carts
  useEffect(() => {
    if (isLoading || cartItems.length === 0) return;
    
    const syncToDatabase = async () => {
      try {
        const sessionId = localStorage.getItem("hanger_session_id") || 
          \`sess-\${Math.random().toString(36).substring(2, 15)}\`;
          
        if (!localStorage.getItem("hanger_session_id")) {
          localStorage.setItem("hanger_session_id", sessionId);
        }

        const cartData = cartItems.map(item => ({
          product_id: item.product_id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selected_size: (item as any).selected_size || null
        }));

        await supabase.from('abandoned_carts').upsert({
          session_id: sessionId,
          email: user?.email || null,
          cart_data: cartData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'session_id' });
      } catch (err) {
        console.error("Failed to sync abandoned cart", err);
      }
    };

    const timeoutId = setTimeout(syncToDatabase, 3000);
    return () => clearTimeout(timeoutId);
  }, [cartItems, user, isLoading]);
`;

content = content.replace(
  /\/\/ Calculate totals when cartItems change/,
  `${syncCode}\n  // Calculate totals when cartItems change`
);

fs.writeFileSync(file, content);
console.log("Updated CartContext.tsx for Abandoned Carts");
