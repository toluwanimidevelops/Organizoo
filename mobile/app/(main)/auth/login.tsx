import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, {  useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/auth/Input";
import GlobalButton from "@/components/global/GlobalButton";
import { FontAwesome } from "@expo/vector-icons";
import { useAppContext } from "@/context/AppContext";
import { router } from "expo-router";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// WebBrowser.maybeCompleteAuthSession();
const Login = () => {
  // const [userInfo, setUserInfo] = useState(null);
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   webClientId:
  //     "228677396218-3ter8fohpdmm41kmaipbnl8dbkk9smqg.apps.googleusercontent.com",
  //   iosClientId:
  //     "228677396218-h7jvdrgnf4554up7ek3v7pofqqc9h1cu.apps.googleusercontent.com",
  //   androidClientId:
  //     "228677396218-5j14728jnoq2i2qek157n6dkou2i56s9.apps.googleusercontent.com",
  // });
  

 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSocialLogin = (platform: string) => {
    // Handle social login logic here based on the platform (Google, Facebook, Apple)
    if (platform.toLocaleLowerCase() === "google") {
      // promptAsync();
    }
    console.log(`Logging in with ${platform}`);
  };
  const {
    login,
    loginLoading,
    isLoginEmailError,
    setIsLoginEmailError,
    isLoginPasswordError,
    setIsLoginPasswordError,
  } = useAppContext();
  // 1. Intercept email typing to clear its error state
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (isLoginEmailError) {
      setIsLoginEmailError(false);
    }
  };

  // 2. Intercept password typing to clear its error state
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (isLoginPasswordError) {
      setIsLoginPasswordError(false);
    }
  };
  // handle login button press
  const handleLogin = () => {
    if (!email || !password) {
      console.log("Email and password are required");
    } else {
      login({ email, password });
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-[#f4f7fd] p-5">
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, backgroundColor: "#f4f7fd" }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text className="text-3xl font-main-bold ">Welcome Back!</Text>
          <Text className="text-[#a8a8a8] font-primary leading-6 mt-1 font-light">
            Glad to have you here again, Lets get started!
          </Text>
          <View className="mt-10 gap-5 flex-1 justify-between">
            <View className="gap-4">
              <Input
                label="Email"
                placeholder="Enter Your Email"
                errorMessage={
                  isLoginEmailError && isLoginPasswordError
                    ? "Email and Password is incorrect"
                    : isLoginEmailError
                      ? "Email is incorrect"
                      : ""
                }
                keyboardType="email-address"
                value={email}
                error={isLoginEmailError}
                setValue={handleEmailChange}
              />
              <Input
                label="Password"
                placeholder="••••••••"
                isPassword={true}
                error={isLoginPasswordError}
                errorMessage={
                  isLoginEmailError && isLoginPasswordError
                    ? "Email and Password is incorrect"
                    : isLoginPasswordError
                      ? "Password is incorrect"
                      : ""
                }
                value={password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                setValue={handlePasswordChange}
              />
              <TouchableOpacity className="self-end ">
                <Text className=" leading-6 mt-1 font-secondary text-[#100a30]">
                  Forgot password?
                </Text>
              </TouchableOpacity>
              <View>
                <GlobalButton
                  text="Log In"
                  lessBorder={true}
                  isDisabled={!email || !password || loginLoading}
                  onPress={() => handleLogin()}
                  loading={loginLoading}
                />
              </View>
              {/* Divider */}
              <View className="flex-row items-center mb-3">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-4  text-[#a8a8a8]  font-primary">
                  Or continue with
                </Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Social Login Buttons */}
              <View className="flex-row justify-center gap-4 mb-10">
                <TouchableOpacity
                  onPress={() => handleSocialLogin("google")}
                  activeOpacity={0.8}
                  className="w-14 h-14 rounded-lg border border-gray-200 items-center justify-center bg-white"
                >
                  <FontAwesome name="google" size={22} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialLogin("facebook")}
                  activeOpacity={0.8}
                  className="w-14 h-14 rounded-lg border border-gray-200 items-center justify-center bg-white"
                >
                  <FontAwesome name="facebook" size={22} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialLogin("apple")}
                  activeOpacity={0.8}
                  className="w-14 h-14 rounded-lg border border-gray-200 items-center justify-center bg-white"
                >
                  <FontAwesome name="apple" size={24} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
            {/* Sign Up Link */}
            <View className="flex-row align-bottom justify-center mt-auto">
              <Text className="text-[#a8a8a8]  font-primary">
                Don`&apos;`t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text className="font-secondary text-[#100a30]">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
