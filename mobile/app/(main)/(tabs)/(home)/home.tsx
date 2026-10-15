import Filter from "@/components/home/filter";
import CompleteProfileModal from "@/components/home/OnboardingModal";
import Search from "@/components/home/search";
import { useAppContext } from "@/context/AppContext";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Home = () => {
  const [isFilter, setIsFilter] = useState<boolean>(true);
  const { user } = useAppContext();
  const switchSearch = () => setIsFilter((prev) => !prev);
  // The modal shows automatically if the user object exists but doesn't have a slug
  const showProfileAlert = user !== null && !user?.slug;

  const handleNavigateToOnboarding = () => {
    // Replace with your real onboarding screen name route
    router.replace("/auth/onboarding");
  };
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F8FAFC",
        }}
      >
        {/* Filters & Search  */}
        {isFilter ? (
          <Filter switchSearch={switchSearch} />
        ) : (
          <Search switchSearch={switchSearch} />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Home</Text>
        </ScrollView>
      </SafeAreaView>
      {/* Profile Enforcement Sheet */}
      <CompleteProfileModal
        visible={showProfileAlert}
        onAction={handleNavigateToOnboarding}
      />
    </>
  );
};

export default Home;
