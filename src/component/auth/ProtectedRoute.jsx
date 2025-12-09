import { useAuth } from "../../context/Authcontext";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { islogedIn, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !islogedIn) {
      // Navigate to login will be handled by the Navigate component
    }
  }, [islogedIn, loading]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!islogedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Add loading styles
const style = document.createElement('style');
style.textContent = `
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f9fafb;
  }
  
  .loading-spinner {
    padding: 1rem 2rem;
    background-color: #e5e7eb;
    border-radius: 0.5rem;
    color: #6b7280;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(style);
