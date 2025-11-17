import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import app from "../../app.json";
import { connect } from "react-redux";
import { User, UserActionTypes } from "../_redux/reducers/types";
import { CommonActions } from "@react-navigation/routers";
import axios from "axios";
import { BASE_URL } from "../consts";
import Loading from "../layout/Loading";
import { main_font } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
  user: User;
  navigation: any;
  logOut: any;
};

const DrawerMenu = ({ user, navigation, logOut }: MyProps) => {
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);

    await axios.post(`${BASE_URL}/logout`, { id: user.user_id }).then(
      (res) => {
        setLoading(false);

        logOut(false, {}, "");
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });

        navigation.dispatch(resetAction);
      },
      (error) => {
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Loading loading={loading} text="Logout in progress. Please wait." />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroller}>
          <View style={styles.header}>
            <FontAwesome5
              name="user-alt"
              size={24}
              color="#FFFFFF"
              style={styles.icon}
            />
            <View>
              <Text style={[styles.name, styles.largeText]}>
                {user.user_name}
              </Text>
              <Text style={styles.phone}>{user.user_phone}</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View>
            <TouchableOpacity onPress={() => navigation.push("Home")}>
              <Text style={[styles.colorWhite, styles.smallText]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Results")}
              style={styles.linkGap}
            >
              <Text style={[styles.colorWhite, styles.smallText]}>
                My Results
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate("Rank")}
              style={styles.linkGap}
            >
              <Text style={[styles.colorWhite, styles.smallText]}>
                Leaderboard
              </Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => navigation.navigate("Bookmark")}
              style={styles.linkGap}
            >
              <Text style={[styles.colorWhite, styles.smallText]}>
                Bookmark
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.linkGap}
            >
              <Text style={[styles.colorWhite, styles.smallText]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
              style={styles.linkGap}
            >
              <Text style={[styles.colorWhite, styles.smallText]}>
                Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut} style={styles.linkGap}>
              <Text style={[styles.colorWhite, styles.smallText]}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("About")}>
              <Text style={[styles.colorWhite, styles.smallText]}>
                About us
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Contact")}
              style={styles.linkGap}
            >
              <Text style={[styles.colorWhite, styles.smallText]}>
                Contact us
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
        </ScrollView>
        <View>
          <Text style={styles.verySmallText}>v {app.expo.version}</Text>
          <Text style={styles.verySmallText}>Homoeopaedia</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#22bdc1",
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    backgroundColor: "#555555",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ffffff",
    marginRight: 10,
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#ffffff",
  },
  phone: {
    fontSize: moderateScale(16),
    color: "#ffffff",
    fontFamily: main_font,
  },
  line: {
    marginTop: 15,
    marginBottom: 15,
    borderBottomColor: "#ffffff",
    borderBottomWidth: 1,
  },
  colorWhite: {
    color: "#ffffff",
  },
  linkGap: {
    marginTop: 10,
  },
  smallText: {
    fontSize: moderateScale(16),
    fontFamily: main_font,
  },
  largeText: {
    fontSize: moderateScale(18),
    fontFamily: main_font,
  },
  verySmallText: {
    fontSize: moderateScale(10),
    color: "#ffffff",
    fontFamily: main_font,
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  logOut: (isAuthenticated: any, user: any, token: any) => {
    dispatch({
      type: UserActionTypes.LOGOUT,
      payload: {
        isAuthenticated,
        user,
        token,
      },
    });
  },
});

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu);
