import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { WEB_URL } from '../consts'
import { regular, semi_bold } from '../constants/font'
import { moderateScale } from 'react-native-size-matters'

type MyProps = {
  navigation: any
  videos: any
  from: string
}

const Video = ({ navigation, videos, from }: MyProps) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('VideoPlay', {
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
        <Text style={{ fontFamily: semi_bold, fontSize: moderateScale(13)}}>{videos.title}</Text>
        <Text style={styles.descr} numberOfLines={2}>
          {videos.descr}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 10,
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  videoSectionThumb: {
    position: 'relative',
  },
  thumb: {
    width: "100%",
    height: 85,
    resizeMode: 'contain',
  },
  videoSectionIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoSection: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
  descr: {
    fontSize: moderateScale(12),
    fontFamily: regular
  },
})

export default Video
