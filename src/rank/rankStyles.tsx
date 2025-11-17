import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9", // Light background for a soft feel
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
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9", // Light background for a soft feel
  },
  centerAlignContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  WarningText: {
    fontSize: moderateScale(16),
    color: "#888",
  },
  scrollContainer: {
    flex: 1,
    margin: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#22bdc1",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  thText: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
  },
  tableTd: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  tdText: {
    flex: 1,
    color: "#333",
  },
});

export default styles;
