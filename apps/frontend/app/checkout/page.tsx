"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import StoreFrontTemplate from "../components/StoreFrontTemplate";
import { ProtectedRoute } from "../components/ProtectedRoute";
import useCheckoutData from "./hooks/useCheckoutData";
import useCheckoutSubmit from "./hooks/useCheckoutSubmit";
import usePayHere from "./hooks/usePayHere";
import { useToast } from "../context/ToastContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const {
    loading,
    error,
    userAddress,
    cities,
    cart,
    deliveryTypes,
    subtotal,
    totalQty,
  } = useCheckoutData();
  const { submit, submitting } = useCheckoutSubmit();
  const { ensureLoaded, startPayment } = usePayHere();
  const { error: pushError, success } = useToast();
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const [useSaved, setUseSaved] = useState<boolean>(!!userAddress);
  const [firstName, setFirstName] = useState(userAddress?.firstName || "");
  const [lastName, setLastName] = useState(userAddress?.lastName || "");
  const [cityId, setCityId] = useState<string>(
    userAddress?.city?.id ? String(userAddress.city.id) : "0"
  );
  const [lineOne, setLineOne] = useState(userAddress?.lineOne || "");
  const [lineTwo, setLineTwo] = useState(userAddress?.lineTwo || "");
  const [postalCode, setPostalCode] = useState(userAddress?.postalCode || "");
  const [mobile, setMobile] = useState(userAddress?.mobile || "");

  // keep local form state in sync if userAddress arrives later
  useMemo(() => {
    if (userAddress) {
      setFirstName(userAddress.firstName || "");
      setLastName(userAddress.lastName || "");
      setCityId(userAddress.city?.id ? String(userAddress.city.id) : "0");
      setLineOne(userAddress.lineOne || "");
      setLineTwo(userAddress.lineTwo || "");
      setPostalCode(userAddress.postalCode || "");
      setMobile(userAddress.mobile || "");
    }
  }, [userAddress]);

  const shippingPricePerUnit = useMemo(() => {
    // Backend uses DeliveryTypes id: 1 (within colombo) and 2 (out of colombo)
    const within = deliveryTypes.find((d) => d.id === 1)?.price ?? 0;
    const out = deliveryTypes.find((d) => d.id === 2)?.price ?? within;

    const selectedCity = cities.find((c) => String(c.id) === String(cityId));
    const isColombo =
      (selectedCity?.name || userAddress?.city?.name || "").toLowerCase() ===
      "colombo";
    return isColombo ? within : out;
  }, [deliveryTypes, cities, cityId, userAddress]);

  const shippingEstimate = useMemo(
    () => shippingPricePerUnit * totalQty,
    [shippingPricePerUnit, totalQty]
  );
  const total = useMemo(
    () => subtotal + shippingEstimate,
    [subtotal, shippingEstimate]
  );

  const canSubmit = cart.length > 0 && !loading && !submitting;

  const onConfirm = async () => {
    if (!canSubmit) return;
    try {
      const payload = {
        isCurrentAddress: useSaved,
        firstName,
        lastName,
        citySelect: cityId || "0",
        lineOne,
        lineTwo,
        postalCode,
        mobile,
      };
      const res = await submit(payload);
      if (!res.status) {
        pushError(res.message || "Checkout failed");
        return;
      }
      if (!res.payhereJson) {
        success("Order created without payment");
        router.push("/checkout/success");
        return;
      }

      // Wire PayHere callbacks to navigate appropriately
      await ensureLoaded();
      if (typeof window !== "undefined" && window.payhere) {
        window.payhere.onCompleted = (orderId: string) => {
          router.push(
            `/checkout/success?orderId=${encodeURIComponent(
              orderId
            )}&amount=${encodeURIComponent(res.payhereJson!.amount)}`
          );
        };
        window.payhere.onDismissed = () => {
          router.push(
            `/checkout/cancel?reason=${encodeURIComponent("dismissed")}`
          );
        };
        window.payhere.onError = (err: string) => {
          pushError(err || "Payment error");
        };
      }

      await startPayment(res.payhereJson);
    } catch (e) {
      pushError(e instanceof Error ? e.message : "Unexpected error");
    }
  };

  return (
    <StoreFrontTemplate>
      <ProtectedRoute>
        <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h1 className="sr-only">Checkout</h1>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
              <div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Shipping information
                  </h2>

                  <div className="mt-4 space-y-4">
                    {userAddress && (
                      <label className="flex items-center gap-3 text-sm text-gray-700">
                        <input
                          type="radio"
                          name="addr-mode"
                          checked={useSaved}
                          onChange={() => setUseSaved(true)}
                          className="size-4"
                        />
                        <span>
                          Use my saved address — {userAddress.firstName}{" "}
                          {userAddress.lastName}, {userAddress.lineOne},{" "}
                          {userAddress.lineTwo}, {userAddress.city?.name}
                        </span>
                      </label>
                    )}
                    <label className="flex items-center gap-3 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="addr-mode"
                        checked={!useSaved}
                        onChange={() => setUseSaved(false)}
                        className="size-4"
                      />
                      <span>Enter a new shipping address</span>
                    </label>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm/6 font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <div className="mt-2">
                        <input
                          id="first-name"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={useSaved}
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta disabled:bg-gray-100 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm/6 font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <div className="mt-2">
                        <input
                          id="last-name"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={useSaved}
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta disabled:bg-gray-100 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="line1"
                        className="block text-sm/6 font-medium text-gray-700"
                      >
                        Address line 1
                      </label>
                      <div className="mt-2">
                        <input
                          id="line1"
                          type="text"
                          value={lineOne}
                          onChange={(e) => setLineOne(e.target.value)}
                          disabled={useSaved}
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta disabled:bg-gray-100 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="line2"
                        className="block text-sm/6 font-medium text-gray-700"
                      >
                        Address line 2
                      </label>
                      <div className="mt-2">
                        <input
                          id="line2"
                          type="text"
                          value={lineTwo}
                          onChange={(e) => setLineTwo(e.target.value)}
                          disabled={useSaved}
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta disabled:bg-gray-100 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm/6 font-medium text-gray-700"
                      >
                        City
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="city"
                          value={cityId}
                          onChange={(e) => setCityId(e.target.value)}
                          disabled={useSaved}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta disabled:bg-gray-100 sm:text-sm/6"
                        >
                          <option value="0">Select a city</option>
                          {cities.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500 sm:size-4"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="postal"
                        className="block text-sm/6 font-medium text-gray-700"
                      >
                        Postal code
                      </label>
                      <div className="mt-2">
                        <input
                          id="postal"
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          disabled={useSaved}
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta disabled:bg-gray-100 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="mobile"
                        className="block text-sm/6 font-medium text-gray-700"
                      >
                        Mobile
                      </label>
                      <div className="mt-2">
                        <input
                          id="mobile"
                          type="text"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          disabled={useSaved}
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta disabled:bg-gray-100 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="mt-10 lg:mt-0">
                <h2 className="text-lg font-medium text-gray-900">
                  Order summary
                </h2>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-xs">
                  <h3 className="sr-only">Items in your cart</h3>
                  {loading && (
                    <div className="px-4 py-6 sm:px-6 text-sm text-gray-500">
                      Loading checkout…
                    </div>
                  )}
                  {!loading && cart.length === 0 && (
                    <div className="px-4 py-6 sm:px-6 text-sm text-gray-500">
                      {error || "Your cart is empty"}
                    </div>
                  )}
                  {cart.length > 0 && (
                    <ul role="list" className="divide-y divide-gray-200">
                      {cart.map((it) => {
                        const p = it.product;
                        const imageSrc = p.firstImage
                          ? `${apiBase}/${p.firstImage}`
                          : "https://placehold.co/200x200";
                        return (
                          <li
                            key={`${p.id}`}
                            className="flex px-4 py-6 sm:px-6"
                          >
                            <div className="shrink-0">
                              <Image
                                alt={p.title}
                                src={imageSrc}
                                width={80}
                                height={80}
                                className="size-20 rounded-md object-cover"
                              />
                            </div>
                            <div className="ml-6 flex flex-1 flex-col">
                              <div className="flex">
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-sm">
                                    <Link
                                      href={`/product?id=${p.id}`}
                                      className="font-medium text-gray-700 hover:text-gray-800"
                                    >
                                      {p.title}
                                    </Link>
                                  </h4>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Qty: {it.qty}
                                  </p>
                                </div>
                                <div className="ml-4 shrink-0 text-sm font-medium text-gray-900">
                                  LKR {(p.price * it.qty).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        LKR {subtotal.toLocaleString()}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Shipping (estimate)</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        LKR {shippingEstimate.toLocaleString()}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base font-medium">Total</dt>
                      <dd className="text-base font-medium text-gray-900">
                        LKR {total.toLocaleString()}
                      </dd>
                    </div>
                  </dl>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <button
                      type="button"
                      disabled={!canSubmit}
                      onClick={onConfirm}
                      className="w-full rounded-md border border-transparent bg-vivid-magenta px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-vivid-magenta-hover focus:ring-2 focus:ring-vivid-magenta focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden disabled:opacity-60"
                    >
                      {submitting ? "Processing…" : "Confirm & Pay"}
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  By confirming, you&apos;ll be redirected to PayHere to
                  complete your payment securely.
                </p>
              </div>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    </StoreFrontTemplate>
  );
}
