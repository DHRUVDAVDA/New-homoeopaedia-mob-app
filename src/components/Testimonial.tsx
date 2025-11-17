import React from "react";
import { StyleSheet, View, Text, Image , TouchableOpacity} from "react-native";
import { WEB_URL } from "../consts";
import { regular } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
	navigation: any;
	data: any;
	from?: string;
	viewPopup: any;
};

const Testimonial = ({
	navigation,
	data,
	from = "home",
	viewPopup,
}: MyProps) => {
	return (
		<View style={from === "home" ? styles.card : styles.twoCard}>
			<TouchableOpacity onPress={() => viewPopup(data)}>
				<Image
					source={{ uri: `${WEB_URL}${data.image}` }}
					style={styles.userImg}
				/>
				<Text style={styles.cardTitle}>
					{data.name}, {data.title}
				</Text>
				<Text style={styles.bgWhite} numberOfLines={2}>
					{data.descr}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#0F5456",
		padding: 10,
		borderRadius: 10,
		marginLeft: 20,
		marginRight: 5,
		marginBottom: 10,
		marginTop: 10,
		maxWidth: 200,
	},
	twoCard: {
		borderRadius: 10,
		flex: 1,
		backgroundColor: "#22bdc1",
		marginBottom: 5,
		marginTop: 10,
		padding: 10,
		marginHorizontal: 5,
	},
	userImg: {
		width: 75,
		height: 75,
		resizeMode: "cover",
		borderRadius: 75 / 2,
	},
	cardTitle: {
		fontSize: moderateScale(11),
		color: "#ffffff",
		marginVertical: 5,
		fontFamily: regular
	},
	bgWhite: {
		color: "#FFFFFF",
		fontFamily: regular,
		fontSize: moderateScale(13)
	},
});

export default Testimonial;
