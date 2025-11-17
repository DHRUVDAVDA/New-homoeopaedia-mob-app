import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { BASE_URL } from '../consts'
import Footer from '../layout/Footer'
import HeaderBack from '../layout/HeaderBack'
import Loading from '../layout/Loading'
import { User } from '../_redux/reducers/types'
import styles from './PreviewStyles'
import Toast from 'react-native-simple-toast'

type MyProps = {
  navigation: any
  route: any
  token: string
  user: User
}

const Preview = ({ navigation, route, token, user }: MyProps) => {
  const { heading, subId, chapterId } = route.params
  const [qcount, setQCount] = useState(0)
  const [ccount, setCCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCount()
  }, [])

  const getCount = () => {
    axios
      .get(
        `${BASE_URL}/qpreview/${subId}/${chapterId}/${user.user_id}?api_token=${token}`,
      )
      .then(
        (res) => {
          setQCount(res.data.qcount)
          setCCount(res.data.ccount)
          setLoading(false)
        },
        (error) => {
          setLoading(false)
          Toast.show('Network error. Tryagain.', Toast.LONG)
        },
      )
  }

  const startOrReview = () => {
    getCount()

    if (qcount > 0 && qcount !== ccount)
      navigation.navigate('QStart', {
        subId: subId,
        chapterId: chapterId,
        totalQues: qcount,
      })
    else if (qcount > 0 && qcount === ccount)
      navigation.navigate('QReview', {
        subId: subId,
        chapterId: chapterId,
      })
    else Toast.show('No questions found.', Toast.LONG)
  }

  const getBtnText = () => {
    if (qcount > 0 && qcount !== ccount) return 'Start'
    else if (qcount > 0 && qcount === ccount) return 'Review'
    else return 'Start'
  }

  return (
    <View style={styles.container}>
      <Loading loading={loading} text="Loading contents. Please wait." />
      <HeaderBack navigation={navigation} heading={heading} />
      <ScrollView contentContainerStyle={styles.content}>
        {!loading && (
          <View style={styles.boxContainer}>
            <View style={styles.textSection}>
              <Text style={styles.text}>
                {qcount} Question{qcount > 1 ? 's' : ''}
              </Text>
              <Text>{ccount} Completed</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                startOrReview()
              }}
              style={styles.start}
            >
              <Text style={styles.btnText}>{getBtnText()}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Footer navigation={navigation} page={`Question`} />
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(Preview)
