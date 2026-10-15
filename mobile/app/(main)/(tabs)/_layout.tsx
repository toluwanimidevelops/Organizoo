import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
const AppLayout = () => {
  const { addLocation } = useAppContext();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log(location);
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const [place] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      let theLocation = {
        latitude,
        longitude,
        city: place.city || "",
        district: place.district || "",
        region: place.region || "",
        country: place.country || "",
        isoCountryCode: place.isoCountryCode || "",
        postalCode: place.postalCode || "",
        street: place.street || "",
        streetNumber: place.streetNumber || "",
        name: place.name || "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      await addLocation(theLocation);
      setLocation({
        latitude,
        longitude,
        city: place.city || "",
        district: place.district || "",
        region: place.region || "",
        country: place.country || "",
        isoCountryCode: place.isoCountryCode || "",
        postalCode: place.postalCode || "",
        street: place.street || "",
        streetNumber: place.streetNumber || "",
        name: place.name || "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }

    getCurrentLocation();
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#100a30",
        tabBarStyle: {
          width: "100%",
          height: 100,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontWeight: "500",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(friends)"
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarLabel: "Saved",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarLabel: "Tickets",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "ticket" : "ticket-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
};
export default AppLayout;
