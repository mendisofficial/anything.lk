"use client";

import { useParams } from "next/navigation";
import StoreFrontTemplate from "@/app/components/StoreFrontTemplate";
import useCollection from "../hooks/useCollection";
import { Loading } from "@/app/components/Loading";
import ProductGrid from "@/app/components/ProductGrid";

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || null;
  const { collection, products, loading, error, refetch } = useCollection({
    slug,
  });

  if (loading) {
    return (
      <StoreFrontTemplate>
        <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
          <Loading />
        </main>
      </StoreFrontTemplate>
    );
  }

  if (error || !collection) {
    return (
      <StoreFrontTemplate>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Collection Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {error || "This collection is unavailable or private."}
            </p>
            <button
              onClick={refetch}
              className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover"
            >
              Retry
            </button>
          </div>
        </main>
      </StoreFrontTemplate>
    );
  }

  return (
    <StoreFrontTemplate>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="mt-1 text-sm text-gray-600">
                {collection.description}
              </p>
            )}
          </div>
          <button
            onClick={refetch}
            className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover"
          >
            Refresh
          </button>
        </div>

        <div className="mt-8">
          <ProductGrid products={products ?? []} loading={loading} />
        </div>
      </main>
    </StoreFrontTemplate>
  );
}
