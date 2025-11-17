import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import HeaderText from '../layout/HeaderText'
import Footer from '../layout/Footer'
import styles from '../HomeStyles'
import { connect } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../consts'
import Toast from 'react-native-simple-toast'
import { Feather } from '@expo/vector-icons'
import Loading from '../layout/Loading'
import { User } from '../_redux/reducers/types'
import { StatusBar } from 'expo-status-bar'

type MyProps = {
  navigation: any
  token: string
  user: User
}

const Results = ({ navigation, token, user }: MyProps) => {
  const [mock, setMock] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMock()
  }, [])

  const getMock = () => {
    axios
      .get(`${BASE_URL}/result/mock/${user.user_id}?api_token=${token}`)
      .then(
        (res) => {
          setMock(res.data.mock)
          setLoading(false)
        },
        (error) => {
          setLoading(false)
          Toast.show('Network error. Tryagain.', Toast.LONG)
        },
      )
  }

  return (
    <View style={[styles.container]}>
      <StatusBar backgroundColor='lightGray' translucent/>
      <Loading loading={loading} text="Loading result. Please wait." />
      <HeaderText navigation={navigation} heading="My Results" />
      <ScrollView contentContainerStyle={styles.scroller}>
        <View style={styles.mockSingle}>
          <View style={styles.mockContents}>
            <Text style={styles.mockHeading}>Mock Test</Text>
            <Text style={styles.restxt}>
              {mock} Result{mock > 1 ? 's' : ''}
            </Text>
          </View>
          {mock > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('RList', { type: 'mock' })}
            >
              <Feather
                name="arrow-right"
                size={20}
                color="#ffffff"
                style={styles.arrow}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Footer navigation={navigation} page="" />
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(Results)
