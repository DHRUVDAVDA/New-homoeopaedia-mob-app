import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { WEB_URL } from "../consts";
import moment from "moment";
import { includes } from "lodash";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import styles from "../notification/NotiStyles";

type MyProps = {
	navigation: any;
	user: User;
	item: any;
};

const Noti = ({ navigation, user, item }: MyProps) => {
	const checkViewed = (views: any) => {
		if (includes(views, user.user_id)) return "#ffffff";
		else return "#22bdc1";
	};

	const convertDescription = (description: string) => {
		const regex = /(<([^>]+)>)/gi;
		const result = description.replace(regex, "");

		return result;
	};

	return (
		<TouchableOpacity
			onPress={() => navigation.navigate("NotiDetail", { item: item })}
			style={[styles.noti, { backgroundColor: checkViewed(item.views) }]}
		>
			<Image
				source={{ uri: `${WEB_URL}${item.image}` }}
				style={styles.image}
			/>
			<View style={styles.flex}>
				<Text
					style={[
						styles.title,
						{
							color:
								checkViewed(item.views) === "#22bdc1"
									? "#FFFFFF"
									: "#000000",
						},
					]}
					numberOfLines={1}
				>
					{item.title}
				</Text>
				<Text
					numberOfLines={1}
					style={[styles.descrtxt, {
						color:
							checkViewed(item.views) === "#22bdc1"
								? "#FFFFFF"
								: "#000000",
					}]}
				>
					{convertDescription(item.descr)}
				</Text>
				<Text
					style={[
						styles.descrtxt,
						checkViewed(item.views) === "#22bdc1" ? styles.dateActive : styles.date
					]}
				>
					{moment(item.created_at).fromNow()}
				</Text>

			</View>
		</TouchableOpacity>
	);
};

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(Noti);
