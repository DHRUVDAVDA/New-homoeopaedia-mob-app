import { StyleSheet } from "react-native";
import { regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

const NotiStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e9e9e9",
	},
	scroller: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
	},
	scrollerNew: {
		flex: 1,
	},
	empty: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	noti: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderRadius: 10,
		padding: 10,
		marginTop: 10,
		marginBottom: 5,
	},
	flex: {
		flex: 1,
		marginLeft: 15,
	},
	title: {
		// fontWeight: "bold",
		fontFamily: semi_bold,
		fontSize: moderateScale(14)
	},
	date: {
		fontSize: moderateScale(11),
		color: "#999999",
	},
	dateActive: {
		fontSize: moderateScale(11),
		color: "#000000",
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 50 / 2,
		resizeMode: "cover",
	},
	imageFull: {
		width: "100%",
		height: 150,
		resizeMode: "contain",
	},
	padding: {
		margin: 20,
	},
	mt10: {
		marginTop: 10,
	},
	descrtxt:{
		fontFamily: regular,
		fontSize: moderateScale(12)
	}
});

export default NotiStyles;
