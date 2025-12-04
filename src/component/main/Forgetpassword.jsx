import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { auth } from "../../utils/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import "../style/Forgetpassword.css";
import { toast } from "react-toastify";

export default function ForgetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Failed to send password reset email");
    }
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-inner">
        {/* Logo/Brand */}
        <div className="forget-password-brand">
          <div className="password-icon-container">
            <svg className="password-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="forget-password-title">Forgot Password</h1>
          <p className="forget-password-subtitle">No worries, we'll send you reset instructions</p>
        </div>

        {/* Reset Card */}
        <div className="forget-password-card">
          <form onSubmit={handleSubmit(onSubmit)} className="forget-password-form">
            
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className={`form-control ${errors.email ? "input-error" : ""}`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="error-message">Email is required</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
            >
              Send Reset Email
              <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>

          {/* Back to Login */}
          <div className="back-to-login-section">
            <p className="back-to-login-text">
              Remember your password?{" "}
              <Link to="/login" className="back-to-login-link">
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <p className="help-text">
            Need help? Contact{" "}
            <a href="mailto:support@example.com" className="help-link">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}