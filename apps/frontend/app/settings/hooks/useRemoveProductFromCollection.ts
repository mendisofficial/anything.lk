"use client";

import axios from "axios";
import { useState } from "react";
import { useToast } from "@/app/context/ToastContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RemoveResponse = {
    status: boolean;
    message?: string;
};

export default function useRemoveProductFromCollection() {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const remove = async (collectionId: number, productId: number) => {
        setLoading(true);
        try {
            const res = await axios.post<RemoveResponse>(
                `${API_BASE_URL}/RemoveProductFromCollection`,
                { collectionId, productId },
                { withCredentials: true }
            );
            if (res.data?.status) {
                toast.success(res.data.message || "Removed from collection");
            } else {
                toast.error(res.data?.message || "Failed to remove from collection");
            }
        } catch {
            toast.error("Failed to remove from collection");
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading };
}
