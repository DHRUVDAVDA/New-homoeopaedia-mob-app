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
import { useSelector } from "react-redux";
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

const MockList = React.memo(({ navigation, user, token, tab }: MyProps) => {
  const [mock, setMock] = useState({});
  const [onlyMock, setOnlyMock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  // Purchase state from Redux
  const isPurchased = useSelector((state: any) => state.purchaseReducer?.isPurchased ?? false);
  const supportsInAppPurchase = useSelector((state: any) => state.purchaseReducer?.supportsInAppPurchase ?? false);

  const route = useRoute();
  // const tab = route.params?.tab || "All";
  console.log("sel tab %%% ", tab);
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
        console.log("mocklist", res);
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
        console.log("#######", res.data.result.data);
        setMock(res.data);
        setOnlyMock((prev) => uniqBy([...prev, ...res.data.result.data], "id"));
        console.log("## mock list one ##", res.data);
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

  /**
   * Navigate to start/review a mock test.
   *
   * Gate logic:
   * - supportsInAppPurchase = true  → check isPurchased ONLY (skip API entirely)
   * - supportsInAppPurchase = false → ignore isPurchased, always use Razorpay API
   *
   * Only the "Not Started" (tab === "NotStarted") items are gated.
   */
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

      // Helper that performs the actual navigation once access is confirmed
      const navigateToTest = () => {
        if (ccount === 0 || status !== "completed") {
          if (status === "") {
            navigation.navigate("Instructions", {
              titleId: title_id,
              totalQues: qcount,
              title: title,
              status: status,
              duration: duration,
              start: start,
              end: end,
            });
          } else {
            navigation.navigate("StartMock", {
              titleId: title_id,
              totalQues: qcount,
              title: title,
              status: status,
              duration: duration,
              start: start,
              end: end,
              fromTab: tab,
            });
          }
        } else {
          navigation.navigate("MockResult", {
            titleId: title_id,
            totalQues: qcount,
            title: title,
            duration: duration,
            start: start,
            end: end,
          });
        }
      };

      if (supportsInAppPurchase) {
        // IAP path: only isPurchased matters — never call the subscription API
        if (isPurchased) {
          navigateToTest();
        } else {
          navigation.navigate("PaidService");
        }
        setLoading(false);
        return;
      }

      // Razorpay / web-subscription path: isPurchased is irrelevant here
      try {
        const res = await axios.get(
          `${BASE_URL}/checksubscription/${user.user_id}/${title_id}?api_token=${token}`
        );
console.log("subsss",res.data);

        if (res.data.success) {
          navigateToTest();
        } else {
          navigation.navigate("PaidService");
        }
      } catch (error) {
        Toast.show("Network error. Try again.", Toast.LONG);
      }

      setLoading(false);
    },
    [navigation, supportsInAppPurchase, isPurchased, user.user_id, token, tab]
  );

  /**
   * Re-attempt a completed mock test.
   *
   * Gate logic (same rule as startOrReview):
   * - supportsInAppPurchase = true  → check isPurchased ONLY (skip API entirely)
   * - supportsInAppPurchase = false → ignore isPurchased, always use Razorpay API
   */
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

      // Helper that resets the attempt and navigates
      const doReattempt = async () => {
        try {
          await axios.get(
            `${BASE_URL}/mreattempt/${title_id}/${user.user_id}?api_token=${token}`
          );
          setLoading(false);
          navigation.navigate("StartMock", {
            titleId: title_id,
            totalQues: qcount,
            title: title,
            status: status,
            duration: duration,
            start: start,
            end: end,
            fromTab: tab,
          });
        } catch (error) {
          setLoading(false);
          Toast.show("Network error. Try again.", Toast.LONG);
        }
      };

      if (supportsInAppPurchase) {
        // IAP path: only isPurchased matters — never call the subscription API
        if (isPurchased) {
          await doReattempt();
        } else {
          setLoading(false);
          navigation.navigate("PaidService");
        }
        return;
      }

      // Razorpay / web-subscription path: isPurchased is irrelevant here
      try {
        const res = await axios.get(
          `${BASE_URL}/checksubscription/${user.user_id}/${title_id}?api_token=${token}`
        );

        if (res.data.success) {
          await doReattempt();
        } else {
          setLoading(false);
          navigation.navigate("PaidService");
        }
      } catch (error) {
        setLoading(false);
        Toast.show("Network error. Try again.", Toast.LONG);
      }
    },
    [navigation, supportsInAppPurchase, isPurchased, token, user.user_id, tab]
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
              name="play-circle"
              size={moderateScale(16)}
              color="#22bdc1"
              style={styles.mr5}
            />
            <Text style={styles.subheading}>{item.duration} Mins</Text>
          </View>
        </View>
        <View style={styles.icons}>
          {item.ccount > 0 && item.exam_status === "completed" && (
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
                name="reload"
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
              {item.ccount > 0 && item.exam_status == "completed" ? (
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
          {!loading && <Text>No mock test found</Text>}
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
