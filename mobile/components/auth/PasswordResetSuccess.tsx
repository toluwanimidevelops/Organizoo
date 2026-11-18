import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlobalButton from "@/components/global/GlobalButton";

type Props = {
  title?: string;
  message?: string;
  buttonText?: string;
  onPress: () => void;
};

const PasswordResetSuccess = ({
  title = "Password changed!",
  message = "Your password has been reset successfully. Log in with your new password.",
  buttonText = "Back to Login",
  onPress,
}: Props) => {
  const circle = useRef(new Animated.Value(0)).current;
  const check = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const content = useRef(new Animated.Value(0)).current;

  // BottomSheetModal mounts its children each time it is presented,
  // so this animation replays every time the sheet opens.
  useEffect(() => {
    Animated.sequence([
      Animated.spring(circle, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(check, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(ring, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(content, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const ringScale = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.7],
  });
  const ringOpacity = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });
  const contentY = content.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  return (
    <View className="w-full items-center px-3 pb-8 pt-2">
      <View className="mb-6 size-28 items-center justify-center">
        <Animated.View
          style={{ transform: [{ scale: ringScale }], opacity: ringOpacity }}
          className="absolute size-28 rounded-full bg-green-500"
        />
        <Animated.View
          style={{ transform: [{ scale: circle }] }}
          className="size-28 items-center justify-center rounded-full bg-green-500"
        >
          <Animated.View
            style={{ transform: [{ scale: check }], opacity: check }}
          >
            <Ionicons name="checkmark" size={58} color="white" />
          </Animated.View>
        </Animated.View>
      </View>

      <Animated.View
        style={{ opacity: content, transform: [{ translateY: contentY }] }}
        className="w-full items-center"
      >
        <Text className="mb-2 text-center text-3xl font-primary-bold text-black dark:text-white">
          {title}
        </Text>
        <Text className="mb-8 text-center max-w-2 mx-auto font-primary leading-6 text-gray-500 dark:text-gray-400">
          {message}
        </Text>
        <View className="w-full">
          <GlobalButton text={buttonText} onPress={onPress} />
        </View>
      </Animated.View>
    </View>
  );
};

export default PasswordResetSuccess;
