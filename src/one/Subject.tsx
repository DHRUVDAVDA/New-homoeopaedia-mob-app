import React, { useEffect, useState } from 'react'
import { View, FlatList, TouchableOpacity, Text } from 'react-native'
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
}

const Subject = ({ navigation, token }: MyProps) => {
  const [subject, setSubject] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubject()
  }, [])

  const getSubject = () => {
    axios.get(`${BASE_URL}/onelinersub?api_token=${token}`).then(
      (res) => {
        setSubject(res.data.one)
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
          data={subject}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Oneliner', { subject_id: item.id })
              }
              style={styles.boxContainer}
            >
              <Text style={styles.heading}>{item.name}</Text>
              <Text style={styles.subheading}>
                {item.total} one liner{item.total > 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
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

export default connect(mapStateToProps)(Subject)
