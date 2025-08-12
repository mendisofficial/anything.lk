"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type TrendingCollection = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    productCount: number;
    previewImage?: string | null;
};

type TrendingCollectionsResponse = {
    status: boolean;
    message?: string;
    trendingCollections?: TrendingCollection[];
};

export default function useTrendingCollections() {
    const [collections, setCollections] = useState<TrendingCollection[] | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCollections = async () => {
        if (!API_BASE_URL) {
            setCollections([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get<TrendingCollectionsResponse>(
                `${API_BASE_URL}/TrendingCollections`
            );
            if (res.data?.status) {
                setCollections(res.data.trendingCollections ?? []);
            } else {
                setCollections([]);
                setError(res.data?.message || "Failed to load trending collections");
            }
        } catch {
            setCollections([]);
            setError("Failed to load trending collections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    return { collections, loading, error, refetch: fetchCollections };
}
