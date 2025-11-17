import React, { useEffect, useState } from "react";
import { BackHandler, Dimensions, ScrollView, Text, View } from "react-native";
import styles from "./ResultStyle";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import moment from "moment";
import { semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
  navigation: any;
  user: User;
  token: string;
  route: any;
  totalMarks: any;
  chartData: any;
  rankList: any;
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Label color
  propsForLabels: {
    fontFamily: semi_bold, // Custom font
    fontSize: moderateScale(14), // Adjust size if needed
    fontWeight: "bold",
  },
};

const ResultOverview = ({
  navigation,
  route,
  user,
  token,
  totalMarks,
  chartData,
  rankList,
}: MyProps) => {
  const { titleId, totalQues, title } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainerNews}>
        <View style={styles.displayFlex}>
          <Ionicons name="trophy" size={30} color="#000000" />
          <View style={styles.ms10}>
            <Text style={styles.bold}>{title}</Text>
            <Text style={styles.subheading}>{totalMarks.date}</Text>
          </View>
        </View>
        <View style={styles.line} />
        <Text style={styles.bold}>Overview</Text>
        <View style={styles.box}>
          <Text style={styles.thin}>MARKS</Text>
          <Text style={styles.bold}>
            {parseInt(totalMarks?.marks) || 0}
            <Text style={styles.grey}>/{totalMarks?.total_marks}</Text>
          </Text>
        </View>
        <View style={styles.line} />
        <Text style={styles.bold}>Test summary</Text>
        <View style={styles.flexDirection}>
          <View style={[styles.box, styles.flex]}>
            <Text style={styles.bold}>{totalMarks?.attempted || 0}</Text>
            <Text style={[styles.subheading, styles.fs12]}>
              Questions attempted
            </Text>
          </View>
          <View style={[styles.box, styles.flex, styles.ms10]}>
            <Text style={styles.bold}>{totalMarks?.correct || 0}</Text>
            <Text style={[styles.subheading, styles.fs12]}>
              Correct answers
            </Text>
          </View>
        </View>
        <View style={styles.flexDirection}>
          <View style={[styles.box, styles.flex]}>
            <Text style={styles.bold}>
              {/* {totalQues - totalMarks?.attempted} */}
              {totalMarks?.unattempted}
            </Text>
            <Text style={[styles.subheading, styles.fs12]}>
              Unattempted questions
            </Text>
          </View>
          <View style={[styles.box, styles.flex, styles.ms10]}>
            <Text style={styles.bold}>{totalMarks?.wrong || 0}</Text>
            <Text style={[styles.subheading, styles.fs12]}>Wrong answers</Text>
          </View>
        </View>
        <View style={styles.chart}>
          <PieChart
            data={chartData}
            width={Dimensions.get("window").width}
            height={150}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft="-35"
            center={[50, -10]}
            absolute
          />
        </View>
		<View style={styles.line} />
		<Text style={[styles.bold, styles.mb10]}>Rank List</Text>
        {rankList && rankList.length > 0 && (
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>
                Rank
              </Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>
                Name
              </Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>
                Mark
              </Text>
            </View>

            {/* Table Rows */}
			{rankList.map((item: { user_id: number; user_name: string; mark: number }, index: number) =>{
              const isCurrentUser = item.user_id === user.user_id; // Check if this is the logged-in user

              return (
                <View key={item.user_id} style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, isCurrentUser && styles.bold]}
                  >
                    {index + 1}
                  </Text>
                  <Text
                    style={[styles.tableCell, isCurrentUser && styles.bold]}
                  >
                    {item.user_name}
                  </Text>
                  <Text
                    style={[styles.tableCell, isCurrentUser && styles.bold]}
                  >
                    {item.mark}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(ResultOverview);
