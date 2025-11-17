import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import { BASE_URL } from "../consts";
import Loading from "../layout/Loading";
import styles from "./SubjectStyles";
import { Feather, EvilIcons, AntDesign } from "@expo/vector-icons";
import { User } from "../_redux/reducers/types";
import Toast from "react-native-simple-toast";
import InputSearch from "../components/InputSearch";

type MyProps = {
	navigation: any;
	user: User;
	token: string;
	subId: number;
	subSlug: string;
};

const All = ({ navigation, user, token, subId }: MyProps) => {
	const [chapter, setChapter] = useState([]);
	const [filteredArray, setFilteredArray] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			setLoading(true);
			getChapter();
		});

		return unsubscribe;
	}, [navigation]);

	const getChapter = () => {
		axios
			.get(
				`${BASE_URL}/qchapter/${subId}/${user.user_id}?api_token=${token}`,
			)
			.then(
				(res) => {
					setChapter(res.data.chapter);
					setFilteredArray(res.data.chapter);
					setLoading(false);
				},
				(error) => {
					setLoading(false);
					Toast.show("Network error. Tryagain.", Toast.LONG);
				},
			);
	};

	const startOrReview = (
		chapterId: number,
		qcount: number,
		ccount: number,
	) => {
		if (qcount !== ccount)
			navigation.navigate("QStart", {
				subId: subId,
				chapterId: chapterId,
				totalQues: qcount,
			});
		else if (qcount === ccount)
			navigation.navigate("QReview", {
				subId: subId,
				chapterId: chapterId,
				totalQues: qcount,
			});
	};

	const reAttempt = (chapterId: number, qcount: number) => {
		setLoading(true);

		axios
			.get(
				`${BASE_URL}/qreattempt/${subId}/${chapterId}/${user.user_id}?api_token=${token}`,
			)
			.then(
				(res) => {
					navigation.navigate("QStart", {
						subId: subId,
						chapterId: chapterId,
						totalQues: qcount,
					});

					setLoading(false);
				},
				(error) => {
					setLoading(false);
					Toast.show("Network error. Tryagain.", Toast.LONG);
				},
			);
	};

	const startSearch = (text: string) => {
		if (text === "") {
			setFilteredArray(chapter);
		} else {
			const filteredData = chapter.filter((item: any) =>
				item.name.toLowerCase().includes(text.toLowerCase()),
			);
			setFilteredArray(filteredData);
		}
	};

	return (
		<View style={styles.content}>
			<Loading loading={loading} text="Loading contents. Please wait." />
			{chapter.length > 0 ? (
				!loading && (
					<>
						<InputSearch startSearch={startSearch} />
						<FlatList
							data={filteredArray}
							renderItem={({ item }) => (
								<View
									style={[
										styles.boxContainer,
										styles.singleList,
									]}
								>
									<View style={{ flexShrink: 1 }}>
										<Text style={styles.heading}>
											{item.name}
										</Text>
										<Text style={styles.subheading}>
											{item.qcount} question
											{item.qcount > 1 ? "s" : ""}
										</Text>
									</View>
									<View style={styles.icons}>
										{item.qcount > 0 && (
											<TouchableOpacity
												onPress={() =>
													reAttempt(
														item.id,
														item.qcount,
													)
												}
											>
												{item.ccount ===
													item.qcount && (
													<AntDesign
														name="reload1"
														size={16}
														color="#ffffff"
														style={[
															styles.startTrophy,
															styles.mr10,
														]}
													/>
												)}
											</TouchableOpacity>
										)}
										{item.qcount > 0 && (
											<TouchableOpacity
												onPress={() =>
													startOrReview(
														item.id,
														item.qcount,
														item.ccount,
													)
												}
											>
												{item.ccount === item.qcount ? (
													<EvilIcons
														name="trophy"
														size={22}
														color="#ffffff"
														style={
															styles.startTrophy
														}
													/>
												) : (
													<Feather
														name="arrow-right"
														size={22}
														color="#ffffff"
														style={
															styles.startArrow
														}
													/>
												)}
											</TouchableOpacity>
										)}
									</View>
								</View>
							)}
							keyExtractor={(item) => item.name}
						/>
					</>
				)
			) : (
				<View style={styles.scroller}>
					<Text>No items found</Text>
				</View>
			)}
		</View>
	);
};

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(All);
