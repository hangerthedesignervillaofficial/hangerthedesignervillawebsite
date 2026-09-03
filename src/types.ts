export interface ProductType {
  product_id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  video_url?: string;
  gallery?: string[];
  stock: number;
  sku?: string;
  category_id?: number;
  tags?: string[];
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  sizes?: string[];
  display_tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItemType {
  id: number;
  cart_id: number;
  product_id: string;
  quantity: number;
  price: number;
  selected_size?: string;
  created_at: string;
  updated_at: string;
  product?: ProductType;
}

export type CartStatus = "active" | "abandoned" | "converted";

export interface CartType {
  id: number;
  user_id: string;
  status: CartStatus;
  created_at: string;
  updated_at: string;
  total_items: number;
  total_price: number;
  cart_items?: CartItemType[];
}

export interface OrderItemType {
  id: number;
  order_id: number;
  quantity: number;
  price: number;
  selected_size?: string;
  product_id: string;
  product?: {
    product_id: string;
    title: string;
    image?: string;
  };
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "packed"
  | "dispatched"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderType {
  id: number;
  display_id?: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  shipping_address_id: number;
  payment_method?: string;
  payment_id?: string;
  cancellation_reason?: string;
  cancellation_status?: 'none' | 'requested' | 'approved' | 'rejected';
  expected_delivery_date?: string;
  created_at?: string;
  updated_at?: string;
  order_items?: OrderItemType[];
}

export interface AddressType {
  id: number;
  user_id: string;
  street: string;
  city: string;
  state?: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export interface ProfileType {
  profile_id: string;
  username?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  role: "admin" | "user";
  created_at: string;
  updated_at?: string;
}

export interface ReviewType {
  id: number;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface CategoryType {
  id: number;
  name: string;
  description: string;
  parent_id?: number;
}
