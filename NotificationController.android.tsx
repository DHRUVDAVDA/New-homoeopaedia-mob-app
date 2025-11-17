import { useEffect } from "react";
// import PushNotification from "react-native-push-notification";
import PushNotification from "react-native-push-notification";
import messaging from "@react-native-firebase/messaging";

PushNotification.createChannel(
  {
    channelId: "homoeopaedia-fcm",
    channelName: "Homoeopaedia FCM",
    channelDescription: "A channel for push notification",
    playSound: true,
    soundName: "default",
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`createChannel returned ${created}`)
);

const NotificationController = (props: any) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      PushNotification.localNotification({
        message: remoteMessage.notification?.body || remoteMessage.data?.body,
        title: remoteMessage.notification?.title || remoteMessage.data?.title,
        bigPictureUrl:
          remoteMessage.notification?.android?.imageUrl ||
          remoteMessage.data?.imageUrl,
        smallIcon: "ic_notification", // Ensure this icon exists in Android resources
        channelId: "homoeopaedia-fcm", // Hardcoded channel ID
        vibrate: true,
        playSound: true,
        soundName: "default",
      });
    });

    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
