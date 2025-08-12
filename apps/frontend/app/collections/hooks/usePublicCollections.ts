"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type PublicCollection = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    productCount: number;
    previewImage?: string;
};

type PublicCollectionsResponse = {
    status: boolean;
    message?: string;
    collections?: PublicCollection[];
};

export default function usePublicCollections() {
    const [collections, setCollections] = useState<PublicCollection[] | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCollections = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get<PublicCollectionsResponse>(
                `${API_BASE_URL}/PublicCollections`
            );
            if (res.data?.status) {
                setCollections(res.data.collections ?? []);
            } else {
                setCollections([]);
                setError(res.data?.message || "Failed to load collections");
            }
        } catch {
            setCollections([]);
            setError("Failed to load collections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    return { collections, loading, error, refetch: fetchCollections };
}
