import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import styles from "./ResultStyle";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import axios from "axios";
import { BASE_URL } from "../consts";
import Toast from "react-native-simple-toast";
import Loading from "../layout/Loading";
import SolutionItem from "./SolutionItem";
import { FontAwesome5 } from "@expo/vector-icons";
import FilterModal from "./FilterModal";
import { main_font, regular } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
  navigation: any;
  user: User;
  token: string;
  route: any;
  totalMarks: {
    correct: number;
    wrong: number;
    attempted: number;
    guess?: number;
    review?: number;
  };
  chartData: any;
};

type SolutionType = {
  id: number;
  question: string;
  answer: string;
  solution?: string;
  get_mock_test_book_mark?: any; // <-- added this
  get_subject?: {
    id: number;
    name: string;
  };
};

const Solution = ({
  navigation,
  route,
  user,
  token,
  totalMarks,
}: MyProps) => {
  const { titleId, totalQues } = route.params;
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [active, setActive] = useState("1-10");
  const [solution, setSolution] = useState<SolutionType[]>([]);
  const [selectedId, setSelectedId] = useState("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  console.log("totalQues", totalQues)

  useEffect(() => {
    loadSolutions();
  }, []);

  const loadSolutions = async () => {
    setLoading(true);
    const split = active.split("-");

    try {
      const res = await axios.get(
        `${BASE_URL}/solutions/${user.user_id}/${titleId}/${split[0]}/${split[1]}?api_token=${token}&type=${selectedId}`
      );
      setSolution(res.data.result);

      const bookmarked = res.data.result
        .filter((item: SolutionType) => item.get_mock_test_book_mark !== null)
        .map((item: SolutionType) => item.id);

      setBookmarkedIds(bookmarked);

      // const newSplit = splitNumberIntoGroups(
      //   res.data.result.length < 10 ? 10 : res.data.result.length
      // );
      // setActive(newSplit.length > 0 ? newSplit[0] : "1-10");

      if (active === "") {
        const newSplit = splitNumberIntoGroups(
          getTotalQues() < 10 ? 10 : getTotalQues()
        );
        setActive(newSplit.length > 0 ? newSplit[0] : "1-10");
      }

    } catch (error) {
      Toast.show("Network error. Try again.", Toast.LONG);
    }
    setLoading(false);
  };

  const splitNumberIntoGroups = (totalItems: number) => {
    const groups = [];
    let start = 1;
    let end = 10;

    while (start <= totalItems) {
      if (end > totalItems) end = totalItems;
      groups.push(`${start}-${end}`);
      start = end + 1;
      end += 10;
    }
    return groups;
  };

  const loadPage = async (page: string) => {
    setLoading(true);
    setActive(page);
    const split = page.split("-");

    try {
      const res = await axios.get(
        `${BASE_URL}/solutions/${user.user_id}/${titleId}/${split[0]}/${split[1]}?api_token=${token}&type=${selectedId}`
      );
      setSolution(res.data.result);

      const bookmarked = res.data.result
        .filter((item: SolutionType) => item.get_mock_test_book_mark !== null)
        .map((item: SolutionType) => item.id);

      setBookmarkedIds(bookmarked);
    } catch (error) {
      Toast.show("Network error. Try again.", Toast.LONG);
    }
    setLoading(false);
  };

  const confirmFilter = async () => {
    setFilter(false);
    loadSolutions();
  };

  const getTotalQues = () => {
    if (selectedId === "correct") return totalMarks?.correct || 0;
    else if (selectedId === "wrong") return totalMarks?.wrong || 0;
    else if (selectedId === "attempted") return totalMarks?.attempted || 0;
    else if (selectedId === "unattempted")
      return totalQues - totalMarks?.attempted || 0;
    else if (selectedId === "guess") return totalMarks?.guess || 0;
    else if (selectedId === "review") return totalMarks?.review || 0;
    else return totalQues;
  };

  return (
    <>
      <View style={styles.containerNew}>
        <Loading loading={loading} text="Loading results. Please wait." />

        {
          totalQues > 10 &&
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontal}
          >
            <View style={styles.pagination}>
              {splitNumberIntoGroups(getTotalQues() < 10 ? 10 : getTotalQues()).map(
                (item, index) => (
                  <TouchableOpacity onPress={() => loadPage(item)} key={index}
                    style={
                      active === item
                        ? styles.paginationSingleActive
                        : styles.paginationSingle
                    }
                  >
                    <Text
                      style={{
                        fontFamily: regular,
                        fontSize: moderateScale(13),
                        lineHeight: moderateScale(13),
                        textAlignVertical: 'center',
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </ScrollView>
        }

        <FlatList
          data={solution}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.innerContainerNew}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ marginVertical: 10, marginHorizontal: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>

                <View style={{ flex: 1, paddingRight: 1 }}>
                  <SolutionItem
                    item={item}
                    index={index}
                    active={active}
                    totalQues={totalQues}
                    titleId={titleId}
                    navigation={navigation}
                    token={token}
                    user={user}
                    bookmarkeditems={bookmarkedIds}
                  />
                </View>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.filter}>
        <TouchableOpacity
          onPress={() => setFilter(true)}
          style={[styles.displayFlex, styles.filterTouch]}
        >
          <FontAwesome5 name="filter" size={12} color="#ffffff" />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <FilterModal
        modalVisible={filter}
        setModalVisible={setFilter}
        totalQues={totalQues}
        totalMarks={totalMarks}
        confirmFilter={confirmFilter}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(Solution);
