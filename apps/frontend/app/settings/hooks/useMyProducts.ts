"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types aligned with SearchProducts but minimal fields used by ProductGrid
export interface MyProductBrand { id: number; name?: string }
export interface MyProductModel { id: number; name?: string; brand?: MyProductBrand }
export interface MyProductColor { id: number; value?: string }

export interface MyProduct {
    id: number;
    title: string;
    price: number;
    firstImage?: string;
    model?: MyProductModel;
    color?: MyProductColor;
}

interface MyProductsResponse {
    status: boolean;
    productList?: MyProduct[];
    message?: string;
}

const useMyProducts = () => {
    const [products, setProducts] = useState<MyProduct[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get<MyProductsResponse>(
                `${API_BASE_URL}/LoadMyProducts`,
                { withCredentials: true }
            );
            if (res.data?.status) {
                setProducts(res.data.productList ?? []);
            } else {
                setProducts([]);
                setError(res.data?.message || "Failed to load your products");
            }
        } catch {
            setProducts([]);
            setError("Failed to load your products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, error, refetch: fetchProducts };
};

export default useMyProducts;
