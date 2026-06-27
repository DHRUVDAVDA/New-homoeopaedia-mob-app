import React, { useEffect, useState, useMemo } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import styles from "./Styles";
import axios from "axios";
import { BASE_URL } from "../consts";
import Loading from "../layout/Loading";
import { UserActionTypes } from "../_redux/reducers/types";
import { CommonActions } from "@react-navigation/routers";
import Toast from "react-native-simple-toast";
import { SelectPicker } from "../components/SelectPicker";
import { filter } from "lodash";

const yearItems = [
  { label: "First Year", value: "First Year" },
  { label: "Second Year", value: "Second Year" },
  { label: "Third Year", value: "Third Year" },
  { label: "Fourth Year", value: "Fourth Year" },
  { label: "Intern", value: "Intern" },
  { label: "Post Intern", value: "Post Intern" },
  { label: "PG Scholar", value: "PG Scholar" },
  { label: "Physician", value: "Physician" },
];

type MyProps = {
  navigation: any;
  logIn: any;
};

const Register = ({ navigation, logIn }: MyProps) => {
  const [isActive, setIsActive] = useState(0);
  const [year, setYear] = useState("");
  const [state, setState] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [collegesO, setCollegesO] = useState([]);
  const [colleges, setColleges] = useState([]);

  const stateItems = useMemo(() => {
    return states.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  }, [states]);

  const collegeItems = useMemo(() => {
    return colleges.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  }, [colleges]);

  useEffect(() => {
    getState();
    getColleges();
  }, []);

  const getState = () => {
    axios.get(`${BASE_URL}/state`).then(
      (res) => {
        if (res.data.success === "loaded") setStates(res.data.state);
      },
      (error) => {
        Toast.show("Network error. Tryagain.", Toast.LONG);
      }
    );
  };

  const getColleges = () => {
    axios.get(`${BASE_URL}/colleges`).then(
      (res) => {
        if (res.data.success === "loaded") {
          setCollegesO(res.data.colleges);
          setColleges(res.data.colleges);
        }
      },
      (error) => {
        Toast.show("Network error. Tryagain.", Toast.LONG);
      }
    );
  };

  const changeState = (value: number) => {
    setState(value);
    const filters = filter(collegesO, ["state_id", parseInt(value)]);
    setColleges(filters);
  };

  const submitForm = (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => {
    if (year === "") Toast.show("Graduation Year Required", Toast.LONG);
    else if (state === "") Toast.show("State Required", Toast.LONG);
    else if (college === "") Toast.show("College Required", Toast.LONG);
    else {
      setLoading(true);

      axios
        .post(`${BASE_URL}/register`, {
          name: name,
          email: email,
          phone: phone,
          college: college?.toString(),
          state: state?.toString(),
          year: year,
          password: password,
        })
        .then((response) => {
          setLoading(false);
          console.log("ressssss",response);

          if (response.data.success) {
            logIn(false, response.data.user_data, response.data.token);

            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{ name: "Otp" }],
            });
            navigation.dispatch(resetAction);
          } else {
            Toast.show(response.data.error, Toast.LONG);
          }
        })
        .catch((error) => {
          console.log("errorrr",error);
          setLoading(false);
          Toast.show("Network error. Tryagain.", Toast.LONG);
        });
    }
  };

  const loginValidationSchema = yup.object().shape({
    name: yup.string().required("Name is Required"),
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
    phone: yup
      .string()
      .length(10, "Phone Number must be 10 digits")
      .required("Phone Number is Required"),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
    confirm: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <KeyboardAvoidingView style={styles.keyContainer} behavior="height" enabled>
      <Loading loading={loading} text="Creating your account. Please wait." />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <AntDesign name="rollback" size={30} color="black" />
        </TouchableOpacity>
        <Image style={styles.image} source={require("../../assets/logo.png")} />
        <Text style={styles.heading}>Let's Get Started!</Text>
        <Text style={styles.subHeading}>
          Create an account to get all features
        </Text>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            password: "",
            confirm: "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) =>
            submitForm(values.name, values.email, values.phone, values.password)
          }
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
                  isActive === 1 || values.name
                    ? [styles.singleInput, styles.singleInputA]
                    : styles.singleInput
                }
              >
                <AntDesign
                  name="user"
                  size={20}
                  color={isActive === 1 || values.name ? "#22bdc1" : "#888888"}
                  style={styles.icons}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  onChangeText={handleChange("name")}
                  onFocus={() => setIsActive(1)}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
              </View>
              {errors.name && touched.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}
              <View
                style={
                  isActive === 2 || values.email
                    ? [styles.singleInput, styles.singleInputA]
                    : styles.singleInput
                }
              >
                <Entypo
                  name="email"
                  size={20}
                  color={isActive === 2 || values.email ? "#22bdc1" : "#888888"}
                  style={styles.icons}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={handleChange("email")}
                  onFocus={() => setIsActive(2)}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
              <View
                style={
                  isActive === 3 || values.phone
                    ? [styles.singleInput, styles.singleInputA]
                    : styles.singleInput
                }
              >
                <FontAwesome
                  name="phone"
                  size={24}
                  color={isActive === 3 || values.phone ? "#22bdc1" : "#888888"}
                  style={styles.icons}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  onChangeText={handleChange("phone")}
                  onFocus={() => setIsActive(3)}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  keyboardType="number-pad"
                />
              </View>
              {errors.phone && touched.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}
              <SelectPicker
                placeholder="---- Select Graduation Year ----"
                selectedValue={year}
                onValueChange={(item) => {
                  setYear(item);
                  setIsActive(4);
                }}
                items={yearItems}
                icon={
                  <AntDesign
                    name="calendar"
                    size={24}
                    color={isActive === 4 || year ? "#22bdc1" : "#888888"}
                    style={styles.icons}
                  />
                }
                isActive={isActive === 4}
              />
              <SelectPicker
                placeholder="---- Select State ----"
                selectedValue={state}
                onValueChange={(item) => {
                  changeState(item);
                  setIsActive(5);
                }}
                items={stateItems}
                icon={
                  <FontAwesome5
                    name="map-marked-alt"
                    size={24}
                    color={isActive === 5 || state ? "#22bdc1" : "#888888"}
                    style={styles.icons}
                  />
                }
                isActive={isActive === 5}
              />
              <SelectPicker
                placeholder="---- Select College ----"
                selectedValue={college}
                onValueChange={(item) => {
                  setCollege(item);
                  setIsActive(6);
                }}
                items={collegeItems}
                icon={
                  <FontAwesome5
                    name="university"
                    size={24}
                    color={isActive === 6 || college ? "#22bdc1" : "#888888"}
                    style={styles.icons}
                  />
                }
                isActive={isActive === 6}
              />
              <View
                style={
                  isActive === 7 || values.password
                    ? [styles.singleInput, styles.singleInputA]
                    : styles.singleInput
                }
              >
                <AntDesign
                  name="unlock"
                  size={20}
                  color={
                    isActive === 7 || values.password ? "#22bdc1" : "#888888"
                  }
                  style={styles.icons}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onFocus={() => setIsActive(7)}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
              {errors.password && touched.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              <View
                style={
                  isActive === 8 || values.password
                    ? [styles.singleInput, styles.singleInputA]
                    : styles.singleInput
                }
              >
                <AntDesign
                  name="unlock"
                  size={20}
                  color={
                    isActive === 8 || values.password ? "#22bdc1" : "#888888"
                  }
                  style={styles.icons}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  onChangeText={handleChange("confirm")}
                  onFocus={() => setIsActive(8)}
                  onBlur={handleBlur("confirm")}
                  value={values.confirm}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
              {errors.confirm && touched.confirm && (
                <Text style={styles.error}>{errors.confirm}</Text>
              )}
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>CREATE</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <View style={styles.signUp}>
          <Text style={styles.dontaccnt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signupLink}>Login Here</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
