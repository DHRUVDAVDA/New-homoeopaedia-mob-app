import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { BASE_URL } from "../../consts";
import axios from "axios";
import moment from "moment";
import { uniqBy } from "lodash";
import Toast from "react-native-simple-toast";
import styles from "../Styles";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Platform,
  BackHandler,
} from "react-native";
import Loading from "../../layout/Loading";
import InputSearchAPI from "../../components/InputSearchAPI";
import { Feather, EvilIcons, AntDesign } from "@expo/vector-icons";

type MyProps = {
  navigation: any;
  user: User;
  token: string;
};

const All = React.memo(({ navigation, user, token }: MyProps) => {
  const [search, setSearch] = useState("");
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const tab = "All";

  // Fetch mock tests
  const getMock = async (url = null, searchKey = "") => {
    console.log("Fetching mock tests...");

    if (!token || !user?.user_id) {
      console.warn("Missing token or user ID");
      return;
    }

    let searchText = searchKey ? `&search=${searchKey}` : "";

    // If it's a new search, reset list
    if (!url) {
      setAllList([]);
      setNextPageUrl(null);
    }

    try {
      const apiUrl = url
        ? `${url}&api_token=${token}${searchText}`
        : `${BASE_URL}/mock/${
            user.user_id
          }/${tab}?api_token=${token}&created_at=${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}${searchText}`;

      console.log("Fetching from URL:", apiUrl);

      const res = await axios.get(apiUrl);

      if (res.data?.result?.data) {
        setAllList((prev) => uniqBy([...prev, ...res.data.result.data], "id"));
        setNextPageUrl(res.data.result.next_page_url);
      }
    } catch (error) {
      console.error("Network error:", error);
      Toast.show("Network error. Try again.", Toast.LONG);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    getMock();
  }, [token, user?.user_id]);

  // Handle search
  const startSearch = () => {
    console.log("Starting search:", search);
    setLoading(true);
    getMock(null, search);
  };

  // Handle pagination
  const loadMore = async () => {
    if (nextPageUrl) {
      await getMock(nextPageUrl);
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    getMock();
  };

  // Render each mock test
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
              size={16}
              color="#22bdc1"
              style={styles.mr5}
            />
            <Text style={styles.subheading}>{item.duration} Mins</Text>
          </View>
        </View>
        <View style={styles.icons}>
          {item.ccount > 0 && item.status === "Completed" && (
            <TouchableOpacity onPress={() => reAttempt(item)}>
              <AntDesign
                name="reload"
                size={16}
                color="#ffffff"
                style={[styles.startTrophy, styles.mr10]}
              />
            </TouchableOpacity>
          )}
          {item.qcount > 0 && (
            <TouchableOpacity onPress={() => startOrReview(item)}>
              {item.ccount > 0 && item.status === "Completed" ? (
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
    ),
    []
  );

  // Handle re-attempt
  const reAttempt = async (item) => {
    console.log("reAttempt");
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/checksubscription/${user.user_id}/${item.id}?api_token=${token}`
      );
      console.log("check sub response", res);
      if (res.data.success) {
        await axios.get(
          `${BASE_URL}/mreattempt/${item.id}/${user.user_id}?api_token=${token}`
        );
        setLoading(false);
        navigation.navigate("StartMock", item);
      } else {
        navigation.navigate("PaidService");
      }
    } catch (error) {
      Toast.show("Network error. Try again.", Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  // Handle start or review
  const startOrReview = async (item) => {
    console.log("startOrReview");
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/checksubscription/${user.user_id}/${item.id}?api_token=${token}`
      );

      if (res.data.success) {
        if (item.ccount === 0 || item.status !== "Completed") {
          navigation.navigate(
            item.status === "" ? "Instructions" : "StartMock",
            item
          );
        } else {
          navigation.navigate("MockResult", item);
        }
      } else {
        navigation.navigate("PaidService");
      }
    } catch (error) {
      Toast.show("Network error. Try again.", Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.content}>
      <Loading loading={loading} text="Loading contents. Please wait." />
      <InputSearchAPI
        search={search}
        setSearch={setSearch}
        startSearch={startSearch}
      />
      {allList.length > 0 ? (
        <FlatList
          data={allList}
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
          <Text>No mock test found</Text>
        </View>
      )}
    </View>
  );
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(All);

export const messagin = () => {
  if (Platform.OS !== "android") {
    BackHandler.exitApp();
    // throw new Error("This app only supports Android.");
  }
};
