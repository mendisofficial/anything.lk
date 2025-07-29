"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ProductImage {
    id: number;
    name: string;
    src: string;
    alt: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
}

export interface Status {
    id: number;
    value: string;
}

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
    classes: string;
}

export interface Condition {
    id: number;
    value: string;
}

export interface Storage {
    id: number;
    value: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    qty: number;
    created_at: string;
    user: User;
    model: Model;
    color: Color;
    condition: Condition;
    storage: Storage;
    status: Status;
    rating: number;
}

export interface SingleProductResponse {
    status: boolean;
    message?: string;
    product: Product;
    productImages: string[];
    productList: Product[];
    similarProductImages: string[][];
}

// Color mapping for Tailwind CSS classes
export const COLOR_CLASS_MAPPING: { [key: string]: string } = {
    'Black': 'bg-gray-900 checked:outline-gray-900',
    'White': 'bg-white border border-gray-300 checked:outline-gray-400',
    'Blue': 'bg-blue-500 checked:outline-blue-500',
    'Green': 'bg-green-500 checked:outline-green-500',
    'Purple': 'bg-purple-500 checked:outline-purple-500',
    'Silver': 'bg-gray-300 checked:outline-gray-300',
    'Gold': 'bg-yellow-400 checked:outline-yellow-400',
    'Red': 'bg-red-500 checked:outline-red-500',
};

// Helper function to get color classes
export const getColorClasses = (colorValue: string): string => {
    return COLOR_CLASS_MAPPING[colorValue] || 'bg-gray-400 checked:outline-gray-400';
};

const useSingleProduct = (productId: string | null) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [productImages, setProductImages] = useState<ProductImage[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [similarProductImages, setSimilarProductImages] = useState<string[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSingleProduct = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/LoadSingleProduct?id=${id}`);
            console.log("Fetched product:", response);
            const data: SingleProductResponse = response.data;

            if (data.status) {
                // Add random rating and color classes for frontend display
                const productWithEnhancements = {
                    ...data.product,
                    rating: Math.floor(Math.random() * 5) + 1,
                    color: {
                        ...data.product.color,
                        classes: getColorClasses(data.product.color.value)
                    }
                };
                setProduct(productWithEnhancements);

                // Transform image URLs to full image objects for the UI
                const transformedImages: ProductImage[] = data.productImages.map((imagePath, index) => ({
                    id: index + 1,
                    name: `Product image ${index + 1}`,
                    src: `${API_BASE_URL}/${imagePath}`,
                    alt: `${data.product.title} - Image ${index + 1}`,
                }));

                setProductImages(transformedImages);

                // Add random ratings and color classes to related products as well
                const relatedProductsWithEnhancements = (data.productList || []).map(product => ({
                    ...product,
                    rating: Math.floor(Math.random() * 5) + 1,
                    color: {
                        ...product.color,
                        classes: getColorClasses(product.color.value)
                    }
                }));
                setRelatedProducts(relatedProductsWithEnhancements);

                // Store similar product images
                setSimilarProductImages(data.similarProductImages || []);
            } else {
                setError(data.message || "Product not found");
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setError("Product not found");
                } else {
                    setError(error.response?.data?.message || "Failed to load product");
                }
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchSingleProduct(productId);
        } else {
            setLoading(false);
            setError("Product ID is required");
        }
    }, [productId]);

    return {
        product,
        productImages,
        relatedProducts,
        similarProductImages,
        loading,
        error,
        refetch: () => productId && fetchSingleProduct(productId),
    };
};

export default useSingleProduct;
