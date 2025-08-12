"use client";

import { useState } from "react";
import axios from "axios";

export type CheckoutPayload = {
    isCurrentAddress: boolean;
    firstName: string;
    lastName: string;
    citySelect: string; // city id as string per backend
    lineOne: string;
    lineTwo: string;
    postalCode: string;
    mobile: string;
};

export type PayHereRequest = {
    sandbox: boolean;
    merchant_id: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    order_id: string;
    items: string;
    amount: string; // formatted string
    currency: string; // e.g., LKR
    hash: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
};

export type CheckoutResponse = {
    status: boolean;
    message?: string;
    payhereJson?: PayHereRequest;
};

export default function useCheckoutSubmit() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [submitting, setSubmitting] = useState(false);

    const submit = async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
        setSubmitting(true);
        try {
            if (!API_BASE_URL) throw new Error("API base URL is not configured");
            const res = await axios.post<CheckoutResponse>(
                `${API_BASE_URL}/CheckOut`,
                payload,
                { withCredentials: true }
            );
            return res.data;
        } catch (e) {
            let msg = "Checkout failed";
            if (axios.isAxiosError(e)) {
                type ErrorData = { message?: string } | string | undefined;
                const ed = e.response?.data as unknown as ErrorData;
                msg = typeof ed === "string" ? ed : ed?.message || e.message || msg;
            } else if (e instanceof Error) {
                msg = e.message;
            }
            return { status: false, message: msg };
        } finally {
            setSubmitting(false);
        }
    };

    return { submit, submitting };
}
