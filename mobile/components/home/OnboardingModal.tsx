import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlobalButton from "../global/GlobalButton";

interface CompleteProfileModalProps {
  visible: boolean;
  onAction: () => void;
}

const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  visible,
  onAction,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      // User must take action; cannot dismiss by pressing Android back button
      onRequestClose={() => {}}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white w-full max-w-sm rounded-2xl p-5 items-center shadow-lg">
          {/* Warning Icon Badge */}
          <View className="w-16 h-16 bg-[#100a30]/10 rounded-full justify-center items-center mb-4">
            <Ionicons name="person" size={32} color="#100a30" />
          </View>

          {/* Heading */}
          <Text className="text-[#100a30]  text-2xl text-center mb-2">
            Complete Your Profile
          </Text>

          {/* Body Text */}
          <Text className="text-gray-500 text-center font-light text-sm leading-5 mb-6">
            Before accessing the home feed, please take a moment to set up your
            basic account details.
          </Text>

          {/* Call to Action Button */}
          <GlobalButton onPress={onAction} lessBorder text="Set Up Now" />
        </View>
      </View>
    </Modal>
  );
};

export default CompleteProfileModal;
