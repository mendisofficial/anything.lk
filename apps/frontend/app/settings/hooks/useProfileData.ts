"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
    ProfileData,
    ProfileUpdatePayload,
    PasswordUpdatePayload,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useProfileData = () => {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(
        null
    );
    const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/MyAccount`, {
                withCredentials: true,
            });
            setProfileData(response.data);
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
        fetchProfileData();
    }, []);

    const updateProfile = async (payload: ProfileUpdatePayload) => {
        setIsUpdating(true);
        setUpdateError(null);
        try {
            const response = await axios.put(
                `${API_BASE_URL}/MyAccount`,
                payload,
                {
                    withCredentials: true,
                }
            );
            console.log("Update response:", response);
            if (response.data.status) {
                await fetchProfileData(); // Refetch data on success
            } else {
                setUpdateError(response.data.message || "An unknown error occurred.");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            setUpdateError("Failed to update profile. Please try again later.");
        } finally {
            setIsUpdating(false);
        }
    };

    const updatePassword = async (payload: PasswordUpdatePayload) => {
        setIsUpdatingPassword(true);
        setPasswordUpdateError(null);
        setPasswordUpdateSuccess(false);
        try {
            const response = await axios.put(
                `${API_BASE_URL}/UpdatePassword`,
                payload,
                {
                    withCredentials: true,
                }
            );
            if (response.data.status) {
                setPasswordUpdateSuccess(true);
            } else {
                setPasswordUpdateError(
                    response.data.message || "An unknown error occurred."
                );
            }
        } catch (error) {
            console.error("Failed to update password:", error);
            setPasswordUpdateError(
                "Failed to update password. Please try again later."
            );
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return {
        profileData,
        loading,
        error,
        updateProfile,
        isUpdating,
        updateError,
        updatePassword,
        isUpdatingPassword,
        passwordUpdateError,
        passwordUpdateSuccess,
    };
};

export default useProfileData;
