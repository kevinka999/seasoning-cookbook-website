import { FaArrowUp } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

type UpvoteButtonProps = {
  upvoted: boolean;
  upvoteCount: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export const UpvoteButton = ({
  upvoted,
  upvoteCount,
  onClick,
  disabled = false,
  className,
}: UpvoteButtonProps) => {
  const baseStyles =
    "flex flex-row items-center justify-center gap-2 border-2 border-black text-white minecraft-text-shadow font-minecraft transition-all rounded-[3px]";
  const upvotedStyles = upvoted
    ? "bg-[#2ecc40] shadow-[inset_0_2px_0_0_#38e87d,inset_2px_0_0_0_#38e87d,inset_-2px_0_0_0_#207a36,inset_0_-2px_0_0_#207a36]"
    : "bg-[#6f6f6f] shadow-[inset_0_2px_0_0_#aaaaaa,inset_2px_0_0_0_#aaaaaa,inset_-2px_0_0_0_#565656,inset_0_-2px_0_0_#565656]";
  const hoverStyles = disabled ? "" : "hover:border-white hover:scale-105";
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";
  const pxStyles = "px-3 py-2";

  const buttonStyles = twMerge(
    baseStyles,
    upvotedStyles,
    hoverStyles,
    disabledStyles,
    pxStyles,
    className,
  );

  return (
    <button className={buttonStyles} onClick={onClick} disabled={disabled}>
      <FaArrowUp className="text-white" size={16} />
      <span className="text-sm font-bold">{upvoteCount}</span>
    </button>
  );
};
