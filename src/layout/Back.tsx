import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type MyProps = {
  navigation: any
  type?: string
}

const Back = ({ navigation, type }: MyProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => (type ? navigation.navigate(type) : navigation.goBack())}
      >
        <Ionicons name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default Back
