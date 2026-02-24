import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
// Main Navigation Component
export default function AppNav() {
  const { userToken } = useSelector((state) => state.auth); // Get the user token from the auth state to determine which stack to show

  return userToken ? <AppStack /> : <AuthStack />;
}