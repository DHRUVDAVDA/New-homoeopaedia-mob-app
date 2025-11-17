import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import { crct_bg_clr, theme_clr, unattempted, wrng_bg_clr } from '../constants/colors';
import { semi_bold } from '../constants/font';
import { moderateScale } from 'react-native-size-matters';
import axios from 'axios';
import { BASE_URL } from '../consts';
import Toast from "react-native-simple-toast";
import ResultStyle from "./ResultStyle";
import ResultOverview from "./ResultOverview";
import Solution from "./Solution";
import Loading from "../layout/Loading";
import Back from "../layout/Back";
import ShowRankModal from "./ShowRankModal";

const Tab = createMaterialTopTabNavigator();

type MyProps = {
	navigation: any;
	user: User;
	token: string;
	route: any;
};

type ChartDataItem = {
	name: string;
	population: number;
	color: string;
	legendFontColor: string;
	legendFontSize: number;
};

// Custom Tab Bar Component
function MyTabBar({ state, descriptors, navigation, position }) {
	return (
		<View style={styles.tabBarContainer}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
							? options.title
							: route.name;

				const isFocused = state.index === index;

				// Animation for the tab label color
				const inputRange = state.routes.map((_, i) => i);
				const color = position.interpolate({
					inputRange,
					outputRange: inputRange.map(i => (i === index ? '#FF6347' : '#999')),
				});

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				return (
					<TouchableOpacity
						accessibilityRole="button"
						accessibilityStates={isFocused ? ['selected'] : []}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						style={[styles.tabItem, isFocused && styles.activeTabItem]}
						key={route.key}
						activeOpacity={0.7}
					>
						{/* <Animated.Text style={[styles.tabLabel, { color }]}>{label}</Animated.Text> */}
						<Text style={[styles.tabLabel, { color: isFocused ? '#000' : '#999' }]}>
							{label}
						</Text>
						{isFocused && <View style={styles.indicator} />}
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const Result = ({ navigation, route, user, token }: MyProps) => {
	const { titleId } = route.params;
	const [chartData, setChartData] = useState<ChartDataItem[]>([]);
	const [totalMarks, setTotalMarks] = useState({});
	const [rankList, setRankList] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [showRank, setShowRank] = useState(false);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			() => {
				navigation.navigate("MockScreen", {
					activeTab: route.params?.fromTab || "Mini Test",
				});


				return true; // Prevent default behavior (exit app)
			},
		);

		return () => backHandler.remove();
	}, []);

	useEffect(() => {
		saveStatus();
		getMarks();
	}, []);

	const saveStatus = async () => {
		await axios
			.post(
				`${BASE_URL}/savemockstatus/${user.user_id}/${titleId}?api_token=${token}`,
				{ status: "Completed" },
			)
			.then(
				(res) => { },
				(error) => { },
			);
	};

	const getMarks = async () => {
		try {
			const response = await axios.get(
				`${BASE_URL}/mmarks/${user.user_id}/${titleId}?api_token=${token}`
			);
			const { data } = response;

			if (data.success) {


				setChartData([
					{
						name: "Correct Answers",
						population: data.result.correct_answers_count,
						// color: "#12b57e",
						color: crct_bg_clr,
						legendFontColor: "#7F7F7F",
						legendFontSize: moderateScale(15),
					},
					{
						name: "Wrong Answers",
						population: data.result.wrong_answer_count,
						// color: "#DC143C",
						color: wrng_bg_clr,
						legendFontColor: "#7F7F7F",
						legendFontSize: moderateScale(15),
					},
					{
						name: "Unattempted",
						population: data.result.unattempted_qus_count,
						color: unattempted,
						legendFontColor: "#7F7F7F",
						legendFontSize: moderateScale(15),
					},
				]);

				setTotalMarks({
					marks: data.result.obtained_marks,
					correct: data.result.correct_answers_count,
					wrong: data.result.wrong_answer_count,
					attempted: data.result.attempted_qus_count, // Only count answered questions
					unattempted: data.result.unattempted_qus_count, // Count skipped questions
					review: data.result.review_qus_count,
					guess: data.result.guess_qus_count,
					date: data.result.exam_date,
					total_marks: data.result.total_marks
				});
				setRankList(data.result.rank_list);
				setShowRank(true);

			}

			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error)
			Toast.show("Network error. Try again.", Toast.LONG);
		}
	};

	const closeModal = async () => {
		setShowRank(false);
	}

	return (
		<View style={ResultStyle.container}>
			<Loading loading={loading} text="Loading results. Please wait." />
			<Back navigation={navigation} type="MockScreen" />
			<View style={ResultStyle.innerContainer}>
				<Text style={[ResultStyle.heading, ResultStyle.mb20]}>
					Performance card
				</Text>
				<Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
					<Tab.Screen
						name="Analysis"
						children={() => (
							<ResultOverview
								navigation={navigation}
								route={route}
								totalMarks={totalMarks}
								chartData={chartData}
								rankList={rankList}
							/>
						)}
					/>
					<Tab.Screen
						name="Solution"
						children={() => (
							<Solution
								navigation={navigation}
								route={route}
								totalMarks={totalMarks}
								chartData={chartData}
							/>
						)}
					/>
				</Tab.Navigator>
			</View>
			<ShowRankModal
				modalVisible={showRank}
				setModalVisible={setShowRank}
				closeModal={closeModal}
				titleId={titleId}
				userId={user.user_id}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	tabBarContainer: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		elevation: 4,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	activeTabItem: {
		borderBottomColor: theme_clr,
	},
	tabLabel: {
		fontSize: moderateScale(13),
		fontFamily: semi_bold
	},
	indicator: {
		position: 'absolute',
		bottom: 0,
		height: 1,
		width: '100%',
		backgroundColor: theme_clr,
		borderRadius: 3,
	},
	screenContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f6f6f6',
	},
	screenText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
	},
});

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
	user: state.authReducer.user,
	token: state.authReducer.token,
});

export default connect(mapStateToProps)(Result);

