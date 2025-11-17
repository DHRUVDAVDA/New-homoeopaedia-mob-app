import React from 'react'
import { View, Text, Modal, Pressable, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'
import { WEB_URL } from '../consts'
import { regular, semi_bold } from '../constants/font'
import { moderateScale } from 'react-native-size-matters'

type MyProps = {
  modalVisible: any
  setModalVisible: any
  data: any
}

const Views = ({ modalVisible, setModalVisible, data }: MyProps) => {
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={{ uri: `${WEB_URL}${data.image}` }}
              style={styles.userImg}
            />
            <Text style={styles.modalText}>
              {data.name}, {data.title}
            </Text>
            <Text style={styles.label}>{data.descr}</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonClose, styles.ml10]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: moderateScale(16),
    // fontWeight: 'bold',
    fontFamily: semi_bold
  },
  label: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: regular
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mr10: {
    marginRight: 10,
    backgroundColor: 'green',
  },
  ml10: {
    marginLeft: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    flex: 1,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontFamily: semi_bold,
    textAlign: 'center',
  },
  userImg: {
    width: 75,
    height: 75,
    resizeMode: 'cover',
    borderRadius: 75 / 2,
    marginBottom: 10,
  },
})

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(Views)
