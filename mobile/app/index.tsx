import { ActivityIndicator, View, Image } from "react-native";
import { Redirect } from "expo-router";
import Logo from "@/assets/logo/connectifybl.png";
import { useAppContext } from "@/context/AppContext";

const App = () => {
  const { user, authLoading } = useAppContext();

  // Track the actual dynamic loading state
  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#ffffff", // Optional: ensures a clean backdrop
        }}
      >
        {/* 
          FIX: Removed conflicting 'w-full' and Tailwind object-contain.
          Using explicit layout dimensions + native resizeMode prop.
        */}
        <Image
          source={Logo}
          style={{ width: 300, height: 150 }}
          resizeMode="contain"
        />

        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 40, position: "absolute", bottom: 70 }}
        />
      </View>
    );
  }

  // Once loading completes, safely route the user
  if (user) {
    return <Redirect href={"/(main)/(tabs)/(home)/home"} />;
  }

  return <Redirect href={"/auth/welcome"} />;
};

export default App;
