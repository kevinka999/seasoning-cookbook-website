import { useState } from "react";
import { Modal } from "../Modal";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AuthMode = "login" | "signup";

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const handleModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
  };

  const handleSuccess = () => {
    onClose();
    setAuthMode("login");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={authMode === "login" ? "Login" : "Sign Up"}
      closeOnOverlayClick={false}
    >
      {authMode === "login" ? (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToSignup={() => handleModeChange("signup")}
        />
      ) : (
        <SignupForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => handleModeChange("login")}
        />
      )}
    </Modal>
  );
};
