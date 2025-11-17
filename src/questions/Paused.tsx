import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import { BASE_URL } from "../consts";
import styles from "./SubjectStyles";
import { Feather } from "@expo/vector-icons";
import { User } from "../_redux/reducers/types";
import Toast from "react-native-simple-toast";
import InputSearch from "../components/InputSearch";

type MyProps = {
	navigation: any;
	user: User;
	token: string;
	subId: number;
};

const Paused = ({ navigation, user, token, subId }: MyProps) => {
	const [paused, setPaused] = useState([]);
	const [filteredArray, setFilteredArray] = useState([]);

	useEffect(() => {
		getPaused();

		const unsubscribe = navigation.addListener("focus", () => {
			getPaused();
		});

		return unsubscribe;
	}, [navigation]);

	const getPaused = () => {
		axios
			.get(
				`${BASE_URL}/paused/${subId}/${user.user_id}?api_token=${token}`,
			)
			.then(
				(res) => {
					setPaused(res.data.paused);
					setFilteredArray(res.data.paused);
				},
				(error) => {
					Toast.show("Network error. Tryagain.", Toast.LONG);
				},
			);
	};

	const startOrReview = (chapterId: number, qcount: number) => {
		navigation.navigate("QStart", {
			subId: subId,
			chapterId: chapterId,
			totalQues: qcount,
		});
	};

	const startSearch = (text: string) => {
		if (text === "") {
			setFilteredArray(paused);
		} else {
			const filteredData = paused.filter((item: any) =>
				item.name.toLowerCase().includes(text.toLowerCase()),
			);
			setFilteredArray(filteredData);
		}
	};

	return (
		<View style={styles.content}>
			{paused.length > 0 ? (
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
									<Feather
										name="arrow-right"
										size={22}
										color="#ffffff"
										style={styles.startArrow}
									/>
								</TouchableOpacity>
							</View>
						)}
						keyExtractor={(item) => item.name}
					/>
				</>
			) : (
				<View style={styles.scroller}>
					<Text>No paused items found</Text>
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

export default connect(mapStateToProps)(Paused);
