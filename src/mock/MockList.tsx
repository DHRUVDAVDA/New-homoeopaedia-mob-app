import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  BackHandler,
} from "react-native";
import { connect } from "react-redux";
import styles from "./Styles";
import { User } from "../_redux/reducers/types";
import axios from "axios";
import { BASE_URL } from "../consts";
import { Feather, EvilIcons, AntDesign } from "@expo/vector-icons";
import Loading from "../layout/Loading";
import Toast from "react-native-simple-toast";
import { uniqBy } from "lodash";
import moment from "moment";
import InputSearchAPI from "../components/InputSearchAPI";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
  navigation: any;
  user: User;
  tab: string;
  token: string;
};

const MockList = React.memo(({ navigation, user, token, tab}: MyProps) => {
  const [mock, setMock] = useState({});
  const [onlyMock, setOnlyMock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const route = useRoute();
  // const tab = route.params?.tab || "All";
  console.log("sel tab %%% ",tab)
  const onRefresh = () => {
    setIsRefreshing(true);
    setLoading(true);
    refreshMock();
  };

  const refreshMock = useCallback(
    async (url = null) => {
      setSearch("");
      // setLoading(true);

      try {
        const res = await axios.get(
          url
            ? `${url}&api_token=${token}`
            : `${BASE_URL}/mock/${
                user.user_id
              }/${tab}?api_token=${token}&created_at=${moment()}`
        );
        console.log("mocklist", res)
        setMock(res.data);
        setOnlyMock(res.data.result.data);
      } catch (error) {
        Toast.show("Network error. Try again.", Toast.LONG);
      }

      setIsRefreshing(false);
      setLoading(false);
    },
    [token, user.user_id]
  );

  const getMock = useCallback(
    async (url = null, searchKey = null) => {
      console.log("Enter in Search ");

      let searchText = "";

      if (search || searchKey) {
        searchText = `&search=${search || searchKey}`;

        if (!url) setOnlyMock([]);
      }

      try {
        const res = await axios.get(
          url
            ? `${url}&api_token=${token}${searchText}`
            : `${BASE_URL}/mock/${
                user.user_id
              }/${tab}?api_token=${token}&created_at=${moment()}${searchText}`
        );
        console.log("#######", res.data.result.data)
        setMock(res.data);
        setOnlyMock((prev) => uniqBy([...prev, ...res.data.result.data], "id"));
        console.log("## mock list one ##", res.data)

      } catch (error) {
        Toast.show("Network error. Try again.", Toast.LONG);
      }

      setIsRefreshing(false);
      setLoading(false);
    },
    [token, user.user_id]
  );

  const startSearch = () => {
    setLoading(true);
    getMock(null, search);
  };

  // useEffect(() => {
  //   getMock();

  //   const unsubscribe = navigation.addListener("focus", () => {
  //     refreshMock();
  //   });

  //   return unsubscribe;
  // }, [navigation, getMock]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getMock();
    }, [tab])
  );

  const startOrReview = useCallback(
    async (
      title_id: number,
      qcount: number,
      ccount: number,
      title: string,
      status: string,
      duration: string,
      start: string,
      end: string
    ) => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${BASE_URL}/checksubscription/${user.user_id}/${title_id}?api_token=${token}`
        );

        if (res.data.success) {
          if (ccount === 0 || status !== "completed")
            status === ""
              ? navigation.navigate("Instructions", {
                  titleId: title_id,
                  totalQues: qcount,
                  title: title,
                  status: status,
                  duration: duration,
                  start: start,
                  end: end,
                })
              : navigation.navigate("StartMock", {
                  titleId: title_id,
                  totalQues: qcount,
                  title: title,
                  status: status,
                  duration: duration,
                  start: start,
                  end: end,
                  fromTab: tab
                });
          else
            navigation.navigate("MockResult", {
              titleId: title_id,
              totalQues: qcount,
              title: title,
              duration: duration,
              start: start,
              end: end,
            });
        } else {
          navigation.navigate("PaidService");
        }
      } catch (error) {
        Toast.show("Network error. Try again.", Toast.LONG);
      }

      setLoading(false);
    },
    [navigation]
  );

  const reAttempt = useCallback(
    async (
      title_id: number,
      qcount: number,
      ccount: number,
      title: string,
      status: string,
      duration: string,
      start: string,
      end: string
    ) => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${BASE_URL}/checksubscription/${user.user_id}/${title_id}?api_token=${token}`
        );

        if (res.data.success) {
          await axios
            .get(
              `${BASE_URL}/mreattempt/${title_id}/${user.user_id}?api_token=${token}`
            )
            .then(
              (res) => {
                setLoading(false);

                navigation.navigate("StartMock", {
                  titleId: title_id,
                  totalQues: qcount,
                  title: title,
                  status: status,
                  duration: duration,
                  start: start,
                  end: end,
                  fromTab: tab
                });
              },
              (error) => {
                setLoading(false);
                Toast.show("Network error. Try again.", Toast.LONG);
              }
            );
        } else {
          navigation.navigate("PaidService");
        }
      } catch (error) {
        Toast.show("Network error. Try again.", Toast.LONG);
      }
    },
    [navigation, token, user.user_id]
  );

  const loadMore = useCallback(async () => {
    if (mock?.next_page_url !== null) {
      await getMock(mock?.next_page_url);
    }
  }, [mock?.next_page_url, getMock]);

  const renderMock = useCallback(
    ({ item }) => (
      <View style={[styles.boxContainer, styles.singleList]}>
        <View style={{ flexShrink: 1 }}>
          <View style={[styles.lastItemList, styles.mb5]}>
            {item.qcount > 0 && (
              <Text style={styles.subheadingQues}>{item.qcount} Ques</Text>
            )}
            {item.mode === 2 && (
              <Text style={styles.comingSoon}>COMING SOON</Text>
            )}
          </View>
          <Text style={styles.heading}>{item.name}</Text>
          <View style={styles.lastItemList}>
            <AntDesign
              name="play"
              size={moderateScale(16)}
              color="#22bdc1"
              style={styles.mr5}
            />
            <Text style={styles.subheading}>{item.duration} Mins</Text>
          </View>
        </View>
        <View style={styles.icons}>
          {item.ccount > 0 && item.exam_status === "completed" &&(
            <TouchableOpacity
              onPress={() =>
                reAttempt(
                  item.id,
                  item.qcount,
                  item.ccount,
                  item.name,
                  item.status,
                  item.duration,
                  item.start,
                  item.end
                )
              }
            >
              <AntDesign
                name="reload1"
                size={moderateScale(16)}
                color="#ffffff"
                style={[styles.startTrophy, styles.mr10]}
              />
            </TouchableOpacity>
          )}
          {item.qcount > 0 && ( 
            <TouchableOpacity
              onPress={() =>
                startOrReview(
                  item.id,
                  item.qcount,
                  item.ccount,
                  item.name,
                  item.exam_status,
                  item.duration,
                  item.start,
                  item.end
                )
              }
            >
              {item.ccount > 0  && item.exam_status == "completed" ? (
                <EvilIcons
                  name="trophy"
                  size={moderateScale(22)}
                  color="#ffffff"
                  style={styles.startTrophy}
                />
              ) : (
                <Feather
                  name="arrow-right"
                  size={moderateScale(22)}
                  color="#ffffff"
                  style={styles.startArrow}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [startOrReview, reAttempt]
  );

  return (
    <View style={styles.content}>
      <Loading loading={loading} text="Loading contents. Please wait." />
      <InputSearchAPI
        search={search}
        setSearch={setSearch}
        startSearch={startSearch}
      />
      {onlyMock.length > 0 ? (
        <FlatList
          data={onlyMock}
          renderItem={renderMock}
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={20}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
        />
      ) : (
        <View style={styles.scroller}>
          {!loading && (
          <Text>No mock test found</Text>
          )}
        </View>
      )}
    </View>
  );
});

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(MockList);

export const messagin = () => {
  if (Platform.OS !== "android") {
    BackHandler.exitApp();
    // throw new Error("This app only supports Android.");
  }
};
