import {
  View,
  Text,
  Modal,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import GlobalButton from "@/components/global/GlobalButton";

interface EmailSuccessModalProps {
  visible: boolean;
  onContinue: () => void;
  title?: string;
  subtitle?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Confetti piece config: horizontal spread, color, size, fall delay
const CONFETTI_COLORS = [
  "#7C3AED", // purple accent (feel free to swap to your brand colors)
  "#FF6B6B",
  "#14B8A6",
  "#FBBF24",
  "#100a30",
];

const CONFETTI_PIECES = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  left: Math.random() * SCREEN_WIDTH,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 6 + Math.random() * 6,
  delay: Math.random() * 300,
  duration: 1600 + Math.random() * 900,
  rotateDeg: Math.random() > 0.5 ? "360deg" : "-360deg",
  square: Math.random() > 0.5,
}));

const ConfettiPiece = ({
  left,
  color,
  size,
  delay,
  duration,
  rotateDeg,
  square,
}: (typeof CONFETTI_PIECES)[number]) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 260,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(duration * 0.6),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.4,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", rotateDeg],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left,
        top: 0,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: square ? 2 : size / 2,
        opacity,
        transform: [{ translateY }, { rotate: spin }],
      }}
    />
  );
};

const EmailSuccessModal = ({
  visible,
  onContinue,
  title = "Email Verified!",
  subtitle = "You're all set. Your account is ready to explore Connectify.",
}: EmailSuccessModalProps) => {
  const scale = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const emojiRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0);
      badgeScale.setValue(0);
      emojiRotate.setValue(0);

      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(emojiRotate, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(emojiRotate, {
            toValue: -1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(emojiRotate, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ).start();
    }
  }, [visible]);

  const emojiSpin = emojiRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 bg-black/50  justify-center items-center px-6">
        {/* Confetti layer */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320 }}
        >
          {CONFETTI_PIECES.map((piece) => (
            <ConfettiPiece key={piece.id} {...piece} />
          ))}
        </View>

        {/* Success Card */}
        <Animated.View
          style={{ transform: [{ scale }] }}
          className="w-full bg-white rounded-3xl px-6 pt-10 pb-6 items-center"
        >
          {/* Celebration badge */}
          <Animated.View
            style={{ transform: [{ scale: badgeScale }] }}
            className="h-24 w-24 rounded-full bg-[#100a30] justify-center items-center mb-5"
          >
            <Ionicons name="checkmark" size={48} color="white" />
            
          </Animated.View>

          {/* Floating emoji accent */}
          <Animated.Text
            style={{
              position: "absolute",
              top: 4,
              right: 26,
              fontSize: 34,
              transform: [{ rotate: emojiSpin }],
            }}
          >
            🎉
          </Animated.Text>

          <Text className="text-center text-3xl font-medium text-[#100a30] mb-3">
            {title}
          </Text>
          <Text className="text-[#a8a8a8] leading-6 mb-8 text-center font-light px-2">
            {subtitle}
          </Text>

          <View className="w-full">
            <GlobalButton
              onPress={onContinue}
              text="Continue"
              lessBorder={true}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default EmailSuccessModal;
