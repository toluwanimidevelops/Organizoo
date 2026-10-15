import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  error?: boolean;
  errorMessage?: string;
  setValue: any;
  keyboardType?: any;
  isPassword?: boolean;
  showPassword?: boolean;
  setShowPassword?: any;
  icon?: React.ReactNode;
  important?: boolean;
  multiline?: boolean;
}

const Input = ({
  label,
  placeholder,
  value,
  error,
  keyboardType,
  showPassword,
  setShowPassword,
  setValue,
  errorMessage,
  isPassword,
  important = true,
  multiline = false,
}: InputProps) => {
  return (
    <View className="flex-col gap-1">
      <Text className="text-gray-700 font-medium text-sm">
        {label} {important && <Text className="text-red-500">*</Text>}
      </Text>

      {/* 
        Container adjustments:
        If multiline, we apply a min-height (100px) and a max-height (140px). 
        Once the text exceeds 140px, the input will become internally scrollable.
      */}
      <View
        className={`flex-row bg-gray-50 border ${
          error ? "border-red-500" : "border-gray-200"
        } rounded-2xl px-4 ${
          multiline
            ? "min-h-[100px] max-h-[140px] py-3 items-start"
            : "h-[48px] items-center"
        }`}
      >
        <TextInput
          className={`flex-1 ${
            multiline ? "w-full" : "h-full"
          } ${error ? "text-red-500" : "text-gray-900"} font-extralight`}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType || "default"}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={setValue}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          // Forces the text input to correctly pass scroll interactions
          // to itself instead of getting swallowed by the page's ScrollView
          scrollEnabled={true}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && errorMessage && (
        <Text className="text-red-500 text-sm ">{errorMessage}</Text>
      )}
    </View>
  );
};

export default Input;
