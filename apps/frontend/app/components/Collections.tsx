"use client";

import Link from "next/link";
import Image from "next/image";
import useTrendingCollections from "../collections/hooks/useTrendingCollections";

export default function Collections() {
  const { collections, loading, error } = useTrendingCollections();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const joinUrl = (base: string, path?: string | null) => {
    if (!path) return "https://placehold.co/600x400";
    const b = base.replace(/\/?$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${b}${p}`;
  };

  return (
    <section aria-labelledby="collections-heading" className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto py-16 sm:py-24 lg:py-32">
          <h2
            id="collections-heading"
            className="text-2xl font-bold text-gray-900"
          >
            Trending collections
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white p-2 border border-gray-200"
                >
                  <div className="aspect-[3/2] rounded-md bg-gray-200 animate-pulse" />
                  <div className="p-4">
                    <div className="h-4 w-3/5 bg-gray-200 rounded animate-pulse" />
                    <div className="mt-2 h-3 w-2/5 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}

            {!loading &&
              Array.isArray(collections) &&
              collections.length === 0 && (
                <div className="sm:col-span-2 lg:col-span-4">
                  <div className="rounded-lg border border-gray-200 bg-white p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        Browse Collections
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Explore curated sets of products created by sellers.
                      </p>
                    </div>
                    <Link
                      href="/collections"
                      className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover"
                    >
                      View Collections
                    </Link>
                  </div>
                </div>
              )}

            {!loading &&
              Array.isArray(collections) &&
              collections.map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  className="group relative rounded-lg overflow-hidden border border-gray-200 bg-white hover:shadow-md transition"
                >
                  <div className="aspect-[3/2] bg-gray-100">
                    <Image
                      alt={c.name}
                      src={joinUrl(apiBase, c.previewImage || undefined)}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-vivid-magenta">
                      {c.name}
                    </h3>
                    {c.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {c.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      {c.productCount} products
                    </p>
                  </div>
                </Link>
              ))}
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-8 flex">
            <Link
              href="/collections"
              className="ml-auto rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover"
            >
              View all collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
