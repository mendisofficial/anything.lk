"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastVariant = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms
  // internal UI state (not part of public API but exported for typing consumers like Toaster)
  closing?: boolean;
};

export type ToastInput = Omit<Toast, "id">;

export type ToastContextValue = {
  toasts: Toast[];
  push: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  // helpers
  success: (
    title: string,
    options?: Omit<ToastInput, "variant" | "title">
  ) => string;
  error: (
    title: string,
    options?: Omit<ToastInput, "variant" | "title">
  ) => string;
  info: (
    title: string,
    options?: Omit<ToastInput, "variant" | "title">
  ) => string;
  warning: (
    title: string,
    options?: Omit<ToastInput, "variant" | "title">
  ) => string;
};

// internal state with a closing flag to drive leave transitions
export type ToastInternal = Toast;

const ToastContext = createContext<ToastContextValue | null>(null);

function genId() {
  const g = globalThis as unknown as { crypto?: { randomUUID?: () => string } };
  if (g.crypto && typeof g.crypto.randomUUID === "function") {
    try {
      return g.crypto.randomUUID();
    } catch {}
  }
  return `t_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const removeNow = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, closing: true } : t))
      );
      const timer = timers.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timers.current.delete(id);
      }
      // Slightly longer than leave:duration to ensure DOM removal after animation
      const removeDelay = 150;
      const handle = setTimeout(() => removeNow(id), removeDelay);
      timers.current.set(id, handle);
    },
    [removeNow]
  );

  const push = useCallback(
    (toast: ToastInput) => {
      const id = genId();
      const duration = toast.duration ?? 5000;
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: toast.title,
          description: toast.description,
          variant: toast.variant ?? "info",
          duration,
        },
      ]);
      if (duration > 0) {
        const handle = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, handle);
      }
      return id;
    },
    [dismiss]
  );

  const clear = useCallback(() => {
    setToasts((prev) => {
      prev.forEach((t) => dismiss(t.id));
      return prev;
    });
  }, [dismiss]);

  const success = useCallback<ToastContextValue["success"]>(
    (title, options) => push({ title, variant: "success", ...options }),
    [push]
  );
  const error = useCallback<ToastContextValue["error"]>(
    (title, options) => push({ title, variant: "error", ...options }),
    [push]
  );
  const info = useCallback<ToastContextValue["info"]>(
    (title, options) => push({ title, variant: "info", ...options }),
    [push]
  );
  const warning = useCallback<ToastContextValue["warning"]>(
    (title, options) => push({ title, variant: "warning", ...options }),
    [push]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      push,
      dismiss,
      clear,
      success,
      error,
      info,
      warning,
    }),
    [toasts, push, dismiss, clear, success, error, info, warning]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
