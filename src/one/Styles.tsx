import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

const Styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e9e9e9",
	},
	content: {
		margin: 20,
		marginTop: 0,
		marginBottom: 0,
		flex: 1,
	},
	boxContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 5,
		padding: 10,
		marginTop: 10,
		marginBottom: 5,
		elevation: 1,
	},
	heading: {
		// fontWeight: "bold",
		fontFamily: semi_bold
	},
	subheading: {
		color: "#22bdc1",
		fontFamily: regular
	},
	flex: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		fontFamily: regular
	},
	upgrade: {
		backgroundColor: "#22bdc1",
		color: "#FFFFFF",
		textAlign: "center",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 10,
		fontSize: moderateScale(16),
	},
	mt20: {
		marginTop: 20,
	},
	mt10: {
		marginTop: 10,
	},
	mb10: {
		paddingBottom: 20,
	},
	mr10: {
		marginRight: 10,
	},
	bgOne: {
		backgroundColor: "#f3f6fb",
		padding: 10,
		borderRadius: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	bgTwo: {
		backgroundColor: "#dbf2ff",
		padding: 10,
		borderRadius: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	bgOneNew: {
		backgroundColor: "#f3f6fb",
		padding: 10,
		borderRadius: 5,
	},
	bgTwoNew: {
		backgroundColor: "#dbf2ff",
		padding: 10,
		borderRadius: 5,
	},
	imageNew: {
		resizeMode: "contain",
		flex: 1,
		aspectRatio: 1,
	},
	flexDir: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	number: {
		backgroundColor: "#22bdc1",
		borderRadius: 50,
		width: 18,
		height: 18,
		display:'flex',
		alignItems:'center',
		justifyContent:'center',
		marginRight: 10
	},
	numbertxt:{
		color: "#ffffff",
		fontSize: moderateScale(12),
		fontFamily: regular
	}
});

export default Styles;
