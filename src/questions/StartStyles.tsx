import { StyleSheet } from "react-native";
import { main_font, regular, semi_bold } from "../constants/font";
import { crct_bg_clr, report_txt_clr, theme_clr } from "../constants/colors";
import { moderateScale } from "react-native-size-matters";

const StartStyles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		flex: 1,
		margin: 20,
		marginTop: 10,
		marginBottom: 10,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	logo: {
		flex: 1,
		textTransform: "uppercase",
		color: theme_clr,
		fontFamily: semi_bold,
		fontSize: moderateScale(14)
	},
	progressBar: {
		flexDirection: "row",
		height: 5,
		width: "100%",
	},
	scroller: {
		marginBottom: 10,
	},
	singleOption: {
		padding: 10,
		marginTop: 10,
		elevation: 1,
	},
	corw: {
		marginTop: 10,
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	sameline: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	remaining: {
		backgroundColor: theme_clr,
		color: "#ffffff",
		borderRadius: 50,
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 8,
		paddingRight: 8,
	},
	circle: {
		width: 10,
		height: 10,
		borderRadius: 20,
		marginRight: 5,
	},
	circleRed: {
		backgroundColor: "red",
	},
	circleGreen: {
		backgroundColor: "green",
	},
	circleGrey: {
		backgroundColor: "#cccccc",
	},
	singlOptExp: {
		marginTop: 5,
	},
	green: {
		color: crct_bg_clr,
		marginLeft: 5,
	},
	red: {
		color: "red",
		marginLeft: 5,
	},
	blackNew: {
		color: "#000000",
		marginLeft: 5,
	},
	whiteNew: {
		color: "#ffffff",
		marginLeft: 5,
	},
	black: {
		color: "#000000",
		marginLeft: 23,
	},
	white: {
		color: "#ffffff",
		marginLeft: 23,
	},
	iconOption: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginTop: 5,
	},
	explain: {
		marginTop: 20,
	},
	nextBtn: {
		textTransform: "uppercase",
		backgroundColor: theme_clr,
		padding: 10,
		borderRadius: 20,
		textAlign: "center",
		color: "#ffffff",
		fontFamily: semi_bold,
		fontSize: moderateScale(14)
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		// alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		// elevation: 2,
		marginTop: 20,
		flex: 1,
	},
	clsbutton: {
		borderRadius: 20,
		borderWidth: 1,
		borderColor: theme_clr,
		padding: 10,
		// elevation: 2,
		marginTop: 20,
		flex: 1,
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#FFF",
	},
	buttonSend: {
		backgroundColor: theme_clr,
	},
	clstextStyle: {
		color: theme_clr,
		fontFamily: semi_bold,
		textAlign: "center",
		fontSize: moderateScale(14)
	},
	textStyle: {
		color: "white",
		fontFamily: semi_bold,
		textAlign: "center",
		fontSize: moderateScale(14)
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: moderateScale(15),
		// fontWeight: "bold",
		fontFamily: main_font
	},
	label: {
		textAlign: "left",
		alignSelf: "flex-start",
		fontFamily: regular,
		fontSize:moderateScale(13)
	},
	modalButtons: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	mr10: {
		marginRight: 10,
	},
	ml10: {
		marginLeft: 10,
	},
	report: {
		marginTop: 20,
		fontSize: moderateScale(14),
		fontFamily: main_font,
		color: report_txt_clr,
	},
	issue: {
		borderColor: "#000000",
		borderWidth: 1,
		padding: 10,
		width: "100%",
		marginTop: 10,
	},
	txt:{
		fontFamily: main_font,
		fontSize: moderateScale(14)
	}
});

export default StartStyles;
