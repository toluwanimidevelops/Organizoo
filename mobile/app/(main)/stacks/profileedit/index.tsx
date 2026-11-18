import { useAppContext } from "@/context/AppContext";
import { View, Text, Image } from "react-native";

const Index = () => {
  const { user } = useAppContext();
  return (
    <View className="flex-1 items-center justify-center dark:bg-black bg-[#F8FAFC]">
      <Image
        source={{ uri: user?.profilePicture }}
        className="w-52 h-52 rounded-full"
      />
    </View>
  );
};

export default Index;
