"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Address, AddressPayload } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useAddresses = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [operationError, setOperationError] = useState<string | null>(null);
    const [operationSuccess, setOperationSuccess] = useState<string | null>(null);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/AddressManagement`, {
                withCredentials: true,
            });
            console.log("Fetched addresses:", response);
            if (response.data.status) {
                setAddresses(response.data.addressList || []);
            } else {
                setError(new Error(response.data.message || "Failed to fetch addresses"));
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error);
            } else if (error instanceof Error) {
                setError(error);
            } else {
                setError(new Error("An unknown error occurred"));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const addAddress = async (payload: AddressPayload) => {
        setIsAdding(true);
        setOperationError(null);
        setOperationSuccess(null);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/AddressManagement`,
                payload,
                {
                    withCredentials: true,
                }
            );
            if (response.data.status) {
                setOperationSuccess(response.data.message);
                await fetchAddresses(); // Refetch addresses
                return true;
            } else {
                setOperationError(response.data.message || "Failed to add address");
                return false;
            }
        } catch (error) {
            console.error("Failed to add address:", error);
            setOperationError("Failed to add address. Please try again later.");
            return false;
        } finally {
            setIsAdding(false);
        }
    };

    const updateAddress = async (payload: AddressPayload) => {
        setIsUpdating(true);
        setOperationError(null);
        setOperationSuccess(null);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/AddressManagement`,
                payload,
                {
                    withCredentials: true,
                }
            );
            if (response.data.status) {
                setOperationSuccess(response.data.message);
                await fetchAddresses(); // Refetch addresses
                return true;
            } else {
                setOperationError(response.data.message || "Failed to update address");
                return false;
            }
        } catch (error) {
            console.error("Failed to update address:", error);
            setOperationError("Failed to update address. Please try again later.");
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteAddress = async (addressId: number) => {
        setIsDeleting(true);
        setOperationError(null);
        setOperationSuccess(null);
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/AddressManagement?addressId=${addressId}`,
                {
                    withCredentials: true,
                }
            );
            if (response.data.status) {
                setOperationSuccess(response.data.message);
                await fetchAddresses(); // Refetch addresses
                return true;
            } else {
                setOperationError(response.data.message || "Failed to delete address");
                return false;
            }
        } catch (error) {
            console.error("Failed to delete address:", error);
            setOperationError("Failed to delete address. Please try again later.");
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    const clearMessages = () => {
        setOperationError(null);
        setOperationSuccess(null);
    };

    return {
        addresses,
        loading,
        error,
        addAddress,
        updateAddress,
        deleteAddress,
        isAdding,
        isUpdating,
        isDeleting,
        operationError,
        operationSuccess,
        clearMessages,
        refetch: fetchAddresses,
    };
};

export default useAddresses;
