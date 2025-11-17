import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import styles from "./Styles";
import { User } from "../_redux/reducers/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MockList from "./MockList";
import All from "./mocklist/all";
import Completed from "./mocklist/completed";
import Notstarted from "./mocklist/notstarted";
import Paused from "./mocklist/paused";
import { semi_bold } from "../constants/font";

type MyProps = {
  navigation: any;
  user: User;
  token: string;
};

const Tab = createMaterialTopTabNavigator();

const Mock = ({ navigation, user, token }: MyProps) => {
  
  return (
    <View style={styles.content}>
      <Tab.Navigator
        lazy={true}
        tabBarOptions={{
          labelStyle: { textTransform: "none" },
        }}
        screenOptions={{
					tabBarLabelStyle: {
						textTransform: "none",
						fontFamily: semi_bold
					},
				}}
      >
        <Tab.Screen
          name="All"
          children={() => <MockList navigation={navigation} tab="All" />}
        />
        <Tab.Screen
          name="Completed"
          children={() => <MockList navigation={navigation} tab="Completed" />}
        />
        <Tab.Screen
          name="Not Started"
          children={() => <MockList navigation={navigation} tab="NotStarted" />}
        />
        <Tab.Screen
          name="Paused"
          children={() => <MockList navigation={navigation} tab="Paused" />}
        />
        {/* <Tab.Screen name="All" component={All} />
        <Tab.Screen name="Completed" component={Completed} />
        <Tab.Screen name="Not Started" component={Notstarted} />
        <Tab.Screen name="Paused" component={Paused} /> */}

      </Tab.Navigator>
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(Mock);
