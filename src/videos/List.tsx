import React from 'react'
import { View,TouchableOpacity,Text } from 'react-native'
import Footer from '../layout/Footer'
import HeaderText from '../layout/HeaderText'
import styles from '../mock/ListStyles'
import { connect } from 'react-redux'
import { User } from '../_redux/reducers/types'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Free from './Free'
import Paid from './PSubject'
import { semi_bold } from '../constants/font'

type MyProps = {
  navigation: any
  user: User
  token: string
}

const Tab = createMaterialTopTabNavigator()

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

const List = ({ navigation }: MyProps) => {
  return (
    <View style={styles.container}>
      <HeaderText navigation={navigation} heading={`Rapid Revision`} />
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen
          name="Free"
          children={() => <Free navigation={navigation} />}
        />
        <Tab.Screen
          name="Paid"
          children={() => <Paid navigation={navigation} />}
        />
      </Tab.Navigator>
      <Footer navigation={navigation} page={`Video`} />
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(List)
