import { StyleSheet } from "react-native";
import { main_font, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

const InstructionStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomColor: "#e9e9e9",
		borderBottomWidth: 1,
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	displayFlex: {
		flexDirection: "row",
		alignItems: "center",
	},
	flex: {
		flex: 1,
	},
	justifyBetween: {
		justifyContent: "space-between",
	},
	timer: {
		backgroundColor: "#e9e9e9",
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 3,
		marginEnd: 10,
	},
	bold16: {
		fontSize: moderateScale(16),
	},
	bold: {
		fontFamily: semi_bold,
		fontSize: moderateScale(13)
	},
	ms10: {
		marginStart: 10,
	},
	ms5: {
		marginStart: 5,
	},
	mt20: {
		marginTop: 20,
	},
	mt10: {
		marginTop: 10,
	},
	mb10: {
		marginBottom: 10,
	},
	mb20: {
		marginBottom: 20,
	},
	innerContainer: {
		marginHorizontal: 15,
		marginVertical: 10,
		// flex: 1,
	},
	choice: {
		borderColor: "#BEE9EB",
		borderWidth: 1,
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	choiceActive: {
		borderColor: "#22bdc1",
		borderWidth: 1,
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	number: {
		paddingVertical: 3,
		paddingHorizontal: 8,
		borderRadius: 50,
		backgroundColor: "#e9e9e9",
	},
	answers: {
		marginHorizontal: 15,
		marginVertical: 10,
	},
	aboveChoice: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	colorGrey: {
		color: "#888888",
		fontFamily: main_font,
		fontSize:moderateScale(13)
	},
	font12: {
		fontSize: moderateScale(12),
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
		marginHorizontal: 15,
		marginVertical: 10,
		flex: 1,
	},
	btnActive: {
		backgroundColor: "#22bdc1",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
		marginHorizontal: 15,
		marginVertical: 10,
		flex: 1,
	},
	btnText: {
		textAlign: "center",
		color: "#ffffff",
		fontFamily: semi_bold,
		fontSize: moderateScale(14)
	},
	footer: {
		borderTopColor: "#e9e9e9",
		borderTopWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	quesImage: {
		// width: "100%",
		// height: 100,
		// flex: 1,
		// resizeMode: "contain",
		width: "100%",
		height: 100,
		resizeMode: "contain",
		marginTop: 10
	},
	qTxt:{
		fontFamily: main_font,
		fontSize: moderateScale(13)
	},
	opt:{
		fontFamily: main_font,
		fontSize: moderateScale(14)
	},
	//////////////////////////////

	subcontainer: {
		flex: 1,
		flexDirection: 'column',
	},
	topHalf: {
		flex: .5,
		justifyContent: 'space-between',
	},
	bottomHalf: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	bottomContent: {
		// flex: 1,
	},
});

export default InstructionStyles;
