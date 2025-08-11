"use client";

import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import StoreFrontTemplate from "@/app/components/StoreFrontTemplate";

export default function PaymentCancelPage() {
  const params = useSearchParams();
  const reason = params.get("reason");

  return (
    <StoreFrontTemplate>
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-10 text-center shadow-xs">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-50">
            <XCircleIcon aria-hidden="true" className="size-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Payment canceled
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
            Your transaction was canceled and you have not been charged.{" "}
            {reason
              ? `Reason: ${reason}`
              : "If this was a mistake, you can try again."}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/checkout"
              className="w-full sm:w-auto rounded-md border border-transparent bg-vivid-magenta px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-vivid-magenta-hover focus:ring-2 focus:ring-vivid-magenta focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden text-center"
            >
              Return to checkout
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
