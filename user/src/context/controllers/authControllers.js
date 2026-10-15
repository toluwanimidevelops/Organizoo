// All of the auth logic that used to live inline in AppContext, moved here
// as a factory function. It takes whatever it needs (api instance, navigate,
// state setters) as params and hands back the same set of functions.

export const createAuthControllers = ({
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
}) => {
  const addLocation = async (location) => {
    try {
      const { data } = await api.post("/auth/location", location);
      setUser(data.user);
    } catch (error) {
      console.log("Location Save Error:", error.message);
    }
  };

  // Sign Up Action
  const signUp = async ({ firstName, lastName, email, password }) => {
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
      localStorage.setItem(TOKEN_KEY, data.token); // No JSON.stringify for flat strings!
      navigate("/auth/verify-email");
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData) {
        if (errorData.type === "validation") {
          setIsSignUpEmailError(true);
          setIsSignUpPasswordError(true);
        }
        if (errorData.type === "email") {
          setIsSignUpEmailError(true);
        }
      } else {
        console.log("Network/General Error:", error.message);
      }
    } finally {
      setSignUpLoading(false);
    }
  };

  // Login Action
  const login = async ({ email, password }) => {
    resetErrors();
    setLoginLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token); // Standardized storage helper

      if (data.otpRequired) {
        navigate("/auth/verify-email");
      } else {
        navigate("/");
      }
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData) {
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
        console.log("Network/General Error:", error.message);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Shared landing logic for every social provider — the backend already
  // finds-or-creates the user and returns the same { token, user } shape
  // as /auth/login, so from here on it's identical to a normal login.
  const handleSocialAuthSuccess = (data) => {
    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
    navigate("/");
  };

  // Google Sign-In — payload: { accessToken } from useGoogleLogin() on the frontend
  const googleAuth = async ({ accessToken }) => {
    setLoginLoading(true);
    try {
      const { data } = await api.post("/auth/google", { accessToken });
      handleSocialAuthSuccess(data);
    } catch (error) {
      console.log(
        "Google auth error:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // Facebook Sign-In — payload: { accessToken } from the Facebook JS SDK
  const facebookAuth = async ({ accessToken }) => {
    setLoginLoading(true);
    try {
      const { data } = await api.post("/auth/facebook", { accessToken });
      handleSocialAuthSuccess(data);
    } catch (error) {
      console.log(
        "Facebook auth error:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // Apple Sign-In — payload: { identityToken, firstName?, lastName? }
  // firstName/lastName only exist on the person's FIRST Apple sign-in —
  // forward them when present, omit them on every sign-in after that.
  const appleAuth = async ({ identityToken, firstName, lastName }) => {
    setLoginLoading(true);
    try {
      const { data } = await api.post("/auth/apple", {
        identityToken,
        firstName,
        lastName,
      });
      handleSocialAuthSuccess(data);
    } catch (error) {
      console.log(
        "Apple auth error:",
        error.response?.data?.message || error.message,
      );
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
      const errorData = error.response?.data;
      if (errorData) {
        console.log("An error occurred while sending", errorData.message);
      }
    }
  };

  // Verify Email Action
  const VerifyEmail = async (otp) => {
    setEmailVerificationLoading(true);
    try {
      const { data } = await api.post("/auth/verifyEmail", { otp });
      if (data.success) {
        setShowSuccess(true);
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData) {
        console.log("An error occurred while verifying", errorData.message);
      }
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  // Slug Exist
  const slugExist = async (slug) => {
    try {
      const { data } = await api.post("/auth/slugExist", { slug });
      if (data.success) {
        return true;
      }
      return false;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData) {
        console.log("An error occurred while verifying", errorData.message);
      }
      return false;
    }
  };

  // Get User Profile
  const getUserProfile = async (currentToken) => {
    try {
      const { data } = await api.get("/auth", {
        headers: { Authorization: currentToken },
      });
      setUser(data.user);
    } catch (error) {
      console.log(
        "Error fetching user profile (session expired). Clearing credentials.",
        error,
      );
      await logout(); // Session expired or invalid token, clean up state
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout Helper
  const logout = async () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log("Logout cleanup error:", error);
    }
  };

  // Load Authentication Token from Local Storage
  const loadStoredToken = async () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
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

  return {
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
  };
};