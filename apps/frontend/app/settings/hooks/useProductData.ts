"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Brand {
    id: number;
    name: string;
}

export interface Model {
    id: number;
    name: string;
    brand: Brand;
}

export interface Color {
    id: number;
    value: string;
}

export interface Condition {
    id: number;
    value: string;
}

export interface Storage {
    id: number;
    value: string;
}

export interface ProductData {
    brandList: Brand[];
    modelList: Model[];
    colorList: Color[];
    qualityList: Condition[];
    storageList: Storage[];
}

const useProductData = () => {
    const [productData, setProductData] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProductData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/LoadProductData`, {
                withCredentials: true,
            });

            // console.log("Full response:", response.data);
            // console.log("Response status:", response.data.status);
            // console.log("Brand list:", response.data.brandList);
            // console.log("Model list:", response.data.modelList);
            // console.log("Color list:", response.data.colorList);
            // console.log("Quality list:", response.data.qualityList);
            // console.log("Storage list:", response.data.storageList);

            if (response.data.status) {
                setProductData({
                    brandList: response.data.brandList || [],
                    modelList: response.data.modelList || [],
                    colorList: response.data.colorList || [],
                    qualityList: response.data.qualityList || [],
                    storageList: response.data.storageList || [],
                });
            } else {
                setError(new Error("Failed to load product data"));
            }
        } catch (error) {
            console.error("Failed to fetch product data:", error);
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
        fetchProductData();
    }, []);

    // Helper function to get models for a specific brand
    const getModelsForBrand = (brandId: number): Model[] => {
        if (!productData) return [];
        return productData.modelList.filter(model => model.brand.id === brandId);
    };

    return {
        productData,
        loading,
        error,
        refetch: fetchProductData,
        getModelsForBrand,
    };
};

export default useProductData;
