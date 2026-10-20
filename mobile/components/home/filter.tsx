import { useAppContext } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const filter = ({ switchSearch }: { switchSearch: () => void }) => {
  const { user } = useAppContext();
  console.log(user);
  return (
    <View className=" pt-7 px-5 gap-3">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity className="flex-row gap-2 items-center">
          <Ionicons name="location-outline" color="black" size={21} />
          <Text className="text-xl font-normal">Lagos</Text>
          <Ionicons name="chevron-down" color="black" size={21} />
        </TouchableOpacity>
        <View className="flex-row gap-1 items-center">
          <TouchableOpacity onPress={()=> router.push("/stacks/notifications")} className="flex-row  items-center">
            <Ionicons name="notifications-outline" color="black" size={27} />
            <View className="absolute top-0 right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> router.push("/(main)/(tabs)/(home)/profile")}>
            <Image
              source={{
                uri: user?.profilePicture,
              }}
              alt="Profile"
              className="size-12 rounded-full"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className=" shadow-md shadow-gray-200/50 rounded-full justify-between flex-row items-center px-5 bg-white w-full h-[60px]">
        <TouchableOpacity
          className=" active:bg-gray-400/10  rounded-full p-2"
          activeOpacity={0.2}
          onPress={switchSearch}
        >
          <Ionicons name="search" size={20} />
        </TouchableOpacity>
        <Text className="flex-1 px-5 text-gray-500 text-sm">
          Find Things to do
        </Text>
        <View className="rounded-full border p-2.5 border-gray-300 justify-center items-center">
          <Ionicons name="filter" size={20} />
        </View>
      </View>
    </View>
  );
};

export default filter;
