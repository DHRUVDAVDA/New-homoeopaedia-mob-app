import React from "react";
import { View } from "react-native";
import Footer from "../layout/Footer";
import HeaderText from "../layout/HeaderText";
import styles from "./ListStyles";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Mini from "./Mini";
import Grand from "./Grand";
import Mock from "./Mock";

type MyProps = {
  navigation: any;
  user: User;
  token: string;
  route: any;
};

const Tab = createMaterialTopTabNavigator();

const List = ({ navigation, route }: MyProps) => {
  return (
    <View style={styles.container}>
      <HeaderText navigation={navigation} heading={`Tests`} />
      <Tab.Navigator
        // lazy={true}
        tabBarOptions={{
          labelStyle: { textTransform: "none" },
        }}
      >
        <Tab.Screen
          name="Mini Test"
          children={() => <Mini navigation={navigation} />}
        />
        <Tab.Screen
          name="Grand Test"
          children={() => <Grand navigation={navigation} />}
        />
        <Tab.Screen
          name="Mock Test"
          children={() => <Mock navigation={navigation} />}
        />
      </Tab.Navigator>
      <Footer navigation={navigation} page={`Mock`} />
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(List);
