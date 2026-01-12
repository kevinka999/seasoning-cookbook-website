import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AuthModal } from "../AuthModal";
import { LoadingScreen } from "../LoadingScreen";

export const PageLayout = () => {
  const { isAuthenticated, signout, user, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <header>
        <div className="page-container">
          <div className="flex flex-col items-center gap-1 pt-4">
            <img
              src="/images/logo.png"
              alt="Seasoning Cookbook"
              className="h-48 w-auto"
            />

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <span className="minecraft-text-shadow font-minecraft text-sm text-white">
                    Welcome, {user?.email || "User"}
                  </span>
                  <button
                    onClick={signout}
                    className="minecraft-text-shadow font-minecraft cursor-pointer text-sm text-white underline hover:text-gray-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="minecraft-text-shadow font-minecraft text-sm text-white">
                    You are not logged in
                  </span>
                  <button
                    onClick={handleOpenAuthModal}
                    className="minecraft-text-shadow font-minecraft cursor-pointer text-sm text-white underline hover:text-gray-300"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="page-container min-h-screen w-full p-8">
        <Outlet />
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </>
  );
};
