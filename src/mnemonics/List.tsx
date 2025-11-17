import React, { useEffect, useState } from 'react'
import { View, FlatList, Text, Image } from 'react-native'
import axios from 'axios'
import { BASE_URL, WEB_URL } from '../consts'
import { connect } from 'react-redux'
import Loading from '../layout/Loading'
import Toast from 'react-native-simple-toast'
import styles from '../one/Styles'
import HeaderBack from '../layout/HeaderBack'
import Footer from '../layout/Footer'
import { Octicons } from '@expo/vector-icons'

type MyProps = {
  navigation: any
  token: string
  route: any
}

const List = ({ navigation, token, route }: MyProps) => {
  const { subject_id } = route.params
  const [mnemonics, setMnemonics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMnemonics()
  }, [])

  const getMnemonics = () => {
    axios.get(`${BASE_URL}/mnemonicall/${subject_id}?api_token=${token}`).then(
      (res) => {
        setMnemonics(res.data.mnemonics)
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
      <HeaderBack navigation={navigation} heading="Mnemonics" />
      <View style={styles.content}>
        <FlatList
          data={mnemonics}
          renderItem={({ item, index }) => (
            <View
              style={
                index % 2
                  ? [styles.mt10, styles.bgTwoNew]
                  : [styles.mt10, styles.bgOneNew]
              }
            >
              <View style={styles.flexDir}>
                <View style={styles.number}>
                  <Text style={styles.numbertxt}>{index + 1}</Text>
                </View>

                <Text style={styles.flex}>{item.ques}</Text>
              </View>
              {item.image && (
                <Image
                  style={styles.imageNew}
                  source={{ uri: `${WEB_URL}/${item.image}` }}
                />
              )}
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
