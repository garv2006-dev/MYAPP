import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { signInWithEmail, signUpWithGoogle } from "../../utils/auth";
import { toast } from "react-toastify";
import "../style/Login.css";

export default function Login() {
  const { islogedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signUpWithGoogle();
      toast.success("Successfully signed in with Google!");
      navigate("/");
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async ({ email, password }) => {
    try {
      setIsLoading(true);
      const response = await signInWithEmail(email, password);
      console.log(response);
      toast.success("Login Successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Sign in error:", error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        toast.error("Invalid email or password!");
      } else if (error.code === "auth/user-not-found") {
        toast.error("Account does not exist!");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-inner">
        {/* Logo/Brand */}
        <div className="login-brand">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            className="google-signin-btn"
            disabled={googleLoading}
          >
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google"
              className="google-icon"
            />
            <span className="google-text">
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="login-divider">
            <div className="divider-line"></div>
            <div className="divider-text">Or continue with email</div>
          </div>

          {/* Email Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            
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
                    message: "Invalid email address"
                  }
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
                placeholder="Enter your password"
                className={`form-control ${errors.password ? "input-error" : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            {/* Forget Password Link */}
            <div className="forgot-password-container">
              <Link
                to="/forgetpassword"
                className="forgot-password-link"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="register-section">
            <p className="register-text">
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}