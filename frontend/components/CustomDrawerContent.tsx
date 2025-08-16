import { useAuth } from "@/context/AuthContext";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";

const CustomDrawerContent = (props: any) => {
  const { user, logOut } = useAuth();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      {/* Drawer items */}
      <View>
        <DrawerItemList {...props} />
      </View>

      {/* User info at bottom */}
      <View className="px-4 py-6 bg-white border-t border-gray-200">
        <Text className="mb-1 text-xs text-gray-500">Signed in with:</Text>
        <Text className="mb-2 text-sm font-medium text-gray-800">
          {user?.email}
        </Text>
        <Text className="mb-1 text-xs text-gray-500">Signed in as:</Text>
        <Text className="text-sm font-medium text-gray-800">{user?.role}</Text>
        {/* Logout button */}
        <TouchableOpacity
          onPress={logOut}
          className="p-2 mt-3 bg-black rounded-md w-min"
        >
          <Text className="text-xs text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
