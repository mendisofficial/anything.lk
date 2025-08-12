"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type MyCollection = {
    id: number;
    name: string;
    slug: string;
    isPublic: boolean;
    productCount: number;
};

type LoadMyCollectionsResponse = {
    status: boolean;
    message?: string;
    collections?: MyCollection[];
};

export default function useMyCollections() {
    const [collections, setCollections] = useState<MyCollection[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCollections = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get<LoadMyCollectionsResponse>(
                `${API_BASE_URL}/LoadMyCollections`,
                { withCredentials: true }
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
