import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const GlobalButton = ({
  text,
  onPress,
  lessBorder = false,
  isDisabled = false,
  loading = false,
}: {
  text: string;
  lessBorder?: boolean;
    isDisabled?: boolean ;
  loading?: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      // 1. Pass the native disabled prop here
      disabled={isDisabled}
      // 2. Change background color dynamically (e.g., bg-gray-400 or lower opacity when disabled)
      className={`py-4 rounded-lg justify-center w-full items-center text-center font-primary text-white 
        ${isDisabled ? "bg-gray-400 opacity-60" : "bg-[#100a30]"}`}
      onPress={onPress}
    >{
        loading ? (<ActivityIndicator color="white" />): <Text className="text-white text-lg text-center">{text}</Text>
    }
      
    </TouchableOpacity>
  );
};

export default GlobalButton;
