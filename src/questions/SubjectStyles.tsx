import { StyleSheet } from "react-native";
import { regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";
import { theme_clr } from "../constants/colors";

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
		fontSize: moderateScale(14)
	},
	subheading: {
		color: "#22bdc1",
		fontFamily: regular,
		fontSize: moderateScale(12)
	},
	singleList: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
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
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 10,
		alignItems: "center",
	},
	textBig: {
		fontSize: moderateScale(20),
		fontFamily: semi_bold,
		color: "#ffffff",
		textAlign: "center",
	},
	textLarge: {
		fontSize: moderateScale(16),
		fontFamily: semi_bold,
		color: "#ffffff",
		textAlign: "center",
	},
	mbmarks: {
		marginBottom: 15,
	},
	marksMultiple: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	flex: {
		flex: 1,
	},
	alignCenter: {
		alignItems: "center",
	},
	bgTheme: {
		backgroundColor: "#22bdc1",
	},
	mt10: {
		marginTop: 10,
	},
	tabBarContainer: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		elevation: 4,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	activeTabItem: {
		borderBottomColor: theme_clr,
	},
	tabLabel: {
		fontSize: moderateScale(12),
		fontFamily: semi_bold
	},
	indicator: {
		position: 'absolute',
		bottom: 0,
		height: 1,
		width: '100%',
		backgroundColor: theme_clr,
		borderRadius: 3,
	},
	screenContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f6f6f6',
	},
	screenText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
	},
});

export default SubjectStyles;
