import React from "react";
import { View, Text, Image, StyleSheet, Linking ,TouchableOpacity} from "react-native";
import { WEB_URL } from "./consts";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
	navigation: any;
};

const PaidService = ({ navigation }: MyProps) => {
	return (
		<View style={styles.container}>
			<View style={styles.container}>
				<Image
					source={require("../assets/paid.jpg")}
					style={styles.image}
				/>
				<View style={styles.p20}>
					<Text style={styles.heading}>
						This is a premium feature
					</Text>
					<Text style={styles.subheading}>
						Get PREMIUM Plan now for unstoppable learning! Upgrade
						your Medical PG prep with most competitive test series &
						get:
					</Text>
					<Text style={styles.grey}>What you will get:</Text>
					<View style={styles.p10}>
						<Text style={styles.mb10}>
							1. Most competitive mock tests ever.
						</Text>
						<Text style={styles.mb10}>
							2. Latest exam pattern questions to relect the real
							exam challenges.
						</Text>
						<Text style={styles.mb10}>
							3. Solutions crafted with detailed explanations.
						</Text>
						<Text style={styles.mb10}>
							4. Analytics designed to measure real-time
							performance & progress.
						</Text>
						<Text style={styles.mb10}>
							5. Freedom to attempt tests as per your comfort.
						</Text>
						<Text>
							6. Attempt a live test when you feel fully prepared.
						</Text>
					</View>
				</View>
			</View>
			<TouchableOpacity
				style={styles.viewPlans}
				onPress={() => {
					Linking.openURL(`${WEB_URL}/plans`);
				}}
			>
				<Text style={styles.viewText}>View Plans</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<Text style={styles.laterText}>MAYBE LATER</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		width: "100%",
		height: 200,
		resizeMode: "cover",
	},
	p20: {
		padding: 20,
	},
	p10: {
		padding: 10,
	},
	heading: {
		fontSize: moderateScale(18),
		fontWeight: "bold",
		marginBottom: 10,
	},
	subheading: {
		fontSize: moderateScale(16),
		marginBottom: 10,
	},
	grey: {
		fontSize: moderateScale(16),
		color: "#555555",
		marginBottom: 10,
	},
	mb10: {
		marginBottom: 10,
	},
	viewPlans: {
		backgroundColor: "#555555",
		padding: 10,
		borderRadius: 5,
		margin: 20,
	},
	viewText: {
		textAlign: "center",
		color: "#ffffff",
	},
	laterText: {
		textAlign: "center",
		textDecorationLine: "underline",
		marginBottom: 20,
	},
});

export default PaidService;
