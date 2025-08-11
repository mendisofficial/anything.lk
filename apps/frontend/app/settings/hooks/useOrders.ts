"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types aligning to the provided backend servlet JSON
export interface OrderStatusDto { id: number; value: string }
export interface DeliveryTypeDto { id: number; name: string; price: number }
export interface OrderProductDto {
    id: number;
    title: string;
    price: number;
    firstImage?: string | null;
}
export interface OrderItemDto {
    id: number;
    qty: number;
    status?: OrderStatusDto;
    deliveryType?: DeliveryTypeDto;
    product?: OrderProductDto;
}
export interface OrderShippingDto {
    firstName?: string;
    lastName?: string;
    lineOne?: string;
    lineTwo?: string;
    postalCode?: string;
    mobile?: string;
    city?: string;
}
export interface OrderDto {
    id: number;
    createdAt?: number;
    items: OrderItemDto[];
    subtotal?: number;
    shipping?: number | OrderShippingDto; // backend currently uses number; may become object later
    total?: number;
}

interface OrderHistoryResponse {
    status: boolean;
    orders?: OrderDto[];
    message?: string;
}

const useOrders = () => {
    const [orders, setOrders] = useState<OrderDto[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get<OrderHistoryResponse>(
                `${API_BASE_URL}/OrderHistory`,
                { withCredentials: true }
            );
            if (res.data?.status) {
                setOrders(res.data.orders ?? []);
            } else {
                setOrders([]);
                setError(res.data?.message || "Failed to load orders");
            }
        } catch {
            setOrders([]);
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return { orders, loading, error, refetch: fetchOrders };
};

export default useOrders;
