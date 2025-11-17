import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HeaderText from '../layout/HeaderText';
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import { theme_clr } from '../constants/colors';
import { semi_bold } from '../constants/font';
import Mini from './tests/Mini';
import Grand from './tests/Grand';
import Mock from './tests/Mock';
import { moderateScale } from 'react-native-size-matters';
import Footer from '../layout/Footer';

const Tab = createMaterialTopTabNavigator();

type MyProps = {
  navigation: any;
  user: User;
  token: string;
  route: any;
};

// Custom Tab Bar Component
function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        // Animation for the tab label color
        const inputRange = state.routes.map((_, i) => i);
        const color = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? '#FF6347' : '#999')),
        });

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.activeTabItem]}
            key={route.key}
            activeOpacity={0.7}
          >
            {/* <Animated.Text style={[styles.tabLabel, { color }]}>{label}</Animated.Text> */}
            <Text style={[styles.tabLabel, { color: isFocused ? '#000' : '#999' }]}>
              {label}
            </Text>
            {isFocused && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const List = ({ navigation, route }: MyProps) => {
  return (
    <View style={{ flex: 1 }}>
      <HeaderText navigation={navigation} heading={`Tests`} />
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen name="Mini Test" component={Mini} />
        <Tab.Screen name="Grand Test" component={Grand} />
        <Tab.Screen name="Mock Test" component={Mock} />
      </Tab.Navigator>
      <Footer navigation={navigation} page={`Mock`} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: theme_clr,
  },
  tabLabel: {
    fontSize: moderateScale(13),
    fontFamily: semi_bold
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 1,
    width: '100%',
    backgroundColor: theme_clr,
    borderRadius: 3,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(List);

