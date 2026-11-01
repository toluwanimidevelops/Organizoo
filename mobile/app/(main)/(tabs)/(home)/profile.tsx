import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Octicons } from "@expo/vector-icons";
import GlobalButton from "@/components/global/GlobalButton";

const Profile = () => {
  const { user, logout } = useAppContext();
  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flex: 1,
        
        }}
      >
        <View className="flex flex-col relative">
          <View className=" h-44 w-full relative">
            <Image
              source={{ uri: user?.coverPhoto  }}
              className="w-full h-full object-cover object-center"
            />
            <View className="absolute bottom-2 right-3 bg-white/80 p-2 rounded-full justify-center items-center">
              <Octicons name="pencil" color="black" size={17} />
            </View>
          </View>
          <View className=" mx-3 h-20 w-32 -top-12 relative ">
            <View className="overflow-hidden  size-32 rounded-full border-white border-4  ">
              <Image
                source={{
                  uri: user?.profilePicture,
                }}
                className="w-full h-full "
              />
            </View>
            <Octicons
              className="absolute rounded-full p-2 bg-black/10 -bottom-12 right-0"
              name="pencil"
              color="black"
              size={17}
            />
          </View>
        </View>
        <View className="mx-3">
          <Text className="text-2xl  font-primary-bold   mt-2">
            {user?.firstName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}{" "}
            {user?.lastName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Text>
          <Text className="text-gray-500 font-primary text-sm  ">
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
          <Text className="text-black mb-5 text-md font-primary mt-2">
            {user?.bio || "No bio available"}
          </Text>
          <GlobalButton text="Logout" lessBorder onPress={logout} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
