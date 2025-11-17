import { StyleSheet } from "react-native";
import { main_font, regular, semi_bold } from "../constants/font";
import { border_clr, crct_bg_clr, crct_text, theme_clr, unattempted, wrng_bg_clr, wrng_text } from "../constants/colors";
import { moderateScale } from "react-native-size-matters";

const ResultStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	containerNew: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	innerContainer: {
		marginHorizontal: 20,
		marginVertical: 10,
		flexGrow: 1,
	},
	innerContainerNew: {
		flexGrow: 1,
	},
	innerContainerNews: {
		marginVertical: 15,
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
	section: {
		marginTop: 20,
	},
	mt30: {
		marginTop: 30,
	},
	mb10: {
		marginBottom: 10,
	},
	heading: {
		fontSize: moderateScale(16),
		fontFamily: semi_bold
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
	},
	mb20: {
		marginBottom: 20,
	},
	line: {
		borderBottomWidth: 1,
		borderBottomColor: "#e9e9e9",
		marginVertical: 20,
		marginBottom: 15,
	},
	box: {
		borderWidth: 1,
		borderColor: "#e9e9e9",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
		marginTop: 15,
		borderRadius: 5,
	},
	grey: {
		color: "#888888",
		fontWeight: "normal",
	},
	flexDirection: {
		flexDirection: "row",
	},
	flex: {
		flex: 1
	},
	me10: {
		marginEnd: 10,
	},
	fs12: {
		fontSize: moderateScale(12),
		textAlign: "center",
	},
	chart: {
		marginTop: 20,
		alignItems: "center",
	},
	horizontal: {
		marginVertical: 10,
	},
	pagination: {
		flexDirection: 'row',
		alignItems: 'center',
		// alignSelf: 'center',
		height: 40,
	},
	paginationSingleActive: {
		backgroundColor: '#fff',
		borderRadius: 20,
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginHorizontal: 5,
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 50,
		// maxWidth: 100,
		minHeight: 25,
		borderColor: "#e9e9e9",
		borderWidth: 1,
	},

	paginationSingle: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderWidth: 1,
		borderColor: "#e9e9e9",
		borderRadius: 20,
		backgroundColor: "#e9e9e9",
		marginHorizontal: 5,
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 50,
		minHeight: 25,
	},
	correctAnswer: {
		borderColor: crct_text,
		color: "FFF",
		backgroundColor: crct_text,
	},
	wrongAnswer: {
		borderColor: wrng_text,
		color: "FFF",
		backgroundColor: wrng_text,
	},
	visited: {
		borderColor: unattempted,
		color: "FFF",
		backgroundColor: unattempted,
	},
	// Correct (answered and not selected)
	answeredCorrect: {
		backgroundColor: "#FFF",
		borderColor: crct_text,
		color: crct_text,
	},

	// Wrong (answered and not selected)
	answeredWrong: {
		backgroundColor: "#FFF",
		borderColor: wrng_text,
		color: wrng_text,
	},
	notanswered: {
		backgroundColor: "#FFF",
		borderColor: unattempted,
		color: unattempted
	},
	textGreen: { color: crct_text },
	textRed: { color: wrng_text },
	textWhite: { color: '#ffffff' },
	textBlue: { color: unattempted },
	textDefault: { color: "black" },
	answer: {
		flexDirection: "row",
		justifyContent: "space-between",
		// alignItems: "flex-start",
		// marginBottom: 10
	},
	numbering: {
		width: 40, // fixed width to fit up to 3 digits
		textAlign: "center",
		paddingVertical: 5,
		borderWidth: 1,
		borderColor: "#888888",
		borderRadius: 5,
		fontWeight: "bold",
		marginRight: 3,
		color: "#888888",
	},

	// numbering: {
	// 	paddingHorizontal: 10,
	// 	paddingVertical: 5,
	// 	borderWidth: 1,
	// 	borderColor: "#888888",
	// 	borderRadius: 5,
	// 	fontWeight: "bold",
	// 	marginRight: 3,
	// 	color: "#888888",
	// },
	// numberingActive: {
	// 	paddingHorizontal: 10,
	// 	paddingVertical: 5,
	// 	borderWidth: 1,
	// 	borderColor: crct_text,
	// 	borderRadius: 5,
	// 	fontWeight: "bold",
	// 	marginRight: 3,
	// 	color: crct_text,
	// },
	numberingActive: {
		width: 40,
		textAlign: "center",
		paddingVertical: 5,
		borderWidth: 1,
		borderColor: crct_text,
		borderRadius: 5,
		fontWeight: "bold",
		marginRight: 3,
		color: crct_text,
	},
	numberingWrong: {
		width: 40,
		textAlign: "center",
		paddingVertical: 5,
		borderWidth: 1,
		borderColor: wrng_text,
		borderRadius: 5,
		fontWeight: "bold",
		marginRight: 3,
		color: wrng_text,
	},
	numberVisited: {
		width: 40,
		textAlign: "center",
		paddingVertical: 5,
		borderWidth: 1,
		borderColor: unattempted,
		borderRadius: 5,
		fontWeight: "bold",
		marginRight: 3,
		color: unattempted,
	},
	// numberingWrong: {
	// 	paddingHorizontal: 10,
	// 	paddingVertical: 5,
	// 	borderWidth: 1,
	// 	borderColor: wrng_text,
	// 	borderRadius: 5,
	// 	fontWeight: "bold",
	// 	marginRight: 3,
	// 	color: wrng_text,
	// },
	// numberVisited:{
	// 	paddingHorizontal: 10,
	// 	paddingVertical: 5,
	// 	borderWidth: 1,
	// 	borderColor: unattempted,
	// 	borderRadius: 5,
	// 	fontWeight: "bold",
	// 	marginRight: 3,
	// 	color: unattempted,
	// },
	question: {
		fontWeight: "bold",
	},
	dot: {
		fontWeight: "bold",
		color: "#888888",
		marginHorizontal: 10,
	},
	colorGrey: {
		color: "#888888",
		fontFamily: main_font
	},
	colorGreen: {
		color: crct_text,
	},
	colorRed: {
		color: wrng_text,
	},
	colorBlue: {
		color: unattempted
	},
	mb10: {
		marginBottom: 10,
	},
	filter: {
		position: "absolute",
		bottom: 10,
		alignSelf: "center",
	},
	filterTouch: {
		backgroundColor: "#000000",
		paddingHorizontal: 20,
		paddingVertical: 5,
		borderRadius: 20,
	},
	filterText: {
		color: "#ffffff",
		fontSize: moderateScale(16),
		fontFamily: main_font,
		marginLeft: 5,
	},
	options: {
		borderWidth: 1,
		borderColor: border_clr,
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
		fontFamily: main_font,
		fontSize: moderateScale(14)
	},
	active: {
		borderColor: crct_text,
	},
	wrong: {
		borderColor: wrng_text,
	},
	correctText: {
		color: crct_text,
		fontFamily: main_font,
		textAlign: "right",
		marginBottom: 10,
	},
	wrongText: {
		color: wrng_text,
		fontFamily: main_font,
		textAlign: "right",
		marginBottom: 10,
	},
	percentageText: {
		color: theme_clr,
		fontFamily: main_font,
		textAlign: "right",
		marginBottom: 10,
	},
	quesImage: {
		width: "100%",
		height: 100,
		// flex: 1,
		resizeMode: "contain",
		marginTop: 10
	},
	fntStyle: {
		fontFamily: main_font,
		color: '#FA5F55',
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
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: moderateScale(15),
		fontFamily: semi_bold
	},
	label: {
		textAlign: "left",
		alignSelf: "flex-start",
		fontFamily: regular
	},
	issue: {
		borderColor: "#000000",
		borderWidth: 1,
		padding: 10,
		width: "100%",
		marginTop: 10,
	},
	modalButtons: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
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
	button: {
		borderRadius: 20,
		padding: 10,
		// elevation: 2,
		marginTop: 20,
		flex: 1,
	},
	buttonSend: {
		backgroundColor: '#22bdc1'
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#FFF",
	},
	btntextStyle: {
		color: theme_clr,
		fontFamily: semi_bold,
		textAlign: "center",
	},
	mr10: {
		marginRight: 10
	},
	textStyle: {
		color: "white",
		fontFamily: semi_bold,
		textAlign: "center",
	},
	ml10: {
		marginLeft: 10,
	},
	thin: {
		fontFamily: main_font
	},
	qtxt: {
		fontFamily: main_font
	},


	tableContainer: {
		marginTop: 10,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		overflow: 'hidden',
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingVertical: 8,
		paddingHorizontal: 5,
		backgroundColor: '#fff',
	},
	tableHeader: {
		backgroundColor: '#f1f1f1',
	},
	tableCell: {
		flex: 1,
		textAlign: 'center',
		fontSize: moderateScale(15),
	},
	tableHeaderText: {
		fontFamily: semi_bold,
		fontSize: moderateScale(15),
	},
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
		// backgroundColor: '#ADD8E6',
		justifyContent: 'flex-end'
	},
	bottomContent: {
		// flex: 1,
	},
	text: {
		fontSize: 18,
		fontWeight: 'bold',
	},

	borderCorrect: {
		borderColor: crct_text,
	},
	borderWrong: {
		borderColor: wrng_text,
	},
	borderDefault: {
		borderColor: border_clr,
	},
	optionLabel: {
		fontFamily: main_font,
		fontSize: moderateScale(14)
	},
	lblboxcrct: {
		// width: 24,
		// height: 24,
		// borderRadius: 50,
		// justifyContent: 'center',
		// alignItems: 'center',
		backgroundColor: crct_text
	},
	lblboxwrng: {
		// width: 24,
		// height: 24,
		// borderRadius: 50,
		// justifyContent: 'center',
		// alignItems: 'center',
		backgroundColor: wrng_text
	},
	optionContainer: {
		padding: 10,
		marginVertical: 5,
		borderWidth: 1,
		borderRadius: 8,
	},

	lblCircle: {
		width: 24,
		height: 24,
		borderRadius: 50,
		justifyContent:'center',
		alignItems:'center',
		marginRight: 10,
	},
	defaultBorder: {
		borderColor: border_clr,
	},
	lblboxDefault: {
		backgroundColor: border_clr,
	},
	labelText: {
		color: 'white',
		fontFamily: main_font,
		fontSize: 14,
		textAlign:'center'
	},
	optionText: {
		flex: 1,
		fontSize: 14,
		fontFamily: main_font,
	},

});

export default ResultStyle;
