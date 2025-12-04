import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { signUpWithEmailAndPassword } from "../../utils/auth";
import { toast } from "react-toastify";
import "../style/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await signUpWithEmailAndPassword(data.email, data.password);
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("User already exists!");
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-inner">
        {/* Logo/Brand */}
        <div className="register-brand">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join us today and get started</p>
        </div>

        {/* Register Card */}
        <div className="register-card">
          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className={`form-control ${errors.name ? "input-error" : ""}`}
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 3, message: "Name must be at least 3 characters" },
                })}
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`form-control ${errors.email ? "input-error" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                className={`form-control ${errors.password ? "input-error" : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                className={`form-control ${errors.confirmPassword ? "input-error" : ""}`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="form-group">
              <label className="terms-label">
                <input
                  type="checkbox"
                  className="terms-checkbox"
                  {...register("terms", {
                    required: "You must agree to the terms and conditions",
                  })}
                />
                <span className="terms-text">
                  I agree to the{" "}
                  <a href="#" className="terms-link">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="terms-link">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p className="error-message">{errors.terms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="login-section">
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}