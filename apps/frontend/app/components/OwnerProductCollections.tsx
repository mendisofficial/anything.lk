"use client";

import { useAuth } from "@/app/context/AuthContext";
import useMyCollections from "@/app/settings/hooks/useMyCollections";
import useAddProductToCollection from "@/app/settings/hooks/useAddProductToCollection";
import useRemoveProductFromCollection from "@/app/settings/hooks/useRemoveProductFromCollection";
import { useMemo, useState } from "react";

export default function OwnerProductCollections({
  productId,
  ownerUserId,
}: {
  productId: number;
  ownerUserId: number;
}) {
  const { user, isAuthenticated } = useAuth();
  const isOwner = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    const uid = Number(user.id);
    return uid === ownerUserId;
  }, [isAuthenticated, user, ownerUserId]);

  const { collections, loading, error, refetch } = useMyCollections();
  const { add, loading: adding } = useAddProductToCollection();
  const { remove, loading: removing } = useRemoveProductFromCollection();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!isOwner) return null;

  return (
    <div className="mt-10 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Manage Collections
          </h3>
          <p className="text-xs text-gray-600">
            Add this product to one of your collections or remove it.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedId ?? ""}
            onChange={(e) =>
              setSelectedId(e.target.value ? Number(e.target.value) : null)
            }
            disabled={loading}
            className="rounded-md border-gray-300 text-sm text-gray-900 focus:ring-vivid-magenta focus:border-vivid-magenta"
          >
            <option value="">Select collection</option>
            {(collections ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.isPublic ? "(Public)" : "(Private)"}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => selectedId != null && add(selectedId, productId)}
            disabled={selectedId == null || adding}
            className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add"}
          </button>
          <button
            type="button"
            onClick={() => selectedId != null && remove(selectedId, productId)}
            disabled={selectedId == null || removing}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            {removing ? "Removing..." : "Remove"}
          </button>
          <button
            type="button"
            onClick={refetch}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
          >
            Reload
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
