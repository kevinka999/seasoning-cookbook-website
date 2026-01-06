import { Outlet } from "react-router-dom";

export const PageLayout = () => {
  return (
    <div className="page-container min-h-screen w-full p-8">
      <Outlet />
    </div>
  );
};
