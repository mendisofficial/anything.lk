"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import { useEffect, useMemo, useState } from "react";

// Types for incoming filter data
interface Brand {
  id: number;
  name: string;
}
interface Color {
  id: number;
  value: string;
}
interface Condition {
  id: number;
  value: string;
}
interface Storage {
  id: number;
  value: string;
}

interface SearchFilterData {
  brandList: Brand[];
  colorList: Color[];
  qualityList: Condition[]; // conditions
  storageList: Storage[];
}

export interface SelectedFilters {
  brands: number[];
  colors: number[];
  conditions: number[];
  storages: number[];
  price: string | null; // id of price range
}

interface FilterProps {
  data?: SearchFilterData | null;
  loading?: boolean;
  error?: string | null;
  onChange?: (filters: SelectedFilters) => void;
  initialFilters?: Partial<SelectedFilters>;
}

// Price options per spec
const PRICE_RANGES: {
  id: string;
  label: string;
  min?: number;
  max?: number;
}[] = [
  { id: "gt_50k", label: "> 50,000 LKR", min: 50001 },
  { id: "50_100k", label: "50,000 - 100,000 LKR", min: 50000, max: 100000 },
  { id: "200_300k", label: "200,000 - 300,000 LKR", min: 200000, max: 300000 },
  { id: "400_500k", label: "400,000 - 500,000 LKR", min: 400000, max: 500000 },
  { id: "lt_500k", label: "< 500,000 LKR", max: 499999 },
];

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Filter({
  data,
  loading,
  error,
  onChange,
  initialFilters,
}: FilterProps) {
  const [filters, setFilters] = useState<SelectedFilters>({
    brands: initialFilters?.brands || [],
    colors: initialFilters?.colors || [],
    conditions: initialFilters?.conditions || [],
    storages: initialFilters?.storages || [],
    price: initialFilters?.price || null,
  });

  // Emit changes to parent
  useEffect(() => {
    onChange?.(filters);
  }, [filters, onChange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.brands.length;
    count += filters.colors.length;
    count += filters.conditions.length;
    count += filters.storages.length;
    if (filters.price) count += 1;
    return count;
  }, [filters]);

  const toggleMulti = (
    key: keyof Pick<
      SelectedFilters,
      "brands" | "colors" | "conditions" | "storages"
    >,
    id: number
  ) => {
    setFilters((prev) => {
      const current = prev[key];
      const exists = current.includes(id);
      const updated = exists
        ? current.filter((i) => i !== id)
        : [...current, id];
      return { ...prev, [key]: updated };
    });
  };

  const setPrice = (id: string) => {
    setFilters((prev) => ({ ...prev, price: prev.price === id ? null : id }));
  };

  const clearAll = () => {
    setFilters({
      brands: [],
      colors: [],
      conditions: [],
      storages: [],
      price: null,
    });
  };

  return (
    <div className="bg-white">
      <div className="px-4 py-8 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Search Products
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-gray-500">
          Filter by brand, condition, color, storage and price to find what you
          need.
        </p>
      </div>

      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="grid items-center border-t border-b border-gray-200"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 py-3">
          <div className="mx-auto flex max-w-7xl divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
            <div className="pr-6">
              <DisclosureButton className="group flex items-center font-medium text-gray-700">
                <FunnelIcon
                  aria-hidden="true"
                  className="mr-2 size-5 flex-none text-gray-400 group-hover:text-gray-500"
                />
                {activeFilterCount}{" "}
                {activeFilterCount === 1 ? "Filter" : "Filters"}
              </DisclosureButton>
            </div>
            <div className="pl-6">
              <button
                type="button"
                onClick={clearAll}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={activeFilterCount === 0}
              >
                Clear all
              </button>
            </div>
          </div>
        </div>

        <DisclosurePanel className="border-t border-gray-200 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm">
            {loading && (
              <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((__, j) => (
                        <div key={j} className="h-3 w-24 bg-gray-100 rounded" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {error && <div className="text-sm text-red-600">{error}</div>}
            {data && !loading && (
              <div className="grid gap-y-10 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Brand */}
                <fieldset>
                  <legend className="block font-medium text-gray-900 mb-4">
                    Brand
                  </legend>
                  <div className="space-y-3 max-h-52 overflow-auto pr-1">
                    {data.brandList.map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.brands.includes(brand.id)}
                          onChange={() => toggleMulti("brands", brand.id)}
                        />
                        <span className="text-gray-600">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {/* Condition */}
                <fieldset>
                  <legend className="block font-medium text-gray-900 mb-4">
                    Condition
                  </legend>
                  <div className="space-y-3">
                    {data.qualityList.map((cond) => (
                      <label
                        key={cond.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.conditions.includes(cond.id)}
                          onChange={() => toggleMulti("conditions", cond.id)}
                        />
                        <span className="text-gray-600">{cond.value}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {/* Color */}
                <fieldset>
                  <legend className="block font-medium text-gray-900 mb-4">
                    Color
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {data.colorList.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => toggleMulti("colors", color.id)}
                        className={classNames(
                          "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition",
                          filters.colors.includes(color.id)
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        <span>{color.value}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                {/* Storage */}
                <fieldset>
                  <legend className="block font-medium text-gray-900 mb-4">
                    Storage
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {data.storageList.map((storage) => (
                      <button
                        key={storage.id}
                        type="button"
                        onClick={() => toggleMulti("storages", storage.id)}
                        className={classNames(
                          "rounded-md border px-3 py-1 text-xs font-medium transition",
                          filters.storages.includes(storage.id)
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        {storage.value}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {/* Price */}
                <fieldset>
                  <legend className="block font-medium text-gray-900 mb-4">
                    Price
                  </legend>
                  <div className="space-y-3">
                    {PRICE_RANGES.map((range) => (
                      <label
                        key={range.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="price"
                          className="size-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.price === range.id}
                          onChange={() => setPrice(range.id)}
                        />
                        <span className="text-gray-600">{range.label}</span>
                      </label>
                    ))}
                    {filters.price && (
                      <button
                        type="button"
                        className="mt-1 text-xs text-indigo-600 hover:underline"
                        onClick={() => setPrice(filters.price!)}
                      >
                        Clear price
                      </button>
                    )}
                  </div>
                </fieldset>
              </div>
            )}
          </div>
        </DisclosurePanel>
        {/* Removing the sort options for now */}
        {/* <div className="col-start-1 row-start-1 py-3">
          <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
            <Menu as="div" className="relative inline-block">
              <div className="flex">
                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      <a
                        href={option.href}
                        className={classNames(
                          option.current
                            ? "font-medium text-gray-900"
                            : "text-gray-500",
                          "block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden"
                        )}
                      >
                        {option.name}
                      </a>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>
          </div>
        </div> */}
      </Disclosure>
    </div>
  );
}
