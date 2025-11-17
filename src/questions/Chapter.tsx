import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Footer from "../layout/Footer";
import HeaderBack from "../layout/HeaderBack";
import styles from "./SubjectStyles";
import All from "./All";
import Completed from "./Completed";
import Unattempted from "./Unattempted";
import Paused from "./Paused";
import { semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
	route: any;
	navigation: any;
};

const Tab = createMaterialTopTabNavigator();

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

const Chapter = ({ route, navigation }: MyProps) => {
	const { heading, subId, subSlug } = route.params;

	return (
		<View style={styles.container}>
			<HeaderBack navigation={navigation} heading={heading} />

			<Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
				<Tab.Screen
					name="All"
					children={() => (
						<All
							navigation={navigation}
							subId={subId}
							subSlug={subSlug}
						/>
					)}
				/>
				<Tab.Screen
					name="Paused"
					children={() => (
						<Paused navigation={navigation} subId={subId} />
					)}
				/>
				<Tab.Screen
					name="Completed"
					children={() => (
						<Completed navigation={navigation} subId={subId} />
					)}
				/>
				<Tab.Screen
					name="Unattempted"
					children={() => (
						<Unattempted navigation={navigation} subId={subId} />
					)}
				/>
			</Tab.Navigator>
			<Footer navigation={navigation} page={`Question`} />
		</View>
	);
};

export default Chapter;
