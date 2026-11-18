import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "nativewind";
import React, { useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import GlobalButton from "@/components/global/GlobalButton";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AppSheet from "@/components/account/AppSheet";
import { router } from "expo-router";

const Profile = () => {
  const { user, logout } = useAppContext();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const sheetRef = useRef<BottomSheetModal>(null);
  const handleViewProfile = () => {
    sheetRef.current?.dismiss();
    router.push("/stacks/profileedit");
  };
  return (
    <>
      <View className="flex-1 dark:bg-black bg-[#F8FAFC]">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flex: 1,
          }}
        >
          <View className="flex flex-col relative">
            <View className=" h-44 w-full relative">
              <Image
                source={{
                  uri:
                    user?.coverPhoto ||
                    "https://connectify-app-nu.vercel.app/coverphoto.png",
                }}
                className="w-full h-full object-cover object-center"
              />
              <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-14 left-3 bg-white/80 p-2 rounded-full justify-center items-center"
              >
                <Octicons name="arrow-left" color="black" size={17} />
              </TouchableOpacity>
              <View className="absolute top-14 right-3 bg-white/80 p-2 rounded-full justify-center items-center">
                <Ionicons name="settings-outline" color="black" size={17} />
              </View>
              <View className="absolute bottom-2 right-3 bg-white/80 p-2 rounded-full justify-center items-center">
                <Octicons name="pencil" color="black" size={17} />
              </View>
            </View>
            <View className=" mx-3 h-20 w-32 -top-12 relative ">
              <View className="overflow-hidden  size-32 rounded-full border-white dark:border-black border-4  ">
                <Image
                  source={{
                    uri:
                      user?.profilePicture ||
                      "https://connectify-app-nu.vercel.app/profile.png",
                  }}
                  className="w-full h-full "
                />
              </View>
              <Pressable
                onPress={() => sheetRef.current?.present()}
                className="absolute rounded-full p-2 dark:bg-white/20 bg-black/10 -bottom-12 right-0"
              >
                <Octicons
                  name="pencil"
                  color={isDark ? "white" : "black"}
                  className="dark:text-gray-600"
                  size={17}
                />
              </Pressable>
            </View>
          </View>
          <View className="px-3">
            <Text className="text-2xl dark:text-white font-primary-bold   mt-2">
              {user?.firstName
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}{" "}
              {user?.lastName
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Text>
            <Text className="text-gray-500 font-primary text-md  ">
              {user?.slug || "No Slug Available"} •{" "}
              {user?.userType
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}{" "}
              •{" "}
              {user?.gender
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Text>
            <Text className="text-black dark:text-white mb-1 text-lg font-primary-bold capitalize mt-2">
              {user?.bio || "No bio available"}
            </Text>
            {/* Location & Email */}
            <View className="flex flex-row mb-1 w-full gap-3 ">
              <View className="flex flex-row flex-shrink gap-1 items-center justify-center">
                <Ionicons
                  size={20}
                  name="location-outline"
                  color={isDark ? "#888" : "black"}
                />
                <Text
                  numberOfLines={1}
                  className="text-black  dark:text-gray-400 text-lg font-primary"
                >
                  {user?.location?.region || "No location availablttte"}
                </Text>
              </View>
              <View className="flex flex-row  gap-1 items-center justify-center">
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={isDark ? "#888" : "black"}
                />
                <Text
                  numberOfLines={1}
                  className="text-black  dark:text-gray-400 text-lg font-primary"
                >
                  {user?.email || "No email available"}
                </Text>
              </View>
            </View>
            {/* Followers & Following  */}
            <View className="flex flex-row p-1  gap-3 items-center mb-5">
              <Text className="font-primary text-lg dark:text-gray-400 text-black">
                <Text className="dark:text-white">
                  {user?.followers?.length || 0}{" "}
                </Text>
                Followers
              </Text>
              <Text className="font-primary text-lg dark:text-gray-400 text-black">
                <Text className="dark:text-white">
                  {user?.following?.length || 0}{" "}
                </Text>
                Following
              </Text>
            </View>
            {/* Share & Edit Profile */}
            <View className="flex flex-row justify-center items-center gap-3">
              <TouchableOpacity
                className={`py-4  rounded-full dark:border bg-midnight dark:bg-transparent dark:border-gray-600 justify-center flex-1  items-center text-center font-primary text-white  `}
              >
                <Text className="text-white text-lg text-center">
                  Share Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/auth/onboarding")}

                className={`py-4 rounded-full dark:border bg-midnight dark:bg-transparent dark:border-gray-600 justify-center  flex-1 items-center text-center font-primary text-white  `}
              >
                <Text className="text-white  text-lg text-center">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
            {/* <GlobalButton text="Logout" lessBorder onPress={logout} /> */}
          </View>
          <AppSheet snapPoints={["25%"]} ref={sheetRef}>
            <View className="min-h-20 mb-16 gap-3">
              <Pressable
                onPress={() => handleViewProfile()}
                className="flex flex-row p-2 items-center  gap-3"
              >
                <Ionicons
                  name="camera-outline"
                  color={isDark ? "white" : "black"}
                  size={25}
                />
                <Text className="text-black text-lg font-main-medium dark:text-white ">
                  View or Edit Profile Picture
                </Text>
              </Pressable>
              <Pressable className="flex flex-row p-2 items-center  gap-3">
                <MaterialIcons
                  name="delete-outline"
                  color={isDark ? "white" : "black"}
                  size={25}
                />
                <Text className="text-black text-lg font-main-medium dark:text-white ">
                  Delete Profile
                </Text>
              </Pressable>
            </View>
          </AppSheet>
        </ScrollView>
      </View>
    </>
  );
};

export default Profile;
