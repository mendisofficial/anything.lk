"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signinUser, verifyAccount } from "../hooks/useAuth";
import { SigninData } from "../types";
import { useAuth } from "../../context/AuthContext";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export default function SigninPage() {
  const [formData, setFormData] = useState<SigninData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await signinUser(formData);
      if (response.status) {
        if (response.message === "Please verify your email") {
          setSuccessMessage(
            "Please verify your email. Check your email for the verification code."
          );
          setShowVerificationForm(true);
        } else {
          setSuccessMessage(response.message);
          // Update auth context with user data
          if (response.user) {
            login(response.user);
          }
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } else {
        setError(response.message || "An unknown error occurred.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await verifyAccount(verificationCode);
      if (response.status) {
        setSuccessMessage(response.message);
        setTimeout(() => {
          setShowVerificationForm(false);
          setError(null);
          router.push("/auth/signin");
        }, 2000);
      } else {
        setError(response.message || "An unknown error occurred.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during verification."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image
                alt="Anything.lk"
                src="/logo.png"
                className="h-32 w-auto"
                width={500}
                height={500}
              />
              {showVerificationForm ? (
                <>
                  <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
                    Verify your account
                  </h2>
                  <p className="mt-2 text-sm/6 text-gray-500">
                    Enter the verification code sent to your email.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in to your account
                  </h2>
                  <p className="mt-2 text-sm/6 text-gray-500">
                    Not a member?{" "}
                    <a
                      href="/auth/signup"
                      className="font-semibold text-vivid-magenta hover:text-vivid-magenta-hover"
                    >
                      Create an account here
                    </a>
                  </p>
                </>
              )}
            </div>

            <div className="mt-10">
              <div>
                {showVerificationForm ? (
                  <form
                    onSubmit={handleVerificationSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <label
                        htmlFor="verification-code"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Verification Code
                      </label>
                      <div className="mt-2">
                        <input
                          id="verification-code"
                          name="verificationCode"
                          type="text"
                          required
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {successMessage && (
                      <p className="text-sm text-green-500">{successMessage}</p>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-vivid-magenta px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {loading ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Password
                      </label>
                      <div className="mt-2">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          autoComplete="current-password"
                          value={formData.password}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {successMessage && (
                      <p className="text-sm text-green-500">{successMessage}</p>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-vivid-magenta px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            alt=""
            src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            className="absolute inset-0 size-full object-cover"
            width={1908}
            height={1433}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
