import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Text, Linking } from "react-native";
import Video from "../components/Video";
import axios from "axios";
import { BASE_URL, WEB_URL } from "../consts";
import { connect } from "react-redux";
import Loading from "../layout/Loading";
import Toast from "react-native-simple-toast";
import { User } from "../_redux/reducers/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import HeaderBack from "../layout/HeaderBack";
import Footer from "../layout/Footer";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
	navigation: any;
	user: User;
	token: string;
	route: any;
};

const Paid = ({ navigation, user, token, route }: MyProps) => {
	const { subject_id } = route.params;
	const [video, setVideo] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getVideo();
	}, []);

	const getVideo = () => {
		axios
			.get(
				`${BASE_URL}/vimeoallnew/${subject_id}/${user.user_id}?api_token=${token}`,
			)
			.then(
				(res) => {
					setVideo(res.data.video);
					setLoading(false);
				},
				(error) => {
					setLoading(false);
					Toast.show("Network error. Tryagain.", Toast.LONG);
				},
			);
	};

	return (
		<View style={styles.container}>
			<Loading loading={loading} text="Loading contents. Please wait." />
			<HeaderBack navigation={navigation} heading="Videos" />
			<View style={styles.content}>
				{video.length > 0 ? (
					<FlatList
						data={video}
						renderItem={({ item }) => (
							<Video
								navigation={navigation}
								videos={item}
								from="vimeo"
							/>
						)}
						keyExtractor={(item) => `key${item.id}`}
						numColumns={2}
						showsVerticalScrollIndicator={false}
					/>
				) : (
					<View style={styles.flex}>
						<TouchableOpacity
							onPress={() => {
								Linking.openURL(`${WEB_URL}/plans`);
							}}
						>
							<Text style={styles.upgrade}>
								Upgrade to Premium
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
			<Footer navigation={navigation} page={`Video`} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	content: {
		margin: 20,
		marginTop: 0,
		marginBottom: 0,
		flex: 1,
	},
	flex: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	upgrade: {
		backgroundColor: "#22bdc1",
		color: "#FFFFFF",
		textAlign: "center",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 10,
		fontSize: moderateScale(16),
	},
});

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(Paid);
