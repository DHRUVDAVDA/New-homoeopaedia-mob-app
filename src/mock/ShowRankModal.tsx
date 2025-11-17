import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../consts";
import axios from "axios";
import { semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";
import { theme_clr } from "../constants/colors";

type MyProps = {
	modalVisible: boolean;
	setModalVisible: (visible: boolean) => void;
	closeModal: () => void;
	titleId: number;
	userId: number;
	token: string;
};

const EndModal = ({ modalVisible, setModalVisible, closeModal, titleId, userId, token }: MyProps) => {
	const [loading, setLoading] = useState(false);
	const [rank, setRank] = useState<number | null>(0);

	useEffect(() => {
		if (modalVisible) {
			fetchRank();
		}
	}, [modalVisible]); // ✅ Ensures API call only when modal opens

	const fetchRank = async () => {
		setLoading(true);

		try {
			const res = await axios.get(`${BASE_URL}/rank/${userId}/${titleId}?api_token=${token}`);

			if (res.data.success) {
				setRank(res.data.result?.mark ?? 0); // ✅ Prevents `null` values
			} else {
				setRank(null);
				closeModal();
			}
		} catch (error) {
			console.error("Error fetching rank:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => setModalVisible(false)}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<View style={styles.displayFlex}>
						<Text style={styles.bold}>Your Rank is</Text>
						{/* <TouchableOpacity onPress={() => setModalVisible(false)}>
							<Ionicons name="close-circle" size={26} color="#000000" />
						</TouchableOpacity> */}
					</View>

					<View style={[styles.displayFlex, styles.mt10, styles.mb10]}>
						<Text style={!loading && styles.fntSize}>{loading ? "Loading..." : rank !== null ? rank : "No rank available"}</Text>
					</View>

					{/* <View style={styles.mb10}>
						<Text style={{ textAlign:'center',color:'#f1b44c', fontFamily:'Lato-Bold'}}>ⓘ You can view the complete Rank List on the website.</Text>
					</View> */}

					<View style={[styles.displayFlex, styles.width80]}>
						{/* <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnPause}>
							<Text style={styles.btnText}>Cancel</Text>
						</TouchableOpacity> */}
						<TouchableOpacity onPress={closeModal} style={styles.btnEnd}>
							<Text style={[styles.btnText, styles.btnTextWhite]}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

// Styles remain unchanged
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
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	displayFlex: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: 'center'
	},
	bold: {
		fontFamily: semi_bold
	},
	mt10: {
		marginTop: 10,
	},
	mb10: {
		marginBottom: 10,
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
	width80:{
		width: 80,
		alignSelf:'center'
	},
	fntSize:{
		fontSize: moderateScale(28),
		fontFamily: semi_bold
	}
});

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(EndModal);
