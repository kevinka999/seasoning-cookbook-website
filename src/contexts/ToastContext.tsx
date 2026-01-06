import React from "react";

export type ToastType = "success" | "error";

export type Toast = {
  id: string;
  type: ToastType;
  content: string;
};

type ToastContextType = {
  toasts: Toast[];
  dispatchToast: (toast: { type: ToastType; content: string }) => void;
  removeToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dispatchToast = (toast: { type: ToastType; content: string }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      type: toast.type,
      content: toast.content,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const value: ToastContextType = {
    toasts,
    dispatchToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
