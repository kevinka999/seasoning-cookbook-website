import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Input } from "../Input";
import { Button } from "../Button";
import { LoadingDots } from "../LoadingDots";

type SignupFormProps = {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
};

type PasswordRequirements = {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

const checkPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

const countMetRequirements = (requirements: PasswordRequirements): number => {
  return Object.values(requirements).filter((req) => req === true).length;
};

const MIN_REQUIREMENTS = 3;
const TOTAL_REQUIREMENTS = 5;

const validationSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .test(
      "password-strength",
      `Password must meet at least ${MIN_REQUIREMENTS} of ${TOTAL_REQUIREMENTS} requirements`,
      (value) => {
        if (!value) return false;
        const requirements = checkPasswordRequirements(value);
        const metCount = countMetRequirements(requirements);
        return metCount >= MIN_REQUIREMENTS;
      },
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignupForm = ({ onSuccess, onSwitchToLogin }: SignupFormProps) => {
  const { signup, isLoading } = useAuth();
  const { dispatchToast } = useToast();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        await signup(values.email, values.password);
        dispatchToast({
          type: "success",
          content: "Sign up successful!",
        });
        onSuccess();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Sign up failed";
        dispatchToast({
          type: "error",
          content: errorMessage,
        });
      }
    },
  });

  const passwordRequirements = checkPasswordRequirements(
    formik.values.password,
  );
  const metCount = countMetRequirements(passwordRequirements);
  const progressPercentage = (metCount / TOTAL_REQUIREMENTS) * 100;
  const isPasswordValid = metCount >= MIN_REQUIREMENTS;

  const getHealthBarColor = () => {
    if (metCount === 0) return "bg-gray-400";
    if (metCount < MIN_REQUIREMENTS) return "bg-red-500";
    if (metCount < TOTAL_REQUIREMENTS) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="signup-email" className="text-base text-primary">
          Email
        </label>
        <Input
          id="signup-email"
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
        <label htmlFor="signup-password" className="text-base text-primary">
          Password
        </label>
        <Input
          id="signup-password"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your password"
          disabled={isLoading}
          className="w-full"
        />
        {formik.values.password && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
                <span className="text-primary">
                  Password strength ({metCount}/{TOTAL_REQUIREMENTS})
              </span>
              {!isPasswordValid && (
                  <span className="text-primary">
                    Need at least {MIN_REQUIREMENTS} requirements
                </span>
              )}
            </div>
            <div className="h-2 w-full border-2 border-black bg-gray-300">
              <div
                className={`h-full transition-all duration-300 ${getHealthBarColor()}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
        {formik.errors.password && formik.touched.password && (
          <span className="text-sm text-red-600">{formik.errors.password}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="signup-confirm-password"
          className="text-base text-primary"
        >
          Confirm Password
        </label>
        <Input
          id="signup-confirm-password"
          type="password"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Confirm your password"
          disabled={isLoading}
          className="w-full"
        />
        {formik.errors.confirmPassword && formik.touched.confirmPassword && (
          <span className="text-sm text-red-600">
            {formik.errors.confirmPassword}
          </span>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 text-sm">
        <span className="text-primary">Already have an account?</span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="cursor-pointer text-blue-600 underline hover:text-blue-700"
        >
          Login
        </button>
      </div>

      <Button
        type="submit"
        variant="green"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? <LoadingDots /> : "Sign Up"}
      </Button>
    </form>
  );
};
