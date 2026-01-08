import { AiOutlineLoading } from "react-icons/ai";

export const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
      <AiOutlineLoading
        className="text-white"
        size={48}
        style={{
          animation: "loading-spin 1s linear infinite",
        }}
      />
    </div>
  );
};
