"use client";

import StoreFrontTemplate from "../components/StoreFrontTemplate";
import ProductOverview from "../components/ProductOverview";
import RelatedProducts from "../components/RelatedProducts";

export default function ProductPage() {
  return (
    <StoreFrontTemplate>
      <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <ProductOverview />
        <RelatedProducts />
      </main>
    </StoreFrontTemplate>
  );
}
