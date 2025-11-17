import { StyleSheet } from "react-native";
import { main_font, regular, semi_bold } from "./constants/font";
import { moderateScale } from "react-native-size-matters";
import { theme_clr } from "./constants/colors";

const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9e9e9",
  },
  p20: {
    padding: 20,
  },
  scroller: {
    // paddingBottom: 10,
  },
  list: {
    flex: 1,
    padding: 20,
  },
  flex: {
    flex: 1,
    textAlign: "center",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#22bdc1",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  titleBold: {
    fontSize: moderateScale(17),
    // fontWeight: "bold",
    fontFamily: semi_bold,
  },
  titleLink: {
    fontSize: moderateScale(15),
    color: "#000000",
    fontFamily: semi_bold,
  },
  line: {
    flex: 1,
    borderBottomColor: "#22bdc1",
    borderBottomWidth: 1,
  },
  headText: {
    backgroundColor: "#22bdc1",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 8,
    paddingBottom: 8,
    color: "#ffffff",
    fontWeight: "bold",
  },
  quesBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    // borderRadius: 5,
    // paddingTop: 10,
    // paddingBottom: 5,
    // paddingLeft: 20,
    // paddingRight: 20,
    // elevation: 1,
  },
  choice: {
    backgroundColor: "#ffffff",
    borderColor: "#e9e9e9",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  question: {
    marginBottom: 5,
  },
  bgGreen: {
    color: "green",
  },
  bgRed: {
    color: "#f00",
  },
  bgBlack: {
    color: "#000",
  },
  bgWhite: {
    color: "#FFFFFF",
  },
  mockSection: {
    marginTop: 15,
  },
  mockSingle: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  mockSingle1: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  enrollNow: {
    backgroundColor: "#F67602",
    color: "#ffffff",
    textAlign: "center",
  },
  mockContents: {
    flex: 1,
    marginRight: 20,
  },
  mockHeading: {
    // fontWeight: "bold",
    fontFamily: semi_bold,
    fontSize: moderateScale(16),
    marginBottom: 10,
  },
  arrow: {
    backgroundColor: "#22bdc1",
    padding: 10,
    borderRadius: 50,
  },
  image: {
    width: "100%",
    resizeMode: "contain",
  },
  imageNew: {
    resizeMode: "contain",
    flex: 1,
    aspectRatio: 1,
  },
  mb20: {
    marginBottom: 20,
  },
  mb10: {
    marginBottom: 10,
  },
  headNoti: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#000000",
    fontSize: moderateScale(16),
    marginBottom: 10,
  },
  oneLiner: {
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  carouselBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  mr10: {
    marginRight: 10,
  },
  ml10: {
    marginLeft: 10,
  },
  ques: {
    fontSize: moderateScale(14),
    fontFamily: main_font,
    // marginLeft: 10,
    // marginRight: 20,
    color: "#000000",
  },
  mt10: {
    marginTop: 10,
  },
  ans: {
    marginLeft: 10,
    marginRight: 20,
  },
  viewMore: {
    backgroundColor: "#22bdc1",
    alignSelf: "center",
    padding: 5,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#ffffff",
    marginTop: 20,
  },
  contentVideo: {
    backgroundColor: "#ffffff",
  },
  txt: {
    fontFamily: main_font,
  },
  restxt: {
    fontFamily: regular,
  },

  uiContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 5,
  },
  box: {
    flex: 0.22, // smaller flex to fit 4 items
    aspectRatio: 1, // square
    borderWidth: 1,
    borderColor: theme_clr,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  boxText: {
    marginTop: 8,
    fontSize: moderateScale(10), // slightly smaller font
    color: theme_clr,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default HomeStyles;
