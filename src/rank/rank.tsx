import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import HeaderText from "../layout/HeaderText";
import Footer from "../layout/Footer";
import styles from "./rankStyles";
import { Picker } from "@react-native-picker/picker";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../consts";
import { User } from "../_redux/reducers/types";
import Loading from "../layout/Loading";

const { width } = Dimensions.get("window");

type MyProps = {
  navigation: any;
  token: string;
  route: any;
  user: User;
};

const RankScreen = ({ navigation, user, token }: MyProps) => {
  const [selSubject, setSelSubject] = useState("Select Subject");
  const [title, setTitle] = useState([]);
  const [rankList, setRankList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = () => {
    console.log("Fetching titles...");
    let URL = `${BASE_URL}/rank/get-title/?api_token=${token}`;
    axios.get(URL).then(
      (res) => {
        console.log(res);
        if (res.data.data.length > 0) {
          setTitle(res.data.data);
          setLoading(false);
        }
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );
  };

  const changeTitle = (value: string) => {
    setSelSubject(value);
    if (value !== "") {
      setLoading(true);
      fetchRankList(value);
    }
  };

  const fetchRankList = (titleId: string) => {
    const URL = `${BASE_URL}/rank/rank-list?api_token=${token}`;

    axios
      .post(URL, {
        title_id: titleId,
        user_id: user.user_id,
      })
      .then(
        (res) => {
          console.log("res", res.data);
          if (res.data?.data) {
            setRankList(res.data.data);
            setLoading(false);
          }
        },
        (error) => {
          console.log("Rank list error:", error);
        }
      );
  };

  return (
    <View style={styles.container}>
      <Loading loading={loading} text="Loading contents. Please wait." />
      <HeaderText navigation={navigation} heading="Leaderboard" />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selSubject}
          onValueChange={(item) => changeTitle(item)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Select Exam" value="" enabled={false} />
          {title.map((item: any) => (
            <Picker.Item
              label={item.name}
              value={item.id.toString()}
              key={item.id}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.mainContainer}>
        {!selSubject || selSubject === "Select Subject" ? (
          <View
            style={styles.centerAlignContainer}
          >
            <Text style={styles.WarningText}>
              Please select an exam to view the rank list.
            </Text>
          </View>
        ) : loading ? null : rankList.length === 0 ? (
          <View
          style={styles.centerAlignContainer}
          >
            <Text style={styles.WarningText}>
              No rank list available for this exam.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Row */}
            <View
              style={styles.tableHead}
            >
              <Text style={styles.thText}>
                Rank
              </Text>
              <Text style={styles.thText}>
                Student
              </Text>
              <Text
                style={[styles.thText,{textAlign: "right"}]}
              >
                Mark
              </Text>
            </View>

            {/* Rank List */}
            {rankList.map((item: any, index: number) => {
              const isTopRank = index < 3;
              const backgroundColor = index % 2 === 0 ? "#fafafa" : "#f0f0f0";

              return (
                <View
                  key={item.rank_id}
                  style={styles.tableTd}
                >
                  <Text
                    style={[
                        styles.tdText,
                        {fontWeight: isTopRank ? "bold" : "normal",},
                    ]}
                  >
                    {index + 1}
                  </Text>
                  <Text
                    style={[
                        styles.tdText,
                        {fontWeight: isTopRank ? "bold" : "normal",},
                    ]}
                  >
                    {item.user_name}
                  </Text>
                  <Text
                    style={[
                        styles.tdText,
                        {textAlign: "right"},
                        {fontWeight: isTopRank ? "bold" : "normal",},
                    ]}
                  >
                    {item.mark}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      <Footer navigation={navigation} page="Rank" />
    </View>
  );
};

// Redux connection
const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(RankScreen);
