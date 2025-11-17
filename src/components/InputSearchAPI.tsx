import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

type MyProps = {
  search: string;
  setSearch: any;
  startSearch: any;
};

const InputSearchAPI = ({ search, setSearch, startSearch }: MyProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.relative}>
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          style={styles.inputSearch}
        />
        <AntDesign
          name="search1"
          size={20}
          color={"#888888"}
          style={styles.icon}
        />
      </View>
      <TouchableOpacity onPress={startSearch} style={styles.iconSearch}>
        <AntDesign name="search1" size={20} color={"#ffffff"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
  },
  inputSearch: {
    borderColor: "#22bdc1",
    borderWidth: 1,
    paddingVertical: 5,
    paddingLeft: 40,
    borderRadius: 5,
  },
  relative: {
    position: "relative",
    flex: 1,
  },
  icon: {
    position: "absolute",
    top: 5,
    left: 10,
  },
  iconSearch: {
    backgroundColor: "#22bdc1",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default InputSearchAPI;
