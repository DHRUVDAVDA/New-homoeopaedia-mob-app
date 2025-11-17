import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import { BASE_URL } from "../consts";
import styles from "./SubjectStyles";
import { EvilIcons } from "@expo/vector-icons";
import { User } from "../_redux/reducers/types";
import Toast from "react-native-simple-toast";
import InputSearch from "../components/InputSearch";

type MyProps = {
	navigation: any;
	user: User;
	token: string;
	subId: number;
};

const Completed = ({ navigation, user, token, subId }: MyProps) => {
	const [completed, setCompleted] = useState([]);
	const [filteredArray, setFilteredArray] = useState([]);

	useEffect(() => {
		getCompleted();

		const unsubscribe = navigation.addListener("focus", () => {
			getCompleted();
		});

		return unsubscribe;
	}, [navigation]);

	const getCompleted = () => {
		axios
			.get(
				`${BASE_URL}/completed/${subId}/${user.user_id}?api_token=${token}`,
			)
			.then(
				(res) => {
					setCompleted(res.data.completed);
					setFilteredArray(res.data.completed);
				},
				(error) => {
					Toast.show("Network error. Tryagain.", Toast.LONG);
				},
			);
	};

	const startOrReview = (chapterId: number, qcount: number) => {
		navigation.navigate("QReview", {
			subId: subId,
			chapterId: chapterId,
			totalQues: qcount,
		});
	};

	const startSearch = (text: string) => {
		if (text === "") {
			setFilteredArray(completed);
		} else {
			const filteredData = completed.filter((item: any) =>
				item.name.toLowerCase().includes(text.toLowerCase()),
			);
			setFilteredArray(filteredData);
		}
	};

	return (
		<View style={styles.content}>
			{completed.length > 0 ? (
				<>
					<InputSearch startSearch={startSearch} />
					<FlatList
						data={filteredArray}
						renderItem={({ item }) => (
							<View
								style={[styles.boxContainer, styles.singleList]}
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
								<TouchableOpacity
									onPress={() =>
										startOrReview(item.id, item.qcount)
									}
								>
									<EvilIcons
										name="trophy"
										size={22}
										color="#ffffff"
										style={styles.startTrophy}
									/>
								</TouchableOpacity>
							</View>
						)}
						keyExtractor={(item) => item.name}
					/>
				</>
			) : (
				<View style={styles.scroller}>
					<Text>No completed items found</Text>
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

export default connect(mapStateToProps)(Completed);
