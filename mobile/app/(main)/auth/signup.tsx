import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/auth/Input";
import GlobalButton from "@/components/global/GlobalButton";
import { FontAwesome,  } from "@expo/vector-icons";
import { useAppContext } from "@/context/AppContext";
import { router } from "expo-router";
const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSocialLogin = (platform: string) => {
    // Handle social login logic here based on the platform (Google, Facebook, Apple)
    console.log(`Logging in with ${platform}`);
  };
  const {
    signUp,
    signUpLoading,
    // setSignUpLoading,
    isSignUpEmailError,
    setIsSignUpEmailError,
    isSignUpPasswordError,
    setIsSignUpPasswordError,
  } = useAppContext();
  // 1. Intercept email typing to clear its error state
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (isSignUpEmailError) {
      setIsSignUpEmailError(false);
    }
  };

  // 2. Intercept password typing to clear its error state
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (isSignUpPasswordError) {
      setIsSignUpPasswordError(false);
    }
  };
  // handle signup button press
  const handleSignUp = () => {
    if (!email || !password) {
      console.log("Email and password are required");
    } else {
      signUp({ firstName, lastName, email, password });
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
          <Text className="text-3xl font-main-bold">Create your account</Text>
          <Text className="text-[#a8a8a8] font-primary leading-6 mt-1 font-light">
            Fill in your details to get started.
          </Text>
          <View className="mt-10 gap-5 flex-1 justify-between">
            <View className="gap-4">
              <Input
                label="First Name"
                placeholder="Enter Your First Name"
                value={firstName}
                setValue={setFirstName}
              />
              <Input
                label="Last Name"
                placeholder="Enter Your Last Name"
                value={lastName}
                setValue={setLastName}
              />
              <Input
                label="Email"
                placeholder="Enter Your Email"
                errorMessage={
                  isSignUpEmailError && isSignUpPasswordError
                    ? "Email is Required"
                    : isSignUpEmailError
                      ? "Email already exists"
                      : ""
                }
                keyboardType="email-address"
                value={email}
                error={isSignUpEmailError}
                setValue={handleEmailChange}
              />
              <Input
                label="Password"
                placeholder="••••••••"
                isPassword={true}
                error={isSignUpPasswordError}
                errorMessage={
                  isSignUpEmailError && isSignUpPasswordError
                    ? "Email already exists"
                    : isSignUpEmailError
                      ? "Email already exists"
                      : ""
                }
                value={password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                setValue={handlePasswordChange}
              />
              
              <View className="mt-3">
                <GlobalButton
                  text="Sign up"
                  loading={signUpLoading}
                  lessBorder={true}
                  isDisabled={
                    !firstName ||
                    !lastName ||
                    !email ||
                    !password ||
                    signUpLoading
                  }
                  onPress={() => handleSignUp()}
                />
              </View>
              {/* Divider */}
              <View className="flex-row items-center mb-3">
                <View className="flex-1 h-px bg-gray-200" />
                <Text
                  
                  className="mx-4  text-[#a8a8a8]  font-primary"
                >
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
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text className="font-secondary text-[#100a30]">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
