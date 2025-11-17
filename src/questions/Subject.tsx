import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import { BASE_URL } from "../consts";
import Footer from "../layout/Footer";
import HeaderText from "../layout/HeaderText";
import Loading from "../layout/Loading";
import styles from "./SubjectStyles";
import Toast from "react-native-simple-toast";
import InputSearch from "../components/InputSearch";

type MyProps = {
	navigation: any;
	token: string;
};

const Subject = ({ navigation, token }: MyProps) => {
	const [subjects, setSubjects] = useState(null);
	const [filteredArray, setFilteredArray] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getSubjects();
	}, []);

	const getSubjects = () => {
		axios.get(`${BASE_URL}/qsubjects?api_token=${token}`).then(
			(res) => {
				setSubjects(res.data.subjects);
				setFilteredArray(res.data.subjects);
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
			setFilteredArray(subjects);
		} else {
			const filteredData = subjects.filter((item: any) =>
				item.name.toLowerCase().includes(text.toLowerCase()),
			);
			setFilteredArray(filteredData);
		}
	};

	return (
		<View style={styles.container}>
			<Loading loading={loading} text="Loading contents. Please wait." />
			<HeaderText navigation={navigation} heading={`Questions`} />
			<View style={styles.content}>
				{subjects?.length > 0 && (
					<InputSearch startSearch={startSearch} />
				)}
				{!loading && (
					<FlatList
						data={filteredArray}
						renderItem={({ item }) =>
							item.chapterCount > 0 && (
								<TouchableOpacity
									onPress={() =>
										navigation.navigate("QChapList", {
											subId: item.id,
											heading: item.name,
											subSlug: item.slug,
										})
									}
									style={styles.boxContainer}
								>
									<Text style={styles.heading}>
										{item.name}
									</Text>
									<Text style={styles.subheading}>
										{item.chapterCount} module
										{item.chapterCount > 1 ? "s" : ""}
									</Text>
								</TouchableOpacity>
							)
						}
						keyExtractor={(item) => item.name}
					/>
				)}
			</View>
			<Footer navigation={navigation} page={`Question`} />
		</View>
	);
};

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(Subject);
