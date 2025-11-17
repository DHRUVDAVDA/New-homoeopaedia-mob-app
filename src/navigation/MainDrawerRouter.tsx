import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import StackScreen from "./StackScreen";
import DrawerMenu from "./DrawerMenu";
import { Platform, StatusBar, View } from "react-native";
import ResultsScreen from "../result/Results";
import ProfileScreen from "../account/Profile";
import SettingsScreen from "../account/Settings";
import AboutScreen from "../About";
import ContactScreen from "../Contact";
import NotiScreen from "../notification/Index";
import RListScreen from "../result/List";
import NotiDetailScreen from "../notification/Details";
import Bookmark from "../bookmark/Bookmark";
import Rank from "../rank/rank";

const Drawer = createDrawerNavigator();

export default function MainDrawerRouter() {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <DrawerMenu {...props} />}
        drawerType="slide"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen name="Home" component={StackScreen} />
        <Drawer.Screen name="Results" component={ResultsScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen name="Contact" component={ContactScreen} />
        <Drawer.Screen name="Notification" component={NotiScreen} />
        <Drawer.Screen name="NotiDetail" component={NotiDetailScreen} />
        <Drawer.Screen name="RList" component={RListScreen} />
        <Drawer.Screen name="Bookmark" component={Bookmark} />
        <Drawer.Screen name="Rank" component={Rank} />
      </Drawer.Navigator>
    </View>
  );
}
