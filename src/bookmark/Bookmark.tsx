import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import HeaderText from "../layout/HeaderText";
import Footer from "../layout/Footer";
import styles from "./bookmarkStyles";
import { Picker } from "@react-native-picker/picker";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../consts";
import { WEB_URL } from "../consts";
import { User } from "../_redux/reducers/types";
import HTML from "react-native-render-html";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import Loading from "../layout/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { main_font, regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

type MyProps = {
  navigation: any;
  token: string;
  route: any;
  user: User;
};

type Question = {
  id: number;
  question: string;
  q_id: number;
  image: string;
  subject: number | string;
  correct_answer: string;
  expl: string;
};

type Subject = {
  id: number;
  name: string;
};

const BookmarkScreen = ({ navigation, user, token, route }: MyProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [comingFromDetails, setComingFromDetails] = useState(false);

  const [selTitle, setSelTitles] = useState<string>("all");
  const [titles, setTitles] = useState<Subject[]>([]);
  const [selTitleName, setselTitleName] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      if (!comingFromDetails) {
        const selectedId = id ? id.toString() : "all";
        setSelTitles(selectedId);
        setCurrentPage(1);
        setLoading(true);
        fetchTitles();
        fetchQuestions(selectedId, 1); // Always load page 1 if not returning from details
      } else {
        setComingFromDetails(false); // reset flag for next time
      }
    }, [comingFromDetails])
  );

  const { id } = route.params || {};

  const fetchTitles = () => {
    const postData = {
      user_id: user.user_id, // Add the user_id here
    };
    const URL = `${BASE_URL}/bookmark/get-title/?api_token=${token}`;
    axios.post(URL, postData).then(
      (res) => {
        if (res.data.data.length > 0) {
          setTitles(res.data.data);
          const titlename = res.data.data.find((item) => item.id == id)?.name
          setselTitleName(titlename);
        }
      },
      (error) => {
        console.log("Error fetching subjects:", error);
      }
    );
  };

  const isValidExplanation = (expl) => {
    if (!expl) return false;

    // Remove all HTML tags and trim whitespace & newlines
    const stripped = expl
      .replace(/<[^>]*>/g, "")
      .replace(/\n/g, "")
      .trim();

    // Return true only if meaningful content exists
    return stripped.length > 0;
  };

  const fetchQuestions = (title: string = "all", page: number = 1) => {
    const URL = `${BASE_URL}/bookmark/mock-bookmark-list/?api_token=${token}`;
    axios
      .post(URL, {
        user_id: user.user_id,
        page: page,
        title_id: title === "all" ? null : title,
      })
      .then(
        (res) => {
          const data = res.data.data;
          setAllQuestions(data.data);
          console.log("data.data", data.data);
          setTotalPages(data.total_page || 1);
          setCurrentPage(parseInt(data.current_page));

          const formattedQuestions: Question[] = data.data.map((item: any) => {
            // Find the correct answer option based on correct_ans value
            const correctOption = item.get_qustions.options.find(
              (option: any) => option.id === item.get_qustions.correct_ans
            );

            return {
              id: item.id,
              q_number: item.q_number,
              question: item.get_qustions.ques,
              q_id: item.get_qustions.id,
              image: item.get_qustions.image,
              subject: item.get_qustions.subject_id || "all",
              correct_answer: correctOption ? correctOption.name : null, // Store the correct answer name
              expl: item.get_qustions.expl,
            };
          });

          console.log("formattedQuestions", formattedQuestions);

          setQuestions(formattedQuestions);
          setLoading(false);
        },
        (error) => {
          console.log("Error fetching questions:", error);
          setLoading(false);
        }
      );
  };

  const changeSubject = (value: string) => {
    setSelTitles(value);
    setLoading(true);
    fetchQuestions(value, 1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setLoading(true);
      fetchQuestions(selTitle, page);
    }
  };

  const removeBookmark = async (id: number) => {
    try {
      setLoading(true);
      const payload = {
        user_id: user.user_id,
        q_id: id,
        status: false,
      };
      const response = await axios.post(
        `${BASE_URL}/bookmark/mock-bookmark?api_token=${token}`,
        payload
      );
      if (response.data.success) {
        fetchQuestions(selTitle, currentPage);
        Toast.show("Bookmark removed successfully.", Toast.LONG);
      }
    } catch (error: any) {
      console.error(
        "Error removing bookmark:",
        error.response?.data || error.message || "Unknown error"
      );
      Toast.show("Error removing bookmark.", Toast.LONG);
      setLoading(false);
    }
  };

  const navigateTodetails = (id) => {
    const item = allQuestions.find((data) => data.id === id);
    console.log(item)
    // if (item) {
    //   setComingFromDetails(true); // Set flag
    navigation.navigate("BookmarkDetails", { data: item, titlename : selTitleName });
    // } else {
    //   console.log("Item not found");
    // }
  };

  return (
    <View style={styles.container}>
      <Loading loading={loading} text="Loading contents. Please wait." />
      <HeaderText navigation={navigation} heading="Bookmarks" />

      {/* Subject Picker */}
      <View style={styles.bookmarkTitle}>
        <Text
          style={{
            fontSize: moderateScale(16),
            fontFamily: semi_bold,
            color: "#000",
          }}
        >
          {selTitle === "all"
            ? "All Bookmarks"
            : titles.find((item) => item.id.toString() === selTitle)?.name ||
            ""}
        </Text>
      </View>

      {/* Question List */}
      <View
        style={{
          marginTop: 10,
          flex: 1,
        }}
      >
        {/* Pagination */}
        {totalPages > 1 && (
          <View style={{
            borderBottomColor: "#fff",
            borderBottomWidth: 1,
            marginBottom: 10
          }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                paddingHorizontal: 10,
                marginBottom: 10,
              }}
            >
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                const startQ = (page - 1) * 10 + 1;
                const endQ = page * 10;
                return (
                  <TouchableOpacity
                    key={page}
                    onPress={() => handlePageChange(page)}
                    style={
                      currentPage === page
                        ? styles.paginationActive
                        : styles.paginationList
                    }
                  >
                    <Text
                      style={{
                        fontFamily: regular,
                        fontSize: moderateScale(13),
                        lineHeight: 13,
                        textAlignVertical: "center",
                      }}
                    >
                      {startQ}–{endQ}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {/* ######################### */}

          {/* Questions */}
          {questions.length === 0 ? (
            <View style={styles.centerAlignContainer}>
              <Text style={styles.warningText}>
                No questions have been bookmarked
              </Text>
            </View>
          ) : (
            questions.map((item, index) => (
              <View key={index}>
                <TouchableOpacity style={[styles.questionCard, { alignItems: 'flex-start' }]}
                  onPress={() => navigateTodetails(item.id)}
                >
                  {/* 1. Question Number */}

                  <View
                    style={{
                      width: "10%"
                    }}
                  >
                    <Text style={styles.questionNumberText}>
                      {/* Q{(currentPage - 1) * 10 + index + 1}. */}
                      Q{item.q_number}.
                    </Text>
                  </View>

                  {/* 2. Question Text */}
                  <View
                    style={[
                      styles.flex,
                      {
                        // paddingHorizontal: 1,
                        // paddingTop: 15,
                        // paddingBottom: 15,
                        width: "73%",
                      },
                    ]}
                  >
                    <View style={{ alignItems: 'flex-start' }}>
                      <HTML
                        contentWidth={width}
                        source={{ html: item.question || "<p>No content</p>" }}
                        tagsStyles={{
                          body: {
                            fontFamily: main_font,
                            fontSize: moderateScale(13),
                            marginTop: 0,
                          },
                          p: {
                            fontFamily: main_font,
                            fontSize: moderateScale(13),
                            marginTop: 0,
                            marginBottom: 0,
                          },
                          span: {
                            fontFamily: main_font,
                            fontSize: moderateScale(13),
                            marginTop: 0,
                          },
                        }}
                        defaultTextProps={{
                          style: {
                            fontFamily: main_font,
                            fontSize: moderateScale(13),
                          },
                        }}
                        baseStyle={{ marginTop: 0 }}
                      />
                    </View>
                    {item?.image && (
                      <Image
                        source={{ uri: `${WEB_URL}${item?.image}` }}
                        style={[
                          styles.quesImage,
                          { marginTop: 10, borderRadius: 8 },
                        ]}
                        resizeMode="contain"
                      />
                    )}

                    {/* <Text style={[styles.answersText]}>
                      {item.correct_answer}
                    </Text> */}

                    {/* {item.expl && isValidExplanation(item.expl) && (
                      <View style={{ marginTop: 6 }}>
                        <Text style={styles.explthin}>Explanation</Text>
                        <HTML
                          source={{ html: item.expl }}
                          contentWidth={width}
                          tagsStyles={{
                            body: {
                              fontFamily: main_font,
                              fontSize: moderateScale(14),
                            },
                            p: {
                              fontFamily: main_font,
                              fontSize: moderateScale(14),
                            },
                            span: {
                              fontFamily: main_font,
                              fontSize: moderateScale(14),
                            },
                          }}
                          defaultTextProps={{
                            style: {
                              fontFamily: main_font,
                              fontSize: moderateScale(14),
                            },
                          }}
                          baseStyle={{ marginTop: 0 }}
                        />
                      </View>
                    )} */}
                  </View>

                  {/* 3. Bookmark Icon */}
                  <TouchableOpacity onPress={() => removeBookmark(item.q_id)}>
                    <Ionicons name="bookmark-sharp" size={24} color="black" />
                  </TouchableOpacity>
                </TouchableOpacity>
                {/* Separator Line */}
                <View style={styles.separator} />
              </View>
            ))
          )}

          {/* ################################## */}
        </ScrollView>
      </View>

      <Footer navigation={navigation} page="Bookmark" />
    </View>
  );
};

// Redux connection
const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(BookmarkScreen);
