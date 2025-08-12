"use client";

import { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ProductSubmissionData {
    brandId: string;
    modelId: string;
    title: string;
    description: string;
    storageId: string;
    colorId: string;
    conditionId: string;
    price: string;
    qty: string;
    image1: File;
    image2: File;
    image3: File;
}

export interface ProductSubmissionResponse {
    status: boolean;
    message: string;
}

const useProductSubmission = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const submitProduct = async (data: ProductSubmissionData): Promise<ProductSubmissionResponse> => {
        setLoading(true);
        setError(null);

        try {
            // Create FormData object for multipart/form-data submission
            const formData = new FormData();

            // Append all text fields
            formData.append('brandId', data.brandId);
            formData.append('modelId', data.modelId);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('storageId', data.storageId);
            formData.append('colorId', data.colorId);
            formData.append('conditionId', data.conditionId);
            formData.append('price', data.price);
            formData.append('qty', data.qty);

            // Append image files
            formData.append('image1', data.image1);
            formData.append('image2', data.image2);
            formData.append('image3', data.image3);

            const response = await axios.post(`${API_BASE_URL}/SaveProduct`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setLoading(false);
            return {
                status: response.data.status || false,
                message: response.data.message || "Unknown error occurred",
            };
        } catch (error) {
            setLoading(false);
            console.error("Error submitting product:", error);

            let errorMessage = "An error occurred while submitting the product.";

            if (axios.isAxiosError(error)) {
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response?.status === 401) {
                    errorMessage = "You must be logged in to add a product.";
                } else if (error.response?.status === 403) {
                    errorMessage = "You don't have permission to add products.";
                } else if (error.response?.status && error.response.status >= 500) {
                    errorMessage = "Server error. Please try again later.";
                }
            }

            setError(errorMessage);
            return {
                status: false,
                message: errorMessage,
            };
        }
    };

    return {
        submitProduct,
        loading,
        error,
    };
};

export default useProductSubmission;
