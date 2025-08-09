"use client";

import Link from "next/link";
import Image from "next/image";

// helpers
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Minimal shape expected from search results
interface GridProduct {
  id: number;
  title: string;
  price: number;
  firstImage?: string;
  model?: { brand?: { name?: string } };
  color?: { value?: string };
}

interface ProductGridProps {
  products?: GridProduct[] | null;
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return (
    <section
      aria-labelledby="products-heading"
      className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8"
    >
      <h2 id="products-heading" className="sr-only">
        Products
      </h2>

      <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
        {loading &&
          range(8).map((i) => (
            <div
              key={i}
              className="group relative border-r border-b border-gray-200 p-4 sm:p-6"
            >
              <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
              <div className="pt-10 pb-4 text-center">
                <div className="mx-auto h-4 w-3/5 bg-gray-200 rounded animate-pulse" />
                <div className="mx-auto mt-3 h-3 w-2/5 bg-gray-100 rounded animate-pulse" />
                <div className="mx-auto mt-4 h-5 w-1/5 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        {!loading &&
          Array.isArray(products) &&
          products.length > 0 &&
          products.map((product) => {
            const imageSrc = product.firstImage
              ? `${apiBase}${product.firstImage}`
              : "https://placehold.co/400x400";
            const brand = product.model?.brand?.name || "";
            const color = product.color?.value || "";
            return (
              <div
                key={product.id}
                className="group relative border-r border-b border-gray-200 p-4 sm:p-6"
              >
                <Image
                  alt={product.title}
                  src={imageSrc}
                  width={500}
                  height={500}
                  className="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75"
                />
                <div className="pt-10 pb-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    <Link href={`/product?id=${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </Link>
                  </h3>
                  {(brand || color) && (
                    <p className="mt-1 text-xs text-gray-500">
                      {[brand, color].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-4 text-base font-medium text-gray-900">
                    LKR {product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        {!loading && Array.isArray(products) && products.length === 0 && (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 p-8 text-center text-sm text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </section>
  );
}
