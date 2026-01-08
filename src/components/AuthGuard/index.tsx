import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { SetupModal } from "../SetupModal";

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, hasCompletedSetup, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasCompletedSetup) {
    return (
      <>
        {children}
        <SetupModal isOpen={true} />
      </>
    );
  }

  return <>{children}</>;
};
