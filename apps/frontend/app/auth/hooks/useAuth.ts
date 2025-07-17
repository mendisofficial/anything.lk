import axios from "axios";
import { SignupData } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const signupUser = async (data: SignupData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/SignUp`, data, { withCredentials: true });
        console.log("Signup response:", response);
        return response.data;
    } catch (error) {
        console.error("Error signing up user:", error);
        throw error;
    }
};

export const verifyAccount = async (verificationCode: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/VerifyAccount`,
            { verificationCode },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Error verifying account:", error);
        throw error;
    }
};
