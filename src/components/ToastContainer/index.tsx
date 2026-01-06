import React from "react";
import { useToast } from "../../contexts/ToastContext";
import { Toast } from "../Toast";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  React.useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 3000);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} type={toast.type} content={toast.content} />
      ))}
    </div>
  );
};
