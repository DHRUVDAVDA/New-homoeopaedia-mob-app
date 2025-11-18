import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

type MyProps = {
  startSearch: any;
};

const InputSearch = ({ startSearch }: MyProps) => {
  return (
    <View style={styles.relative}>
      <TextInput
        placeholder="Search..."
        onChangeText={startSearch}
        style={styles.inputSearch}
      />
      <AntDesign
        name="search"
        size={20}
        color={"#888888"}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputSearch: {
    borderColor: "#22bdc1",
    borderWidth: 1,
    paddingVertical: 5,
    paddingLeft: 40,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
  },
  relative: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: 18,
    left: 30,
  },
});

export default InputSearch;
