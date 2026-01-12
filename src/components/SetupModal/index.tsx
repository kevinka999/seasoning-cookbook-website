import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../Modal";
import { Input } from "../Input";
import { Button } from "../Button";
import { LoadingDots } from "../LoadingDots";
import { createSeasoningCookbookUser } from "../../api/mutations/createSeasoningCookbookUser";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

type SetupModalProps = {
  isOpen: boolean;
};

export const SetupModal = ({ isOpen }: SetupModalProps) => {
  const [nickname, setNickname] = useState("");
  const { dispatchToast } = useToast();
  const queryClient = useQueryClient();
  const { hasCompletedSetup } = useAuth();

  const createUserMutation = useMutation({
    mutationFn: createSeasoningCookbookUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seasoningCookbook", "user", "nickname"],
      });
      dispatchToast({
        type: "success",
        content: "Setup completed successfully!",
      });
      setNickname("");
    },
    onError: (error) => {
      dispatchToast({
        type: "error",
        content:
          error instanceof Error
            ? error.message
            : "Failed to complete setup. Please try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      dispatchToast({
        type: "error",
        content: "Nickname cannot be empty",
      });
      return;
    }

    createUserMutation.mutate({ nickname: nickname.trim() });
  };

  if (!isOpen || hasCompletedSetup) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen && !hasCompletedSetup}
      onClose={() => {}}
      title="Complete Your Setup"
      blocking={true}
      closeOnOverlayClick={false}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="nickname" className="text-base text-primary">
            Choose your nickname
          </label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            disabled={createUserMutation.isPending}
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          variant="green"
          disabled={createUserMutation.isPending || !nickname.trim()}
        >
          {createUserMutation.isPending ? <LoadingDots /> : "Complete Setup"}
        </Button>
      </form>
    </Modal>
  );
};
