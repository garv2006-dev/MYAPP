// src/context/Authcontext/index.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userlogedIn, setUserlogedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setUserlogedIn(!!user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserlogedIn(false);
    } catch (error) {
      console.error("Error signing out: ", error);
      throw error;
    }
  };

  const value = {
    user,
    islogedIn: userlogedIn,
    loading,
    logout: handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}