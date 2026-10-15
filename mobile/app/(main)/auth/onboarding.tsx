import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/auth/Input";
import GlobalButton from "@/components/global/GlobalButton";
import { useAppContext, User } from "@/context/AppContext";
import RNPickerSelect from "react-native-picker-select";
import { router } from "expo-router";

// Custom Mock Components to simulate the graphic items in the image layout
const DesignIcon = () => <Ionicons name="brush" size={32} color="#100a30" />;
const MusicIcon = () => (
  <Ionicons name="musical-notes" size={32} color="#100a30" />
);
const ArtIcon = () => (
  <Ionicons name="color-palette" size={32} color="#100a30" />
);
const SportsIcon = () => (
  <Ionicons name="basketball" size={32} color="#100a30" />
);
const FoodIcon = () => <Ionicons name="fast-food" size={32} color="#100a30" />;
const TechIcon = () => (
  <Ionicons name="hardware-chip" size={32} color="#100a30" />
);
const OthersIcon = () => (
  <Ionicons name="ellipsis-horizontal" size={32} color="#100a30" />
);

interface InterestItem {
  id: string;
  label: string;
  renderIcon: () => React.JSX.Element;
}

// Animateable Individual Interest Card
const AnimatedInterestCard = ({
  item,
  isSelected,
  onPress,
}: {
  item: InterestItem;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.04 : 1,
      useNativeDriver: true,
      friction: 7,
      tension: 60,
    }).start();
  }, [isSelected]);

  return (
    <View className="w-[30%] mb-6 items-center">
      <Animated.View
        style={[
          interestStyles.cardContainer,
          isSelected
            ? interestStyles.activeBorder
            : interestStyles.inactiveBorder,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={interestStyles.touchableArea}
        >
          {item.renderIcon()}
        </TouchableOpacity>
      </Animated.View>
      <Text className="text-sm text-gray-800 font-medium text-center mt-2">
        {item.label}
      </Text>
    </View>
  );
};

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [slugError, setSlugError] = useState<Boolean>(false);
  
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "other" },
  ];

  // Added Tech and configured array options list
  const interestOptions: InterestItem[] = [
    { id: "tech", label: "Tech", renderIcon: () => <TechIcon /> },
    { id: "design", label: "Design", renderIcon: () => <DesignIcon /> },
    { id: "music", label: "Music", renderIcon: () => <MusicIcon /> },
    { id: "art", label: "Art", renderIcon: () => <ArtIcon /> },
    { id: "sports", label: "Sports", renderIcon: () => <SportsIcon /> },
    { id: "food", label: "Food", renderIcon: () => <FoodIcon /> },
    { id: "others", label: "Others", renderIcon: () => <OthersIcon /> },
  ];

  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { user , slugExist, setUser , api} = useAppContext();
  const [data, setData] = useState<User | null>(null);

  useEffect(() => {
    if (user) setData(user);
  }, [user]);
  useEffect(() => {
    if (!data?.slug) return;

    const checkSlug = async () => {
      const isAvailable = await slugExist(data?.slug as string);
      setSlugError(!isAvailable);
    };

    checkSlug();
  }, [data?.slug]);

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleToggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleUpdateField = (field: keyof User, value: any) => {
    setData((prev) => {
      if (!prev) return { [field]: value } as unknown as User;
      return { ...prev, [field]: value };
    });
  };

  const handleDeepUpdateField = (
    parentField: keyof User,
    childField: string,
    value: any,
    nestedField?: string,
  ) => {
    setData((prev) => {
      if (!prev) return prev;
      const updatedParent = { ...(prev[parentField] as any) };
      if (nestedField) {
        updatedParent[childField] = {
          ...updatedParent[childField],
          [nestedField]: value,
        };
      } else {
        updatedParent[childField] = value;
      }
      return { ...prev, [parentField]: updatedParent };
    });
  };

  const handleSubmit = async () => {
    try {
      setOnboardingLoading(true);
      const completePayload = { ...data, interests: selectedInterests };
      const { data: data1 } = await api.post("/auth/updateProfile", completePayload);
      if (data1.success) {
        setUser(data1.user as User)
        router.push("/(main)/(tabs)/(home)/home");

      }
    } catch (error) {
      console.error("Failed completing onboarding validation setup:", error);
    } finally {
      setOnboardingLoading(false);
    }
  };

  const isStepDisabled = () => {
    if (step === 1) {
      return (
        !data?.firstName?.trim() ||
        !data?.lastName?.trim() ||
        !data?.slug?.trim() ||
        !data?.bio?.trim() ||
        !data?.gender?.trim()
      );
    }
    if (step === 2) return !data?.phone?.trim();
    if (step === 3)
      return !data?.location?.city?.trim() || !data?.location?.country?.trim();
    if (step === 4) return selectedInterests.length !== 3;
    return false;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7fd] p-5">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          {step > 1 ? (
            <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
              <Ionicons name="arrow-back" size={24} color="#100a30" />
            </TouchableOpacity>
          ) : (
            <View className="w-10" />
          )}

          <Text className="text-gray-400 font-normal">
            Step {step} of {totalSteps}
          </Text>
        </View>

        {/* Progress Bar */}
        {step !== 4 && (
          <View className="h-1.5 w-full bg-gray-200 rounded-full mb-8 overflow-hidden">
            <View
              className="h-full bg-[#100a30]"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </View>
        )}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* STEP 1: ACCOUNT TYPE & BIOLOGY */}
          {step === 1 && (
            <View className="gap-y-4">
              <View className="mb-2">
                <Text className="text-xl text-gray-900">
                  Tell us about yourself
                </Text>
              </View>
              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={data?.firstName || ""}
                setValue={(text) => handleUpdateField("firstName", text)}
              />
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={data?.lastName || ""}
                setValue={(text) => handleUpdateField("lastName", text)}
              />
              <Input
                label="Slug"
                error={slugError}
                errorMessage="A user with this slug already exist"
                placeholder="@user10002"
                value={data?.slug || ""}
                setValue={(text) => handleUpdateField("slug", text)}
              />
              <Input
                label="Bio"
                placeholder="Tell us a little about yourself..."
                value={data?.bio || ""}
                multiline={true}
                setValue={(text) => handleUpdateField("bio", text)}
              />
              <View className="flex-col gap-1">
                <Text className="text-gray-700 font-medium text-sm">
                  Gender <Text className="text-red-500">*</Text>
                </Text>
                <View className="relative w-full bg-white border border-gray-200 rounded-2xl h-[48px] justify-center">
                  <RNPickerSelect
                    placeholder={{
                      label: "Select your gender",
                      value: null,
                      color: "#9ca3af",
                    }}
                    items={genderOptions}
                    value={data?.gender || null}
                    onValueChange={(value) =>
                      handleUpdateField("gender", value)
                    }
                    style={pickerStyles}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => (
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name="chevron-down"
                          size={15}
                          color="#9ca3af"
                        />
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: COMMUNICATIONS */}
          {step === 2 && (
            <View className="gap-y-4">
              <Text className="text-xl text-gray-900 mb-2">
                Account Communications
              </Text>
              <Input
                label="Phone Number"
                placeholder="+234 000 000 0000"
                keyboardType="phone-pad"
                value={data?.phone || ""}
                setValue={(text) => handleUpdateField("phone", text)}
              />
              <View className="mt-4 p-4 bg-white rounded-2xl border border-gray-100 gap-y-4">
                <Text className="text-lg text-gray-800 mb-1">
                  Notification Preferences
                </Text>
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-gray-700 font-normal">
                      Push Notifications
                    </Text>
                    <Text className="text-xs font-light text-gray-400">
                      Receive alerts on updates instantly
                    </Text>
                  </View>
                  <Switch
                    value={data?.preferences?.notifications?.push ?? true}
                    onValueChange={(val) =>
                      handleDeepUpdateField(
                        "preferences",
                        "notifications",
                        val,
                        "push",
                      )
                    }
                    trackColor={{ true: "#100a30", false: "#e5e7eb" }}
                  />
                </View>
                <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
                  <View>
                    <Text className="text-gray-700 font-normal">
                      Email Subscriptions
                    </Text>
                    <Text className="text-xs font-light text-gray-400">
                      Get news announcements via inbox
                    </Text>
                  </View>
                  <Switch
                    value={data?.preferences?.notifications?.email ?? true}
                    onValueChange={(val) =>
                      handleDeepUpdateField(
                        "preferences",
                        "notifications",
                        val,
                        "email",
                      )
                    }
                    trackColor={{ true: "#100a30", false: "#e5e7eb" }}
                  />
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: REGIONAL LOCATION */}
          {step === 3 && (
            <View className="gap-y-4">
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Where are you located?
              </Text>
              <Input
                label="Country"
                placeholder="e.g. Nigeria"
                value={data?.location?.country || ""}
                setValue={(text) =>
                  handleDeepUpdateField("location", "country", text)
                }
              />
              <Input
                label="City"
                placeholder="e.g. Lagos"
                value={data?.location?.city || ""}
                setValue={(text) =>
                  handleDeepUpdateField("location", "city", text)
                }
              />
              <Input
                label="Street Address"
                placeholder="e.g. 12 Broad Street"
                important={false}
                value={data?.location?.street || ""}
                setValue={(text) =>
                  handleDeepUpdateField("location", "street", text)
                }
              />
              <View className="flex-row gap-x-3">
                <View className="flex-1">
                  <Input
                    label="Postal Code"
                    placeholder="100001"
                    important={false}
                    value={data?.location?.postalCode || ""}
                    setValue={(text) =>
                      handleDeepUpdateField("location", "postalCode", text)
                    }
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="State/Region"
                    placeholder="Lagos State"
                    important={false}
                    value={data?.location?.region || ""}
                    setValue={(text) =>
                      handleDeepUpdateField("location", "region", text)
                    }
                  />
                </View>
              </View>
            </View>
          )}

          {/* STEP 4: INTERESTS WITH TECH & SPRINGS */}
          {step === 4 && (
            <View className="items-center flex-1">
              <Text className="text-2xl text-gray-900 mt-4 mb-8 text-center">
                Select Your 3 Interests
              </Text>

              <View className="flex-row flex-wrap justify-between w-full px-1">
                {interestOptions.map((item) => (
                  <AnimatedInterestCard
                    key={item.id}
                    item={item}
                    isSelected={selectedInterests.includes(item.id)}
                    onPress={() => handleToggleInterest(item.id)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Footer Navigation */}
          <View className="mt-auto pt-6">
            <GlobalButton
              text={
                step === totalSteps ? "Finish Account Creation" : "Continue"
              }
              loading={onboardingLoading}
              onPress={handleNext}
              lessBorder
              isDisabled={isStepDisabled()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const interestStyles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  touchableArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeBorder: {
    borderWidth: 2,
    borderColor: "#100a30",
  },
  inactiveBorder: {
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    fontWeight: "200",
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "#111827",
    paddingRight: 40,
  },
  inputAndroid: {
    fontSize: 14,
    fontWeight: "200",
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: "#111827",
    paddingRight: 40,
  },
});

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    right: 16,
    top: Platform.OS === "ios" ? 14 : 12,
  },
});

export default Onboarding;
