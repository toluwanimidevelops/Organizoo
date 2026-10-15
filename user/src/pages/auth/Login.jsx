import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Auth/Input";
import Button from "../../components/Global/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare, FaApple } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppContext } from "../../context/AppContext";
import {
  triggerFacebookLogin,
  triggerAppleLogin,
} from "../../utils/socialAuth";

const authImages = [
  "/auth/001.png",
  "/auth/002.png",
  "/auth/003.png",
  "/auth/004.png",
];

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const {
    login,
    loginLoading,
    isLoginEmailError,
    setIsLoginEmailError,
    isLoginPasswordError,
    setIsLoginPasswordError,
    googleAuth,
    facebookAuth,
    appleAuth,
  } = useAppContext();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && isLoginEmailError) {
      setIsLoginEmailError(false);
    }
    if (name === "password" && isLoginPasswordError) {
      setIsLoginPasswordError(false);
    }
  };

  const handleLogin = () => {
    if (!data.email || !data.password) {
      console.log("Email and password are required");
    } else {
      login({ email: data.email, password: data.password });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      googleAuth({ accessToken: tokenResponse.access_token }),
    onError: () => console.log("Google login failed"),
  });

  const handleFacebookLogin = async () => {
    try {
      const accessToken = await triggerFacebookLogin();
      facebookAuth({ accessToken });
    } catch (error) {
      console.log("Facebook login failed:", error.message);
    }
  };

  const handleAppleLogin = async () => {
    try {
      const { identityToken, firstName, lastName } = await triggerAppleLogin();
      appleAuth({ identityToken, firstName, lastName });
    } catch (error) {
      console.log("Apple login failed:", error.message);
    }
  };

  const handleSocialLogin = (provider) => {
    switch (provider) {
      case "google":
        googleLogin();
        break;
      case "facebook":
        handleFacebookLogin();
        break;
      case "apple":
        handleAppleLogin();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.title = "Connectify - Login";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % authImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const emailErrorMessage =
    isLoginEmailError && isLoginPasswordError
      ? "Email and Password is incorrect"
      : isLoginEmailError
        ? "Email is incorrect"
        : "";

  const passwordErrorMessage =
    isLoginEmailError && isLoginPasswordError
      ? "Email and Password is incorrect"
      : isLoginPasswordError
        ? "Password is incorrect"
        : "";

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* Left Carousel Column */}
      <div className="relative order-2 md:order-1 hidden md:block md:flex-1 h-full bg-midnight overflow-hidden">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute z-10 top-6 left-6 md:top-10 md:left-10 size-10 cursor-pointer flex justify-center items-center bg-gray-300/50 hover:bg-gray-300 duration-300 rounded-md text-secondary-dark"
          aria-label="Go back"
        >
          <IoMdArrowRoundBack size={20} />
        </button>

        <AnimatePresence mode="sync">
          <motion.img
            key={authImages[imageIndex]}
            src={authImages[imageIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-center object-cover"
            alt="Authentication visual"
          />
        </AnimatePresence>

        <div className="absolute z-10 bottom-8 left-0 w-full flex justify-center gap-2">
          {authImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setImageIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={`h-1.5 rounded-full duration-300 ${
                i === imageIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Form Column */}
      <div className="order-1 md:order-2 w-full md:w-[500px] lg:w-[700px] flex justify-center items-center h-full px-6 sm:px-10 py-10 overflow-y-auto">
        <div className="text-secondary-dark w-full max-w-md my-auto">
          <h1 className="text-3xl   font-main">Welcome Back!</h1>
          <p className="text-[#a8a8a8]   font-secondary leading-6 mb-6 font-light">
            We have missed you
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <Input
              label="Email"
              id="email"
              error={isLoginEmailError}
              errorMessage={emailErrorMessage}
              name="email"
              keyboardType="email"
              handleChange={handleChange}
              value={data.email}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              id="password"
              name="password"
              keyboardType="password"
              isPassword={true}
              error={isLoginPasswordError}
              errorMessage={passwordErrorMessage}
              showPassword={showPassword}
              setShowPassword={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
              handleChange={handleChange}
              value={data.password}
              placeholder="Enter your password"
            />

            <div className="mt-2">
              <Button
                text="Continue"
                type="submit"
                widthFull
                buttonBackground="bg-midnight"
                hoverBackground="hover:bg-midnight-muted"
                disabledBackground="disabled:bg-gray-300"
                isDisabled={!data.email || !data.password || loginLoading}
                loading={loginLoading}
              />
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs text-gray-400 absolute">
              Or continue with
            </span>
          </div>

          {/* Social Logins */}
          <div className="flex justify-center items-center gap-4">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="p-2.5 border  rounded-md bg-gray-100 border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
              aria-label="Sign up with Google"
            >
              <FcGoogle size={24} />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="p-2.5 border  rounded-md bg-gray-100 border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
              aria-label="Sign up with Facebook"
            >
              <FaFacebookSquare color="#1877F2" size={24} />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("apple")}
              className="p-2.5 border  rounded-md bg-gray-100 border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
              aria-label="Sign up with Apple"
            >
              <FaApple size={24} />
            </button>
          </div>

          {/* Redirect Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-midnight font-main hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
