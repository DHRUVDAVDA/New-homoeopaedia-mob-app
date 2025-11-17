import { StyleSheet } from "react-native";
import { regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

const SubjectStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e9e9e9",
	},
	content: {
		flex: 1,
		paddingBottom: 5,
	},
	scroller: {
		flex: 1,
		paddingBottom: 5,
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		width: "100%",
		height: 150,
		resizeMode: "contain",
	},
	text: {
		fontSize: moderateScale(16),
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 20,
	},
	boxContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 5,
		padding: 10,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
		marginBottom: 5,
		elevation: 1,
	},
	heading: {
		// fontWeight: "bold",
		fontFamily: semi_bold,
		fontSize: moderateScale(13.5),
		marginBottom: 10,
	},
	subheading: {
		color: "#22bdc1",
		fontSize: moderateScale(10),
		fontFamily: regular
	},
	subheadingQues: {
		color: "#22bdc1",
		fontSize: moderateScale(10),
		marginRight: 10,
		fontFamily: regular
	},
	mb5: {
		marginBottom: 5,
	},
	comingSoon: {
		backgroundColor: "#cccccc",
		color: "#888888",
		fontSize: moderateScale(12),
		fontWeight: "bold",
		paddingVertical: 2,
		paddingHorizontal: 5,
		borderRadius: 5,
	},
	singleList: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	lastItemList: {
		flexDirection: "row",
		alignItems: "center",
	},
	startArrow: {
		backgroundColor: "#22bdc1",
		padding: 5,
		borderRadius: 50,
	},
	startTrophy: {
		backgroundColor: "#22bdc1",
		padding: 5,
		paddingTop: 8,
		paddingBottom: 8,
		borderRadius: 50,
	},
	icons: {
		flexDirection: "row",
		alignItems: "center",
	},
	mr10: {
		marginRight: 10,
		padding: 9,
	},
	contents: {
		margin: 20,
	},
	marks: {
		backgroundColor: "#22bdc1",
		borderRadius: 20,
		padding: 20,
		alignItems: "center",
	},
	textBig: {
		fontSize: moderateScale(20),
		fontWeight: "bold",
		color: "#ffffff",
	},
	textLarge: {
		fontSize: moderateScale(16),
		fontWeight: "bold",
		color: "#ffffff",
	},
	mbmarks: {
		marginBottom: 15,
	},
	mr5: {
		marginRight: 5,
	},
	inputSearch: {
		borderColor: "#22bdc1",
		borderWidth: 1,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
		marginHorizontal: 20,
		marginTop: 10,
	},
});

export default SubjectStyles;
