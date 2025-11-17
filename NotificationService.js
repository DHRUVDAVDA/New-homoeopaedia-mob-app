// NotificationService.js
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import axios from "axios";
import { BASE_URL } from './src/consts';
import { store } from './src/store/configureStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  } else {
    Alert.alert('Permission denied', 'Cannot receive notifications');
  }
}

async function getFcmToken() {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      await AsyncStorage.setItem('fcm_token', fcmToken);
      // TODO: Send the token to your server for later use.
    } else {
      console.log('Failed to get FCM token');
    }
  } catch (error) {
    console.log('Error getting FCM token:', error);
  }
}
