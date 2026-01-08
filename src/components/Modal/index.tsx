import { FaTimes } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { Z_INDEX } from "../../constants/z-index";
import { Card } from "../Card";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  blocking?: boolean;
  closeOnOverlayClick?: boolean;
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  blocking = false,
  closeOnOverlayClick = true,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      style={{ zIndex: Z_INDEX.modalOverlay }}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: Z_INDEX.modalContent }}
      >
        <Card title={title} className={twMerge("relative", className)}>
          {!blocking && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center border-2 border-black bg-[#6f6f6f] text-white shadow-[inset_0_2px_0_0_#aaaaaa,inset_2px_0_0_0_#aaaaaa,inset_-2px_0_0_0_#565656,inset_0_-2px_0_0_#565656] transition-colors hover:border-white"
              style={{ zIndex: Z_INDEX.modalCloseButton }}
              aria-label="Close modal"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
          {children}
        </Card>
      </div>
    </div>
  );
};
