import React, { useMemo, useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import RadioGroup from "react-native-radio-buttons-group";
import { main_font, semi_bold } from "../constants/font";
import { theme_clr } from "../constants/colors";

type MyProps = {
	modalVisible: any;
	setModalVisible: any;
	totalQues: any;
	totalMarks: any;
	confirmFilter: any;
	selectedId: string;
	setSelectedId: any;
};

const FilterModal = ({
	modalVisible,
	setModalVisible,
	totalQues,
	totalMarks,
	confirmFilter,
	selectedId,
	setSelectedId,
}: MyProps) => {
	// const radioButtons = useMemo(
	// 	() => [
	// 		{
	// 			id: "all",
	// 			label: `All (${totalQues})`,
	// 			value: "all",
	// 		},
	// 		{
	// 			id: "correct",
	// 			label: `Correct (${totalMarks?.correct || 0})`,
	// 			value: "correct",
	// 		},
	// 		{
	// 			id: "wrong",
	// 			label: `Incorrect (${totalMarks?.wrong || 0})`,
	// 			value: "wrong",
	// 		},
	// 		{
	// 			id: "attempted",
	// 			label: `Attempted (${totalMarks?.attempted || 0})`,
	// 			value: "attempted",
	// 		},
	// 		{
	// 			id: "unattempted",
	// 			label: `Unattempted (${
	// 				totalQues - totalMarks?.attempted || 0
	// 			})`,
	// 			value: "unattempted",
	// 		},
	// 		{
	// 			id: "guess",
	// 			label: `Guessed (${totalMarks?.guess || 0})`,
	// 			value: "guess",
	// 		},
	// 		{
	// 			id: "review",
	// 			label: `Mark for Review (${totalMarks?.review || 0})`,
	// 			value: "review",
	// 		},
	// 	],
	// 	[],
	// );
	const radioButtons = useMemo(
		() => [
			{
				id: "all",
				label: `All (${totalQues})`,
				value: "all",
				labelStyle: { fontFamily: main_font}
			},
			{
				id: "correct",
				label: `Correct (${totalMarks?.correct || 0})`,
				value: "correct",
				labelStyle: { fontFamily: main_font}
			},
			{
				id: "wrong",
				label: `Incorrect (${totalMarks?.wrong || 0})`,
				value: "wrong",
				labelStyle: { fontFamily: main_font}
			},
			{
				id: "attempted",
				label: `Attempted (${totalMarks?.attempted || 0})`,
				value: "attempted",
				labelStyle: { fontFamily: main_font}
			},
			{
				id: "unattempted",
				label: `Unattempted (${(totalMarks?.unattempted || 0)
					})`,
				value: "unattempted",
				labelStyle: { fontFamily: main_font}
			},
			{
				id: "review",
				label: `Mark for Review (${totalMarks?.review || 0})`,
				value: "review",
				labelStyle: { fontFamily: main_font}
			},
		],
		[totalMarks, totalQues] // Dependencies added
	);

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(!modalVisible);
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<View style={styles.displayFlex}>
						<Text style={styles.bold}>Filters</Text>
						<TouchableOpacity
							onPress={() => setModalVisible(false)}
						>
							<Ionicons
								name="close-circle"
								size={26}
								color="#000000"
							/>
						</TouchableOpacity>
					</View>
					<View style={[styles.mt20, styles.mb20]}>
						<RadioGroup
							radioButtons={radioButtons}
							onPress={setSelectedId}
							selectedId={selectedId}
							containerStyle={{
								alignItems: "flex-start",
							}}
						/>
					</View>
					<View style={styles.displayFlex}>
						<TouchableOpacity
							onPress={() => setModalVisible(false)}
							style={styles.btnPause}
						>
							<Text style={[styles.btnText, styles.btnTextTheme]}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={confirmFilter}
							style={styles.btnEnd}
						>
							<Text style={[styles.btnText, styles.btnTextWhite]}>
								Filter
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		paddingVertical: 50,
	},
	modalView: {
		margin: 15,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	innerContainer: {
		flexGrow: 1,
	},
	displayFlex: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		flexWrap: "wrap",
	},
	bold: {
		fontFamily: semi_bold
	},
	mt20: {
		marginTop: 20,
	},
	mb10: {
		marginBottom: 10,
	},
	mb20: {
		marginBottom: 20,
	},
	textCenter: {
		textAlign: "center",
	},
	blue: {
		color: "blue",
		fontWeight: "bold",
	},
	yellow: {
		color: "#FFBF00",
		fontWeight: "bold",
	},
	colorGrey: {
		color: "#888888",
	},
	line: {
		borderBottomWidth: 1,
		borderBottomColor: "#e9e9e9",
		marginVertical: 20,
		marginBottom: 15,
	},
	numberContainer: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
	number: {
		padding: 8,
		paddingHorizontal: 30,
		borderWidth: 1,
		borderColor: "#e9e9e9",
		borderRadius: 10,
		marginBottom: 10,
		marginRight: 5,
	},
	numberAttempted: {
		padding: 8,
		paddingHorizontal: 30,
		borderWidth: 1,
		borderColor: "blue",
		borderRadius: 10,
		marginBottom: 10,
		marginRight: 5,
	},
	numberSkipped: {
		padding: 8,
		paddingHorizontal: 30,
		borderWidth: 1,
		borderColor: "#FFBF00",
		borderRadius: 10,
		marginBottom: 10,
		marginRight: 5,
	},
	btnPause: {
		borderWidth: 1,
		borderColor: theme_clr,
		flex: 1,
		paddingVertical: 8,
		borderRadius: 5,
		marginEnd: 5,
	},
	btnEnd: {
		borderWidth: 1,
		borderColor: theme_clr,
		flex: 1,
		paddingVertical: 8,
		borderRadius: 5,
		backgroundColor: theme_clr,
		marginStart: 5,
	},
	btnText: {
		textAlign: "center",
		fontFamily: semi_bold
	},
	btnTextWhite: {
		color: "#ffffff",
	},
	btnTextTheme:{
		color: theme_clr
	}
});

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(FilterModal);
