import { StyleSheet } from "react-native";
import { semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

const ProfileStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e9e9e9",
	},
	scroller: {
		padding: 20,
		paddingBottom: 10,
	},
	inputContainer: {
		width: "100%",
	},
	singleInput: {
		flexDirection: "row",
		borderRadius: 40,
		height: 40,
		backgroundColor: "#ffffff",
		elevation: 5,
		color: "#22bdc1",
		fontWeight: "bold",
		marginTop: 20,
		alignItems: "center",
		paddingLeft: 10,
		paddingRight: 10,
	},
	singleInputA: {
		borderWidth: 1,
		borderColor: "#22bdc1",
	},
	icons: {
		paddingLeft: 10,
	},
	input: {
		flex: 1,
		paddingLeft: 10,
		color: "#22bdc1",
		// fontWeight: "bold",
		fontFamily: semi_bold
	},
	error: {
		fontSize: moderateScale(10),
		color: "red",
		marginTop: 5,
	},
	button: {
		backgroundColor: "#0149a5",
		padding: 10,
		borderRadius: 30,
		marginTop: 20,
		alignItems: "center",
		elevation: 5,
	},
	buttonText: {
		color: "#ffffff",
		// fontWeight: "bold",
		fontFamily: semi_bold,
		fontSize: moderateScale(16),
	},
});

export default ProfileStyles;
