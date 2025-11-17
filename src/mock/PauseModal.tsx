import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { regular, semi_bold } from "../constants/font";

type MyProps = {
	modalVisible: any;
	setModalVisible: any;
	confirmPause: any;
	onCancel: any;
};

const PauseModal = ({
	modalVisible,
	setModalVisible,
	confirmPause,
	onCancel
}: MyProps) => {
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
						<Text style={styles.bold}>Confirm Pause Test</Text>
						<TouchableOpacity
							onPress={() => onCancel()}
						>
							<Ionicons
								name="close-circle"
								size={26}
								color="#000000"
							/>
						</TouchableOpacity>
					</View>
					<View
						style={[styles.displayFlex, styles.mt20, styles.mb20]}
					>
						<Text style={{ fontFamily: regular }}>Are you sure want to pause the test?</Text>
						<Text style={{ fontFamily: regular }}>
							{" "}
							You can start the exam again from where you left off
						</Text>
					</View>
					<View style={styles.displayFlex}>
						<TouchableOpacity
							onPress={() => onCancel()}
							style={styles.btnPause}
						>
							<Text style={styles.btnText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={confirmPause}
							style={styles.btnEnd}
						>
							<Text style={[styles.btnText, styles.btnTextWhite]}>
								Confirm
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
		borderColor: "#e9e9e9",
		flex: 1,
		paddingVertical: 8,
		borderRadius: 5,
		marginEnd: 5,
	},
	btnEnd: {
		borderWidth: 1,
		borderColor: "#e9e9e9",
		flex: 1,
		paddingVertical: 8,
		borderRadius: 5,
		backgroundColor: "red",
		marginStart: 5,
	},
	btnText: {
		textAlign: "center",
		fontFamily: semi_bold
	},
	btnTextWhite: {
		color: "#ffffff",
	},
});

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(PauseModal);
