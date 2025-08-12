"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

type City = {
    id: number;
    name: string;
    district?: string | null;
};

type DeliveryType = {
    id: number;
    name: string;
    price: number;
};

type Product = {
    id: number;
    title: string;
    price: number;
    qty?: number | null;
    firstImage?: string | null;
    model?: { brand?: { name?: string } | null } | null;
    color?: { value?: string } | null;
};

type CartItem = {
    id: number;
    qty: number;
    product: Product;
};

type AddressUser = {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
};

type Address = {
    id: number;
    firstName: string;
    lastName: string;
    lineOne: string;
    lineTwo: string;
    postalCode: string;
    mobile: string;
    city: City;
    user?: AddressUser;
};

type ApiResponse = {
    status: boolean;
    message?: string;
    userAddress?: Address;
    cityList?: City[];
    cartList?: CartItem[];
    deliveryTypes?: DeliveryType[];
};

export default function useCheckoutData() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userAddress, setUserAddress] = useState<Address | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);

    const subtotal = useMemo(
        () =>
            cart.reduce((sum, it) => sum + (it.qty || 0) * (it.product?.price || 0), 0),
        [cart]
    );

    const totalQty = useMemo(
        () => cart.reduce((sum, it) => sum + (it.qty || 0), 0),
        [cart]
    );

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!API_BASE_URL) throw new Error("API base URL is not configured");
            const res = await axios.get<ApiResponse>(
                `${API_BASE_URL}/LoadCheckOutData`,
                { withCredentials: true }
            );
            console.log("Checkout data response:", res);
            const data = res.data;
            if (!data.status) {
                setError(data.message || "Failed to load checkout data");
            }
            setUserAddress(data.userAddress ?? null);
            setCities(data.cityList ?? []);
            setCart(data.cartList ?? []);
            setDeliveryTypes(data.deliveryTypes ?? []);
        } catch (e) {
            let msg = "Failed to load checkout data";
            if (axios.isAxiosError(e)) {
                const status = e.response?.status;
                if (status === 401) {
                    msg = "Please sign in to continue";
                } else {
                    type ErrorData = { message?: string } | string | undefined;
                    const ed = e.response?.data as unknown as ErrorData;
                    msg = typeof ed === "string" ? ed : ed?.message || e.message || msg;
                }
            } else if (e instanceof Error) {
                msg = e.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return {
        loading,
        error,
        userAddress,
        cities,
        cart,
        deliveryTypes,
        subtotal,
        totalQty,
        refetch,
    };
}
