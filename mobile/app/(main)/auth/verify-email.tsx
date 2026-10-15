import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import GlobalButton from "@/components/global/GlobalButton";
import { useAppContext } from "@/context/AppContext";
import EmailSuccessModal from "@/components/auth/EmailSuccessModal";

const INITIAL_TIME = 30; // 30-second countdown duration

const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(INITIAL_TIME);
  const [canResend, setCanResend] = useState(false);

  const {
    resendEmailVerificationOtp,
    VerifyEmail,
    emailVerificationLoading,
    showSuccess,
    setShowSuccess,
  } = useAppContext();

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // 1. Timer Logic Hook
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCountdown((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    // Clean up interval loop when component unmounts or timer finishes
    return () => clearInterval(timer);
  }, [countdown]);

  // 2. Resend Code Action
  const handleResendCode = () => {
    if (!canResend) return;

    console.log("Resending verification email...");
    // Call your backend service context function here to send a new OTP
    resendEmailVerificationOtp();
    // Reset timer back to initial countdown length
    setCountdown(INITIAL_TIME);
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
      handleVerify(finalCode);
    }
  };
  // Handle Backspace Key Press for OTP input boxes
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  // Handle Verify Action
  const handleVerify = (finalCode: string) => {
    console.log("Ready to verify OTP code:", finalCode);
    // Call your context backend api service here
    VerifyEmail(finalCode);
  };

  return (
    <>
      <EmailSuccessModal
        visible={showSuccess}
        onContinue={() => {
          setShowSuccess(false);
          router.replace("/(main)/(tabs)/(home)/home"); // or wherever onboarding leads next
        }}
      />
      <SafeAreaView className="flex-1 bg-[#f4f7fd] p-5">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            {/* Back Button Container */}
            <View className="w-full relative flex-row items-center justify-start h-12 mb-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-gray-200 w-12 h-12 flex justify-center items-center rounded-full"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="#100a30" />
              </TouchableOpacity>
            </View>

            {/* Mail Icon Branding */}
            <View className="justify-center items-center mt-8 h-20 w-20 rounded-full bg-[#100a30]">
              <Ionicons name="mail-outline" size={40} color="white" />
            </View>

            <Text className="text-center my-4 text-3xl font-medium text-[#100a30]">
              Please Verify Your Email
            </Text>
            <Text className="text-[#a8a8a8] leading-6 mb-3 text-center font-light px-6">
              Enter the 4 digit code sent by email
            </Text>

            {/* Interactive OTP Box Grid */}
            <View className="flex-row mb-10 gap-4 w-full px-4 justify-between">
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
                    className="border flex-1 h-16 bg-white border-gray-300 rounded-xl text-2xl font-semibold text-[#100a30] text-center "
                    style={{
                      borderColor: code[index] ? "#100a30" : "#d1d5db",
                      borderWidth: 1,
                    }}
                  />
                ))}
            </View>

            {/* Verify Action Button */}
            <View className="w-full ">
              <GlobalButton
                isDisabled={
                  code.join("").length !== 4 || emailVerificationLoading
                }
                onPress={() => handleVerify(code.join(""))}
                text="Verify Email"
                loading={emailVerificationLoading}
                lessBorder={true}
              />
            </View>
            {/* 3. Resend OTP Section Container */}
            <View className="flex-row justify-center mt-10 items-center mb-10 w-full px-4">
              <Text className="text-gray-500 font-light">
                Didn't receive the code?{" "}
              </Text>
              {canResend ? (
                <TouchableOpacity onPress={handleResendCode}>
                  <Text className="text-[#a8a8a8]  text-center font-light ">
                    Resend Code
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text className="text-gray-400 font-light">
                  Resend in{" "}
                  <Text className="font-medium text-[#100a30]">
                    {countdown}{" "}
                  </Text>
                  <Text className="font-light text-gray-400">Seconds</Text>
                </Text>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default VerifyEmail;
