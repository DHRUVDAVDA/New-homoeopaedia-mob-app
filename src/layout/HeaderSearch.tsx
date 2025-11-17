import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

type MyProps = {
	navigation: any;
};

const HeaderSearch = ({ navigation }: MyProps) => {
	const [keyword, setKeyword] = useState("");

	useEffect(() => {}, []);

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<Ionicons name="arrow-back" size={30} color="#ffffff" />
			</TouchableOpacity>
			<TextInput
				style={styles.input}
				placeholder="Try MB7831"
				placeholderTextColor="#cccccc"
				autoFocus={true}
				value={keyword}
				onChangeText={(e) => setKeyword(e)}
			/>
			{keyword !== "" && (
				<TouchableOpacity
					onPress={() => setKeyword("")}
					style={styles.search}
				>
					<FontAwesome name="close" size={28} color="#ffffff" />
				</TouchableOpacity>
			)}
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
	input: {
		flex: 1,
		color: "#ffffff",
		fontWeight: "bold",
		marginLeft: 10,
	},
	search: {
		alignItems: "flex-end",
	},
});

export default HeaderSearch;
