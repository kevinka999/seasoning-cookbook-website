import { twMerge } from "tailwind-merge";

type DividerProps = {
  className?: string;
};

export const Divider = ({ className }: DividerProps) => {
  return (
    <div className={twMerge("my-6 flex items-center", className)}>
      <div className="h-px flex-1 border-t border-b border-t-[#555555] border-b-[#aaaaaa] bg-[#8b8b8b]"></div>
      <div className="mx-2 h-1.5 w-1.5 rounded-none border border-black bg-[#8b8b8b] shadow-[inset_0_1px_0_0_#aaaaaa,inset_1px_0_0_0_#aaaaaa,inset_-1px_0_0_0_#555555,inset_0_-1px_0_0_#555555]"></div>
      <div className="h-px flex-1 border-t border-b border-t-[#555555] border-b-[#aaaaaa] bg-[#8b8b8b]"></div>
    </div>
  );
};
