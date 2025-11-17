import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import styles from "./ResultStyle";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import Back from "../layout/Back";
import axios from "axios";
import { BASE_URL, WEB_URL } from "../consts";
import Toast from "react-native-simple-toast";
import HTML from "react-native-render-html";
import Loading from "../layout/Loading";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { main_font, regular } from "../constants/font";
import { moderateScale } from "react-native-size-matters";
import { theme_clr } from "../constants/colors";

const { width } = Dimensions.get("window");

type MyProps = {
  navigation: any;
  user: User;
  token: string;
  route: any;
};

const SolutionQues = ({ navigation, route, user, token }: MyProps) => {
  const { titleId, totalQues, title, questionId } = route.params;
  const [quesNo, setQuesNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [option, setOption] = useState(0);
  const [response, setResponse] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("");
  const [issue, setIssue] = useState("");
  const [index, setIndex] = useState(0);
  const [isexpl, setShowexpl] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const scrollRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    loadQuestions();
    checksubscription();
  }, []);

  const checksubscription = async () => {
    const postData = {
      user_id: user.user_id,
      title_id: titleId
    };
    const URL = `${BASE_URL}/home/check-subscription/?api_token=${token}`;
    axios.post(URL, postData).then(
      (res) => {
        console.log(res)
        if (res.data.success) {
          setIsSubscribed(res.data.data);
        }
      },
      (error) => {
        console.log("Error fetching subjects:", error);
      }
    );
  };

  const loadQuestions = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/mquestions/${titleId}/${user.user_id}?api_token=${token}`
      );
      const allQuestions = res.data.result;
      setQuestions(allQuestions);
      console.log("res --->", res.data.result)
      if (questionId) {
        const foundIndex = allQuestions.findIndex(
          (q: any) => q.id === questionId
        );
        if (foundIndex !== -1) {
          setQuesNo(foundIndex);

          setTimeout(() => {
            scrollRef.current?.scrollTo({
              x: foundIndex * 60,
              animated: true,
            });
          }, 300);

        } else {
          setQuesNo(0); // fallback to first if not found
          setTimeout(() => {
            scrollRef.current?.scrollTo({ x: 0, animated: true });
          }, 300);
        }
      } else {
        setQuesNo(0);
        setTimeout(() => {
          scrollRef.current?.scrollTo({ x: 0, animated: true });
        }, 300);
      }
    } catch (error) {
      Toast.show("Network error. Try again.", Toast.LONG);
    }

    setLoading(false);
  };

  // const checkOptions = async (quesId: number, optionId: number) => {
  //   setOption(optionId);
  //   setLoading(true);

  //   const correct = questions[quesNo].correct_ans;

  //   // const isCorrect = correct === optionId;

  //   const wrong =
  //     questions[quesNo].correct_ans !== optionId
  //       ? optionId
  //       : questions[quesNo].correct_ans;

  //   await axios
  //     .get(
  //       `${BASE_URL}/checkanscount/${quesId}/${correct}/${wrong}?api_token=${token}`
  //     )
  //     .then(
  //       (res) => {
  //         console.log(res.data)
  //         setResponse(res.data);
  //         setShowexpl(true)
  //       },
  //       (error) => {
  //         Toast.show("Network error. Try again.", Toast.LONG);
  //       }
  //     );

  //   setLoading(false);
  // };

  const checkOptions = async (quesId: number, optionId: number) => {
    setOption(optionId);
    setLoading(true);

    const correct = questions[quesNo].correct_ans;

    await axios
      .get(
        `${BASE_URL}/checkanscount/${quesId}/${correct}/${optionId}?api_token=${token}`
      )
      .then((res) => {
        setResponse(res.data);
        setShowexpl(true);
      })
      .catch(() => {
        Toast.show("Network error. Try again.", Toast.LONG);
      });

    setLoading(false);
  };



  const saveReport = (quesID: number) => {
    if (!type) Toast.show("Report type required.", Toast.LONG);
    else if (!issue) Toast.show("Elaborate issue required.", Toast.LONG);
    else {
      setLoading(true);

      axios
        .post(`${BASE_URL}/report?api_token=${token}`, {
          user_id: user.user_id,
          quesID: quesID,
          type: type,
          issue: issue,
        })
        .then((response) => {
          setModalVisible(false);
          setLoading(false);

          Toast.show("Question successfully reported.", Toast.LONG);
        })
        .catch((error) => {
          setLoading(false);
          Toast.show("Network error. Tryagain.", Toast.LONG);
        });
    }
  };

  console.log(questions);

  const toggleBookmark = async (quesID: number) => {
    console.log("Toggling bookmark for Question ID:", quesID);
    console.log("Toggling bookmark for user.user_id:", user.user_id);

    const questionIndex = questions.findIndex((q) => q.id === quesID);
    if (questionIndex === -1) return; // Question not found

    const currentBookmarkStatus = questions[questionIndex]?.is_bookmarked || false;

    const payload = {
      user_id: user.user_id,
      q_id: quesID,
      status: !currentBookmarkStatus, // true = add, false = remove
      q_number: quesNo + 1
    };

    console.log("Sending API request:", payload);

    try {
      const response = await axios.post(
        `${BASE_URL}/bookmark/mock-bookmark?api_token=${token}`,
        payload
      );

      console.log("API Response:", response); // Log the response

      if (response.data?.success) {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].is_bookmarked = !currentBookmarkStatus;
        setQuestions(updatedQuestions);
      } else {
        Toast.show("Failed to update bookmark.", Toast.LONG);
      }
    } catch (error) {
      console.error(
        "Error updating bookmark:",
        error?.response?.data || error.message
      );
      Toast.show("Network error. Try again.", Toast.LONG);
    }
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

  // const totalResponses = response.correct + response.wrong;
  const CHARACTER_LIMIT = 200;
  // function decodeEntities(str) {
  //   return str
  //     .replace(/&nbsp;/g, ' ')
  //     .replace(/&amp;/g, '&')
  //     .replace(/&lt;/g, '<')
  //     .replace(/&gt;/g, '>')
  //     .replace(/&quot;/g, '"')
  //     .replace(/&#039;/g, "'");
  // }

  // const questionHTML = questions?.[quesNo]?.ques ?? '';

  // // Convert line-separating tags to \n before removing HTML
  // let cleanedHTML = questionHTML
  //   .replace(/<br\s*\/?>/gi, '\n')     // <br> => newline
  //   .replace(/<\/p>/gi, '\n')          // </p> => newline
  //   .replace(/<\/div>/gi, '\n')        // </div> => newline
  //   .replace(/<[^>]+>/g, '');          // remove remaining tags

  // let plainText = decodeEntities(cleanedHTML);

  // // Preserve newlines, normalize multiple spaces/tabs
  // plainText = plainText.replace(/[ \t]+/g, ' ').replace(/\r\n|\r/g, '\n').trim();
  // const isTruncated = plainText.length > CHARACTER_LIMIT;
  // const truncatedText = plainText.substring(0, CHARACTER_LIMIT) + '...';


  function decodeEntities(str) {
    return str
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/gi, "'")
      .replace(/&rsquo;/gi, '’')
      .replace(/&lsquo;/gi, '‘')
      .replace(/&ldquo;/gi, '“')
      .replace(/&rdquo;/gi, '”')
      .replace(/&hellip;/gi, '…')
      .replace(/&mdash;/gi, '—')
      .replace(/&ndash;/gi, '–');
  }

  function convertHTMLToPlainText(html) {
    let index = 1;

    return decodeEntities(
      html
        // Convert list items
        .replace(/<ol>/gi, '') // optional: remove opening <ol>
        .replace(/<\/ol>/gi, '')
        .replace(/<ul>/gi, '')
        .replace(/<\/ul>/gi, '')
        .replace(/<li>(.*?)<\/li>/gi, (_, item) => `\n${index++}. ${item.trim()}`)

        // Convert block-level tags to line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n')

        // Remove all remaining HTML tags
        .replace(/<[^>]+>/g, '')

        // Normalize spaces and newlines
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{2,}/g, '\n')
        .replace(/\r\n|\r/g, '\n')
        .trim()
    );
  }

  const questionHTML = questions?.[quesNo]?.ques ?? '';
  const plainText = convertHTMLToPlainText(questionHTML);
  const isTruncated = plainText.length > CHARACTER_LIMIT;
  const truncatedText = isTruncated
    ? plainText.substring(0, CHARACTER_LIMIT).trimEnd() + '...'
    : plainText;

  return (
    <View style={styles.containerNew}>
      <Loading loading={loading} text="Loading questions. Please wait." />
      <Back navigation={navigation} />


      <View style={{ paddingHorizontal: 18 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between", marginTop: "1%"
          }}
        >
          <Text style={[styles.heading, styles.mb10]}>
            Questions {quesNo + 1} of {totalQues}
          </Text>
          {
            isSubscribed ? (
              <TouchableOpacity
                onPress={() => toggleBookmark(questions[quesNo]?.id)}
              >
                {
                  questions[quesNo]?.is_bookmarked ?
                    <Ionicons name="bookmark-sharp" size={24} color="black" />
                    :
                    <Ionicons name="bookmark-outline" size={24} color="black" />
                }
              </TouchableOpacity>
            ) : null
          }

        </View>

        <View>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontal}
              ref={scrollRef}
            >
              <View style={styles.pagination}>
                {Array.from({ length: totalQues }).map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setQuesNo(index);
                      setOption(0);
                      setResponse({});
                      setShowexpl(false);
                      setExpanded(false);
                    }}
                    key={index}
                    style={[
                      styles.paginationSingle,
                      index === quesNo &&
                      (questions[index]?.sel_answer === questions[index]?.correct_ans
                        ? styles.correctAnswer :
                        questions[index]?.sel_answer == 0 ?
                          styles.visited
                          : styles.wrongAnswer),
                      index !== quesNo && questions[index]?.sel_answer != null &&
                      (questions[index]?.sel_answer === questions[index]?.correct_ans
                        ? styles.answeredCorrect :
                        questions[index]?.sel_answer == 0 ?
                          styles.notanswered
                          : styles.answeredWrong),
                    ]}

                  >
                    <Text
                      style={[{
                        fontFamily: regular,
                        fontSize: moderateScale(14),
                        lineHeight: 15,
                        textAlignVertical: 'center',
                      },
                      index === quesNo &&
                      (questions[index]?.sel_answer === questions[index]?.correct_ans
                        ? styles.textWhite
                        : styles.textWhite),
                      index !== quesNo &&
                      (questions[index]?.sel_answer === questions[index]?.correct_ans
                        ? styles.textGreen :
                        questions[index]?.sel_answer == 0 ?
                          styles.textBlue
                          : styles.textRed),
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 18,
        justifyContent: 'space-between',
      }}
        style={{ flex: 1 }}>
        <View style={styles.subcontainer}>

          <View style={styles.topHalf}>
            <View>
              {questions.length > 0 && (
                <View>
                  <View>
                    <HTML
                      source={{ html: questionHTML }}
                      contentWidth={width}
                      tagsStyles={{
                        body: { fontFamily: main_font, fontSize: moderateScale(14), marginBottom: 0, paddingBottom: 0 },
                        p: { fontFamily: main_font, fontSize: moderateScale(14), marginBottom: 0, paddingBottom: 0 },
                        span: { fontFamily: main_font, fontSize: moderateScale(14), marginBottom: 0, paddingBottom: 0 },
                      }}
                      defaultTextProps={{
                        style: { fontFamily: main_font, fontSize: moderateScale(14), marginBottom: 0, paddingBottom: 0 },
                      }}
                    />
                  </View>

                  {questions[quesNo]?.image && (
                    <Image
                      source={{ uri: `${WEB_URL}${questions[quesNo]?.image}` }}
                      style={styles.quesImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
              )}
            </View>
          </View>
          <View style={styles.bottomHalf}>
            <TouchableOpacity
              style={[styles.mt10, styles.mb10]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.fntStyle}>Report this Question</Text>
            </TouchableOpacity>
            <View style={styles.bottomContent}>
              {questions.length > 0 && (
                <View>
                  {questions[quesNo].options.map((item: any, index: number) => {
                    const optionLabels = ["A", "B", "C", "D"];
                    const selectedOption = option;
                    const isCorrect = response?.correct == item.id;
                    const isSelected = selectedOption === item.id;
                    const rawCount = Number(response?.counts?.[item.id] || 0);
                    const percentage =
                      response?.total > 0
                        ? Math.round((rawCount / response.total) * 100)
                        : 0;
                    const shouldShow = isCorrect || (isSelected && !isCorrect);

                    return (
                      <View key={index}>
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => checkOptions(questions[quesNo].id, item.id)}
                          style={[
                            styles.optionContainer,
                            isCorrect && option
                              ? styles.active
                              : isSelected && !isCorrect && option
                                ? styles.wrong
                                : styles.defaultBorder,
                          ]}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                              style={[
                                styles.lblCircle,
                                isCorrect && option
                                  ? styles.lblboxcrct
                                  : isSelected && !isCorrect && option
                                    ? styles.lblboxwrng
                                    : styles.lblboxDefault,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.labelText,
                                  isCorrect && option
                                    ? styles.textWhite
                                    : isSelected && !isCorrect && option
                                      ? styles.textWhite
                                      : styles.textDefault,
                                ]}
                              >
                                {optionLabels[index]}
                              </Text>
                            </View>
                            <Text style={styles.optionText}>{item.name}</Text>
                          </View>
                        </TouchableOpacity>



                        {Boolean(option && shouldShow) && (
                          <Text
                            style={
                              isCorrect
                                ? styles.correctText
                                : isSelected
                                  ? styles.wrongText
                                  : styles.percentageText
                            }
                          >
                            {`${percentage}% students selected this`}
                          </Text>
                        )}
                      </View>

                    );
                  })}
                </View>
              )}
            </View>
          </View>

          {
            questions.length > 0 && isValidExplanation(questions[quesNo]?.expl) && (
              isexpl ? (
                <View>
                  <View style={{
                    marginTop: 9
                  }}
                  // onPress={() => setShowexpl(!isexpl)}
                  >
                    <Text style={{
                      fontFamily: main_font,
                      fontSize: moderateScale(14),
                      color: theme_clr
                    }}>Explanation</Text>
                  </View>
                  <View style={{
                    marginTop: -16
                  }}>
                    <HTML
                      source={{
                        html: questions[quesNo].expl,
                      }}
                      contentWidth={width}
                      tagsStyles={{
                        body: { fontFamily: main_font, fontSize: moderateScale(14) },
                        p: { fontFamily: main_font, fontSize: moderateScale(14) },
                        span: { fontFamily: main_font, fontSize: moderateScale(14) },
                      }}
                      defaultTextProps={{
                        style: { fontFamily: main_font, fontSize: moderateScale(14) },
                      }}
                    />
                  </View>
                </View>
              ) : null
            )
          }

        </View>

      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Feedback/Report Error</Text>
            <Text style={styles.label}>What are you reporting?</Text>
            <View
              style={{
                alignSelf: "flex-start",
                borderWidth: 1,
                borderColor: "#000000",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <Picker
                selectedValue={type}
                onValueChange={(item) => setType(item)}
                style={{
                  width: Dimensions.get("window").width - 80,
                }}
                mode="dropdown"
              >
                <Picker.Item label="---- Select Type ----" value="" />
                <Picker.Item label="Factual error" value="Factual error" />
                <Picker.Item
                  label="Confusing question"
                  value="Confusing question"
                />
                <Picker.Item
                  label="Inadequate explanation"
                  value="Inadequate explanation"
                />
              </Picker>
            </View>
            <Text style={styles.label}>Elaborate issue</Text>
            <TextInput
              multiline={true}
              value={issue}
              onChangeText={(e) => setIssue(e)}
              style={styles.issue}
            />
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => saveReport(questions?.[quesNo]?.["id"])}
                style={[styles.button, styles.buttonSend, styles.mr10]}
              >
                <Text style={styles.textStyle}>Send</Text>
              </Pressable>
              <Pressable
                style={[styles.clsbutton, styles.buttonClose, styles.ml10]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.btntextStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View >
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(SolutionQues);
