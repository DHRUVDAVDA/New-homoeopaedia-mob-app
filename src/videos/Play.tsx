import React from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions } from "react-native";
import Footer from "../layout/Footer";
import YoutubePlayer from "react-native-youtube-iframe";
import WebView from "react-native-webview";
import { BASE_URL } from "../consts";
import { connect } from "react-redux";
import HeaderBack from "../layout/HeaderBack";
import { regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
  navigation: any;
  token: string;
  route: any;
};

const Play = ({ navigation, token, route }: MyProps) => {
  const { videoInfo, from, title } = route.params;

  const videoID = (url: string) => {
    if (url.split("v=").length > 1) {
      var video_id = url.split("v=")[1];
      var ampersandPosition = video_id.indexOf("&");
      if (ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
    } else {
      var video_id = url.split(".be/")[1];
    }

    return video_id;
  };

  return (
    <View style={styles.container}>
      <HeaderBack navigation={navigation} heading={title} />
      <View style={styles.content}>
        {from === "vimeo" ? (
          <WebView
            source={{
              uri: `${BASE_URL}/vimeo/${videoInfo.url}/${
                Dimensions.get("window").width
              }/250?api_token=${token}`,
            }}
            javaScriptEnabled={true}
            scrollEnabled={false}
            allowsFullscreenVideo={true}
            userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
          />
        ) : (
          <YoutubePlayer
            height={250}
            play={true}
            videoId={videoID(videoInfo.url)}
          />
        )}
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{videoInfo.title}</Text>
          <Text style={styles.txt}>{videoInfo.descr}</Text>
        </ScrollView>
      </View>
      <Footer navigation={navigation} page={`Video`} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingTop: 0,
  },
  title: {
    // fontWeight: "bold",
    fontSize: moderateScale(15),
    marginBottom: 5,
    fontFamily: semi_bold
  },
  txt:{
    fontFamily: regular,
    fontSize: moderateScale(13),
  }
});

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(Play);
