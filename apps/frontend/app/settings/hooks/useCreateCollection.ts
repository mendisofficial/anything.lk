"use client";

import axios from "axios";
import { useState } from "react";
import { useToast } from "@/app/context/ToastContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type CreateCollectionResponse = {
    status: boolean;
    message?: string;
    collection?: { id: number; slug: string };
};

export type CreateCollectionPayload = {
    name: string;
    description?: string;
    isPublic: boolean;
};

export default function useCreateCollection({
    onDone,
}: {
    onDone?: () => void;
}) {
    const [creating, setCreating] = useState(false);
    const toast = useToast();

    const create = async (payload: CreateCollectionPayload): Promise<boolean> => {
        if (!payload?.name?.trim()) {
            toast.error("Collection name is required");
            return false;
        }
        setCreating(true);
        try {
            const res = await axios.post<CreateCollectionResponse>(
                `${API_BASE_URL}/CreateCollection`,
                payload,
                { withCredentials: true }
            );
            if (res.data?.status) {
                toast.success("Collection created");
                onDone?.();
                return true;
            } else {
                toast.error(res.data?.message || "Failed to create collection");
                return false;
            }
        } catch {
            toast.error("Failed to create collection");
            return false;
        } finally {
            setCreating(false);
        }
    };

    return { create, creating };
}
