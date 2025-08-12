"use client";

import { useCallback } from "react";
import type { PayHereRequest } from "./useCheckoutSubmit";

// Minimal runtime type for global payhere object
declare global {
    interface Window {
        payhere?: {
            startPayment: (params: PayHereRequest) => void;
            onCompleted?: (orderId: string) => void;
            onDismissed?: () => void;
            onError?: (error: string) => void;
        };
    }
}

export default function usePayHere() {
    const ensureLoaded = useCallback(async () => {
        if (typeof window === "undefined") return false;
        if (window.payhere) return true;

        // Use PayHere hosted script
        await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://www.payhere.lk/lib/payhere.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load PayHere SDK"));
            document.head.appendChild(script);
        });
        return !!window.payhere;
    }, []);

    const startPayment = useCallback(async (payload: PayHereRequest) => {
        const ok = await ensureLoaded();
        if (!ok) throw new Error("PayHere SDK not available");
        window.payhere!.startPayment(payload);
    }, [ensureLoaded]);

    return { ensureLoaded, startPayment };
}
