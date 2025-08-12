"use client";

import axios from "axios";
import { useState } from "react";
import { useToast } from "@/app/context/ToastContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type AddResponse = {
    status: boolean;
    message?: string;
};

export default function useAddProductToCollection() {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const add = async (collectionId: number, productId: number) => {
        setLoading(true);
        try {
            const res = await axios.post<AddResponse>(
                `${API_BASE_URL}/AddProductToCollection`,
                { collectionId, productId },
                { withCredentials: true }
            );
            if (res.data?.status) {
                toast.success(res.data.message || "Added to collection");
            } else {
                toast.error(res.data?.message || "Failed to add to collection");
            }
        } catch {
            toast.error("Failed to add to collection");
        } finally {
            setLoading(false);
        }
    };

    return { add, loading };
}
