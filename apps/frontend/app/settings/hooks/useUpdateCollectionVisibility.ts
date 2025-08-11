"use client";

import axios from "axios";
import { useState } from "react";
import { useToast } from "@/app/context/ToastContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type UpdateVisibilityResponse = {
    status: boolean;
    message?: string;
};

export default function useUpdateCollectionVisibility({
    onDone,
}: {
    onDone?: () => void;
}) {
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const toast = useToast();

    const toggleVisibility = async (collectionId: number, isPublic: boolean) => {
        setUpdatingId(collectionId);
        try {
            const res = await axios.post<UpdateVisibilityResponse>(
                `${API_BASE_URL}/UpdateCollectionVisibility`,
                { collectionId, isPublic },
                { withCredentials: true }
            );
            if (res.data?.status) {
                toast.success(res.data.message || "Collection updated");
                onDone?.();
            } else {
                toast.error(res.data?.message || "Failed to update collection");
            }
        } catch {
            toast.error("Failed to update collection");
        } finally {
            setUpdatingId(null);
        }
    };

    return { toggleVisibility, updatingId };
}
