import { StyleSheet } from "react-native";
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
	boxContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 5,
		padding: 20,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
		marginBottom: 5,
		elevation: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	textSection: {
		flex: 1,
	},
	text: {
		fontWeight: "bold",
		fontSize: moderateScale(18),
	},
	start: {
		alignItems: "flex-end",
		backgroundColor: "#22bdc1",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 5,
	},
	btnText: {
		color: "#ffffff",
		textTransform: "uppercase",
		fontWeight: "bold",
	},
});

export default SubjectStyles;
