import React, { useState, useContext, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase-config";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const auth = getAuth(app);
  const [user, setUser] = useState();


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });


    return unsubscribe;
  }, [auth]);

  const value = { user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}