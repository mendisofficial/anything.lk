"use client";

import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useToast, type Toast } from "../context/ToastContext";

function VariantIcon({
  variant,
}: {
  variant?: "success" | "error" | "info" | "warning";
}) {
  const common = "size-6";
  switch (variant) {
    case "success":
      return (
        <CheckCircleIcon
          aria-hidden="true"
          className={`${common} text-green-500`}
        />
      );
    case "error":
      return (
        <XCircleIcon aria-hidden="true" className={`${common} text-red-500`} />
      );
    case "warning":
      return (
        <ExclamationTriangleIcon
          aria-hidden="true"
          className={`${common} text-yellow-500`}
        />
      );
    default:
      return (
        <InformationCircleIcon
          aria-hidden="true"
          className={`${common} text-blue-500`}
        />
      );
  }
}

export default function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((t: Toast) => (
          <Transition
            key={t.id}
            show={!t.closing}
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <VariantIcon variant={t.variant} />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    {t.title ? (
                      <p className="text-sm font-medium text-gray-900">
                        {t.title}
                      </p>
                    ) : null}
                    {t.description ? (
                      <p className="mt-1 text-sm text-gray-500">
                        {t.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => dismiss(t.id)}
                      className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        ))}
      </div>
    </div>
  );
}
