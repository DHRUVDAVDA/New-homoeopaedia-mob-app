import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/configureStore";
import AppNavigator from "./AppNavigator";
// import NotificationController from "./NotificationController.android";
import { StatusBar } from "expo-status-bar";
import { CaptureProtection } from "react-native-capture-protection";
import { useFonts } from "expo-font";
import { View, ActivityIndicator, Alert } from "react-native";

import messaging from "@react-native-firebase/messaging";
import { requestUserPermission } from "./NotificationService";

import { navigate } from "./src/NavigationService";

export default function App() {
  useEffect(() => {
    requestUserPermission();

    // Foreground message handler
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   const { title, body } = remoteMessage.notification;
    //   Alert.alert(title || 'Notification', body || 'You have a new message');
    // });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { title, body } = remoteMessage?.notification;
      console.log(remoteMessage);
      const item = {
        id: remoteMessage?.data?.id,
        image: remoteMessage?.data?.image,
        title: remoteMessage?.data?.title,
        descr: remoteMessage?.data?.descr,
        created_at: remoteMessage?.data?.created_at,
      };
      const shortDescr =
        remoteMessage?.data?.descr?.length > 100
          ? remoteMessage.data.descr.slice(0, 100) + "..."
          : remoteMessage.data.descr;

      Alert.alert(
        title || "Notification",
        shortDescr || "You have a new message",
        [
          {
            text: "View More",
            onPress: () => {
              navigate("NotiDetail", { item });
            },
          },
          {
            text: "Dismiss",
            style: "cancel",
          },
        ],
        { cancelable: true },
      );
    });

    // // Background & quit state message handler
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });

    // return unsubscribe;

    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log("Opened from background:", remoteMessage);
        if (remoteMessage?.data) {
          const item = {
            id: remoteMessage.data.id,
            image: remoteMessage.data.image,
            title: remoteMessage.data.title,
            descr: remoteMessage.data.descr,
            created_at: remoteMessage.data.created_at,
          };
          navigate("NotiDetail", { item });
        }
      },
    );

    // Quit state notification tap
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data) {
          console.log("Opened from quit state:", remoteMessage);
          const item = {
            id: remoteMessage.data.id,
            image: remoteMessage.data.image,
            title: remoteMessage.data.title,
            descr: remoteMessage.data.descr,
            created_at: remoteMessage.data.created_at,
          };
          navigate("NotiDetail", { item });
        }
      });

    // Background message handler (for completeness)
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Background message received:", remoteMessage);
    });

    return () => {
      unsubscribe();
      unsubscribeOpened();
    };
  }, []);

  useEffect(() => {
    CaptureProtection.prevent({
      screenshot: true,
      record: true,
      appSwitcher: true,
    });

    return () => {
      CaptureProtection.allow();
    };
  }, []);

  // Load Fonts
  const [fontsLoaded] = useFonts({
    "Lato-Black": require("./assets/fonts/Lato-Black.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
    "Lato-Light": require("./assets/fonts/Lato-Light.ttf"),
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Black": require("./assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  });

  // Show loading indicator until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar translucent backgroundColor="transparent" style="light" />
        {/* <NotificationController /> */}
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
