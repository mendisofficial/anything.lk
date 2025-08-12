"use client";

import { useCallback, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type AddToCartResponse = {
    status: boolean;
    message?: string;
};

type UseAddToCartReturn = {
    addToCart: (productId: number, qty?: number) => Promise<AddToCartResponse>;
    loading: boolean;
    error: string | null;
    lastResponse: AddToCartResponse | null;
};

const useAddToCart = (): UseAddToCartReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastResponse, setLastResponse] = useState<AddToCartResponse | null>(
        null
    );

    const addToCart = useCallback(async (productId: number, qty = 1) => {
        setLoading(true);
        setError(null);

        try {
            if (!API_BASE_URL) throw new Error("API base URL is not configured");
            const url = `${API_BASE_URL}/AddToCart`;
            const params = new URLSearchParams({ prId: String(productId), qty: String(qty) });
            const res = await axios.get<AddToCartResponse>(`${url}?${params.toString()}`, {
                withCredentials: true,
            });
            const data = res.data ?? { status: false, message: "No response" };
            setLastResponse(data);
            if (!data.status) {
                setError(data.message || "Failed to add to cart");
            }
            return data;
        } catch (e) {
            let msg = "Failed to add to cart";
            if (axios.isAxiosError(e)) {
                type ErrorData = { message?: string } | string | undefined;
                const data = e.response?.data as unknown as ErrorData;
                if (typeof data === "string") {
                    msg = data || e.message || msg;
                } else {
                    msg = (data?.message as string | undefined) || e.message || msg;
                }
            } else if (e instanceof Error) {
                msg = e.message;
            }
            const fallback: AddToCartResponse = { status: false, message: msg };
            setError(msg);
            setLastResponse(fallback);
            return fallback;
        } finally {
            setLoading(false);
        }
    }, []);

    return { addToCart, loading, error, lastResponse };
};

export default useAddToCart;
