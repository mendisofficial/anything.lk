"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { City } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useCities = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/CityData`);
                const data: City[] = response.data;
                setCities(data.sort((a, b) => a.name.localeCompare(b.name)));
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

        fetchCities();
    }, []);

    return { cities, loading, error };
};

export default useCities;
