import React, { createContext, useContext, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginUser, signupUser, logoutUser } from "../api/mutations";
import { getUserData } from "../api/queries";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useQueryClient } from "@tanstack/react-query";
import type {
  User,
  LoginRequest,
  SignupRequest,
} from "../types/identity-service";

const ACCESS_TOKEN_KEY = "access_token";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [storedToken, setStoredToken] = useLocalStorage<string | null>(
    ACCESS_TOKEN_KEY,
    null
  );
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getUserData,
    enabled: !!storedToken,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
    },
  });

  const isAuthenticated = !!storedToken && !!user;

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const data: LoginRequest = { email, password };
      const response = await loginMutation.mutateAsync(data);

      setStoredToken(response.accessToken);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    [loginMutation, setStoredToken, queryClient]
  );

  const signup = useCallback(
    async (email: string, password: string): Promise<void> => {
      const data: SignupRequest = { email, password };
      const response = await signupMutation.mutateAsync(data);

      setStoredToken(response.accessToken);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    [signupMutation, setStoredToken, queryClient]
  );

  const signout = useCallback(async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Signout error:", error);
    } finally {
      setStoredToken(null);
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
    }
  }, [logoutMutation, setStoredToken, queryClient]);

  const value: AuthContextType = {
    isAuthenticated,
    user: user || null,
    login,
    signup,
    signout,
    isLoading:
      isLoadingUser ||
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
