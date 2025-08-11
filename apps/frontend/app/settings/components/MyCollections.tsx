"use client";

import Link from "next/link";
import useMyCollections from "../hooks/useMyCollections";
import useUpdateCollectionVisibility from "../hooks/useUpdateCollectionVisibility";
import useCreateCollection from "../hooks/useCreateCollection";
import { useState } from "react";

export default function MyCollections() {
  const { collections, loading, error, refetch } = useMyCollections();
  const { toggleVisibility, updatingId } = useUpdateCollectionVisibility({
    onDone: refetch,
  });
  const { create, creating } = useCreateCollection({ onDone: refetch });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    isPublic: true,
  });
  const isFormValid = form.name.trim() !== "";

  const resetForm = () => {
    setForm({ name: "", description: "", isPublic: true });
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">
            My Collections
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Create and manage your product collections.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refetch}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-200"
          >
            Refresh
          </button>
          {!showCreateForm && (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover"
            >
              New Collection
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="divide-y divide-gray-200 rounded-md border">
        {showCreateForm && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await create({
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                isPublic: form.isPublic,
              });
              if (ok) resetForm();
            }}
            className="p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Add New Collection
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-900">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Back to School"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                />
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-900">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Short description for your collection"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-vivid-magenta sm:text-sm/6"
                />
              </div>
              <div className="sm:col-span-3 flex items-center gap-2">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isPublic: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-vivid-magenta focus:ring-vivid-magenta"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make public
                </label>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={!isFormValid || creating}
                className="rounded-md bg-vivid-magenta px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-vivid-magenta-hover disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {loading && <div className="p-6 text-sm text-gray-500">Loading...</div>}
        {!loading && Array.isArray(collections) && collections.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            You don&#39;t have any collections yet.
          </div>
        )}
        {!loading &&
          Array.isArray(collections) &&
          collections.map((c) => (
            <div
              key={c.id}
              className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/collections/${c.slug}`}
                    className="text-base font-semibold text-gray-900 hover:text-vivid-magenta"
                  >
                    {c.name}
                  </Link>
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    {c.productCount} products
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Slug: {c.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-vivid-magenta focus:ring-vivid-magenta"
                    checked={c.isPublic}
                    onChange={() => toggleVisibility(c.id, !c.isPublic)}
                    disabled={updatingId === c.id}
                  />
                  {updatingId === c.id
                    ? "Updating..."
                    : c.isPublic
                    ? "Public"
                    : "Private"}
                </label>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
