"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "../product/hooks/useSingleProduct";

interface RelatedProductsProps {
  products: Product[];
  similarProductImages: string[][];
}

export default function RelatedProducts({
  products,
  similarProductImages,
}: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-heading" className="mt-16 sm:mt-24">
      <h2 id="related-heading" className="text-lg font-medium text-gray-900">
        Related Products
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.slice(0, 4).map((product, index) => {
          // Get the first image for this product from similarProductImages
          const productImages = similarProductImages[index] || [];
          const firstImage =
            productImages.length > 0
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${productImages[0]}`
              : `${process.env.NEXT_PUBLIC_API_BASE_URL}/product-images/${product.id}/image1.png`;

          return (
            <div key={product.id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-auto lg:h-80">
                <Image
                  alt={product.title}
                  src={firstImage}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/400x400";
                  }}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/product?id=${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.model.brand.name} - {product.color.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {product.condition.value}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    LKR {product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{product.qty} left</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
