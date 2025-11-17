import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "./src/Splash";
import LoginScreen from "./src/account/Login";
import RegisterScreen from "./src/account/Register";
import OtpScreen from "./src/account/Otp";
import MainDrawerRouter from "./src/navigation/MainDrawerRouter";
import { navigationRef } from "./src/NavigationService";
import NotiDetails from "./src/notification/Details";

const Stack = createStackNavigator();

export default function AppNavigator() {
	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator
				initialRouteName="Splash"
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name="Splash" component={SplashScreen} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Register" component={RegisterScreen} />
				<Stack.Screen name="Otp" component={OtpScreen} />
				<Stack.Screen name="Home" component={MainDrawerRouter} />
				<Stack.Screen name="NotiDetail" component={NotiDetails} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
