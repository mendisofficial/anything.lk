"use client";

import Image from "next/image";
import useOrders, {
  OrderDto,
  OrderItemDto,
  OrderShippingDto,
} from "../hooks/useOrders";

export default function Orders() {
  const { orders, loading, error, refetch } = useOrders();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const joinUrl = (base: string, path?: string | null) => {
    if (!path) return "https://placehold.co/200x200";
    const b = base.replace(/\/?$/, "");
    const p = path.replace(/^\//, "");
    return `${b}/${p}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">Orders</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Your past orders and their statuses.
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vivid-magenta disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="mt-2 h-3 w-32 bg-gray-100 rounded" />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-24 bg-gray-100 rounded" />
                <div className="h-24 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (!orders || orders.length === 0) && (
        <div className="py-12 text-sm text-gray-500">No orders yet.</div>
      )}

      {!loading && orders && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((o: OrderDto) => (
            <div key={o.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <div className="font-medium text-gray-900">Order #{o.id}</div>
                  {o.createdAt && (
                    <div>
                      Placed on {new Date(o.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold text-gray-900">
                    LKR{" "}
                    {(o.total || 0).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-gray-500">
                    {`Subtotal LKR ${(
                      o.subtotal || 0
                    ).toLocaleString()} • Shipping LKR ${(typeof o.shipping ===
                    "number"
                      ? o.shipping
                      : 0
                    ).toLocaleString()}`}
                  </div>
                </div>
              </div>

              {/* Items */}
              <ul className="mt-4 divide-y divide-gray-200">
                {o.items.map((it: OrderItemDto, idx: number) => {
                  const p = it.product;
                  const img = joinUrl(apiBase, p?.firstImage || undefined);
                  const status = it.status?.value || "";
                  const delivery = it.deliveryType?.name || "";
                  const deliveryPrice = it.deliveryType?.price ?? 0;
                  return (
                    <li
                      key={`${o.id}-${it.id ?? idx}`}
                      className="py-4 flex gap-4"
                    >
                      <div className="shrink-0">
                        <Image
                          src={img}
                          alt={p?.title || "Product"}
                          width={96}
                          height={96}
                          className="size-24 rounded object-cover border"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-gray-900 truncate">
                              {p?.title || "Product"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Qty {it.qty} • LKR{" "}
                              {(p?.price ?? 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            {status && (
                              <div className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-700">
                                {status}
                              </div>
                            )}
                            {delivery && (
                              <div className="mt-1 text-gray-500">
                                {delivery} • LKR{" "}
                                {deliveryPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Shipping address */}
              {typeof o.shipping === "object" && o.shipping && (
                <div className="mt-4 rounded bg-gray-50 p-3 text-sm text-gray-700">
                  <div className="font-medium text-gray-900">Shipping to</div>
                  <div>
                    {(o.shipping as OrderShippingDto).firstName}{" "}
                    {(o.shipping as OrderShippingDto).lastName}
                  </div>
                  <div>
                    {(o.shipping as OrderShippingDto).lineOne}
                    {(o.shipping as OrderShippingDto).lineTwo
                      ? `, ${(o.shipping as OrderShippingDto).lineTwo}`
                      : ""}
                  </div>
                  <div>
                    {(o.shipping as OrderShippingDto).city
                      ? `${(o.shipping as OrderShippingDto).city}`
                      : ""}
                    {(o.shipping as OrderShippingDto).postalCode
                      ? ` ${(o.shipping as OrderShippingDto).postalCode}`
                      : ""}
                  </div>
                  {(o.shipping as OrderShippingDto).mobile && (
                    <div>Mobile: {(o.shipping as OrderShippingDto).mobile}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
