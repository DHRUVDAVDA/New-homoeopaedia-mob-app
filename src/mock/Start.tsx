import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Animated,
	Modal,
	Pressable,
	Dimensions,
	TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../consts";
import { connect } from "react-redux";
import styles from "../questions/StartStyles";
import Loading from "../layout/Loading";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { User } from "../_redux/reducers/types";
import HTML from "react-native-render-html";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-simple-toast";
import { crct_bg_clr, wrng_bg_clr } from "../constants/colors";

type MyProps = {
	navigation: any;
	route: any;
	token: string;
	user: User;
};

const Start = ({ navigation, route, token, user }: MyProps) => {
	const { titleId, totalQues } = route.params;
	const [index, setIndex] = useState(0);
	const [questions, setQuestions] = useState([]);
	const [circle, setCircle] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingR, setLoadingR] = useState(false);
	const [optcolor, setOptcolor] = useState("#ffffff");
	const [optid, setOptid] = useState(0);
	const [optselected, setOptselected] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [type, setType] = useState("");
	const [issue, setIssue] = useState("");

	useEffect(() => {
		getQuestions();
	}, []);

	const getQuestions = () => {
		axios
			.get(
				`${BASE_URL}/tload/${titleId}/${user.user_id}?api_token=${token}`,
			)
			.then(
				(res) => {
					setQuestions(res?.data?.questions);
					getCircle();
					setLoading(false);
				},
				(error) => {
					setLoading(false);
					Toast.show("Network error. Tryagain.", Toast.LONG);
				},
			);
	};

	const getCircle = () => {
		axios
			.get(
				`${BASE_URL}/tcircle/${titleId}/${user.user_id}?api_token=${token}`,
			)
			.then(
				(res) => {
					setCircle(res?.data?.circle);
				},
				(error) => {
					console.log(error);
				},
			);
	};

	const saveAnswer = (option: number) => {
		setLoading(true);

		axios
			.post(`${BASE_URL}/savetanswer?api_token=${token}`, {
				user_id: user.user_id,
				title_id: titleId,
				ques_id: questions[index]["id"],
				option_id: option,
			})
			.then((response) => {
				setLoading(false);

				if (response?.data?.success) {
					getCircle();
					setOptid(option);

					if (option == questions[index]["correct_ans"])
						setOptcolor(crct_bg_clr);
					else setOptcolor(wrng_bg_clr);

					setTimeout(() => {
						setOptselected(true);
					}, 1000);
				} else {
					Toast.show(response?.data?.error, Toast.LONG);
				}
			})
			.catch((error) => {
				setLoading(false);
				Toast.show("Network error. Tryagain.", Toast.LONG);
			});
	};

	const nextQuestion = () => {
		const totalQuestion = questions?.length;

		if (index != totalQuestion - 1) {
			setOptselected(false);
			setIndex(index + 1);
		}
	};

	const finishQuestion = () => {
		setLoading(true);

		axios
			.post(`${BASE_URL}/completetsection?api_token=${token}`, {
				user_id: user.user_id,
				title_id: titleId,
			})
			.then((response) => {
				setLoading(false);

				if (response?.data?.success) {
					navigation.goBack();
				} else {
					Toast.show(response?.data?.error, Toast.LONG);
				}
			})
			.catch((error) => {
				setLoading(false);
				Toast.show("Network error. Tryagain.", Toast.LONG);
			});
	};

	// const loadCircle = (balance: any) => {
	//   for (let i = 0; i < balance; i++) {
	//     return <View key={i} style={[styles.circle, styles.circleGrey]}></View>
	//   }
	// }

	const saveReport = (quesID: number) => {
		if (!type) Toast.show("Report type required.", Toast.LONG);
		else if (!issue) Toast.show("Elaborate issue required.", Toast.LONG);
		else {
			setLoadingR(true);

			axios
				.post(`${BASE_URL}/report?api_token=${token}`, {
					user_id: user?.user_id,
					quesID: quesID,
					type: type,
					issue: issue,
				})
				.then((response) => {
					setModalVisible(false);
					setLoadingR(false);

					Toast.show("Question successfully reported.", Toast.LONG);
				})
				.catch((error) => {
					setLoadingR(false);
					Toast.show("Network error. Tryagain.", Toast.LONG);
				});
		}
	};

	return (
		<View style={styles.container}>
			<Loading loading={loading} text="Loading questions. Please wait." />
			<Loading loading={loadingR} text="Reporting. Please wait." />
			{!loading && (
				<>
					<View style={styles.contentContainer}>
						<View style={styles.header}>
							<Text style={styles.logo}>Homoeopaedia</Text>
							<TouchableOpacity
								onPress={() => navigation.goBack()}
							>
								<FontAwesome
									name="close"
									size={24}
									color="#22bdc1"
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.corw}>
							<View style={styles.sameline}>
								<View style={styles.progressBar}>
									<Animated.View
										style={{
											backgroundColor: "#22bdc1",
											width: `${(
												(circle?.length / totalQues) *
												100
											).toFixed(2)}%`,
										}}
									/>
								</View>
							</View>
							<Text style={styles.remaining}>
								{totalQues - circle?.length}
							</Text>
						</View>
						{!optselected ? (
							<ScrollView contentContainerStyle={styles.scroller}>
								<HTML
									source={{
										html: `${circle?.length + 1}) ${
											questions[index]["ques"]
										}`,
									}}
								/>
								<View>
									{questions?.[index]?.["options"]?.map(
										(item: any, i: number) => (
											<TouchableOpacity
												onPress={() =>
													saveAnswer(item?.option_id)
												}
												key={i}
												style={[
													styles.singleOption,
													{
														backgroundColor:
															optid ==
															item?.option_id
																? optcolor
																: "#ffffff",
													},
												]}
											>
												<Text
													style={{
														color:
															optid ==
															item?.option_id
																? "#ffffff"
																: "#000000",
													}}
												>
													{item?.option}
												</Text>
											</TouchableOpacity>
										),
									)}
								</View>
							</ScrollView>
						) : (
							<>
								<ScrollView
									contentContainerStyle={styles.scroller}
								>
									<HTML
										source={{
											html: `${circle?.length}) ${questions?.[index]?.["ques"]}`,
										}}
									/>
									{questions?.[index]?.["options"]?.map(
										(item: any, i: number) =>
											optid == item?.option_id &&
											item?.option_id ==
												questions?.[index]?.[
													"correct_ans"
												] ? (
												<View
													key={i}
													style={[
														styles.iconOption,
														{
															backgroundColor:
																crct_bg_clr,
															paddingBottom: 5,
															marginTop: 5,
														},
													]}
												>
													<Ionicons
														name="checkmark-circle"
														size={18}
														color="white"
														style={styles.icon}
													/>
													<Text
														style={[
															styles.singlOptExp,
															styles.whiteNew,
														]}
													>
														{item?.option}
													</Text>
												</View>
											) : optid == item?.option_id &&
											  item?.option_id !=
													questions?.[index]?.[
														"correct_ans"
													] ? (
												<View
													key={i}
													style={[
														styles.iconOption,
														{
															backgroundColor:
																wrng_bg_clr,
															paddingBottom: 5,
															marginTop: 5,
														},
													]}
												>
													<Entypo
														name="circle-with-cross"
														size={18}
														color="white"
														style={styles.icon}
													/>
													<Text
														style={[
															styles.singlOptExp,
															styles.whiteNew,
														]}
													>
														{item?.option}
													</Text>
												</View>
											) : (
												<View
													key={i}
													style={styles.iconOption}
												>
													{item?.option_id ==
													questions?.[index]?.[
														"correct_ans"
													] ? (
														<View
															style={[
																styles.iconOption,
																{
																	backgroundColor:
																		crct_bg_clr,
																	paddingBottom: 5,
																	paddingRight: 5,
																	marginTop: 5,
																	flex: 1,
																},
															]}
														>
															<Ionicons
																name="checkmark-circle"
																size={18}
																color="white"
																style={
																	styles.icon
																}
															/>
															<Text
																style={[
																	styles.singlOptExp,
																	styles.whiteNew,
																]}
															>
																{item?.option}
															</Text>
														</View>
													) : (
														<Text
															style={[
																styles.singlOptExp,
																item?.option_id ==
																questions?.[
																	index
																]?.[
																	"correct_ans"
																]
																	? styles.green
																	: styles.black,
															]}
														>
															{item?.option}
														</Text>
													)}
												</View>
											),
									)}
									{questions?.[index]?.["explain"] && (
										<View style={styles.explain}>
											<HTML
												source={{
													html: questions?.[index]?.[
														"explain"
													],
												}}
											/>
										</View>
									)}
									<TouchableOpacity
										onPress={() =>
											setModalVisible(!modalVisible)
										}
									>
										<Text style={styles.report}>
											Report this Question
										</Text>
									</TouchableOpacity>
								</ScrollView>
								<Modal
									animationType="slide"
									transparent={true}
									visible={modalVisible}
									onRequestClose={() => {
										setModalVisible(!modalVisible);
									}}
								>
									<View style={styles.centeredView}>
										<View style={styles.modalView}>
											<Text style={styles.modalText}>
												Feedback/Report Error
											</Text>
											<Text style={styles.label}>
												What are you reporting?
											</Text>
											<View
												style={{
													alignSelf: "flex-start",
													borderWidth: 1,
													borderColor: "#000000",
													marginTop: 10,
													marginBottom: 10,
												}}
											>
												<Picker
													selectedValue={type}
													onValueChange={(item) =>
														setType(item)
													}
													style={{
														width:
															Dimensions.get(
																"window",
															).width - 80,
													}}
													mode="dropdown"
												>
													<Picker.Item
														label="---- Select Type ----"
														value=""
													/>
													<Picker.Item
														label="Factual error"
														value="Factual error"
													/>
													<Picker.Item
														label="Confusing question"
														value="Confusing question"
													/>
													<Picker.Item
														label="Inadequate explanation"
														value="Inadequate explanation"
													/>
												</Picker>
											</View>
											<Text style={styles.label}>
												Elaborate issue
											</Text>
											<TextInput
												multiline={true}
												value={issue}
												onChangeText={(e) =>
													setIssue(e)
												}
												style={styles.issue}
											/>
											<View style={styles.modalButtons}>
												<Pressable
													onPress={() =>
														saveReport(
															questions?.[
																index
															]?.["id"],
														)
													}
													style={[
														styles.button,
														styles.buttonSend,
														styles.mr10,
													]}
												>
													<Text
														style={styles.textStyle}
													>
														Send
													</Text>
												</Pressable>
												<Pressable
													style={[
														styles.clsbutton,
														styles.buttonClose,
														styles.ml10,
													]}
													onPress={() =>
														setModalVisible(
															!modalVisible,
														)
													}
												>
													<Text
														style={styles.clstextStyle}
													>
														Close
													</Text>
												</Pressable>
											</View>
										</View>
									</View>
								</Modal>
								<TouchableOpacity
									onPress={() => {
										index == questions?.length - 1
											? finishQuestion()
											: nextQuestion();
									}}
								>
									<Text style={styles.nextBtn}>
										{index == questions?.length - 1
											? "Finish"
											: "Next"}
									</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</>
			)}
		</View>
	);
};

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(Start);
