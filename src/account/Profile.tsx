import React, { useEffect, useState } from "react";
import {
	Dimensions,
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
import styles from "./ProfileStyles";
import axios from "axios";
import { BASE_URL } from "../consts";
import Loading from "../layout/Loading";
import { User, UserActionTypes } from "../_redux/reducers/types";
import Toast from "react-native-simple-toast";
import HeaderText from "../layout/HeaderText";
import Footer from "../layout/Footer";
import { Picker } from "@react-native-picker/picker";
import { filter } from "lodash";
import { semi_bold } from "../constants/font";

type MyProps = {
	navigation: any;
	user: User;
	token: string;
	updateProfile: (user: User) => void;
};

const Profile = ({ navigation, user, token, updateProfile }: MyProps) => {
	const [isActive, setIsActive] = useState(0);
	const [year, setYear] = useState(user.user_year);
	const [state, setState] = useState(user.user_state);
	const [college, setCollege] = useState(user.user_college);
	const [loading, setLoading] = useState(false);
	const [states, setStates] = useState([]);
	const [collegesO, setCollegesO] = useState([]);
	const [colleges, setColleges] = useState([]);

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
			},
		);
	};

	const getColleges = () => {
		axios.get(`${BASE_URL}/colleges`).then(
			(res) => {
				if (res.data.success === "loaded") {
					setCollegesO(res.data.colleges);
					setColleges(res.data.colleges);
					// const filters = filter(collegesO, ['state_id', state?.toString()])
					// setColleges(filters)
				}
			},
			(error) => {
				Toast.show("Network error. Tryagain.", Toast.LONG);
			},
		);
	};

	const changeState = (value: string) => {
		setState(value);
		const filters = filter(collegesO, ["state_id", parseInt(value)]);
		setColleges(filters);
	};

	const submitForm = (name: string, email: string, phone: string) => {
		if (year === "") Toast.show("Graduation Year Required", Toast.LONG);
		else if (state === "") Toast.show("State Required", Toast.LONG);
		else if (college === "") Toast.show("College Required", Toast.LONG);
		else {
			setLoading(true);

			axios
				.post(`${BASE_URL}/profile?api_token=${token}`, {
					user_id: user.user_id,
					name: name,
					email: email,
					phone: phone,
					college: college?.toString(),
					state: state?.toString(),
					year: year,
				})
				.then((response) => {
					setLoading(false);

					if (response.data.success) {
						updateProfile({
							user_id: user.user_id,
							user_name: name,
							user_email: email,
							user_phone: phone,
							user_college: college,
							user_state: state,
							user_year: year,
						});
						Toast.show(response.data.message, Toast.LONG);
					} else {
						Toast.show(response.data.error, Toast.LONG);
					}
				})
				.catch((error) => {
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
	});

	return (
		<View style={styles.container}>
			<Loading
				loading={loading}
				text="Updating your account. Please wait."
			/>
			<HeaderText navigation={navigation} heading="Profile" />
			<ScrollView contentContainerStyle={styles.scroller}>
				<Formik
					initialValues={{
						name: user.user_name,
						email: user.user_email,
						phone: user.user_phone,
					}}
					validationSchema={loginValidationSchema}
					onSubmit={(values) =>
						submitForm(values.name, values.email, values.phone)
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
										? [
												styles.singleInput,
												styles.singleInputA,
										  ]
										: styles.singleInput
								}
							>
								<AntDesign
									name="user"
									size={20}
									color={
										isActive === 1 || values.name
											? "#22bdc1"
											: "#888888"
									}
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
										? [
												styles.singleInput,
												styles.singleInputA,
										  ]
										: styles.singleInput
								}
							>
								<Entypo
									name="email"
									size={20}
									color={
										isActive === 2 || values.email
											? "#22bdc1"
											: "#888888"
									}
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
								/>
							</View>
							{errors.email && touched.email && (
								<Text style={styles.error}>{errors.email}</Text>
							)}
							<View
								style={
									isActive === 3 || values.phone
										? [
												styles.singleInput,
												styles.singleInputA,
										  ]
										: styles.singleInput
								}
							>
								<FontAwesome
									name="phone"
									size={24}
									color={
										isActive === 3 || values.phone
											? "#22bdc1"
											: "#888888"
									}
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
							<View
								style={
									isActive === 5 || state
										? [
												styles.singleInput,
												styles.singleInputA,
										  ]
										: styles.singleInput
								}
							>
								<FontAwesome5
									name="map-marked-alt"
									size={24}
									color={
										isActive === 5 || state
											? "#22bdc1"
											: "#888888"
									}
									style={styles.icons}
								/>
								<Picker
									selectedValue={state}
									onValueChange={(item) => changeState(item)}
									style={{
										width:
											Dimensions.get("window").width - 80,
										color: "#22bdc1",
										fontFamily: semi_bold
									}}
									mode="dropdown"
								>
									<Picker.Item
										label="---- Select State ----"
										value=""
									/>
									{states.map((item: any) => (
										<Picker.Item
											label={item.name}
											value={item.id.toString()}
											key={item.id}
										/>
									))}
								</Picker>
							</View>
							<View
								style={
									isActive === 4 || college
										? [
												styles.singleInput,
												styles.singleInputA,
										  ]
										: styles.singleInput
								}
							>
								<FontAwesome5
									name="university"
									size={24}
									color={
										isActive === 4 || college
											? "#22bdc1"
											: "#888888"
									}
									style={styles.icons}
								/>
								<Picker
									selectedValue={college}
									onValueChange={(item) => setCollege(item)}
									style={{
										width:
											Dimensions.get("window").width - 80,
										color: "#22bdc1",
										fontFamily: semi_bold
									}}
									mode="dropdown"
								>
									<Picker.Item
										label="---- Select College ----"
										value=""
									/>
									{colleges.map((item: any) => (
										<Picker.Item
											label={item.name}
											value={item.id.toString()}
											key={item.id}
										/>
									))}
								</Picker>
							</View>
							<View
								style={
									isActive === 6 || year
										? [
												styles.singleInput,
												styles.singleInputA,
										  ]
										: styles.singleInput
								}
							>
								<AntDesign
									name="calendar"
									size={24}
									color={
										isActive === 6 || year
											? "#22bdc1"
											: "#888888"
									}
									style={styles.icons}
								/>
								<Picker
									selectedValue={year}
									onValueChange={(item) => setYear(item)}
									style={{
										width:
											Dimensions.get("window").width - 80,
										color: "#22bdc1",
										fontFamily: semi_bold
									}}
									mode="dropdown"
								>
									<Picker.Item
										label="---- Select Graduation Year ----"
										value=""
									/>
									<Picker.Item
										label="First Year"
										value="First Year"
									/>
									<Picker.Item
										label="Second Year"
										value="Second Year"
									/>
									<Picker.Item
										label="Third Year"
										value="Third Year"
									/>
									<Picker.Item
										label="Fourth Year"
										value="Fourth Year"
									/>
									<Picker.Item
										label="Intern"
										value="Intern"
									/>
									<Picker.Item
										label="Post Intern"
										value="Post Intern"
									/>
									<Picker.Item
										label="PG Scholar"
										value="PG Scholar"
									/>
									<Picker.Item
										label="Physician"
										value="Physician"
									/>
								</Picker>
							</View>
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

const mapDispatchToProps = (dispatch: any) => ({
	updateProfile: (user: any) => {
		dispatch({
			type: UserActionTypes.UPDATE_PROFILE,
			payload: {
				user,
			},
		});
	},
});

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
