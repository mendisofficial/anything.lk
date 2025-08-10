"use client";

import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ActionResponse = { status: boolean; message?: string };

const useCartActions = () => {
    const { success, error } = useToast();
    const [updating, setUpdating] = useState<Set<number>>(new Set());
    const [removing, setRemoving] = useState<Set<number>>(new Set());

    const setBusy = (set: React.Dispatch<React.SetStateAction<Set<number>>>, id: number, busy: boolean) => {
        set((prev) => {
            const next = new Set(prev);
            if (busy) next.add(id);
            else next.delete(id);
            return next as Set<number>;
        });
    };

    const updateQty = useCallback(async (productId: number, qty: number): Promise<ActionResponse> => {
        if (!API_BASE_URL) return { status: false, message: "API base URL is not configured" };
        setBusy(setUpdating, productId, true);
        try {
            const url = `${API_BASE_URL}/UpdateCartQty`;
            const params = new URLSearchParams({ prId: String(productId), qty: String(qty) });
            const res = await axios.get<ActionResponse>(`${url}?${params.toString()}`, { withCredentials: true });
            const data = res.data || { status: false, message: "No response" };
            if (data.status) success(data.message || "Cart updated");
            else error(data.message || "Failed to update cart");
            return data;
        } catch (e) {
            let msg = "Failed to update cart";
            if (axios.isAxiosError(e)) {
                type ErrorData = { message?: string } | string | undefined;
                const ed = e.response?.data as unknown as ErrorData;
                msg = typeof ed === "string" ? ed : ed?.message || e.message || msg;
            } else if (e instanceof Error) {
                msg = e.message || msg;
            }
            error(msg);
            return { status: false, message: msg };
        } finally {
            setBusy(setUpdating, productId, false);
        }
    }, [success, error]);

    const removeItem = useCallback(async (productId: number): Promise<ActionResponse> => {
        if (!API_BASE_URL) return { status: false, message: "API base URL is not configured" };
        setBusy(setRemoving, productId, true);
        try {
            const url = `${API_BASE_URL}/RemoveFromCart`;
            const params = new URLSearchParams({ prId: String(productId) });
            const res = await axios.get<ActionResponse>(`${url}?${params.toString()}`, { withCredentials: true });
            const data = res.data || { status: false, message: "No response" };
            if (data.status) success(data.message || "Removed from cart");
            else error(data.message || "Failed to remove item");
            return data;
        } catch (e) {
            let msg = "Failed to remove item";
            if (axios.isAxiosError(e)) {
                type ErrorData = { message?: string } | string | undefined;
                const ed = e.response?.data as unknown as ErrorData;
                msg = typeof ed === "string" ? ed : ed?.message || e.message || msg;
            } else if (e instanceof Error) {
                msg = e.message || msg;
            }
            error(msg);
            return { status: false, message: msg };
        } finally {
            setBusy(setRemoving, productId, false);
        }
    }, [success, error]);

    const isUpdating = useCallback((productId: number) => updating.has(productId), [updating]);
    const isRemoving = useCallback((productId: number) => removing.has(productId), [removing]);

    return useMemo(() => ({ updateQty, removeItem, isUpdating, isRemoving }), [updateQty, removeItem, isUpdating, isRemoving]);
};

export default useCartActions;
