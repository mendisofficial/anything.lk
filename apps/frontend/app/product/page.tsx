"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import StoreFrontTemplate from "../components/StoreFrontTemplate";
import RelatedProducts from "../components/RelatedProducts";
import { Loading } from "../components/Loading";
import useSingleProduct from "./hooks/useSingleProduct";
import ProductOverview from "../components/ProductOverview";

function ProductPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const {
    product,
    productImages,
    relatedProducts,
    similarProductImages,
    loading,
    error,
  } = useSingleProduct(productId);

  if (loading) {
    return (
      <StoreFrontTemplate>
        <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
          <Loading />
        </main>
      </StoreFrontTemplate>
    );
  }

  if (error) {
    return (
      <StoreFrontTemplate>
        <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </StoreFrontTemplate>
    );
  }

  return (
    <StoreFrontTemplate>
      <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <ProductOverview product={product} productImages={productImages} />
        <RelatedProducts
          products={relatedProducts}
          similarProductImages={similarProductImages}
        />
      </main>
    </StoreFrontTemplate>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <StoreFrontTemplate>
          <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
            <Loading />
          </main>
        </StoreFrontTemplate>
      }
    >
      <ProductPageContent />
    </Suspense>
  );
}
