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
          initialRouteName="all-courses"
          screenOptions={{
            headerShown: true,
            drawerActiveBackgroundColor: "black", // Selected item background
            drawerActiveTintColor: "white", // Selected item text color
            drawerInactiveTintColor: "gray",
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="all-courses"
            options={{
              headerShown: true,
              title: "All Courses",
              drawerLabel: "All Courses",
            }}
          />
          {/* courseId route */}
          <Drawer.Screen
            name="[courseId]"
            options={{
              headerShown: true,
              drawerItemStyle: { display: "none" },
              title: "Course Details",
            }}
          />

          <Drawer.Screen
            name="enrolled-courses"
            options={{
              drawerItemStyle: {
                display: user?.role === "student" ? "flex" : "none",
              },
              title: "Enrolled Courses",
            }}
          />
          <Drawer.Screen
            name="create-course"
            options={{
              headerShown: true,
              drawerItemStyle: {
                display: user?.role === "instructor" ? "flex" : "none",
              },
              title: "Create Course",
            }}
          />
          <Drawer.Screen
            name="update-course"
            options={{
              headerShown: true,
              drawerItemStyle: {
                display: "none",
              },
              title: "Update Course",
            }}
          />
          <Drawer.Screen
            name="instructor-courses"
            options={{
              headerShown: true,
              drawerItemStyle: {
                display: user?.role === "instructor" ? "flex" : "none",
              },
              title: "My Courses",
              drawerLabel: "My Courses",
            }}
          />
          <Drawer.Screen
            name="course-suggestion"
            options={{
              headerShown: true,
              drawerItemStyle: {
                display: user?.role === "student" ? "flex" : "none",
              },
              title: "Course Suggestion",
              drawerLabel: "Course Suggestions",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </CourseProvider>
  );
}
