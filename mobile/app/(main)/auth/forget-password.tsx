import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Vibration,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/auth/Input";
import GlobalButton from "@/components/global/GlobalButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { AxiosError } from "axios";
import { ApiErrorResponse, useAppContext } from "@/context/AppContext";
import AppSheet from "@/components/account/AppSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import PasswordResetSuccess from "@/components/auth/PasswordResetSuccess";

const ForgetPassword = () => {
  const { api } = useAppContext();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const sheetRef = useRef<BottomSheetModal>(null);
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [error, setError] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState<string>("");
  const handleEmailChange = (text: string) => {
    setError(false);
    setErrorMessage("");
    setEmail(text);
  };
  const handlePasswordChange = (text: string) => {
    setError(false);
    setErrorMessage("");
    setNewPassword(text);
  };
  useEffect(() => {
    const rerender = () => {
      sheetRef.current?.present();
      setEmail("");
      setCode(["", "", "", ""]);
      setNewPassword("");
    };
    rerender();
  }, []);
  //Send Reset Password Otp
  const sendResetPasswordOtp = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/sendPasswordResetOtp", { email });
      if (data.success) {
        step === 1 && setStep(2);
      }
    } catch (error) {
      Vibration.vibrate(500);
      const err = error as AxiosError<ApiErrorResponse>;
      console.log(err);
      setError(true);
      if (err.response?.data) {
        const message = err.response?.data.message;
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };
  // Handle Backspace Key Press for OTP input boxes
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  // handle Change Text for OTP input boxes
  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1);
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    const finalCode = newCode.join("");
    if (finalCode.length === 4) {
      verifyPasswordOtp();
    }
  };
  // Verify Password Otp
  const verifyPasswordOtp = async () => {
    setLoading(true);
    try {
      const finalCode = code.join("");
      console.log(finalCode);
      if (finalCode.length === 4) {
        const { data } = await api.post("/auth/checkResetPasswordOtp", {
          email,
          otp: finalCode,
        });

        if (data.success) {
          setStep(3);
        }
      } else {
        console.log("---hey");
        setErrorMessage("Otp is not Correct");
      }
    } catch (error) {
      Vibration.vibrate(500);
      const err = error as AxiosError<ApiErrorResponse>;
      setError(true);
      console.log(err.response?.data.message);
      if (err.response?.data) {
        const message = err.response?.data.message;
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };
  // Change Password
  const changePassword = async () => {
    setLoading(true);
    try {
      const finalCode = code.join("");
      const { data } = await api.post("/auth/resetPassword", {
        email,
        otp: finalCode,
        newPassword: newPassword,
      });
      if (data.success) {
        Keyboard.dismiss();
        //  Handle Modal that Redirect To Login
        setTimeout(() => sheetRef.current?.present(), 250);
      }
    } catch (error) {
      Vibration.vibrate(500);
      const err = error as AxiosError<ApiErrorResponse>;
      console.log(err.response?.data);
      setError(true);
      if (err.response?.data) {
        const message = err.response?.data.message;
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = () => {
    if (step === 1) {
      return sendResetPasswordOtp();
    } else if (step === 2) {
      return verifyPasswordOtp();
    } else {
      return changePassword();
    }
  };
  const handleBack = () => {
    setErrorMessage("");
    if (step === 3) {
      setError(false);
      setErrorMessage("");
      setStep(2);
    } else if (step === 2) {
      setError(false);
      setErrorMessage("");
      setCode(["", "", "", ""]);
      setStep(1);
    } else {
      setError(false);
      setErrorMessage("");
      setEmail(" ");
      router.back();
    }
  };
  const { colorScheme } = useColorScheme();
  let isDarkMode = colorScheme === "dark";
  return (
    <SafeAreaView className="flex-1 p-5 dark:bg-black bg-[#f4f7fd]">
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, width: "100%" }}
        >
          {step === 1 && (
            <>
              <View className="flex-col ">
                <View className="flex-row items-center gap-2  mb-2">
                  <TouchableOpacity onPress={handleBack}>
                    <Ionicons
                      name="chevron-back"
                      size={24}
                      color={isDarkMode ? "white" : "black"}
                    />
                  </TouchableOpacity>
                  <Text className="text-3xl dark:text-white font-main-bold">
                    Forgot Password?
                  </Text>
                </View>
                <Text className="text-[#a8a8a8] dark:text-[#a8a8a8] font-primary leading-6 mt-1 font-light">
                  Enter your registered email to receive a password reset code.
                </Text>
              </View>
              <View className="mt-2 pb-2 gap-5 flex-1 justify-between">
                <Input
                  important
                  error={error}
                  errorMessage={errorMessage}
                  value={email}
                  keyboardType="email-address"
                  setValue={handleEmailChange}
                  label="Email"
                  placeholder="Enter Your Email"
                />
                <GlobalButton
                  onPress={() => handleSubmit()}
                  loading={loading}
                  isDisabled={!email}
                  text="Send Reset Otp "
                />
              </View>
            </>
          )}
          {step === 2 && (
            <>
              <View className="flex-col jusify-between flex-1">
                <View className="flex-col jusify-between flex-1">
                  <View className="flex-row items-center gap-2  mb-2">
                    <TouchableOpacity onPress={handleBack}>
                      <Ionicons
                        name="chevron-back"
                        size={24}
                        color={isDarkMode ? "white" : "black"}
                      />
                    </TouchableOpacity>
                    <Text className="text-3xl dark:text-white font-main-bold">
                      Reset OTP?
                    </Text>
                  </View>

                  <Text className="text-[#a8a8a8] dark:text-[#a8a8a8] font-primary leading-6 mt-1 font-light">
                    A reset code has been sent to your email. Please enter the
                    code below to verify your identity and proceed with
                    resetting your password.
                  </Text>

                  <View className="flex-row  gap-4 w-full py-4 justify-between">
                    {Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <TextInput
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          value={code[index]}
                          onChangeText={(text) => handleChangeText(text, index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          maxLength={1}
                          keyboardType="number-pad"
                          className="border flex-1 h-16  justify-center items-center dark:bg-white bg-transparent border-gray-300 rounded-md text-2xl font-primary-bold text-[#100a30] text-center "
                          style={{
                            borderColor: code[index] ? "#100a30" : "#d1d5db",
                            borderWidth: 1,
                          }}
                        />
                      ))}
                  </View>
                </View>

                <GlobalButton
                  onPress={() => handleSubmit()}
                  loading={loading}
                  isDisabled={code.join("").length !== 4}
                  text="Verify Otp"
                />
              </View>
            </>
          )}
          {step === 3 && (
            <>
              <View className="flex-col ">
                <View className="flex-row items-center gap-2  mb-2">
                  <TouchableOpacity onPress={handleBack}>
                    <Ionicons
                      name="chevron-back"
                      size={24}
                      color={isDarkMode ? "white" : "black"}
                    />
                  </TouchableOpacity>
                  <Text className="text-3xl dark:text-white font-main-bold">
                    New Password
                  </Text>
                </View>
                <Text className="text-[#a8a8a8] dark:text-[#a8a8a8] font-primary leading-6 mt-1 font-light">
                  Enter your new Password below. Make sure to choose a strong
                  password that you haven't used before for security purposes.
                </Text>
              </View>
              <View className="mt-2 pb-2 gap-5 flex-1 justify-between">
                <Input
                  important
                  value={newPassword}
                  
                  isPassword={true}
                  error={error}
                  errorMessage={errorMessage}
                  setValue={handlePasswordChange}
                  label="New Password"
                  placeholder="Enter Your New Password."
                />
                <GlobalButton
                  onPress={() => handleSubmit()}
                  loading={loading}
                  isDisabled={newPassword.length < 5}

                  text="Send Reset Otp "
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* SuccesModal  */}
      <AppSheet snapPoints={[ "50%"]} ref={sheetRef}>
        <PasswordResetSuccess onPress={() => router.replace("/auth/login")} />
      </AppSheet>
    </SafeAreaView>
  );
};

export default ForgetPassword;
