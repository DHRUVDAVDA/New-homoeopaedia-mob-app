import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../Home";
import SearchScreen from "../Search";
import VideoListScreen from "../videos/List";
import VideoPlayScreen from "../videos/Play";
import PvideoScreen from "../videos/Paid";
import QSubListScreen from "../questions/Subject";
import QChapListScreen from "../questions/Chapter";
import QPreviewScreen from "../questions/Preview";
import QStartScreen from "../questions/Start";
import QReviewScreen from "../questions/Review";
import List from "../mock/List";
import TStartScreen from "../mock/Start";
import TReviewScreen from "../mock/Review";
import ResultsScreen from "../result/Results";
import RListScreen from "../result/List";
import ProfileScreen from "../account/Profile";
import SettingsScreen from "../account/Settings";
import NotiScreen from "../notification/Index";
import NotiDetailScreen from "../notification/Details";
import AboutScreen from "../About";
import ContactScreen from "../Contact";
import OsubjectScreen from "../one/Subject";
import OnelinerScreen from "../one/List";
import MnSubjectScreen from "../mnemonics/Subject";
import MnemonicsScreen from "../mnemonics/List";
import TestimonialsScreen from "../testimonials/Index";
import Instructions from "../mock/Instructions";
import StartMock from "../mock/StartMock";
import Result from "../mock/Result";
import PaidService from "../PaidService";
import SolutionQues from "../mock/SolutionQues";
import TitleList from "../bookmark/TitleList";
import BookmarkData from "../bookmark/Bookmark";
import SingleQus from "../bookmark/SingleQus";

const Stack = createStackNavigator();
const StackScreen = () => (
  <Stack.Navigator
    // initialRouteName="Splash"
    // screenOptions={{
    //   headerShown: false,
    //   cardStyle: {
    //     // paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    //   },
    // }}
    screenOptions={{
      headerShown: false,
      navigationBarColor: 'transparent', // Avoid deprecated API
    }}
    // headerMode="none"
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="VideoList" component={VideoListScreen} />
    <Stack.Screen name="VideoPlay" component={VideoPlayScreen} />
    <Stack.Screen name="Pvideo" component={PvideoScreen} />
    <Stack.Screen name="QSubList" component={QSubListScreen} />
    <Stack.Screen name="QChapList" component={QChapListScreen} />
    <Stack.Screen name="QPreview" component={QPreviewScreen} />
    <Stack.Screen name="QStart" component={QStartScreen} />
    <Stack.Screen name="QReview" component={QReviewScreen} />
    <Stack.Screen name="MockScreen" component={List} />
    <Stack.Screen name="TStart" component={TStartScreen} />
    <Stack.Screen name="TReview" component={TReviewScreen} />
    <Stack.Screen name="Results" component={ResultsScreen} />
    <Stack.Screen name="RList" component={RListScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Notification" component={NotiScreen} />
    <Stack.Screen name="NotiDetail" component={NotiDetailScreen} />
    <Stack.Screen name="Contact" component={ContactScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
    <Stack.Screen name="OSubject" component={OsubjectScreen} />
    <Stack.Screen name="Oneliner" component={OnelinerScreen} />
    <Stack.Screen name="MnSubject" component={MnSubjectScreen} />
    <Stack.Screen name="Mnemonics" component={MnemonicsScreen} />
    <Stack.Screen name="Testimonials" component={TestimonialsScreen} />
    <Stack.Screen name="Instructions" component={Instructions} />
    <Stack.Screen name="StartMock" component={StartMock} />
    <Stack.Screen name="MockResult" component={Result} />
    <Stack.Screen name="PaidService" component={PaidService} />
    <Stack.Screen name="MockResultQues" component={SolutionQues} />
    <Stack.Screen name="TitleList" component={TitleList} />
    <Stack.Screen name="BookmarkData" component={BookmarkData} />
    <Stack.Screen name="BookmarkDetails" component={SingleQus} />
  </Stack.Navigator>
);

export default StackScreen;
