"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type CollectionProduct = {
    id: number;
    title: string;
    price: number;
    firstImage?: string;
};

export type CollectionMeta = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
};

type GetCollectionResponse = {
    status: boolean;
    message?: string;
    collection?: CollectionMeta;
    products?: CollectionProduct[];
};

export default function useCollection({
    slug,
    id,
}: {
    slug?: string | null;
    id?: string | number | null;
}) {
    const [collection, setCollection] = useState<CollectionMeta | null>(null);
    const [products, setProducts] = useState<CollectionProduct[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCollection = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (slug) params.set("slug", slug);
            if (id != null) params.set("id", String(id));
            const res = await axios.get<GetCollectionResponse>(
                `${API_BASE_URL}/GetCollection?${params.toString()}`
            );
            if (res.data?.status && res.data.collection) {
                setCollection(res.data.collection);
                setProducts(res.data.products ?? []);
            } else {
                setCollection(null);
                setProducts([]);
                setError(res.data?.message || "Collection not found");
            }
        } catch {
            setCollection(null);
            setProducts([]);
            setError("Failed to load collection");
        } finally {
            setLoading(false);
        }
    }, [slug, id]);

    useEffect(() => {
        if (slug || id != null) fetchCollection();
    }, [fetchCollection, slug, id]);

    return { collection, products, loading, error, refetch: fetchCollection };
}
