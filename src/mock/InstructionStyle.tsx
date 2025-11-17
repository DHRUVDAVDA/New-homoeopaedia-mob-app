import { StyleSheet } from "react-native";
import { regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

const InstructionStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	innerContainer: {
		marginHorizontal: 20,
		marginVertical: 10,
		flexGrow: 1,
	},
	displayFlex: {
		flexDirection: "row",
		alignItems: "center",
	},
	bold: {
		fontFamily: semi_bold,
		fontSize: moderateScale(14),
	},
	subheading: {
		color: "#888888",
		fontFamily: semi_bold,
		fontSize: moderateScale(14),
	},
	ms10: {
		marginStart: 10,
	},
	mt20: {
		marginTop: 20,
	},
	mt10: {
		marginTop: 10,
	},
	mt5: {
		marginTop: 5,
	},
	mb10:{
		marginBottom: 10
	},
	section: {
		marginTop: 10,
	},
	heading: {
		fontSize: moderateScale(16),
		fontFamily: semi_bold,
	},
	footer: {
		borderTopColor: "#e9e9e9",
		borderTopWidth: 1,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#ffffff",
	},
	btnStart: {
		backgroundColor: "#22bdc1",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
	},
	btnDisabled: {
		backgroundColor: "#888888",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
	},
	btnText: {
		textAlign: "center",
		color: "#ffffff",
		fontFamily: semi_bold,
	},
	txt:{
		fontFamily: regular,
		fontSize: moderateScale(13)
	}
});

export default InstructionStyles;
