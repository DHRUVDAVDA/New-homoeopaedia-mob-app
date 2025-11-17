import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Footer from '../layout/Footer'
import axios from 'axios'
import { BASE_URL } from '../consts'
import { connect } from 'react-redux'
import Toast from 'react-native-simple-toast'
import HeaderBack from '../layout/HeaderBack'
import { FlatList } from 'react-native-gesture-handler'
import Loading from '../layout/Loading'
import { User } from '../_redux/reducers/types'
import Testimonial from '../components/Testimonial'
import Views from './Views'
import { moderateScale } from 'react-native-size-matters'

type MyProps = {
  navigation: any
  token: string
  user: User
}

const Index = ({ navigation, token, user }: MyProps) => {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [testimonial, setTestimonial] = useState({})
  const [testiSelected, setTestiSelected] = useState({})
  const [onlyTestimonial, setOnlyTestimonial] = useState([])

  useEffect(() => {
    getTestimonials()
  }, [])

  const getTestimonials = async (page = 1) => {
    setLoading(true)

    await axios
      .get(`${BASE_URL}/testimonial/all?page=${page}&api_token=${token}`)
      .then(
        (res) => {
          setTestimonial(res.data.testimonial)
          setOnlyTestimonial((prev) => [...prev, ...res.data.testimonial.data])
        },
        (error) => {
          Toast.show('Network error. Tryagain.', Toast.LONG)
        },
      )

    setLoading(false)
  }

  const loadMoreTesti = async () => {
    if (testimonial?.current_page !== testimonial?.last_page) {
      setLoading(true)

      await getTestimonials(testimonial?.current_page + 1)

      setLoading(false)
    }
  }

  const viewPopup = (data: any) => {
    setTestiSelected(data)
    setModalVisible(true)
  }

  return (
      <View style={styles.container}>
        <Loading loading={loading} text="Loading testimonials. Please wait." />
        <Views
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          data={testiSelected}
        />
        <HeaderBack navigation={navigation} heading="Testimonials" />
        {onlyTestimonial.length > 0 ? (
          <View style={styles.scroller}>
            <FlatList
              data={onlyTestimonial}
              renderItem={({ item }: { item: any }) => (
                <Testimonial
                  navigation={navigation}
                  data={item}
                  from="full"
                  viewPopup={viewPopup}
                />
              )}
              keyExtractor={(item) => `key${item.id}`}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={1}
              onEndReached={loadMoreTesti}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9',
  },
  scroller: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  scrollerNew: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noti: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  flex: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontWeight: 'bold',
  },
  date: {
    fontSize: moderateScale(12),
    color: '#999999',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    resizeMode: 'cover',
  },
  imageFull: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  padding: {
    margin: 20,
  },
  mt10: {
    marginTop: 10,
  },
})

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(Index)
