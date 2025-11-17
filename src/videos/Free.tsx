import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import Video from '../components/Video'
import axios from 'axios'
import { BASE_URL } from '../consts'
import { connect } from 'react-redux'
import Loading from '../layout/Loading'
import Toast from 'react-native-simple-toast'

type MyProps = {
  navigation: any
  token: string
}

const Free = ({ navigation, token }: MyProps) => {
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVideo()
  }, [])

  const getVideo = () => {
    axios.get(`${BASE_URL}/video?api_token=${token}`).then(
      (res) => {
        setVideo(res.data.video)
        setLoading(false)
      },
      (error) => {
        setLoading(false)
        Toast.show('Network error. Tryagain.', Toast.LONG)
      },
    )
  }

  return (
    <View style={styles.container}>
      <Loading loading={loading} text="Loading contents. Please wait." />
      <View style={styles.content}>
        <FlatList
          data={video}
          renderItem={({ item }) => (
            <Video navigation={navigation} videos={item} from="video" />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    margin: 20,
    marginTop: 0,
    marginBottom: 0,
    flex: 1,
  },
})

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(Free)
