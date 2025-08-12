"use client";

import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import useProductData from "../hooks/useProductData";
import useProductSubmission from "../hooks/useProductSubmission";
import { Loading } from "@/app/components/Loading";

export default function AddProducts() {
  const {
    productData: backendData,
    loading,
    error,
    getModelsForBrand,
  } = useProductData();

  const {
    submitProduct,
    loading: submissionLoading,
    error: submissionError,
  } = useProductSubmission();

  const [productData, setProductData] = useState({
    brand: "",
    model: "",
    title: "",
    description: "",
    storage: "",
    color: "",
    condition: "",
    price: "",
    quantity: "1",
  });

  const [images, setImages] = useState({
    image1: null as File | null,
    image2: null as File | null,
    image3: null as File | null,
  });

  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // If brand is changed, reset model selection
    if (name === "brand") {
      setProductData({
        ...productData,
        [name]: value,
        model: "", // Reset model when brand changes
      });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleImageChange =
    (imageKey: keyof typeof images) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setImages({ ...images, [imageKey]: file });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous messages and clear any submission errors
    setSubmitMessage(null);
    setSubmitSuccess(false);

    // Validate required fields
    if (!productData.brand) {
      setSubmitMessage("Please select a brand");
      return;
    }

    if (!productData.model) {
      setSubmitMessage("Please select a model");
      return;
    }

    if (!productData.title.trim()) {
      setSubmitMessage("Product title is required");
      return;
    }

    if (!productData.description.trim()) {
      setSubmitMessage("Product description is required");
      return;
    }

    if (!productData.storage) {
      setSubmitMessage("Please select storage");
      return;
    }

    if (!productData.color) {
      setSubmitMessage("Please select a color");
      return;
    }

    if (!productData.condition) {
      setSubmitMessage("Please select a condition");
      return;
    }

    if (!productData.price || parseFloat(productData.price) <= 0) {
      setSubmitMessage("Please enter a valid price");
      return;
    }

    if (!productData.quantity || parseInt(productData.quantity) <= 0) {
      setSubmitMessage("Please enter a valid quantity");
      return;
    }

    if (!images.image1) {
      setSubmitMessage("Image 1 is required");
      return;
    }

    if (!images.image2) {
      setSubmitMessage("Image 2 is required");
      return;
    }

    if (!images.image3) {
      setSubmitMessage("Image 3 is required");
      return;
    }

    try {
      const submissionData = {
        brandId: productData.brand,
        modelId: productData.model,
        title: productData.title.trim(),
        description: productData.description.trim(),
        storageId: productData.storage,
        colorId: productData.color,
        conditionId: productData.condition,
        price: productData.price,
        qty: productData.quantity,
        image1: images.image1,
        image2: images.image2,
        image3: images.image3,
      };

      const result = await submitProduct(submissionData);

      if (result.status) {
        setSubmitSuccess(true);
        setSubmitMessage(result.message);

        // Reset form on success
        setProductData({
          brand: "",
          model: "",
          title: "",
          description: "",
          storage: "",
          color: "",
          condition: "",
          price: "",
          quantity: "1",
        });

        setImages({
          image1: null,
          image2: null,
          image3: null,
        });

        // Reset file inputs
        const fileInputs = document.querySelectorAll(
          'input[type="file"]'
        ) as NodeListOf<HTMLInputElement>;
        fileInputs.forEach((input) => {
          input.value = "";
        });
      } else {
        setSubmitMessage(result.message);
      }
    } catch (error) {
      setSubmitMessage("An unexpected error occurred. Please try again.");
      console.error("Product submission error:", error);
    }
  };

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // Show error state
  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            Failed to load product data
          </h3>
          <p className="mt-2 text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Get available models for selected brand
  const availableModels = productData.brand
    ? getModelsForBrand(parseInt(productData.brand))
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          {/* Product Information Section */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">
              Product Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Add details about the product you want to sell.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Brand */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="brand"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Brand
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="brand"
                    name="brand"
                    value={productData.brand}
                    onChange={handleInputChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  >
                    <option value="">Select a brand</option>
                    {backendData?.brandList.map((brand) => (
                      <option key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>

              {/* Model */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="model"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Model
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="model"
                    name="model"
                    value={productData.model}
                    onChange={handleInputChange}
                    disabled={!productData.brand}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {productData.brand
                        ? "Select a model"
                        : "Select a brand first"}
                    </option>
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id.toString()}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="col-span-full">
                <label
                  htmlFor="title"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={productData.title}
                    onChange={handleInputChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                    placeholder="Enter product title"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={productData.description}
                    onChange={handleInputChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                    placeholder="Describe your product in detail..."
                  />
                </div>
                <p className="mt-3 text-sm/6 text-gray-600">
                  Write a detailed description of your product including its
                  features and condition.
                </p>
              </div>

              {/* Storage */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="storage"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Storage
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="storage"
                    name="storage"
                    value={productData.storage}
                    onChange={handleInputChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  >
                    <option value="">Select storage</option>
                    {backendData?.storageList ? (
                      backendData.storageList.map((storage) => (
                        <option key={storage.id} value={storage.id}>
                          {storage.value}
                        </option>
                      ))
                    ) : (
                      <option disabled>No storage options available</option>
                    )}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>

              {/* Color */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="color"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Color
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="color"
                    name="color"
                    value={productData.color}
                    onChange={handleInputChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  >
                    <option value="">Select color</option>
                    {backendData?.colorList &&
                    backendData.colorList.length > 0 ? (
                      backendData.colorList.map((color) => (
                        <option key={color.id} value={color.id.toString()}>
                          {color.value}
                        </option>
                      ))
                    ) : (
                      <option disabled>No color options available</option>
                    )}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="condition"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Condition
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="condition"
                    name="condition"
                    value={productData.condition}
                    onChange={handleInputChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  >
                    <option value="">Select condition</option>
                    {backendData?.qualityList &&
                    backendData.qualityList.length > 0 ? (
                      backendData.qualityList.map((condition) => (
                        <option
                          key={condition.id}
                          value={condition.id.toString()}
                        >
                          {condition.value}
                        </option>
                      ))
                    ) : (
                      <option disabled>No condition options available</option>
                    )}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing and Quantity Section */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">
              Pricing & Availability
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Set your product price and available quantity.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Price */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Price (LKR)
                </label>
                <div className="mt-2">
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={productData.price}
                    onChange={handleInputChange}
                    placeholder="1499.00"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="quantity"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Quantity
                </label>
                <div className="mt-2">
                  <input
                    id="quantity"
                    name="quantity"
                    type="text"
                    value={productData.quantity}
                    onChange={handleInputChange}
                    placeholder="1"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">
              Product Images
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Upload up to 3 images of your product. High-quality images help
              sell faster.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
              {/* Image 1 */}
              <div className="col-span-1">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Image 1
                </label>
                <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="image1-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-vivid-magenta focus-within:ring-2 focus-within:ring-vivid-magenta focus-within:ring-offset-2 focus-within:outline-hidden hover:text-vivid-magenta-hover"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image1-upload"
                          name="image1-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange("image1")}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    {images.image1 && (
                      <p className="mt-2 text-xs text-vivid-magenta">
                        {images.image1.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Image 2 */}
              <div className="col-span-1">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Image 2
                </label>
                <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="image2-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-vivid-magenta focus-within:ring-2 focus-within:ring-vivid-magenta focus-within:ring-offset-2 focus-within:outline-hidden hover:text-vivid-magenta-hover"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image2-upload"
                          name="image2-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange("image2")}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    {images.image2 && (
                      <p className="mt-2 text-xs text-vivid-magenta">
                        {images.image2.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Image 3 */}
              <div className="col-span-1">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Image 3
                </label>
                <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="image3-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-vivid-magenta focus-within:ring-2 focus-within:ring-vivid-magenta focus-within:ring-offset-2 focus-within:outline-hidden hover:text-vivid-magenta-hover"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image3-upload"
                          name="image3-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange("image3")}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    {images.image3 && (
                      <p className="mt-2 text-xs text-vivid-magenta">
                        {images.image3.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {(submitMessage || submissionError) && (
          <div
            className={`mt-4 p-4 rounded-md ${
              submitSuccess
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`text-sm ${
                submitSuccess ? "text-green-800" : "text-red-800"
              }`}
            >
              {submitMessage || submissionError}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            disabled={submissionLoading}
            className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-magenta ${
              submissionLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-vivid-magenta hover:bg-vivid-magenta-hover"
            }`}
          >
            {submissionLoading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
