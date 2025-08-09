"use client";

import Filter from "../components/Filter";
import ProductGrid from "../components/ProductGrid";
import StoreFrontTemplate from "../components/StoreFrontTemplate";
import useSearchFilters from "./hooks/useSearchFilters";
import useProductSearch from "./hooks/useProductSearch";
import { useState } from "react";
import type { SelectedFilters } from "../components/Filter";

export default function SearchPage() {
  const { data, loading, error } = useSearchFilters();
  const [selected, setSelected] = useState<SelectedFilters | null>(null);
  const { products, loading: searching } = useProductSearch(
    selected,
    data || null
  );

  const handleFiltersChange = (filters: SelectedFilters) => {
    setSelected(filters);
  };
  return (
    <StoreFrontTemplate>
      <main className="pb-24">
        <Filter
          data={data || undefined}
          loading={loading}
          error={error || undefined}
          onChange={handleFiltersChange}
        />
        <ProductGrid products={products || undefined} loading={searching} />
      </main>
    </StoreFrontTemplate>
  );
}
