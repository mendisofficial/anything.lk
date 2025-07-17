import axios from "axios";
import { SignupData, SigninData } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const signupUser = async (data: SignupData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/SignUp`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error signing up user:", error);
        return {
            status: false,
            message: "An error occurred during sign up.",
        };
    }
};

export const signinUser = async (data: SigninData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/SignIn`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error during sign in:", error);
        return {
            status: false,
            message: "An error occurred during sign in.",
        };
    }
};

export const verifyAccount = async (verificationCode: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/VerifyAccount`, { verificationCode }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error verifying account:", error);
        return {
            status: false,
            message: "An error occurred during account verification.",
        };
    }
};
