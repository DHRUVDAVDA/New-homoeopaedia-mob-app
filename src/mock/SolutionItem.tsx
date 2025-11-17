import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, Dimensions } from "react-native";
import styles from "./ResultStyle";
import HTML from "react-native-render-html";
import { BASE_URL, WEB_URL } from "../consts";
import { main_font, regular } from "../constants/font";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import axios from "axios";
import { moderateScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

interface SolutionItemProps {
  item: any;
  index: number;
  active: any;
  navigation: any;
  totalQues: number;
  titleId: number;
  token: String;
  user: any;
  bookmarkeditems: any;
}

const SolutionItem: React.FC<SolutionItemProps> = ({
  item,
  index,
  active,
  navigation,
  totalQues,
  titleId,
  token,
  user,
  bookmarkeditems,
}) => {
  const [bookmarkedIds, setBookmarkedIds] = useState(bookmarkeditems);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
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

  const checkAnswerText = (
    correct_ans: number,
    options_id: any,
    type: string
  ) => {
    if (correct_ans === options_id) {
      return "Correct";
    } else if (type === "answered" && correct_ans !== options_id) {
      return "Wrong";
    } else if (type === "visited") {
      if (options_id === null || options_id === 0) return "Visited";
      else return "Wrong";
    } else if (type === null) {
      return "Unattempted";
    } else {
      return "Wrong";
    }
  };

  const answerText = checkAnswerText(
    parseInt(item.correct_ans),
    item.manswers.length > 0 ? parseInt(item.manswers[0].options_id) : null,
    item.manswers.length > 0 ? item.manswers[0].type : null
  );
  console.log("answerText", answerText)
  const numberingStyle =
    answerText === "Correct"
      ? styles.numberingActive : answerText == "Visited"
        ? styles.numberVisited
        : answerText === "Wrong"
          ? styles.numberingWrong
          : styles.numbering;

  const colorStyle =
    answerText === "Correct"
      ? styles.colorGreen : answerText == "Visited"
        ? styles.colorBlue
        : answerText === "Wrong"
          ? styles.colorRed
          : styles.colorGrey;

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


  const toggleBookmark = async (id: number, index) => {
    const isBookmarked = bookmarkedIds.includes(id);
    const newStatus = !isBookmarked;

    try {
      // setLoading(true);
      const payload = {
        user_id: user.user_id,
        q_id: id,
        status: newStatus,
        q_number: parseInt(active.split("-")[0]) + index
      };
      const response = await axios.post(
        `${BASE_URL}/bookmark/mock-bookmark?api_token=${token}`,
        payload
      );
      if (response.data.success) {
        Toast.show(
          newStatus
            ? "Bookmark added successfully."
            : "Bookmark removed successfully.",
          Toast.LONG
        );

        setBookmarkedIds((prev) =>
          newStatus ? [...prev, id] : prev.filter((item) => item !== id)
        );
      }
    } catch (error: any) {
      console.error(
        "Error toggling bookmark:",
        error.response?.data || error.message || "Unknown error"
      );
      Toast.show("Error updating bookmark.", Toast.LONG);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("MockResultQues", {
            titleId: titleId,
            totalQues: totalQues,
            title: "",
            questionId: item.id,
          })
        }
        style={styles.answer}
        key={item.id}
      >

        <View style={{
          width: '15%',
          alignItems: 'center',
        }}>
          <Text style={[numberingStyle, styles.qtxt]}>
            {parseInt(active.split("-")[0]) + index}
          </Text>
        </View>

        <View
          style={[
            styles.flex,
            {
              // paddingHorizontal: 1,
              // paddingTop: 19,
              // paddingBottom: 7,
              width: '73%'
            },
          ]}
        >
          <View style={{ marginLeft: 5}}>
            <HTML
              contentWidth={width}
              source={{ html: item.ques }}
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
                style: { fontFamily: main_font, fontSize: moderateScale(13) },
              }}
              baseStyle={{ marginTop: 0 }}
            />
            {item?.image && (
              <Image
                source={{ uri: `${WEB_URL}${item?.image}` }}
                style={[styles.quesImage, { marginTop: 10, borderRadius: 8 }]}
                resizeMode="contain"
              />
            )}
          </View>
          <View
            style={[
              styles.answer
            ]}
          >
            <Text style={[colorStyle, styles.qtxt, { marginRight: 4 }]}>
              {answerText}
            </Text>
            <Text style={[styles.dot, { marginHorizontal: 2 }]}>.</Text>
            <Text style={[styles.colorGrey, styles.qtxt, { flex: 1 }]}>
              {/* {item.options_solutions.name}*/} {item.get_subject?.name}
            </Text>
          </View>
        </View>
        <View style={{
          width: '7%',
          alignItems: 'center',
        }}>
          {
            isSubscribed ? (
              <TouchableOpacity
                style={{ marginTop: 1 }}
                onPress={() => toggleBookmark(item.id, index)}
              >
                {bookmarkedIds.length > 0 &&
                  bookmarkedIds.includes(item.id) ? (
                  <Ionicons name="bookmark-sharp" size={24} color="black" />
                ) : (
                  <Ionicons name="bookmark-outline" size={24} color="black" />
                )}
              </TouchableOpacity>
            ) : null
          }

        </View>
      </TouchableOpacity>
      {/* <Text style={{ fontSize: moderateScale(14), fontFamily: regular, color: "#666", marginTop: 2 }}>
        Subject –{" "}
        <Text style={{ fontFamily: main_font, color: "#333" }}>
          {item.get_subject?.name}
        </Text>
      </Text> */}
    </View>

  );
};

export default SolutionItem;
