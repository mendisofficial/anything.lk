"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "./ProductGrid";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Minimal type expected by ProductGrid
type GridProduct = {
  id: number;
  title: string;
  price: number;
  firstImage?: string;
  model?: { brand?: { name?: string } };
  color?: { value?: string };
};

type TrendingResponse = {
  status: boolean;
  trendingProducts?: Array<{
    id: number;
    title: string;
    price: number;
    firstImage?: string | null; // provided by backend helper
    model?: { brand?: { name?: string } };
    color?: { value?: string };
  }>;
  message?: string;
};

export default function TrendingProducts() {
  const [products, setProducts] = useState<GridProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!API_BASE_URL) {
        setProducts([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<TrendingResponse>(
          `${API_BASE_URL}/TrendingProducts`,
          { withCredentials: true }
        );
        if (cancelled) return;
        if (res.data?.status && Array.isArray(res.data.trendingProducts)) {
          const mapped: GridProduct[] = res.data.trendingProducts.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            // backend returns relative like "product-images/123/image1.jpg"
            firstImage: p.firstImage || undefined,
            model: p.model,
            color: p.color,
          }));
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load trending products");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-32">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
          <h2
            id="trending-heading"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Trending products
          </h2>
        </div>

        <div className="relative mt-8">
          <ProductGrid products={products || []} loading={loading} />
          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </section>
  );
}
