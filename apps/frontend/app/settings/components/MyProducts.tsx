"use client";

import ProductGrid from "@/app/components/ProductGrid";
import useMyProducts from "../hooks/useMyProducts";

export default function MyProducts() {
  const { products, loading, error, refetch } = useMyProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">
            My Products
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Manage the products you&apos;ve added.
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-magenta disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <ProductGrid products={products ?? []} loading={loading} />
    </div>
  );
}
