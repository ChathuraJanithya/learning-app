import { Drawer } from "expo-router/drawer";
import CustomHeader from "@/components/CustomHeader";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LayoutDashboard } from "lucide-react-native";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import { CourseProvider } from "@/context/CourseContext";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout() {
  const { user } = useAuth();
  return (
    <CourseProvider>
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
          {/* courseId route */}
          <Drawer.Screen
            name="[courseId]"
            options={{
              headerShown: true,
              drawerItemStyle: { display: "none" },
              header: () => <CustomHeader />,
              drawerIcon: () => (
                <View className="flex items-center justify-center">
                  <LayoutDashboard className="text-white " size={14} />
                </View>
              ),
            }}
          />

          <Drawer.Screen
            name="enrolled-courses"
            options={{
              drawerItemStyle: {
                display: user?.role === "student" ? "flex" : "none",
              },
              header: () => <CustomHeader />,
              drawerIcon: () => (
                <View className="flex items-center justify-center">
                  <LayoutDashboard className="text-white " size={14} />
                </View>
              ),
            }}
          />
          <Drawer.Screen
            name="create-course"
            options={{
              headerShown: true,
              drawerItemStyle: {
                display: user?.role === "instructor" ? "flex" : "none",
              },
            }}
          />
          <Drawer.Screen
            name="update-course"
            options={{
              headerShown: true,
              drawerItemStyle: {
                display: "none",
              },
            }}
          />
          <Drawer.Screen
            name="instructor-courses"
            options={{
              headerShown: true,
              drawerItemStyle: {
                display: user?.role === "instructor" ? "flex" : "none",
              },
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </CourseProvider>
  );
}
