import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Footer from '../layout/Footer'
import styles from './NotiStyles'
import axios from 'axios'
import { BASE_URL } from '../consts'
import { connect } from 'react-redux'
import Toast from 'react-native-simple-toast'
import HeaderBack from '../layout/HeaderBack'
import { FlatList } from 'react-native-gesture-handler'
import Loading from '../layout/Loading'
import { User } from '../_redux/reducers/types'
import Noti from '../components/Noti'

type MyProps = {
  navigation: any
  token: string
  user: User
}

const Index = ({ navigation, token, user }: MyProps) => {
  const [noti, setNoti] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNotification()
    })

    return unsubscribe
  }, [navigation])

  const getNotification = () => {
    axios.get(`${BASE_URL}/notification?api_token=${token}`).then(
      (res) => {
        setNoti(res.data.noti)
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
      <Loading loading={loading} text="Loading notifications. Please wait." />
      <HeaderBack navigation={navigation} heading="Notification" />
      {noti.length > 0 ? (
        <View style={styles.scroller}>
          <FlatList
            data={noti}
            renderItem={({ item }: { item: any }) => (
              <Noti navigation={navigation} item={item} />
            )}
            keyExtractor={(item) => `key${item.id}`}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.empty}>
          <Text>No notifications found</Text>
        </View>
      )}
      <Footer navigation={navigation} page="" />
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(Index)
