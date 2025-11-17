import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNotification } from './src/context/NotificationContext';
import { useNavigation } from '@react-navigation/native';

import { navigate } from './src/NavigationService';
import { moderateScale } from 'react-native-size-matters';

const NotificationModal = () => {
  const { visible, notification, hideNotification } = useNotification();
//   const navigation = useNavigation();

  if (!notification) return null;

  const handleViewMore = () => {
    hideNotification();
    navigate('NotiDetail', { data: notification });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.row}>
            {notification.image && <Image source={{ uri: notification.image }} style={styles.image} />}
            <View style={styles.textArea}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.message} numberOfLines={3}>{notification.descr}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleViewMore}>
            <Text style={styles.buttonText}>View More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '85%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textArea: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: moderateScale(16),
    marginBottom: 4,
  },
  message: {
    fontSize: moderateScale(14),
    color: '#555',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
