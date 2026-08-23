import { CheckoutClient } from "@/app/checkout/CheckoutClient";

// Auth is handled client-side in CheckoutClient to support both
// Supabase sessions and mock/guest users stored in localStorage
export default function CheckoutPage() {
  return <CheckoutClient />;
}
