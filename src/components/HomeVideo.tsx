import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { WEB_URL } from "../consts";
import { main_font, regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
  navigation: any;
  videos: any;
  from: string;
};

const HomeVideo = ({ navigation, videos, from }: MyProps) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("VideoPlay", {
          videoInfo: videos,
          from: from,
          title: videos.title,
        })
      }
      style={styles.box}
    >
      {videos.thumb ? (
        <View style={styles.videoSectionThumb}>
          <Image
            source={{ uri: `${WEB_URL}${videos.thumb}` }}
            style={styles.thumb}
          />
          <View style={styles.videoSectionIcon}>
            <FontAwesome name="youtube-play" size={24} color="#ffffff" />
          </View>
        </View>
      ) : (
        <View style={styles.videoSection}>
          <FontAwesome name="youtube-play" size={24} color="#ffffff" />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {videos.title}
        </Text>
        <Text style={styles.descr} numberOfLines={1}>
          {videos.descr}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    position: "relative",
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 5,
    maxWidth: 200,
  },
  videoSectionThumb: {
    position: "relative",
  },
  thumb: {
    width: 200,
    height: 100,
    resizeMode: "stretch",
    borderRadius: 25,
  },
  videoSectionIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  videoSection: {
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
    borderRadius: 10,
    height: 100,
  },
  textContainer: {
    paddingVertical: 10,
  },
  descr: {
    fontSize: moderateScale(11),
    color: "#000000",
    fontFamily: regular
  },
  title: {
    fontSize: moderateScale(13),
    fontFamily: semi_bold,
    color: "#000000",
  },
});

export default HomeVideo;
