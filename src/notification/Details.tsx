import React, { useEffect } from "react";
import { Image, Linking, ScrollView, Text, View, Dimensions } from "react-native";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import HeaderBack from "../layout/HeaderBack";
import Footer from "../layout/Footer";
import styles from "./NotiStyles";
import { BASE_URL, WEB_URL } from "../consts";
import moment from "moment";
import axios from "axios";
import HTML from "react-native-render-html";
import { regular } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

const { width } = Dimensions.get('window');

type MyProps = {
	navigation: any;
	user: User;
	token: string;
	route: any;
};

const Details = ({ navigation, user, token, route }: MyProps) => {
	const { item } = route.params;

	console.log("noti params", route.params)
	useEffect(() => {
		updateNotification();
	}, []);

	const updateNotification = () => {
		axios
			.get(
				`${BASE_URL}/updatenoti/${user.user_id}/${item.id}?api_token=${token}`,
			)
			.then(
				(res) => {
					console.log(res.data);
				},
				(error) => {
					console.log("error");
				},
			);
	};

	const openLink = (event: any, url: string) => {
		Linking.openURL(url);
	};

	return (
		<View style={styles.container}>
			<HeaderBack navigation={navigation} heading="Notification" />
			<ScrollView>
				<Image
					source={{ uri: `${WEB_URL}${item.image}` }}
					style={styles.imageFull}
				/>
				<View style={styles.padding}>
					<Text style={styles.title}>{item.title}</Text>
					<View style={styles.mt10}>
						<HTML
							source={{ html: item.descr }}
							onLinkPress={openLink}
							contentWidth={width}
							tagsStyles={{
								body: { fontFamily: regular, fontSize: moderateScale(14) },
								p: { fontFamily: regular, fontSize: moderateScale(14) },
								span: { fontFamily: regular, fontSize: moderateScale(14) },
							}}
							defaultTextProps={{
								style: { fontFamily: regular, fontSize: moderateScale(14) },
							}}
						/>
					</View>
					<Text style={[styles.mt10, styles.descrtxt]}>
						{moment(item.created_at).format("DD/MM/YYYY")}
					</Text>
				</View>
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

export default connect(mapStateToProps)(Details);
