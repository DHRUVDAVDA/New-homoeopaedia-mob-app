import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { regular, semi_bold } from "../constants/font";

const Styles = StyleSheet.create({
	keyContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffff",
	},
	scrollContainer: {
		alignItems: "center",
		padding: 20,
	},
	image: {
		width: "70%",
		height: 70,
		resizeMode: "contain",
	},
	heading: {
		fontSize: moderateScale(24),
		fontFamily: semi_bold,
		marginBottom: 5,
	},
	subHeading: {
		marginBottom: 10,
		fontFamily: regular,
		fontSize: moderateScale(12)
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
		fontWeight: "bold",
	},
	forgot: {
		marginTop: 10,
		textAlign: "right",
		color: "#000000",
		fontFamily: regular,
		fontSize: moderateScale(12)
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
		fontFamily: semi_bold,
		fontSize: moderateScale(16),
	},
	signUp: {
		flexDirection: "row",
		marginTop: 50,
	},
	signupLink: {
		color: "#0149a5",
		fontFamily: semi_bold,
		fontSize: moderateScale(12)
	},
	error: {
		fontSize: moderateScale(10),
		color: "red",
		marginTop: 5,
	},
	backBtn: {
		alignSelf: "flex-start",
		marginBottom: 30,
	},
	dontaccnt:{
		fontFamily: regular,
		fontSize: moderateScale(12)
	}
});

export default Styles;
