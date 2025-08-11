import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export type PendingProduct = {
    id: number;
    title: string;
    price: number;
    firstImage?: string;
    // extra fields safe from backend
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export default function usePendingProducts() {
    const [products, setProducts] = useState<PendingProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPending = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/ListPendingProducts`, {
                withCredentials: true,
            });
            console.log("Pending products response:", res);
            if (res.data?.status) {
                setProducts(res.data.pendingProducts || []);
            } else {
                setError(res.data?.message || "Failed to load pending products");
            }
        } catch (err) {
            const e = err as unknown as { response?: { data?: { message?: string } }; message?: string };
            setError(e?.response?.data?.message || e?.message || "Request failed");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const approve = useCallback(async (productId: number) => {
        try {
            const params = new URLSearchParams({ productId: String(productId) });
            const res = await axios.post(
                `${API_BASE_URL}/admin/ApproveProduct?${params.toString()}`,
                {},
                { withCredentials: true }
            );
            if (!res.data?.status) {
                throw new Error(res.data?.message || "Approve failed");
            }
            // optimistic update
            setProducts((prev) => prev.filter((p) => p.id !== productId));
            return { ok: true } as const;
        } catch (err) {
            const e = err as { message?: string };
            return { ok: false, message: e?.message || "Approve failed" } as const;
        }
    }, []);

    return { products, loading, error, refetch: fetchPending, approve } as const;
}
