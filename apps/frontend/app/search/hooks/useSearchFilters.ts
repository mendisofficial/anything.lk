"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Brand {
    id: number;
    name: string;
}

export interface Color {
    id: number;
    value: string;
}

export interface Condition {
    id: number;
    value: string;
}

export interface Storage {
    id: number;
    value: string;
}

export interface SearchFilterData {
    brandList: Brand[];
    colorList: Color[];
    qualityList: Condition[];
    storageList: Storage[];
}

const useSearchFilters = () => {
    const [data, setData] = useState<SearchFilterData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/LoadProductData`, {
                withCredentials: true,
            });
            if (res.data?.status) {
                setData({
                    brandList: res.data.brandList || [],
                    colorList: res.data.colorList || [],
                    qualityList: res.data.qualityList || [],
                    storageList: res.data.storageList || [],
                });
            } else {
                setError("Failed to load filters");
            }
        } catch {
            setError("Failed to load filters");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refetch: fetchData };
};

export default useSearchFilters;
