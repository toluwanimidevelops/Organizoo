import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios, { AxiosError } from "axios";
import { Vibration } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export interface IGeoCoordinates {
  type: "point";
  coordinates: [number, number];
}

export interface IUserLocation {
  city?: string;
  country?: string;
  district?: string;
  isoCountryCode?: string;
  name?: string;
  postalCode?: string;
  region?: string;
  street?: string;
  streetNumber?: string;
  timezone?: string;
  coordinates?: IGeoCoordinates;
}

export interface INotificationPreferences {
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface IPrivacyPreferences {
  profilePublic: boolean;
  showAttendance: boolean;
  allowMessages: boolean;
}

export interface IUserPreferences {
  language: string;
  theme: "light" | "dark";
  notifications: INotificationPreferences;
  privacy: IPrivacyPreferences;
}
// Updated User Interface matching your schema definition
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  coverPhoto: string;
  bio: string;
  gender: "male" | "female" | "other";
  userType: "attendee" | "organizer" | "admin";
  location?: IUserLocation;
  preferences?: IUserPreferences;
  phone?: string;
  slug?: string;
  interest: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
  totalEventsAttended?: number;
  averageRatings?: number;
  totalReviews?: number;
}

interface AuthCredentials {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

interface AppContextType {
  user: User | null;
  authLoading: boolean; // Added to track initial token restoration
  emailVerificationLoading: boolean;
  setEmailVerificationLoading: (val: boolean) => void;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  signUp: (credentials: Required<AuthCredentials>) => Promise<void>;
  resendEmailVerificationOtp: () => Promise<void>;
  login: (
    credentials: Omit<AuthCredentials, "firstName" | "lastName">,
  ) => Promise<void>;
  slugExist: (slug: string) => Promise<boolean>;
  addLocation: (location: LocationData) => Promise<void>;
  VerifyEmail: (otp: string) => Promise<void>;
  isLoginEmailError: boolean;
  setIsLoginEmailError: (val: boolean) => void;
  isLoginPasswordError: boolean;
  setIsLoginPasswordError: (val: boolean) => void;
  isSignUpEmailError: boolean;
  setShowSuccess: (val: boolean) => void;
  showSuccess: boolean;
  loginLoading: boolean;
  setLoginLoading: (val: boolean) => void;
  signUpLoading: boolean;
  setSignUpLoading: (val: boolean) => void;
  setIsSignUpEmailError: (val: boolean) => void;
  isSignUpPasswordError: boolean;
  setIsSignUpPasswordError: (val: boolean) => void;
  logout: () => Promise<void>; // Added helper
}

interface LocationData {
  city: string;
  country: string;
  district: string;
  isoCountryCode: string;
  name: string;
  postalCode: string;
  region: string;
  street: string;
  streetNumber: string;
  timezone: string;
  longitude: number;
  latitude: number;
}

interface ApiErrorResponse {
  type: "validation" | "email" | "password";
  message: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const api = axios.create({ baseURL: "http://172.20.10.2:5000/api" });

// Constant storage key to prevent mismatches
const TOKEN_KEY = "@token";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
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

  const addLocation = async (location: LocationData) => {
    try {
      const { data } = await api.post("/auth/location", location);
      setUser(data.user);
    } catch (error) {
      const err = error as Error;
      console.log("Location Save Error:", err.message);
    }
  };

  // Sign Up Action
  const signUp = async ({
    firstName,
    lastName,
    email,
    password,
  }: Required<AuthCredentials>) => {
    setSignUpLoading(true);
    resetErrors();
    try {
      const { data } = await api.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });
      setToken(data.token);
      await AsyncStorage.setItem(TOKEN_KEY, data.token); // No JSON stringify for flat strings!
      router.push("/(main)/auth/verify-email");
    } catch (error) {
      Vibration.vibrate(500);
      const err = error as AxiosError<ApiErrorResponse>;

      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.type === "validation") {
          setIsSignUpEmailError(true);
          setIsSignUpPasswordError(true);
        }
        if (errorData.type === "email") {
          setIsSignUpEmailError(true);
        }
      } else {
        console.log("Network/General Error:", err.message);
      }
    } finally {
      setSignUpLoading(false);
    }
  };

  // Login Action
  const login = async ({
    email,
    password,
  }: Omit<AuthCredentials, "firstName" | "lastName">) => {
    resetErrors();
    setLoginLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      await AsyncStorage.setItem(TOKEN_KEY, data.token); // Standardized storage helper

      if (data.otpRequired) {
        router.push("/(main)/auth/verify-email");
      } else {
        router.push("/(main)/(tabs)/(home)/home");
      }
    } catch (error) {
      Vibration.vibrate(500);
      const err = error as AxiosError<ApiErrorResponse>;

      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.type === "validation") {
          setIsLoginEmailError(true);
          setIsLoginPasswordError(true);
        }
        if (errorData.type === "email") {
          setIsLoginEmailError(true);
        }
        if (errorData.type === "password") {
          setIsLoginPasswordError(true);
        }
      } else {
        console.log("Network/General Error:", err.message);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Resend email verification Otp
  const resendEmailVerificationOtp = async () => {
    try {
      const { data } = await api.post("/auth/sendEmailOtp", null);
      if (data.success) {
        console.log(data.message);
      }
    } catch (error) {
      Vibration.vibrate(500);
      const err = error as AxiosError<ApiErrorResponse>;
      if (err.response?.data) {
        console.log(
          "An error occurred while sending",
          err.response.data.message,
        );
      }
    }
  };

  // Verify Email Action
  const VerifyEmail = async (otp: string) => {
    setEmailVerificationLoading(true);
    try {
      const { data } = await api.post("/auth/verifyEmail", { otp });
      if (data.success) {
        setShowSuccess(true);
      }
    } catch (error) {
      Vibration.vibrate(500);
      const err = error as AxiosError<ApiErrorResponse>;
      if (err.response?.data) {
        console.log(
          "An error occurred while verifying",
          err.response.data.message,
        );
      }
    } finally {
      setEmailVerificationLoading(false);
    }
  };
  // Slug Exist
  const slugExist = async (slug: string) => {
    try {
      const { data } = await api.post("/auth/slugExist", { slug });
      if (data.success) {
        return true;
      }
      return false;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      if (err.response?.data) {
        console.log(
          "An error occurred while verifying",
          err.response.data.message,
        );
      }
      return false;
    }
  };
  // Get User Profile
  const getUserProfile = async (currentToken: string) => {
    try {
      const { data } = await api.get("/auth", {
        headers: { Authorization: currentToken },
      });
      setUser(data.user);
    } catch (error) {
      console.log(
        "Error fetching user profile (session expired). Clearing credentials.",
      );
      await logout(); // Session expired or invalid token, clean up state
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout Helper
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      router.replace("/");
    } catch (error) {
      console.log("Logout cleanup error:", error);
    }
  };

  // Load Authentication Token from Local Storage
  const loadStoredToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken); // Stored directly as a pure string
        await getUserProfile(storedToken);
      } else {
        setAuthLoading(false); // No token found, loading finished
      }
    } catch (error) {
      console.log("Error loading token from storage:", error);
      setAuthLoading(false);
    }
  };

  // Lifecycle initialization
  useEffect(() => {
    loadStoredToken();
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        addLocation,
        user,
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
