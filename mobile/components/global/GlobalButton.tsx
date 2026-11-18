import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const GlobalButton = ({
  text,
  onPress,
  icon,
  borderFull = false,
  isDisabled = false,
  background,
  textColor,
  loading = false,
}: {
  text: string;
  borderFull?: boolean;
  isDisabled?: boolean;
  textColor?: string;
  background?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      // 1. Pass the native disabled prop here
      disabled={isDisabled}
      // 2. Change background color dynamically (e.g., bg-gray-400 or lower opacity when disabled)
      className={`py-4  justify-center flex-row gap-2 w-full items-center text-center font-primary text-white 
        ${borderFull ? "rounded-full" : "rounded-lg"}
        ${isDisabled ? "bg-gray-400 opacity-60" : background ? background : "bg-[#100a30]"}`}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          {icon && icon}
          <Text
            className={`${textColor ? textColor : "text-white"} font-primary text-lg text-center`}
          >
            {text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default GlobalButton;
