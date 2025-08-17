import { TouchableOpacity, Text, View } from "react-native";

import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        height: 60,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        className="p-3 bg-black rounded-xl top-2"
      >
        <Text className="text-white ">☰</Text>
      </TouchableOpacity>
    </View>
  );
}
