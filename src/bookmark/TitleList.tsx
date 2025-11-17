import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL, WEB_URL } from "../consts";
import Toast from "react-native-simple-toast";
import HeaderText from "../layout/HeaderText";
import styles from "./bookmarkStyles";
import Loading from "../layout/Loading";
import InputSearchAPI from "../components/InputSearchAPI";
import { uniqBy } from "lodash";
import { moderateScale } from "react-native-size-matters";
import { theme_clr } from "../constants/colors";

const contentWidth = Dimensions.get("window").width;

type MyProps = {
  navigation: any;
  user: User;
  token: string;
  route: any;
};

const TitleList = ({ navigation, route, user, token }: MyProps) => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchval, setSearch] = useState("");

  useEffect(() => {
    getTitles();
  }, []);

  const getTitles = useCallback(
    async (url = null, searchKey = null) => {
      console.log("Enter in Search");

      let searchText = searchval || searchKey || "";

      const postData = {
        user_id: user.user_id,
        ...(searchText ? { search: searchText } : {}),
      };

      try {
        const endpoint = `${BASE_URL}/bookmark/get-title/?api_token=${token}`;

        const res = await axios.post(endpoint, postData);
        console.log("## Response ##", res.data);

        if (res.data.data) {
          //   setTitles((prev) => uniqBy([...prev, ...res.data.data], "id"));
          setTitles(uniqBy(res.data.data, "id"));
        } else {
          setTitles([]);
        }
      } catch (error) {
        console.log("Error fetching titles:", error);
        Toast.show("Network error. Try again.", Toast.LONG);
      }

      setLoading(false);
    },
    [token, user.user_id, searchval]
  );

  const onRefresh = () => {
    setLoading(true);
  };

  const startSearch = () => {
    setTitles([]);
    setLoading(true);
    getTitles(null, searchval);
  };

  const renderList = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("BookmarkData", { id: item.id })}
      >

        <View style={[styles.boxContainer, styles.singleList]}>
          <View style={
            {
              width: 35, height: 35, borderRadius: 50, backgroundColor: theme_clr,
              justifyContent: 'center', alignItems: 'center'
            }
          }>
            <Ionicons name="bookmarks-outline" color={"#FFF"} size={moderateScale(13)} />
          </View>
          <Text style={[styles.heading, {marginLeft: 10}]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation]
  );

  return (
    <>
      <Loading
        loading={loading}
        text={
          loading
            ? "Loading questions. Please wait."
            : "Saving answers. Please wait."
        }
      />

      <View style={styles.container}>
        <HeaderText navigation={navigation} heading={`Bookmarks`} />
        <InputSearchAPI
          search={searchval}
          setSearch={setSearch}
          startSearch={startSearch}
        />
        {titles.length > 0 ? (
          <FlatList
            data={titles}
            renderItem={renderList}
            onEndReachedThreshold={0.5}
            // onEndReached={loadMore}
            keyExtractor={(item) => item.id.toString()}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={20}

          // onRefresh={onRefresh}
          // refreshing={isRefreshing}
          />
        ) : (
          <View style={styles.scroller}>
            {!loading && <Text>No titles found</Text>}
          </View>
        )}
      </View>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(TitleList);
