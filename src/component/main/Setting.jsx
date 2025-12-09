import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/Authcontext";
import { db } from "../../utils/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import "../style/setting.css";

export default function Setting() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            gender: "",
            phoneNumber: "",
            email: "",
            birthDate: "",
            occupation: "",
            showCreateNewsButton: false
        }
    });

    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            const profileDocRef = doc(db, "profile", user.uid);
            const profileDoc = await getDoc(profileDocRef);
            
            if (profileDoc.exists()) {
                const data = profileDoc.data();
                setProfileData(data);
                reset({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    gender: data.gender || "",
                    phoneNumber: data.phoneNumber || "",
                    email: data.email || user.email || "",
                    birthDate: data.birthDate || "",
                    occupation: data.occupation || "",
                    showCreateNewsButton: data.showCreateNewsButton || false
                });
            } else {
                reset({
                    firstName: "",
                    lastName: "",
                    gender: "",
                    phoneNumber: "",
                    email: user.email || "",
                    birthDate: "",
                    occupation: "",
                    showCreateNewsButton: false
                });
            }
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError("Failed to load profile data");
        }
    };

    const onSubmit = async (data) => {
        if (!user) {
            setError("You must be logged in to create your profile");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const profileDocRef = doc(db, "profile", user.uid);
            const profileData = {
                ...data,
                createdAt: serverTimestamp(),
                userId: user.uid,
                userEmail: user.email
            };

            await setDoc(profileDocRef, profileData);
            
            setSuccess("Profile created successfully!");
            setProfileData(profileData);
            
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (err) {
            console.error("Error creating profile:", err);
            setError("Failed to create profile");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="profile-container">
            {/* <div className="profile-header">
                <h1>Settings</h1>
                <div className="user-info">
                    {user && (
                        <div className="user-details">
                            <span className="user-name">{profileData?.firstName || profileData?.lastName ? `${profileData?.firstName || ''} ${profileData?.lastName || ''}`.trim() || 'Anonymous User' : user.displayName || 'Anonymous User'}</span>
                            <span className="user-email">{profileData?.email || user.email}</span>
                            <span className="user-phone">{profileData?.phoneNumber || 'No phone number'}</span>
                        </div>
                    )}
                </div>
            </div> */}

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="success-message">
                    <p>{success}</p>
                </div>
            )}

            <div className="profile-content">
                <div className="form-section">
                    <h2>Create Profile Information</h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name *</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    {...register("firstName", { 
                                        required: "First name is required",
                                        minLength: {
                                            value: 2,
                                            message: "First name must be at least 2 characters"
                                        },
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message: "First name can only contain letters"
                                        }
                                    })}
                                    placeholder="Enter your first name"
                                />
                                {errors.firstName && (
                                    <span className="error-text">{errors.firstName.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last Name *</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    {...register("lastName", { 
                                        required: "Last name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Last name must be at least 2 characters"
                                        },
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message: "Last name can only contain letters"
                                        }
                                    })}
                                    placeholder="Enter your last name"
                                />
                                {errors.lastName && (
                                    <span className="error-text">{errors.lastName.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Gender *</label>
                            <select
                                id="gender"
                                {...register("gender", { 
                                    required: "Please select a gender"
                                })}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                            {errors.gender && (
                                <span className="error-text">{errors.gender.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number *</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                {...register("phoneNumber", { 
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[+]?[\d\s\-\(\)]+$/,
                                        message: "Please enter a valid phone number"
                                    }
                                })}
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.phoneNumber && (
                                <span className="error-text">{errors.phoneNumber.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Please enter a valid email address"
                                    }
                                })}
                                placeholder="your.email@example.com"
                                disabled={!!user.email}
                            />
                            {errors.email && (
                                <span className="error-text">{errors.email.message}</span>
                            )}
                            {user.email && (
                                <small className="form-hint">Email cannot be changed (linked to your account)</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="birthDate">Birth Date</label>
                            <input
                                type="date"
                                id="birthDate"
                                {...register("birthDate", { 
                                    validate: {
                                        notFuture: value => {
                                            if (!value) return true; // Optional field
                                            const birthDate = new Date(value);
                                            const today = new Date();
                                            const age = today.getFullYear() - birthDate.getFullYear();
                                            return age >= 13 || "You must be at least 13 years old";
                                        }
                                    }
                                })}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {errors.birthDate && (
                                <span className="error-text">{errors.birthDate.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="occupation">Occupation</label>
                            <input
                                type="text"
                                id="occupation"
                                {...register("occupation", { 
                                    minLength: {
                                        value: 3,
                                        message: "Occupation must be at least 3 characters"
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Occupation must not exceed 50 characters"
                                    },
                                    pattern: {
                                        value: /^[A-Za-z\s\-]+$/,
                                        message: "Occupation can only contain letters, spaces, and hyphens"
                                    }
                                })}
                                placeholder="Enter your occupation"
                            />
                            {errors.occupation && (
                                <span className="error-text">{errors.occupation.message}</span>
                            )}
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    id="showCreateNewsButton"
                                    {...register("showCreateNewsButton",{required: "You must agree to the Terms and Conditions and Privacy Policy"})}
                                />
                                <span className="checkbox-text">I agree to the Terms and Conditions and Privacy Policy</span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading || !user}
                            >
                                {loading ? "Create Profile..." : "Create Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

