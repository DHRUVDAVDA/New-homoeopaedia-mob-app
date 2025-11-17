import React, { useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { AntDesign } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as yup from 'yup'
import styles from './Styles'
import axios from 'axios'
import { BASE_URL } from '../consts'
import Loading from '../layout/Loading'
import { User, UserActionTypes } from '../_redux/reducers/types'
import { CommonActions } from '@react-navigation/routers'
import Toast from 'react-native-simple-toast'

type MyProps = {
  navigation: any
  user: User
  token: string
  logIn: (isAuthenticated: boolean, user: User, token: string) => void
}

const Otp = ({ navigation, user, token, logIn }: MyProps) => {
  const [isActive, setIsActive] = useState(0)
  const [loading, setLoading] = useState(false)

  const submitForm = (otp: string) => {
    setLoading(true)

    axios
      .post(`${BASE_URL}/otp`, {
        phone: user.user_phone,
        otp: otp,
      })
      .then((response) => {
        setLoading(false)

        if (response.data.success) {
          logIn(true, user, token)
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
          navigation.dispatch(resetAction)
        } else {
          Toast.show(response.data.error, Toast.LONG)
        }
      })
      .catch((error) => {
        setLoading(false)
        Toast.show('Network error. Tryagain.', Toast.LONG)
      })
  }

  const resendOTP = () => {
    setLoading(true)

    axios
      .post(`${BASE_URL}/resend`, {
        phone: user.user_phone,
      })
      .then((response) => {
        setLoading(false)
        Toast.show(response.data.message, Toast.LONG)
      })
      .catch((error) => {
        setLoading(false)
        Toast.show('Network error. Tryagain.', Toast.LONG)
      })
  }

  const loginValidationSchema = yup.object().shape({
    otp: yup.string().required('OTP is required'),
  })

  return (
    <KeyboardAvoidingView style={styles.keyContainer} behavior="height" enabled>
      <Loading loading={loading} text="Checking your OTP. Please wait." />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image style={styles.image} source={require('../../assets/logo.png')} />
        <Text style={styles.heading}>Let's Get Started!</Text>
        <Text style={styles.subHeading}>
          Enter OTP to complete registration
        </Text>
        <Formik
          initialValues={{ otp: '' }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => submitForm(values.otp)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.inputContainer}>
              <View
                style={
                  isActive === 1 || values.otp
                    ? [styles.singleInput, styles.singleInputA]
                    : styles.singleInput
                }
              >
                <TextInput
                  style={[
                    styles.input,
                    { textAlign: 'center', paddingLeft: 0 },
                  ]}
                  placeholder="OTP"
                  onChangeText={handleChange('otp')}
                  onFocus={() => setIsActive(1)}
                  onBlur={handleBlur('otp')}
                  value={values.otp}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.otp && touched.otp && (
                <Text style={styles.error}>{errors.otp}</Text>
              )}
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <View style={styles.signUp}>
          <Text>Don't receive OTP? </Text>
          <TouchableOpacity onPress={() => resendOTP()}>
            <Text style={styles.signupLink}>Resend</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  logIn: (isAuthenticated: any, user: any, token: any) => {
    dispatch({
      type: UserActionTypes.LOGIN,
      payload: {
        isAuthenticated,
        user,
        token,
      },
    })
  },
})

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps, mapDispatchToProps)(Otp)
