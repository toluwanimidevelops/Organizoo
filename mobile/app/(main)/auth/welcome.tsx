import { View, Text, Image } from "react-native";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import GoogleLog from "@/assets/images/fci.png";
import welcomeBg from "@/assets/background/bg.png";
import GlobalButton from "@/components/global/GlobalButton";
import { router } from "expo-router";

const welcome = () => {
  return (
    <View className="flex-1 justify-center dark:bg-black bg-[#F8FAFC] items-end flex-row relative">
      <Image
        source={welcomeBg}
      
        className="w-full h-full object-cover top-0 right-0 left-0 object-top absolute"
      />
      <View className="min-h-20 gap-5 mb-10">
        <Text className="font-primary max-w-sm  mx-auto  text-4xl text-center  dark:text-white  ">
          Organize. Discover. Connect
        </Text>
        <GlobalButton
          onPress={() => router.push("/auth/signup")}
          borderFull
          text="Sign up with Email"
          icon={<Ionicons name="mail-sharp" size={18} color="white" />}
        />
        <GlobalButton
          borderFull
          // onPress={()=>()}
          icon={<Image className="size-6 object-cover" source={GoogleLog} />}
          text="Sign up with Google"
          background="bg-white"
          textColor="text-black"
        />
        <GlobalButton
          // onPress={()=>()}
          borderFull
          text="Sign up with Apple"
          icon={<Fontisto name="apple" size={18} color="white" />}
          background="bg-black "
        />
        <Text className="text-gray-500 max-w-xs mx-auto mt-3 font-primary text-center">
          By signing up, you agree to our{" "}
          <Text className="text-midnight-muted font-primary-bold">
            Terms of condition
          </Text>{" "}
          and{" "}
          <Text className="text-midnight-muted font-primary-bold">
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default welcome;
