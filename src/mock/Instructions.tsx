import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import styles from "./InstructionStyle";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import Back from "../layout/Back";
import { Ionicons } from "@expo/vector-icons";
import CheckBox from "react-native-checkbox";
type MyProps = {
  navigation: any;
  user: User;
  token: string;
  route: any;
};

const Instructions = ({ navigation, route }: MyProps) => {
  const { titleId, totalQues, title, status, duration, start, end } =
    route.params;
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const startTest = () => {
    if (toggleCheckBox) {
      navigation.navigate("StartMock", {
        titleId: titleId,
        totalQues: totalQues,
        title: title,
        status: status,
        duration: duration,
        start: start,
        end: end,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Back navigation={navigation} />
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <View style={styles.displayFlex}>
          <Ionicons name="timer" size={30} color="#000000" />
          <View style={styles.ms10}>
            <Text style={styles.bold}>{duration} Mins</Text>
            <Text style={styles.subheading}>Duration</Text>
          </View>
        </View>
        <View style={[styles.displayFlex, styles.mt20]}>
          <Ionicons name="list-circle" size={30} color="#000000" />
          <View style={styles.ms10}>
            <Text style={styles.bold}>
              {totalQues} Questions - {totalQues * 4} Marks
            </Text>
            <Text style={styles.subheading}>Scoring details</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Syllabus</Text>
          <Text style={[styles.txt]}>{title}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Instructions</Text>
          <Text style={[styles.mt5, styles.txt]}>
            1. Total duration of mock test is {duration} min.
          </Text>
          <Text style={[styles.mt5, styles.txt]}>
            2. The countdown timer in the top right corner of screen will
            display the remaining time available for you to complete the
            examination. When the timer reaches zero, the examination will end
            by itself. You will not be required to end or submit your
            examination.
          </Text>
          <Text style={[styles.mt5, styles.txt]}>
            3. This is a Mock test. The Questions displayed are for practice
            purpose only. Under no circumstances should this be presumed as
            sample questions.
          </Text>
          <Text style={[styles.mt5, styles.mb10, styles.txt]}>
            4. Mock test is meant for creating awareness about the test delivery
            system. Contents are for sample only and actual content will be
            different on the day of examination.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => setToggleCheckBox(!toggleCheckBox)}
          style={styles.displayFlex}
        >
          <View style={{ transform: [{ scale: 0.7 }], marginTop: 3 }}>
            <CheckBox
              label=""
              checked={toggleCheckBox}
              onChange={() => setToggleCheckBox(!toggleCheckBox)}
            />
          </View>
          <Text style={styles.txt}>I have read all the instructions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={startTest}
          style={toggleCheckBox ? styles.btnStart : styles.btnDisabled}
        >
          <Text style={styles.btnText}>Start test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(Instructions);
