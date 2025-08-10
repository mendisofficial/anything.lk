"use client";

import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import StoreFrontTemplate from "@/app/components/StoreFrontTemplate";
import { useCart } from "@/app/context/CartContext";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const orderRef = params.get("orderId") || params.get("session_id");
  const amount = params.get("amount");
  const { reset } = useCart();

  useEffect(() => {
    // Clear the cart badge locally after a successful payment
    reset();
  }, [reset]);

  return (
    <StoreFrontTemplate>
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-10 text-center shadow-xs">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircleIcon
              aria-hidden="true"
              className="size-10 text-green-600"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Payment successful
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
            Thanks for your purchase. We&apos;ve emailed your receipt and order
            details. You can continue shopping or review your order from your
            account.
          </p>

          <div className="mx-auto mt-8 w-full max-w-md text-left">
            <dl className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-gray-50">
              {orderRef && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-gray-600">Order reference</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {orderRef}
                  </dd>
                </div>
              )}
              {amount && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-gray-600">Amount paid</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {amount}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="w-full sm:w-auto rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden text-center"
            >
              Continue shopping
            </Link>
            <Link
              href="/cart"
              className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-hidden text-center"
            >
              View cart
            </Link>
          </div>
        </div>
      </main>
    </StoreFrontTemplate>
  );
}
