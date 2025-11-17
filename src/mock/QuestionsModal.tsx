import React from "react";
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

type MyProps = {
	modalVisible: any;
	setModalVisible: any;
	data: any;
	questions: Array<any>;
	selectedOptions: Array<any>;
	setQuesIndex: Function;
	skippedQues: Array<any>;
	isRunning: boolean;
	handlePause: Function;
	handleResume: Function;
	endTest: Function;
};

const QuestionsModal = ({
	modalVisible,
	setModalVisible,
	data,
	questions,
	selectedOptions,
	setQuesIndex,
	skippedQues,
	isRunning,
	handlePause,
	handleResume,
	endTest,
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
						<Text style={styles.bold}>Mini Test 1</Text>
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
					<ScrollView contentContainerStyle={styles.innerContainer}>
						<View style={[styles.displayFlex, styles.mt20]}>
							<View>
								<Text style={[styles.textCenter, styles.blue]}>
									{selectedOptions.length}
								</Text>
								<Text style={styles.colorGrey}>Attempted</Text>
							</View>
							<View>
								<Text
									style={[styles.textCenter, styles.yellow]}
								>
									{skippedQues.length}
								</Text>
								<Text style={styles.colorGrey}>Skipped</Text>
							</View>
							<View>
								<Text style={[styles.textCenter, styles.bold]}>
									{data.totalQues -
										selectedOptions.length -
										skippedQues.length}
								</Text>
								<Text style={styles.colorGrey}>
									Not Visited
								</Text>
							</View>
						</View>
						<View style={styles.line} />
						<Text style={styles.mb10}>Questions</Text>
						<View style={styles.numberContainer}>
							{questions.map((item, index) => (
								<TouchableOpacity
									onPress={() => {
										setQuesIndex(index);
										setModalVisible(false);
									}}
									style={
										selectedOptions.some(
											(option) =>
												parseInt(option.question_id) ===
												parseInt(item.id),
										)
											? styles.numberAttempted
											: skippedQues
													.map(Number)
													.includes(item.id)
											? styles.numberSkipped
											: styles.number
									}
									key={index.toString()}
								>
									<Text style={styles.bold}>
										{index < 9
											? `0${index + 1}`
											: index + 1}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>
					<View style={styles.line} />
					<View style={styles.displayFlex}>
						<TouchableOpacity
							onPress={() =>
								isRunning ? handlePause() : handleResume()
							}
							style={styles.btnPause}
						>
							<Text style={styles.btnText}>
								{isRunning ? "Pause" : "Resume"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={endTest}
							style={styles.btnEnd}
						>
							<Text style={[styles.btnText, styles.btnTextWhite]}>
								End test
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
		fontWeight: "bold",
	},
	mt20: {
		marginTop: 20,
	},
	mb10: {
		marginBottom: 10,
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
		fontWeight: "bold",
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

export default connect(mapStateToProps)(QuestionsModal);
