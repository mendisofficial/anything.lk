"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CartProduct {
    id: number;
    title: string;
    price: number;
    qty?: number; // available qty in stock
    firstImage?: string | null;
    color?: { value?: string };
    model?: { brand?: { name?: string } };
}

export interface CartItem {
    qty: number; // quantity in cart
    product: CartProduct;
}

export interface LoadCartItemsResponse {
    status: boolean;
    message?: string;
    cartItems?: CartItem[];
}

const useCartItems = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const syncSessionCart = useCallback(async () => {
        if (!API_BASE_URL) return;
        try {
            await axios.get(`${API_BASE_URL}/CheckSessionCart`, { withCredentials: true });
        } catch {
            // it's okay to ignore errors here; this is best-effort
        }
    }, []);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!API_BASE_URL) throw new Error("API base URL is not configured");
            const res = await axios.get<LoadCartItemsResponse>(
                `${API_BASE_URL}/LoadCartItems`,
                { withCredentials: true }
            );
            const data = res.data;
            if (data.status && Array.isArray(data.cartItems)) {
                setItems(data.cartItems);
            } else {
                setItems([]);
                setError(data.message || "Your cart is empty");
            }
        } catch (e) {
            let msg = "Failed to load cart";
            if (axios.isAxiosError(e)) {
                type ErrorData = { message?: string } | string | undefined;
                const ed = e.response?.data as unknown as ErrorData;
                msg = typeof ed === "string" ? ed : ed?.message || e.message || msg;
            } else if (e instanceof Error) {
                msg = e.message;
            }
            setError(msg);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Best-effort sync and then load cart items
        (async () => {
            await syncSessionCart();
            await fetchCart();
        })();
    }, [syncSessionCart, fetchCart]);

    const subtotal = useMemo(
        () => items.reduce((sum, it) => sum + (it.product?.price || 0) * (it.qty || 0), 0),
        [items]
    );

    return { items, loading, error, subtotal, refetch: fetchCart };
};

export default useCartItems;
