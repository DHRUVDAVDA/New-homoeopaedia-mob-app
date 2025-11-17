import React, { useEffect, useState } from 'react'
import { View, FlatList, Text } from 'react-native'
import axios from 'axios'
import { BASE_URL } from '../consts'
import { connect } from 'react-redux'
import Loading from '../layout/Loading'
import Toast from 'react-native-simple-toast'
import styles from './Styles'
import HeaderBack from '../layout/HeaderBack'
import Footer from '../layout/Footer'

type MyProps = {
  navigation: any
  token: string
  route: any
}

const List = ({ navigation, token, route }: MyProps) => {
  const { subject_id } = route.params
  const [one, setOne] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOne()
  }, [])

  const getOne = () => {
    axios.get(`${BASE_URL}/onelinerall/${subject_id}?api_token=${token}`).then(
      (res) => {
        setOne(res.data.one)
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
      <HeaderBack navigation={navigation} heading="One Liner" />
      <View style={styles.content}>
        <FlatList
          data={one}
          renderItem={({ item, index }) => (
            <View
              style={
                index % 2
                  ? [styles.mt10, styles.bgTwo]
                  : [styles.mt10, styles.bgOne]
              }
            >
              <View  style={styles.number}>
                <Text style={styles.numbertxt}>{index + 1}</Text>
              </View>
              
              <Text style={styles.flex}>
                {item.ques} - <Text>{item.ans}</Text>
              </Text>
            </View>
          )}
          keyExtractor={(item) => `key${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Footer navigation={navigation} page={`Home`} />
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(List)
