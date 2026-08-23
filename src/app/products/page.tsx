import { Suspense } from "react";
import AllProductsClient from "@/components/AllProductsClient";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AllProductsClient />
    </Suspense>
  );
}
