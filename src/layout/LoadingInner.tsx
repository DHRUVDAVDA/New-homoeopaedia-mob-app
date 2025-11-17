import React from "react";
import { StyleSheet, View, Modal, ActivityIndicator, Text } from "react-native";

const LoadingInner = (props: any) => {
	const { loading, text } = props;

	return (
		<View style={styles.activityIndicatorWrapper}>
			<ActivityIndicator
				animating={loading}
				color="#000000"
				size="large"
			/>
			<Text style={styles.title}>{text}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	activityIndicatorWrapper: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		textAlign: "center",
	},
});

export default LoadingInner;
