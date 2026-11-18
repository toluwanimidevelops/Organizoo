import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "nativewind";

const Search = ({ switchSearch }: { switchSearch: () => void }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className="p-3  pt-7 px-5 gap-3">
      <View className="flex-row justify-between">
        <Text className="text-2xl font-main dark:text-white">Search</Text>
        <TouchableOpacity onPress={switchSearch}>
          <Ionicons name="close" color={isDark ? "white" : "black"} size={25} />
        </TouchableOpacity>
      </View>
      <View className="flex-row  px-5 bg-white dark:bg-gray-500/10 border  dark:border-gray-600 rounded-md w-full h-[60px] items-center gap-2">
        <Ionicons size={20} color={isDark ? "white" : "black"} name="search" />
        <TextInput
          className=" placeholder:text-gray-500 dark:text-gray-300 dark:placeholder:text-white flex-1 outline-none border-none text-sm h-full"
          placeholder="Search events...."
        />
      </View>
    </View>
  );
};

export default Search;
