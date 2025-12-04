import { Link } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const { islogedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <nav className="nav-container">
        
        {/* Logo */}
        <div className="logo">
          <Link to="/">MyApp</Link>
        </div>

        {/* Nav Links */}
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className="nav-link"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="nav-link"
            >
              Contact
            </Link>
          </li>

          {islogedIn ? (
            <>
              <li>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </button>
              </li>
              {user && user.photoURL && (
                <li className="nav-avatar-item">
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="nav-avatar"
                  />
                </li>
              )}
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className="nav-link"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}