"use client";

import StoreFrontTemplate from "../components/StoreFrontTemplate";
import usePublicCollections from "./hooks/usePublicCollections";
import Link from "next/link";
import Image from "next/image";

export default function CollectionsListPage() {
  const { collections, loading, error, refetch } = usePublicCollections();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const joinUrl = (base: string, path?: string) => {
    if (!path) return "https://placehold.co/600x400";
    const b = base.replace(/\/?$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${b}${p}`;
  };

  return (
    <StoreFrontTemplate>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Collections
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Discover curated product collections.
            </p>
          </div>
          <button
            onClick={refetch}
            className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-magenta disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-gray-100 h-72 animate-pulse"
              />
            ))}

          {!loading &&
            Array.isArray(collections) &&
            collections.length === 0 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-500">
                No collections yet.
              </div>
            )}

          {!loading &&
            Array.isArray(collections) &&
            collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition"
              >
                <div className="aspect-[3/2] bg-gray-100">
                  <Image
                    alt={c.name}
                    src={joinUrl(apiBase, c.previewImage)}
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
      </main>
    </StoreFrontTemplate>
  );
}
