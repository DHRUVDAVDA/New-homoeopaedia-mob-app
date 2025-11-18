import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import styles from "./Styles";
import axios from "axios";
import { BASE_URL } from "../consts";
import Loading from "../layout/Loading";
import { User, UserActionTypes } from "../_redux/reducers/types";
import { CommonActions } from "@react-navigation/routers";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

type MyProps = {
  navigation: any;
  logIn: (isAuthenticated: boolean, user: User, token: string) => void;
};

const Login = ({ navigation, logIn }: MyProps) => {
  const [isActive, setIsActive] = useState(0);
  const [loading, setLoading] = useState(false);
  // const submitForm = async (email: string, password: string) => {
  // 	setLoading(true);
  // 	console.log('loginnew')
  // 	const fcmToken = await AsyncStorage.getItem('fcm_token');

  // 	axios
  // 		.post(`${BASE_URL}/loginnew`, {
  // 			phone: email,
  // 			password: password,
  // 			fcm_token: fcmToken
  // 		})
  // 		.then((response) => {
  // 			setLoading(false);
  // 			console.log("login res", response)
  // 			if (response?.data.success) {
  // 				logIn(true, response?.data.user_data, response?.data.token);

  // 				const resetAction = CommonActions.reset({
  // 					index: 0,
  // 					routes: [{ name: "Home" }],
  // 				});
  // 				// sendFCMToken(response?.data.user_data.user_id)
  // 				navigation.dispatch(resetAction);
  // 			} else {
  // 				Alert.alert(response?.data.error);
  // 				// Toast.show(response?.data.error, Toast.LONG);
  // 			}
  // 		})
  // 		.catch((error) => {
  // 			console.log(error)
  // 			setLoading(false);
  // 			Toast.show(`Network error. Tryagain.${error}`, Toast.LONG);
  // 		});
  // };

  const submitForm = async (
    email: string,
    password: string,
    forceLogin = false
  ) => {
    setLoading(true);
    const fcmToken = await AsyncStorage.getItem("fcm_token");

    axios
      .post(`${BASE_URL}/student-login`, {
        phone: email,
        password: password,
        fcm_token: fcmToken,
        force_login: forceLogin,
      })
      .then((response) => {
        setLoading(false);
        const res = response?.data;

        if (res.status === "success" && res.success) {
          logIn(true, res.user_data, res.token);
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
          navigation.dispatch(resetAction);
        } else if (res.status === "already_logged_in") {
          Alert.alert("Already Logged In", res.message, [
            { text: "Cancel", style: "cancel" },
            {
              text: "Continue Here",
              onPress: () => submitForm(email, password, true),
            },
          ]);
        } else if (res.error) {
          Alert.alert("Login Error", res.error);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show(`Network error. Try again.`, Toast.LONG);
      });
  };

  const sendFCMToken = async (userid) => {
    const fcmToken = await AsyncStorage.getItem("fcm_token");
    try {
      await axios
        .post(`${BASE_URL}/store-fcm-token`, {
          user_id: userid,
          token: fcmToken,
        })
        .then((res) => {
          console.log("Token sent to server");
        });
    } catch (err) {
      console.error("Error storing FCM token", err);
    }
  };

  const loginValidationSchema = yup.object().shape({
    email: yup.string().required("Phone number is required"),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
  });

  return (
    <KeyboardAvoidingView style={styles.keyContainer} behavior="height" enabled>
      <Loading loading={loading} text="Checking your account. Please wait." />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image style={styles.image} source={require("../../assets/logo.png")} />
        <Text style={styles.heading}>Welcome back!</Text>
        <Text style={styles.subHeading}>Log in to your existing account</Text>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => submitForm(values.email, values.password)}
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
                  isActive === 1 || values.email
                    ? [styles.singleInput, styles.singleInputA]
                    : styles.singleInput
                }
              >
                <AntDesign
                  name="user"
                  size={20}
                  color={isActive === 1 || values.email ? "#22bdc1" : "#888888"}
                  style={styles.icons}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  onChangeText={handleChange("email")}
                  onFocus={() => setIsActive(1)}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
              <View
                style={
                  isActive === 2 || values.password
                    ? [styles.singleInput, styles.singleInputA]
                    : styles.singleInput
                }
              >
                <AntDesign
                  name="unlock"
                  size={20}
                  color={
                    isActive === 2 || values.password ? "#22bdc1" : "#888888"
                  }
                  style={styles.icons}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onFocus={() => setIsActive(2)}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
              {errors.password && touched.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://homoeopaedia.com/forgot")
                }
              >
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>LOG IN</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <View style={styles.signUp}>
          <Text style={styles.dontaccnt}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  logIn: (isAuthenticated: any, user: any, token: any) => {
    dispatch({
      type: UserActionTypes.LOGIN,
      payload: {
        isAuthenticated,
        user,
        token,
      },
    });
  },
});

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
