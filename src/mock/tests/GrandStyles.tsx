import { StyleSheet } from "react-native";
import { regular, semi_bold } from "../../constants/font";
import { moderateScale } from "react-native-size-matters";

const GrandStyles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#f6f6f6'
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
    singleList: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
    heading: {
		fontFamily: semi_bold,
		fontSize: moderateScale(13.5),
		marginBottom: 10,
	},
	subheading: {
		color: "#22bdc1",
		fontSize: moderateScale(10),
		fontFamily: regular
	},
    icons: {
		flexDirection: "row",
		alignItems: "center",
	},
    startTrophy: {
		backgroundColor: "#22bdc1",
		padding: 5,
		paddingTop: 8,
		paddingBottom: 8,
		borderRadius: 50,
	},
    mr10: {
		marginRight: 10,
		padding: 9,
	},
    startArrow: {
		backgroundColor: "#22bdc1",
		padding: 5,
		borderRadius: 50,
	},
    scroller: {
		flex: 1,
		paddingBottom: 5,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default GrandStyles;