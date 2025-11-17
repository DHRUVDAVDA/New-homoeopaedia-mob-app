import { CommonActions } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { connect } from 'react-redux'

type MyProps = {
  isAuthenticated: boolean
  navigation: any
}

const Splash = ({ isAuthenticated, navigation }: MyProps) => {
  useEffect(() => {
    setTimeout(() => {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: isAuthenticated ? 'Home' : 'Login' }],
      })

      navigation.dispatch(resetAction)
    }, 2000)
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  logo: {
    width: '100%',
    height: 123,
    resizeMode: 'contain',
  },
})

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
})

export default connect(mapStateToProps)(Splash)
