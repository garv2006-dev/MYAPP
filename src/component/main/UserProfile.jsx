import { useState, useEffect } from "react";
import { useAuth } from "../../context/Authcontext";
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import "../style/userrofile.css";

export default function UserProfile() {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            const ref = doc(db, "profile", user.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                setProfileData(snap.data());
            } else {
                setProfileData({
                    email: user.email,
                    firstName: user.displayName?.split(" ")[0] || "",
                    lastName: user.displayName?.split(" ")[1] || "",
                });
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load your profile.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="loading-text">Loading profile...</p>;

    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="profile-container">

            <h1 className="page-title">User Profile</h1>

            <div className="profile-card">

                <div className="profile-avatar">
                    <div className="avatar-placeholder">
                        {(profileData?.firstName?.[0] ||
                          profileData?.lastName?.[0] ||
                          user?.email?.[0] ||
                          "U").toUpperCase()}
                    </div>
                </div>

                <div className="profile-info">
                    <h2 className="profile-name">
                        {profileData?.firstName || profileData?.lastName
                            ? `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim()
                            : "No Name Set"}
                    </h2>

                    <p className="profile-field">
                        <strong>Email:</strong> {profileData?.email || user.email}
                    </p>

                    <p className="profile-field">
                        <strong>Phone:</strong> {profileData?.phoneNumber || "Not added"}
                    </p>

                    {profileData?.occupation && (
                        <p className="profile-field">
                            <strong>Occupation:</strong> {profileData.occupation}
                        </p>
                    )}

                    {profileData?.gender && (
                        <p className="profile-field">
                            <strong>Gender:</strong> {profileData.gender}
                        </p>
                    )}

                    {profileData?.birthDate && (
                        <p className="profile-field">
                            <strong>Birth:</strong> {new Date(profileData.birthDate).toLocaleDateString()}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}
