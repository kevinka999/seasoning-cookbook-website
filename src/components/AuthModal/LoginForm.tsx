import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Input } from "../Input";
import { Button } from "../Button";
import { LoadingDots } from "../LoadingDots";

type LoginFormProps = {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
};

const validationSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type FormValues = {
  email: string;
  password: string;
};

export const LoginForm = ({ onSuccess, onSwitchToSignup }: LoginFormProps) => {
  const { login, isLoading } = useAuth();
  const { dispatchToast } = useToast();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        dispatchToast({
          type: "success",
          content: "Login successful!",
        });
        onSuccess();
      } catch (error) {
        let errorMessage = "Login failed";

        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        dispatchToast({
          type: "error",
          content: errorMessage,
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className="text-base text-primary">
          Email
        </label>
        <Input
          id="login-email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your email"
          disabled={isLoading}
          className="w-full"
        />
        {formik.errors.email && formik.touched.email && (
          <span className="text-sm text-red-600">{formik.errors.email}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="login-password" className="text-base text-primary">
          Password
        </label>
        <Input
          id="login-password"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your password"
          disabled={isLoading}
          className="w-full"
        />
        {formik.errors.password && formik.touched.password && (
          <span className="text-sm text-red-600">{formik.errors.password}</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 text-sm">
        <span className="text-primary">Don't have an account?</span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="cursor-pointer text-blue-600 underline hover:text-blue-700"
        >
          Sign Up
        </button>
      </div>

      <Button
        type="submit"
        variant="green"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? <LoadingDots /> : "Login"}
      </Button>
    </form>
  );
};
