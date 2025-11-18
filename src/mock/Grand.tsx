import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import styles from "./Styles";
import { User } from "../_redux/reducers/types";
import axios from "axios";
import { BASE_URL } from "../consts";
import { Feather, EvilIcons, AntDesign } from "@expo/vector-icons";
import Loading from "../layout/Loading";
import Toast from "react-native-simple-toast";
import InputSearch from "../components/InputSearch";

type MyProps = {
  navigation: any;
  user: User;
  token: string;
};

const Grand = ({ navigation, user, token }: MyProps) => {
  const [grand, setGrand] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGrand();

    const unsubscribe = navigation.addListener("focus", () => {
      getGrand();
    });

    return unsubscribe;
  }, [navigation]);

  const getGrand = async () => {
    await axios
      .get(`${BASE_URL}/grand/${user.user_id}?api_token=${token}`)
      .then(
        (res) => {
          setGrand(res.data.result);
          setFilteredArray(res.data.result);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          Toast.show("Network error. Tryagain.", Toast.LONG);
        }
      );

    setLoading(false);
  };

  const startOrReview = (title_id: number, qcount: number, ccount: number) => {
    if (qcount !== ccount)
      navigation.navigate("TStart", {
        titleId: title_id,
        totalQues: qcount,
      });
    else if (qcount === ccount)
      navigation.navigate("TReview", {
        titleId: title_id,
        totalQues: qcount,
      });
  };

  const reAttempt = (title_id: number, qcount: number) => {
    setLoading(true);

    axios
      .get(
        `${BASE_URL}/treattempt/${title_id}/${user.user_id}?api_token=${token}`
      )
      .then(
        (res) => {
          navigation.navigate("TStart", {
            titleId: title_id,
            totalQues: qcount,
          });

          setLoading(false);
        },
        (error) => {
          setLoading(false);
          Toast.show("Network error. Tryagain.", Toast.LONG);
        }
      );
  };

  const startSearch = (text: string) => {
    if (text === "") {
      setFilteredArray(grand);
    } else {
      const filteredData = grand.filter((item: any) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredArray(filteredData);
    }
  };

  return (
    <View style={styles.content}>
      <Loading loading={loading} text="Loading contents. Please wait." />
      {grand.length > 0 ? (
        <>
          <InputSearch startSearch={startSearch} />
          <FlatList
            data={filteredArray}
            renderItem={({ item }) => (
              <View style={[styles.boxContainer, styles.singleList]}>
                <View style={{ flexShrink: 1 }}>
                  <Text style={styles.heading}>{item.name}</Text>
                  <Text style={styles.subheading}>
                    {item.qcount} question
                    {item.qcount > 1 ? "s" : ""}
                  </Text>
                </View>
                <View style={styles.icons}>
                  {item.qcount > 0 && (
                    <TouchableOpacity
                      onPress={() => reAttempt(item.id, item.qcount)}
                    >
                      {item.ccount === item.qcount && (
                        <AntDesign
                          name="reload"
                          size={16}
                          color="#ffffff"
                          style={[styles.startTrophy, styles.mr10]}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  {item.qcount > 0 && (
                    <TouchableOpacity
                      onPress={() =>
                        startOrReview(item.id, item.qcount, item.ccount)
                      }
                    >
                      {item.ccount === item.qcount ? (
                        <EvilIcons
                          name="trophy"
                          size={22}
                          color="#ffffff"
                          style={styles.startTrophy}
                        />
                      ) : (
                        <Feather
                          name="arrow-right"
                          size={22}
                          color="#ffffff"
                          style={styles.startArrow}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            keyExtractor={(item) => item.name}
          />
        </>
      ) : (
        <View style={styles.scroller}>
          <Text>No grand test found</Text>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(Grand);
