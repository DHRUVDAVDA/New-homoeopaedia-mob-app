import { StyleSheet } from "react-native";
import { main_font, semi_bold } from "../constants/font";
import { border_clr, crct_text } from "../constants/colors";
import { moderateScale } from "react-native-size-matters";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F9F9F9", // Light background for a soft feel
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },

  pickerContainer: {
    width: "95%",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
    margin: 10,
  },

  picker: {
    height: 50,
    width: "100%",
    color: "black",
  },

  card: {
    margin: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#22bdc1",
    flex: 1,
    minHeight: 60, // Adjust this value based on your design
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 3, // Shadow effect for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: 'center'
  },
  questionText: {
    color: "#444",
    lineHeight: 22,
    fontFamily: semi_bold,
    flex: 1, // Allows text to take available space
    fontSize: moderateScale(16),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Spreads items
    // padding: 10,
  },

  indexText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginRight: 10,
  },


  bookmarkIcon: {
    color: "#000", // Change color if needed
    marginLeft: 10,
  },
  singleInput: {
    flexDirection: "row",
    height: 40,
    backgroundColor: "#ffffff",
    elevation: 5,
    color: "#22bdc1",
    fontWeight: "bold",
    marginTop: 20,
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    margin: 20
  },
  innerContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    flex: 1,
  },
  displayFlex: {
    flexDirection: "row",
    alignItems: "center",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  quesImage: {
    width: "100%",
    height: 100,
    // flex: 1,
    resizeMode: "contain",
  },
  answersText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: moderateScale(14),
    fontFamily: main_font,
    color: crct_text,
  },
  number: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 50,
    backgroundColor: "#e9e9e9",
  },
  ms10: {
    marginStart: 10,
  },
  opt: {
    fontFamily: semi_bold
  },
  choice: {
    borderColor: "#e9e9e9",
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

  //pagination 
  heading: {
    // fontWeight: "bold",
    fontFamily: semi_bold,
    fontSize: moderateScale(13.5),
    // marginBottom: 10,
  },
  mb10: {
    marginBottom: 10,
  },
  horizontal: {
    marginVertical: 15,
  },
  flex: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
  },
  paginationSingleActive: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#e9e9e9",
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginRight: 15,
  },
  paginationSingle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#e9e9e9",
    borderRadius: 20,
    backgroundColor: "#e9e9e9",
    marginRight: 15,
  },
  //
  centerAlignContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  WarningText: {
    fontSize: moderateScale(16),
    color: "#666",
    textAlign: "center",
  },

  warningText: {
    fontSize: moderateScale(16),
    color: 'gray',
  },
  questionCard: {
    flexDirection: "row",
    justifyContent: 'space-between',
    // alignItems: "flex-start",
    // padding: 12,
    marginHorizontal: 12
  },
  questionNumberBox: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  questionNumberText: {
    fontFamily: main_font,
    fontSize: moderateScale(14),
    color: '#444',
  },
  questionTextBox: {
    flex: 1,
    paddingHorizontal: 8,
  },
  bookmarkIconBox: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
    marginHorizontal: 12,
  },
  colorGrey: {
    color: "#888888",
  },
  qtxt: {
    fontFamily: semi_bold
  },
  thin: {
    fontFamily: semi_bold
  },
  explthin: {
    fontFamily: semi_bold,
    fontSize: moderateScale(14)
  },
  paginationActive: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    minHeight: 25,
    borderColor: "#e9e9e9",
    borderWidth: 1,
  },

  paginationList: {
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
  scroller: {
    flex: 1,
    paddingBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  boxContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 5,
    // elevation: 1,
  },
  singleList: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
  },

  bookmarkTitle: {
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10
  },
  containerNew: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  options: {
    borderWidth: 1,
    borderColor: border_clr,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: main_font,
  },
  active: {
		borderColor: crct_text,
	},
  textGreen: { color: crct_text },
  textDefault: { color: "black"},
});

export default styles;
