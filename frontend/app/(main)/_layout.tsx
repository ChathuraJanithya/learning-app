import { Drawer } from "expo-router/drawer";
import CustomHeader from "@/components/CustomHeader";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LayoutDashboard } from "lucide-react-native";
import CustomDrawerContent from "@/components/CustomDrawerContent";

export default function DashboardLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="dashboard"
        screenOptions={{
          headerShown: true,
          drawerActiveBackgroundColor: "black", // Selected item background
          drawerActiveTintColor: "white", // Selected item text color
          drawerInactiveTintColor: "gray",
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="dashboard"
          options={{
            header: () => <CustomHeader />,
            drawerIcon: () => (
              <View className="flex items-center justify-center">
                <LayoutDashboard className="text-white " size={14} />
              </View>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
