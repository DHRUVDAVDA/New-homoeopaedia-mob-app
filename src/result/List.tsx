import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import HeaderText from '../layout/HeaderText'
import Footer from '../layout/Footer'
import styles from '../HomeStyles'
import { connect } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../consts'
import Toast from 'react-native-simple-toast'
import Loading from '../layout/Loading'
import { User } from '../_redux/reducers/types'
import moment from 'moment'

type MyProps = {
  navigation: any
  token: string
  user: User
  route: any
}

const List = ({ navigation, token, user, route }: MyProps) => {
  const { type } = route.params
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getList()
  }, [])

  const getList = () => {
    let URL = ''
    if (type === 'mock')
      URL = `${BASE_URL}/result/mlist/${user.user_id}?api_token=${token}`

    axios.get(URL).then(
      (res) => {
        setLists(res.data.list)
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
      <Loading loading={loading} text="Loading result. Please wait." />
      <HeaderText navigation={navigation} heading="My Results" />
      <View style={styles.list}>
        {lists.length > 0 && (
          <FlatList
            data={lists}
            renderItem={({ item }: { item: any }) => (
              <View style={styles.mockSingle1}>
                <Text style={[styles.mockHeading, styles.flex]}>
                  {item.mark}
                </Text>
                <Text style={styles.restxt}>{item.name}</Text>
                <Text style={styles.restxt}>{moment(item.created_at).format('DD-MM-YYYY')}</Text>
              </View>
            )}
            keyExtractor={(item) => `key${item.id}`}
          />
        )}
      </View>
      <Footer navigation={navigation} page="" />
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(List)
