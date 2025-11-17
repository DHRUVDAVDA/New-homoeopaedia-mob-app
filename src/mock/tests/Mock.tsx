import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { connect } from "react-redux";
import { User } from '../../_redux/reducers/types';
import All from './MockTest/All';
import Completed from './MockTest/Completed';
import NotStarted from './MockTest/NotStarted';
import Paused from './MockTest/Paused';
import { theme_clr } from '../../constants/colors';
import { semi_bold } from '../../constants/font';
import { moderateScale } from 'react-native-size-matters';

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

const Mock = ({ navigation, route }: MyProps) => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen name="All" component={All} />
        <Tab.Screen name="Completed" component={Completed} />
        <Tab.Screen name="NotStarted" component={NotStarted} />
        <Tab.Screen name="Paused" component={Paused} />
      </Tab.Navigator>
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

export default connect(mapStateToProps)(Mock);

