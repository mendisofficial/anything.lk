"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { SelectedFilters } from "../../components/Filter";
import type { SearchFilterData } from "./useSearchFilters";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface SearchProductBrand { id: number; name: string }
export interface SearchProductModel { id: number; name: string; brand: SearchProductBrand }
export interface SearchProductColor { id: number; value: string }
export interface SearchProductStorage { id: number; value: string }
export interface SearchProductCondition { id: number; value: string }
export interface SearchProductStatus { id: number; Value?: string }

export interface SearchProduct {
    id: number;
    title: string;
    model: SearchProductModel;
    description: string;
    price: number;
    qty: number;
    color: SearchProductColor;
    storage: SearchProductStorage;
    condition: SearchProductCondition;
    status: SearchProductStatus;
    created_at: string;
    firstImage?: string;
}

export interface SearchProductResponse {
    status: boolean;
    productList: SearchProduct[];
    totalCount?: number;
}

const LARGE_PRICE = 1_000_000_000; // upper bound for open-ended ranges

const mapPriceRange = (priceId: string | null): { priceStart: number; priceEnd: number } | null => {
    if (!priceId) return null;
    switch (priceId) {
        case "gt_50k":
            return { priceStart: 50001, priceEnd: LARGE_PRICE };
        case "50_100k":
            return { priceStart: 50000, priceEnd: 100000 };
        case "200_300k":
            return { priceStart: 200000, priceEnd: 300000 };
        case "400_500k":
            return { priceStart: 400000, priceEnd: 500000 };
        case "lt_500k":
            return { priceStart: 0, priceEnd: 499999 };
        default:
            return null;
    }
};

const useProductSearch = (
    filters: SelectedFilters | null,
    meta: SearchFilterData | null,
) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<SearchProduct[] | null>(null);
    const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

    // Build request payload from filters + meta (gracefully handle missing filters/meta)
    const payload = useMemo(() => {
        const p: Record<string, unknown> = {};

        const f = filters ?? {
            brands: [],
            colors: [],
            conditions: [],
            storages: [],
            price: null as string | null,
        };

        // Map first selected value in each category (backend supports single value per field)
        if (meta) {
            if (f.brands.length > 0) {
                const b = meta.brandList.find((x) => x.id === f.brands[0]);
                if (b) p.brandName = b.name;
            }
            if (f.conditions.length > 0) {
                const c = meta.qualityList.find((x) => x.id === f.conditions[0]);
                if (c) p.conditionName = c.value;
            }
            if (f.colors.length > 0) {
                const c = meta.colorList.find((x) => x.id === f.colors[0]);
                if (c) p.colorName = c.value;
            }
            if (f.storages.length > 0) {
                const s = meta.storageList.find((x) => x.id === f.storages[0]);
                if (s) p.storageValue = s.value;
            }
        }

        const price = mapPriceRange(f.price);
        if (price) {
            p.priceStart = price.priceStart;
            p.priceEnd = price.priceEnd;
        }

        return p;
    }, [filters, meta]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.post<SearchProductResponse>(
                    `${API_BASE_URL}/SearchProducts`,
                    payload,
                    { withCredentials: true }
                );
                if (!cancelled) {
                    if (res.data?.status) {
                        setProducts(res.data.productList || []);
                        setTotalCount(res.data.totalCount);
                    } else {
                        setProducts([]);
                        setTotalCount(undefined);
                    }
                }
            } catch {
                if (!cancelled) {
                    setError("Failed to search products");
                    setProducts([]);
                    setTotalCount(undefined);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [payload]);

    return { products, loading, error, totalCount };
};

export default useProductSearch;
