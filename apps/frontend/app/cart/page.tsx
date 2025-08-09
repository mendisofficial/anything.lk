"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import StoreFrontTemplate from "../components/StoreFrontTemplate";
import useCartItems from "./hooks/useCartItems";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

export default function CartPage() {
  const { items, loading, error, subtotal, refetch } = useCartItems();
  const { setCartCount } = useCart();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    // keep header badge in sync with number of distinct items
    setCartCount(items.length);
  }, [items.length, setCartCount]);

  return (
    <StoreFrontTemplate>
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            {loading && (
              <div className="py-12 text-sm text-gray-500">Loading cart…</div>
            )}
            {!loading && items.length === 0 && (
              <div className="py-12 text-sm text-gray-500">
                {error || "Your cart is empty"}
              </div>
            )}

            {!loading && items.length > 0 && (
              <ul
                role="list"
                className="divide-y divide-gray-200 border-t border-b border-gray-200"
              >
                {items.map((it, idx) => {
                  const p = it.product;
                  const imageSrc = p.firstImage
                    ? `${apiBase}/${p.firstImage}`
                    : "https://placehold.co/400x400";
                  const brand = p.model?.brand?.name || "";
                  const color = p.color?.value || "";
                  return (
                    <li key={`${p.id}-${idx}`} className="flex py-6 sm:py-10">
                      <div className="shrink-0">
                        <Image
                          alt={p.title}
                          src={imageSrc}
                          width={192}
                          height={192}
                          className="size-24 rounded-md object-cover sm:size-48"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link
                                  href={`/product?id=${p.id}`}
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {p.title}
                                </Link>
                              </h3>
                            </div>
                            <div className="mt-1 flex text-sm text-gray-500">
                              {[brand, color].filter(Boolean).join(" · ")}
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              LKR {(p.price || 0).toLocaleString()}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <div className="inline-grid w-full max-w-20 grid-cols-1">
                              <div className="col-start-1 row-start-1 rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6">
                                Qty: {it.qty}
                              </div>
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                              />
                            </div>

                            <div className="absolute top-0 right-0">
                              <button
                                type="button"
                                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                disabled
                                title="Remove coming soon"
                              >
                                <span className="sr-only">Remove</span>
                                <XMarkIconMini
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                          {(p.qty ?? 0) > 0 ? (
                            <CheckIcon
                              aria-hidden="true"
                              className="size-5 shrink-0 text-green-500"
                            />
                          ) : (
                            <ClockIcon
                              aria-hidden="true"
                              className="size-5 shrink-0 text-gray-300"
                            />
                          )}

                          <span>
                            {(p.qty ?? 0) > 0 ? "In stock" : "Out of stock"}
                          </span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  LKR {subtotal.toLocaleString()}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">LKR 0.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                  <a
                    href="#"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">LKR 0.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  LKR {subtotal.toLocaleString()}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="button"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden disabled:opacity-60"
                disabled={items.length === 0 || loading}
                onClick={() => refetch()}
              >
                Refresh Cart
              </button>
            </div>
          </section>
        </form>
      </main>
    </StoreFrontTemplate>
  );
}
