import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
	navigation: any;
	heading: string;
};

const HeaderBack = ({ navigation, heading }: MyProps) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<Ionicons name="arrow-back" size={30} color="#ffffff" />
			</TouchableOpacity>
			<Text style={styles.name}>{heading}</Text>
			<TouchableOpacity
				onPress={() => navigation.navigate("Notification")}
				style={styles.search}
			>
				<Ionicons name="notifications" size={28} color="#ffffff" />
			</TouchableOpacity>
			{/* <TouchableOpacity
				onPress={() => navigation.navigate("Search")}
				style={styles.search}
			>
				<Feather name="search" size={28} color="#ffffff" />
			</TouchableOpacity> */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#22bdc1",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	name: {
		flex: 1,
		color: "#ffffff",
		// fontWeight: "bold",
		fontFamily: semi_bold,
		textTransform: "uppercase",
		fontSize: moderateScale(20),
		justifyContent: "center",
		textAlign: "center",
	},
	search: {
		alignItems: "flex-end",
	},
});

export default HeaderBack;
