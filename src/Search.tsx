import React from "react";
import { View, Text } from "react-native";
import HeaderSearch from "./layout/HeaderSearch";
import Footer from "./layout/Footer";
import styles from "./HomeStyles";

type MyProps = {
	navigation: any;
};

const Search = ({ navigation }: MyProps) => {
	return (
		<View style={styles.container}>
			<HeaderSearch navigation={navigation} />
			<View style={styles.scroller}>
				<Text>Search MCQ IDs, topics from QBank, Tests, Videos</Text>
			</View>
			<Footer navigation={navigation} page={`Home`} />
		</View>
	);
};

export default Search;
