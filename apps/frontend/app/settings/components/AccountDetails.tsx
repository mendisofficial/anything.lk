"use client";

import { useState, useEffect } from "react";
import useProfileData from "../hooks/useProfileData";
import { useAuth } from "../../context/AuthContext";
import { ProfileUpdatePayload, PasswordUpdatePayload } from "../hooks/types";
import { Loading } from "@/app/components/Loading";

export default function AccountDetails() {
  const {
    profileData: fetchedProfileData,
    loading: profileLoading,
    error: profileError,
    updateProfile,
    isUpdating,
    updateError,
    updatePassword,
    isUpdatingPassword,
    passwordUpdateError,
    passwordUpdateSuccess,
  } = useProfileData();
  const { user } = useAuth();

  const [initialProfileData, setInitialProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (fetchedProfileData) {
      const initialData = {
        firstName: fetchedProfileData.firstname || "",
        lastName: fetchedProfileData.lastname || "",
        email: user?.email || "",
      };
      setProfileData(initialData);
      setInitialProfileData(initialData);
    }
  }, [fetchedProfileData, user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ProfileUpdatePayload = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
    };

    updateProfile(payload);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      console.error("Passwords do not match");
      return;
    }
    const payload: PasswordUpdatePayload = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmNewPassword,
    };
    await updatePassword(payload);
  };

  useEffect(() => {
    if (passwordUpdateSuccess) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [passwordUpdateSuccess]);

  if (profileLoading) {
    return <Loading />;
  }

  if (profileError) {
    return <div>Error loading profile: {profileError.message}</div>;
  }

  const isDirty =
    JSON.stringify(profileData) !== JSON.stringify(initialProfileData);

  const isPasswordFormValid =
    passwordData.currentPassword.length > 0 &&
    passwordData.newPassword.length > 0 &&
    passwordData.newPassword === passwordData.confirmNewPassword;

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      {/* Profile section */}
      <form onSubmit={handleProfileSubmit}>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Update your personal information.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
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
                  autoComplete="email"
                  value={profileData.email}
                  readOnly
                  className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                />
                <p className="mt-1 text-sm/6 text-gray-600">
                  Anything.LK member since {fetchedProfileData?.since}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {updateError && (
            <div className="text-sm text-red-600">{updateError}</div>
          )}
          <button
            type="submit"
            disabled={!isDirty || isUpdating}
            className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-magenta disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* Password section */}
      <form onSubmit={handlePasswordSubmit}>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Change Password
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Update your password to keep your account secure.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="current-password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Current password
              </label>
              <div className="mt-2">
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="new-password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                New password
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="confirm-new-password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirm new password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  type="password"
                  autoComplete="new-password"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {passwordUpdateError && (
            <div className="text-sm text-red-600">{passwordUpdateError}</div>
          )}
          {passwordUpdateSuccess && (
            <div className="text-sm text-green-600">
              Password updated successfully!
            </div>
          )}
          <button
            type="submit"
            disabled={!isPasswordFormValid || isUpdatingPassword}
            className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-magenta disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
