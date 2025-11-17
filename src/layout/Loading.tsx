import React from "react";
import { StyleSheet, View, Modal, ActivityIndicator, Text } from "react-native";

const Loading = (props: any) => {
  const { loading, text } = props;

  return (
    // <View
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
      <Modal
        transparent={true}
        animationType={"fade"}
        visible={loading}
        onRequestClose={() => {
          console.log("close modal");
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={loading}
              color="#000000"
              size="large"
            />
            <Text style={styles.title}>{text}</Text>
          </View>
        </View>
      </Modal>
    // </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 150,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
  },
  title: {
    textAlign: "center",
  },
});

export default Loading;
