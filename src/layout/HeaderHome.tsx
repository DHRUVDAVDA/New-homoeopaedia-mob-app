import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
	navigation: any;
};

const HeaderHome = ({ navigation }: MyProps) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => navigation.openDrawer()}>
				<FontAwesome name="navicon" size={30} color="#22bdc1" />
			</TouchableOpacity>
			{/* <Text style={styles.name}>Home</Text> */}
			<Image
				style={styles.logo}
				source={require("../../assets/logo.png")}
			/>
			<TouchableOpacity
				onPress={() => navigation.navigate("Notification")}
				style={styles.search}
			>
				<Ionicons name="notifications" size={28} color="#22bdc1" />
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
		backgroundColor: "#ffffff",
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
		fontWeight: "bold",
		textTransform: "uppercase",
		fontSize: moderateScale(20),
		justifyContent: "center",
		textAlign: "center",
	},
	search: {
		alignItems: "flex-end",
	},
	logo: {
		flex: 1,
		height: 30,
		resizeMode: "contain",
	},
});

export default HeaderHome;
