import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import type { ToastType } from "../../contexts/ToastContext";

type ToastVariant = ToastType;

const colorVariant: Record<ToastVariant, string> = {
  success: "bg-[#6f6f6f]",
  error: "bg-[#e74c3c]",
};

const innerBorderVariant: Record<ToastVariant, string> = {
  success:
    "shadow-[inset_0_2px_0_0_#aaaaaa,inset_2px_0_0_0_#aaaaaa,inset_-2px_0_0_0_#565656,inset_0_-4px_0_0_#565656]",
  error:
    "shadow-[inset_0_2px_0_0_#ff6b6b,inset_2px_0_0_0_#ff6b6b,inset_-2px_0_0_0_#c0392b,inset_0_-4px_0_0_#c0392b]",
};

const iconVariant: Record<ToastVariant, React.ReactNode> = {
  success: (
    <FaCheckCircle
      className="text-white"
      style={{ filter: "drop-shadow(2px 2px 0 #3e3e3e)" }}
    />
  ),
  error: (
    <FaExclamationCircle
      className="text-white"
      style={{ filter: "drop-shadow(2px 2px 0 #3e3e3e)" }}
    />
  ),
};

type ToastProps = {
  type: ToastType;
  content: string;
  className?: string;
};

export const Toast = ({ type, content, className }: ToastProps) => {
  const baseStyles =
    "border-2 border-black rounded-none text-white minecraft-text-shadow font-minecraft px-3 py-2 min-w-[180px] text-sm flex items-center gap-2";
  const colorStyles = colorVariant[type];
  const innerBorderStyles = innerBorderVariant[type];

  const toastStyles = twMerge(
    baseStyles,
    colorStyles,
    innerBorderStyles,
    className,
  );

  return (
    <div className={toastStyles} role="alert">
      {iconVariant[type]}
      <p>{content}</p>
    </div>
  );
};
