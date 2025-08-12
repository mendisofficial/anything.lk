"use client";

import { useState } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import StoreFrontTemplate from "../components/StoreFrontTemplate";
import usePendingProducts from "./hooks/usePendingProducts";
import { CheckCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useToast } from "../context/ToastContext";

const adminNav = [{ id: "Pending Products", name: "Pending Products" }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminPage() {
  const [active, setActive] = useState("Pending Products");
  const { products, loading, error, refetch, approve } = usePendingProducts();
  const toast = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const joinUrl = (base: string, path?: string) => {
    if (!path) return "https://placehold.co/400x400";
    const b = base.replace(/\/?$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${b}${p}`;
  };

  const handleApprove = async (id: number) => {
    const res = await approve(id);
    if (res.ok) {
      toast.success("Product approved", {
        description: `Product #${id} is now active.`,
      });
    } else {
      toast.error(res.message || "Failed to approve");
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <StoreFrontTemplate>
        <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
          <h1 className="sr-only">Admin</h1>

          <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
            <nav className="flex-none px-4 sm:px-6 lg:px-0">
              <ul
                role="list"
                className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
              >
                {adminNav.map((item) => (
                  <li key={item.id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActive(item.id);
                      }}
                      className={classNames(
                        active === item.id
                          ? "bg-gray-50 text-vivid-magenta"
                          : "text-gray-700 hover:bg-gray-50 hover:text-vivid-magenta",
                        "group flex gap-x-3 rounded-md py-2 pr-3 pl-2 text-sm/6 font-semibold"
                      )}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
            {active === "Pending Products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base/7 font-semibold text-gray-900">
                      Pending Products
                    </h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                      Review and approve products submitted by sellers.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={refetch}
                      className="inline-flex items-center gap-2 rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-magenta disabled:opacity-50"
                    >
                      <ArrowPathIcon className="size-4" /> Refresh
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Grid with approve buttons per card */}
                <section className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
                  <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
                    {loading &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="group relative border-r border-b border-gray-200 p-4 sm:p-6"
                        >
                          <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
                          <div className="pt-10 pb-4 text-center">
                            <div className="mx-auto h-4 w-3/5 bg-gray-200 rounded animate-pulse" />
                            <div className="mx-auto mt-3 h-3 w-2/5 bg-gray-100 rounded animate-pulse" />
                            <div className="mx-auto mt-4 h-5 w-1/5 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                      ))}
                    {!loading &&
                      products.map((p) => {
                        const img = joinUrl(apiBase, p.firstImage);
                        console.log("Product image URL:", img);
                        return (
                          <div
                            key={p.id}
                            className="group relative border-r border-b border-gray-200 p-4 sm:p-6"
                          >
                            <Image
                              alt={p.title}
                              src={img}
                              width={500}
                              height={500}
                              className="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75"
                            />
                            <div className="pt-10 pb-2 text-center">
                              <h3 className="text-sm font-medium text-gray-900">
                                {p.title}
                              </h3>
                              <p className="mt-2 text-base font-medium text-gray-900">
                                LKR {p.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="mt-2 flex justify-center">
                              <button
                                type="button"
                                onClick={() => handleApprove(p.id)}
                                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                              >
                                <CheckCircleIcon className="size-4" /> Approve
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    {!loading && products.length === 0 && (
                      <div className="col-span-2 md:col-span-3 lg:col-span-4 p-8 text-center text-sm text-gray-500">
                        No pending products.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>
      </StoreFrontTemplate>
    </ProtectedRoute>
  );
}
