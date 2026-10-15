import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createAuthControllers } from "./controllers/authControllers";

const AppContext = createContext(undefined);

const api = axios.create({ baseURL: "http://localhost:5000/api" });

// Constant storage key to prevent mismatches
const TOKEN_KEY = "@token";

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Tracks startup state

  // Error & Loading States
  const [isLoginEmailError, setIsLoginEmailError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoginPasswordError, setIsLoginPasswordError] = useState(false);
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false);
  const [isSignUpEmailError, setIsSignUpEmailError] = useState(false);
  const [isSignUpPasswordError, setIsSignUpPasswordError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Dynamically attach the token to all requests if it exists
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, [token]);

  const resetErrors = () => {
    setIsLoginEmailError(false);
    setIsLoginPasswordError(false);
    setIsSignUpEmailError(false);
    setIsSignUpPasswordError(false);
  };

  // All the auth functions now live in ./controllers/authControllers.js —
  // this just wires them up with what they need from this component.
  const {
    addLocation,
    signUp,
    login,
    googleAuth,
    facebookAuth,
    appleAuth,
    resendEmailVerificationOtp,
    VerifyEmail,
    slugExist,
    getUserProfile,
    logout,
    loadStoredToken,
  } = createAuthControllers({
    api,
    navigate,
    TOKEN_KEY,
    setUser,
    setToken,
    setAuthLoading,
    setSignUpLoading,
    setLoginLoading,
    setEmailVerificationLoading,
    setShowSuccess,
    setIsLoginEmailError,
    setIsLoginPasswordError,
    setIsSignUpEmailError,
    setIsSignUpPasswordError,
    resetErrors,
  });

  // Lifecycle initialization
  useEffect(() => {
    loadStoredToken();
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        addLocation,
        user,
        getUserProfile,
        authLoading,
        signUpLoading,
        setSignUpLoading,
        loginLoading,
        setLoginLoading,
        VerifyEmail,
        resendEmailVerificationOtp,
        setUser,
        token,
        slugExist,
        setToken,
        signUp,
        googleAuth,
        facebookAuth,
        appleAuth,
        setShowSuccess,
        showSuccess,
        login,
        emailVerificationLoading,
        setEmailVerificationLoading,
        isLoginEmailError,
        setIsLoginEmailError,
        isLoginPasswordError,
        setIsLoginPasswordError,
        isSignUpEmailError,
        setIsSignUpEmailError,
        isSignUpPasswordError,
        setIsSignUpPasswordError,
        logout,
        api,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
