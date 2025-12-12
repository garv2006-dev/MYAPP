import { Link } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Header.css";

// Import simple icons for the menu button
import { IoMenu, IoClose } from "react-icons/io5";

export default function Header() {
  const { islogedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  // New state for the mobile hamburger menu
  const [openMenu, setOpenMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
    // Close mobile menu when a navigation occurs (optional, but good for UX)
    setOpenMenu(false);
  }, [user]);

  // Close dropdown when the mobile menu is opened/closed to prevent overlap
  useEffect(() => {
    if (openMenu) {
      setOpenDropdown(false);
    }
  }, [openMenu]);

  const fetchUserProfile = async () => {
    try {
      const profileDocRef = doc(db, "profile", user.uid);
      const profileDoc = await getDoc(profileDocRef);

      if (profileDoc.exists()) {
        setUserProfile(profileDoc.data());
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDisplayName = () => {
    if (userProfile?.firstName || userProfile?.lastName) {
      return `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim();
    }
    return user?.displayName || "User";
  };

  const getAvatarText = () => {
    if (userProfile?.firstName) {
      return userProfile.firstName.charAt(0).toUpperCase();
    }
    return (
      user?.displayName?.charAt(0)?.toUpperCase() ||
      user?.email?.charAt(0)?.toUpperCase() ||
      "U"
    );
  };

  const handleLinkClick = () => {
    // Close the mobile menu when a link is clicked
    setOpenMenu(false);
  };

  return (
    <header className="header">
      <nav className="nav-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="logo-link">
            {/* Added 'logo-image' class for specific styling */}
            <img src="textlogo.svg" alt="App Logo" className="logo-image" />
          </Link>
        </div>

        {/* Hamburger Menu Button (visible on mobile) */}
        <div className="menu-button" onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? <IoClose size={24} /> : <IoMenu size={24} />}
        </div>

        {/* Nav Links Container (conditionally shown on mobile) */}
        {/* The 'nav-links' class is now handled by a new 'nav-links-container' */}
        <div className={`nav-links-container ${openMenu ? "open" : ""}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link" onClick={handleLinkClick}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/contact" className="nav-link" onClick={handleLinkClick}>
                Contact
              </Link>
            </li>

            {/* Show Create News button if flag is enabled */}
            {islogedIn && userProfile?.showCreateNewsButton && (
              <li>
                <Link to="/createnews" className="nav-link" onClick={handleLinkClick}>
                  Create News
                </Link>
              </li>
            )}

            {islogedIn ? (
              <li className="nav-avatar-wrapper">
                <div
                  className="nav-avatar-dropdown"
                  onClick={() => setOpenDropdown(!openDropdown)}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="nav-avatar"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  <div
                    className="nav-avatar-placeholder"
                    style={{
                      display: user?.photoURL ? "none" : "flex",
                    }}
                  >
                    {getAvatarText()}
                  </div>
                </div>

                {openDropdown && (
                  <ul className="dropdown-menu">
                    <li className="dropdown-item" onClick={handleLinkClick}>
                      <Link to="/userprofile" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Profile
                      </Link>
                    </li>
                    <li className="dropdown-item" onClick={handleLinkClick}>
                      {!userProfile ? (
                        <Link to="/setting" style={{ textDecoration: 'none', color: 'inherit' }}>
                          Setting
                        </Link>
                      ) : (
                        <Link to="/createnews" style={{ textDecoration: 'none', color: 'inherit' }}>
                          Create News
                        </Link>
                      )}
                    </li>
                    <li className="dropdown-item" onClick={() => {
                      handleLogout();
                      handleLinkClick(); // Close menu after logout
                    }}>
                      Logout
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <li>
                <Link to="/login" className="nav-link" onClick={handleLinkClick}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}