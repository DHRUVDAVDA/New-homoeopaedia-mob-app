import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  AntDesign,
  Ionicons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native"; // <-- ADD THIS
import { semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
  navigation: any;
  page: string;
};

const Footer = ({ navigation, page }: MyProps) => {
  const state = useNavigationState((state) => state); // get current navigation state

  // Get active route name
  const currentRouteName = state.routes[state.index].name;

  // List of pages where Footer should be shown
  const allowedRoutes = ["Home", "QSubList", "MockScreen", "VideoList"];

  if (!allowedRoutes.includes(currentRouteName)) {
    // If current page is NOT allowed, hide Footer
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.single}
      >
        <Ionicons
          name="home"
          size={20}
          color={page === "Home" ? "#22bdc1" : "#000000"}
        />
        {page === "Home" && (
          <Text style={[styles.text, { color: "#22bdc1" }]}>Home</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("QSubList")}
        style={styles.single}
      >
        <AntDesign
          name="question-circle"
          size={20}
          color={page === "Question" ? "#22bdc1" : "#000000"}
        />
        {page === "Question" && (
          <Text style={[styles.text, { color: "#22bdc1" }]}>Questions</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("MockScreen")}
        style={styles.single}
      >
        <FontAwesome
          name="file-text"
          size={20}
          color={page === "Mock" ? "#22bdc1" : "#000000"}
        />
        {page === "Mock" && (
          <Text style={[styles.text, { color: "#22bdc1" }]}>Tests</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("VideoList")}
        style={styles.single}
      >
        <MaterialIcons
          name="video-library"
          size={20}
          color={page === "Video" ? "#22bdc1" : "#000000"}
        />
        {page === "Video" && (
          <Text style={[styles.text, { color: "#22bdc1" }]}>Videos</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#cccccc",
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  single: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontFamily: semi_bold,
    fontSize: moderateScale(12),
  },
});

export default Footer;
