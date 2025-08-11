"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import useAddresses from "../hooks/useAddresses";
import useCities from "../hooks/useCities";
import { AddressPayload, Address } from "../hooks/types";
import { Loading } from "@/app/components/Loading";
import { useAuth } from "@/app/context/AuthContext";

export default function Addresses() {
  const { user } = useAuth();
  const {
    addresses,
    loading: addressLoading,
    error: addressError,
    addAddress,
    updateAddress,
    deleteAddress,
    isAdding,
    isUpdating,
    isDeleting,
    operationError,
    operationSuccess,
    clearMessages,
  } = useAddresses();

  const { cities, loading: citiesLoading } = useCities();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState<AddressPayload>({
    lineOne: "",
    lineTwo: "",
    postalCode: "",
    cityId: 0,
    label: "",
    isDefault: false,
    firstName: "",
    lastName: "",
    mobile: "",
  });

  // Keep first/last name synced with logged-in user
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    }));
  }, [user]);

  const resetForm = () => {
    setFormData({
      lineOne: "",
      lineTwo: "",
      postalCode: "",
      cityId: 0,
      label: "",
      isDefault: false,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      mobile: "",
    });
    setShowAddForm(false);
    setEditingAddress(null);
    clearMessages();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      cityId: parseInt(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;
    const payload: AddressPayload = {
      ...formData,
      firstName: user?.firstName || formData.firstName,
      lastName: user?.lastName || formData.lastName,
    };
    if (editingAddress) {
      success = await updateAddress({
        ...payload,
        addressId: editingAddress.id,
      });
    } else {
      success = await addAddress(payload);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      lineOne: address.lineOne,
      lineTwo: address.lineTwo,
      postalCode: address.postalCode,
      cityId: address.city.id,
      label: address.label,
      isDefault: address.isDefault,
      firstName: user?.firstName || address.firstName || "",
      lastName: user?.lastName || address.lastName || "",
      mobile: address.mobile || "",
    });
    setEditingAddress(address);
    setShowAddForm(true);
    clearMessages();
  };

  const handleDelete = async (addressId: number) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(addressId);
    }
  };

  useEffect(() => {
    if (operationSuccess) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [operationSuccess, clearMessages]);

  if (addressLoading) {
    return <Loading />;
  }

  if (addressError) {
    return <div>Error loading addresses: {addressError.message}</div>;
  }

  const isFormValid =
    formData.lineOne.trim() !== "" &&
    formData.lineTwo.trim() !== "" &&
    formData.postalCode.trim() !== "" &&
    formData.label.trim() !== "" &&
    formData.cityId > 0 &&
    formData.mobile.trim() !== "";

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      {/* Header */}
      <div className="border-b border-gray-900/10 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              Manage Addresses
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Add and manage your delivery addresses.
            </p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-x-2 rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-magenta"
            >
              <PlusIcon className="h-4 w-4" />
              Add Address
            </button>
          )}
        </div>

        {/* Messages */}
        {operationError && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-600">{operationError}</div>
          </div>
        )}

        {operationSuccess && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-600">{operationSuccess}</div>
          </div>
        )}

        {/* Address List */}
        <div className="mt-10 space-y-6">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">
                No addresses found. Add your first address to get started.
              </div>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                {address.isDefault && (
                  <div className="absolute -top-2 -right-2 rounded-full bg-vivid-magenta px-2 py-1 text-xs font-medium text-white">
                    Default
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {address.label}
                    </h3>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>{address.lineOne}</p>
                      <p>{address.lineTwo}</p>
                      <p>
                        {address.city.name}, {address.postalCode}
                      </p>
                      {address.mobile && <p>Mobile: {address.mobile}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={isDeleting}
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-xs ring-1 ring-red-300 hover:bg-red-50 disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit}>
          <div className="border-b border-gray-900/10 pb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-base/7 font-semibold text-gray-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="mobile"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Mobile
                </label>
                <div className="mt-2">
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="07XXXXXXXX"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  />
                </div>
              </div>

              {/* Hidden fields auto-filled from logged-in user */}
              <input
                type="hidden"
                name="firstName"
                value={user?.firstName || formData.firstName}
              />
              <input
                type="hidden"
                name="lastName"
                value={user?.lastName || formData.lastName}
              />

              <div className="col-span-full">
                <label
                  htmlFor="label"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Address Label
                </label>
                <div className="mt-2">
                  <input
                    id="label"
                    name="label"
                    type="text"
                    placeholder="e.g., Home, Office, etc."
                    value={formData.label}
                    onChange={handleInputChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="lineOne"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Address Line 1
                </label>
                <div className="mt-2">
                  <input
                    id="lineOne"
                    name="lineOne"
                    type="text"
                    autoComplete="street-address"
                    value={formData.lineOne}
                    onChange={handleInputChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="lineTwo"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Address Line 2
                </label>
                <div className="mt-2">
                  <input
                    id="lineTwo"
                    name="lineTwo"
                    type="text"
                    autoComplete="street-address"
                    value={formData.lineTwo}
                    onChange={handleInputChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="cityId"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  City
                </label>
                <div className="relative mt-2">
                  <select
                    id="cityId"
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleCityChange}
                    disabled={citiesLoading}
                    className="block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  >
                    <option value={0}>Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-gray-500 sm:h-4 sm:w-4"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="postalCode"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Postal Code
                </label>
                <div className="mt-2">
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    autoComplete="postal-code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex items-center">
                  <input
                    id="isDefault"
                    name="isDefault"
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-vivid-magenta focus:ring-vivid-magenta"
                  />
                  <label
                    htmlFor="isDefault"
                    className="ml-3 block text-sm/6 font-medium text-gray-900"
                  >
                    Set as default address
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  This will be used as your primary delivery address.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-semibold text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isAdding || isUpdating}
              className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-magenta disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding || isUpdating
                ? editingAddress
                  ? "Updating..."
                  : "Adding..."
                : editingAddress
                ? "Update Address"
                : "Add Address"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
