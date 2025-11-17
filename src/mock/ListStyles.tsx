import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { theme_clr } from "../constants/colors";
import { semi_bold } from "../constants/font";

const ListStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e9e9e9",
	},
	content: {
		flex: 1,
		paddingBottom: 5,
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
		fontWeight: "bold",
	},
	subheading: {
		color: "#22bdc1",
	},
	mockSingle: {
		backgroundColor: "#ffffff",
		borderRadius: 5,
		marginBottom: 10,
	},
	enrollNow: {
		backgroundColor: "#F67602",
		color: "#ffffff",
		textAlign: "center",
		paddingTop: 10,
		paddingBottom: 10,
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
		fontWeight: "bold",
	},
	mockContents: {
		padding: 20,
		paddingTop: 10,
		paddingBottom: 10,
	},
	mockHeading: {
		fontWeight: "bold",
		fontSize: moderateScale(16),
		marginBottom: 10,
	},
	padding: {
		padding: 20,
		paddingBottom: 10,
		// flex: 1,
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
		fontSize: moderateScale(13),
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

export default ListStyles;
