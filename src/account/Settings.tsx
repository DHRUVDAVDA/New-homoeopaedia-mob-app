import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { connect } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import styles from "./ProfileStyles";
import axios from "axios";
import { BASE_URL } from "../consts";
import Loading from "../layout/Loading";
import { User } from "../_redux/reducers/types";
import Toast from "react-native-simple-toast";
import HeaderText from "../layout/HeaderText";
import Footer from "../layout/Footer";

type MyProps = {
	navigation: any;
	user: User;
	token: string;
};

const Settings = ({ navigation, user, token }: MyProps) => {
	const [isActive, setIsActive] = useState(0);
	const [loading, setLoading] = useState(false);

	const submitForm = (password: string) => {
		setLoading(true);

		axios
			.post(`${BASE_URL}/settings?api_token=${token}`, {
				user_id: user.user_id,
				password: password,
			})
			.then((response) => {
				setLoading(false);

				if (response.data.success) {
					Toast.show(response.data.message, Toast.LONG);
				} else {
					Toast.show(response.data.error, Toast.LONG);
				}
			})
			.catch((error) => {
				setLoading(false);
				Toast.show("Network error. Tryagain.", Toast.LONG);
			});
	};

	const loginValidationSchema = yup.object().shape({
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
		<View style={styles.container}>
			<Loading
				loading={loading}
				text="Updating your settings. Please wait."
			/>
			<HeaderText navigation={navigation} heading="Settings" />
			<ScrollView contentContainerStyle={styles.scroller}>
				<Formik
					initialValues={{
						password: "",
						confirm: "",
					}}
					validationSchema={loginValidationSchema}
					onSubmit={(values) => submitForm(values.password)}
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
									isActive === 1 || values.password
										? [
												styles.singleInput,
												styles.singleInputA,
										  ]
										: styles.singleInput
								}
							>
								<AntDesign
									name="unlock"
									size={20}
									color={
										isActive === 1 || values.password
											? "#22bdc1"
											: "#888888"
									}
									style={styles.icons}
								/>
								<TextInput
									style={styles.input}
									placeholder="Password"
									onChangeText={handleChange("password")}
									onFocus={() => setIsActive(1)}
									onBlur={handleBlur("password")}
									value={values.password}
									secureTextEntry
									autoCapitalize="none"
								/>
							</View>
							{errors.password && touched.password && (
								<Text style={styles.error}>
									{errors.password}
								</Text>
							)}
							<View
								style={
									isActive === 2 || values.password
										? [
												styles.singleInput,
												styles.singleInputA,
										  ]
										: styles.singleInput
								}
							>
								<AntDesign
									name="unlock"
									size={20}
									color={
										isActive === 2 || values.password
											? "#22bdc1"
											: "#888888"
									}
									style={styles.icons}
								/>
								<TextInput
									style={styles.input}
									placeholder="Confirm Password"
									onChangeText={handleChange("confirm")}
									onFocus={() => setIsActive(2)}
									onBlur={handleBlur("confirm")}
									value={values.confirm}
									secureTextEntry
									autoCapitalize="none"
								/>
							</View>
							{errors.confirm && touched.confirm && (
								<Text style={styles.error}>
									{errors.confirm}
								</Text>
							)}
							<TouchableOpacity
								onPress={handleSubmit}
								style={styles.button}
							>
								<Text style={styles.buttonText}>UPDATE</Text>
							</TouchableOpacity>
						</View>
					)}
				</Formik>
			</ScrollView>
			<Footer navigation={navigation} page="" />
		</View>
	);
};

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(Settings);
