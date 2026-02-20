import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import store from "./redux/store";
import { checkLoginStatus } from "./redux/authSlice";
// import SplashScreen from "./assets/SplashScreen";
import {
  WelcomeScreen,
  LoginScreen,
  SignupScreen,
  HomeScreen,
  ProfileScreen,
  SearchScreen,
  CategoriesScreen,
  ProductDetailScreen,
  CartScreen,
  CheckoutScreen,
} from "./components";
import EntryScreen from "./components/EntryScreen";

const Stack = createNativeStackNavigator();

function EntryStackScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return <EntryScreen />;
}

// Auth Stack - for unauthenticated users
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="Entry" component={EntryStackScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// App Stack - for authenticated users
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

// Main Navigation Component
function AppNav() {
  const dispatch = useDispatch();
  const { userToken, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgba(248, 55, 88, 1)" />
      </View>
    );
  }

  return userToken ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNav />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
