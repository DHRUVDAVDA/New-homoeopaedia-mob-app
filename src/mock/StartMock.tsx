import React, { useState, useEffect } from "react";
import {
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View, Dimensions
} from "react-native";
import styles from "./MockStyle";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import { Ionicons } from "@expo/vector-icons";
import QuestionsModal from "./QuestionsModal";
import axios from "axios";
import { BASE_URL, WEB_URL } from "../consts";
import Toast from "react-native-simple-toast";
import Loading from "../layout/Loading";
import HTML from "react-native-render-html";
import { filter } from "lodash";
import EndModal from "./EndModal";
import PauseModal from "./PauseModal";
import moment from "moment";
import CheckBox from "react-native-checkbox";
import AllQuestionsModal from "./AllQuestionsModal";
import { main_font, regular, semi_bold } from "../constants/font";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale } from "react-native-size-matters";
import { theme_clr } from "../constants/colors";
const width = Dimensions.get("window").width;

type MyProps = {
  navigation: any;
  user: User;
  token: string;
  route: any;
};

const StartMock = ({ navigation, route, user, token }: MyProps) => {
  const { titleId, totalQues, title, status, duration, start, end, tab } =
    route.params;
  const [time, setTime] = useState(duration * 60);
  const [modal, setModal] = useState(false);
  const [isVerify, setVerifyQusModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [pauseModal, setPauseModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quesIndex, setQuesIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [markReview, setMarkReview] = useState([]);
  const [guess, setGuess] = useState([]);
  const [skippedQues, setSkippedQues] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [testEndedManually, setTestEndedManually] = useState(false);
  const [modaltype, setmodaltype] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    if (status === "Paused" && isMounted) {
      const currentTime = moment();
      const startTime = moment(start);
      const endTime = moment(end);
      const totalElapsedTime = currentTime.diff(startTime, "seconds");

      if (currentTime.isAfter(endTime)) {
        if (isMounted) confirmEnd(); // Prevent calling after unmount
      } else {
        const remainingTime = endTime.diff(currentTime, "seconds");
        if (remainingTime > 0 && isMounted) {
          setTime(remainingTime);
          setIsRunning(false);
        }
      }

      loadPausedQuestions();
    }

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, [status]);

  useEffect(() => {
    if (time === 0 && !testEndedManually) {
      console.log("### ys time up####")
      confirmEnd();
    }
  }, [time]);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            confirmEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval); // Clears interval when component unmounts
    };
  }, [isRunning, time]);



  /** Load Initial Questions */
  useEffect(() => {
    // Capture the start time when the exam begins
    const startTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const endTime = moment().add(duration, "minutes").format("YYYY-MM-DD HH:mm:ss");
    saveStatus("Started", startTime, endTime);
    loadQuestions();
  }, []);

  /** Handle Android Back Button */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      setEndModal(true);
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const markForReview = (quesId: number, selectedOptionId: number | null) => {
    if (!isRunning) {
      Toast.show("Please resume the timer to start exam", Toast.LONG);
      return;
    }

    setMarkReview((prevItems) => {
      const isMarked = prevItems.includes(quesId);
      const updatedMarkReview = isMarked
        ? prevItems.filter((item) => item !== quesId) // Remove if already marked
        : [...prevItems, quesId]; // Add if not marked

      // Update the selectedOptions array
      setSelectedOptions((prevItems) => {
        const existingItem = prevItems.find((item) => item.question_id === quesId);

        if (existingItem) {
          // Update type to "mark-review-next" if the question is already in selectedOptions
          return prevItems.map((item) =>
            item.question_id === quesId
              ? { ...item, type: isMarked ? "save-next" : "mark-review-next" }
              : item
          );
        } else if (!isMarked && selectedOptionId !== null) {
          // If question is not in selectedOptions and has an option selected, add it with type "mark-review-next"
          return [...prevItems, { question_id: quesId, option_id: selectedOptionId, type: "mark-review-next" }];
        }

        return prevItems;
      });

      return updatedMarkReview;
    });
  };

  const confirmGuess = (quesId: number) => {
    if (!isRunning)
      Toast.show("Please resume the timer to start exam", Toast.LONG);
    else {
      const newItem = quesId;
      const itemIndex = guess.findIndex((item: any) => item === newItem);

      if (itemIndex !== -1) {
        // Item exists, remove it
        setGuess((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems.splice(itemIndex, 1);
          return updatedItems;
        });
      } else {
        // Item doesn't exist, add it
        setGuess((prevItems) => [...prevItems, newItem]);
      }
    }
  };

  const selectOption = (quesId: number, optId: number) => {
    if (!isRunning) {
      Toast.show("Please resume the timer to start exam", Toast.LONG);
      return;
    }

    setSelectedOptions((prevItems) => {
      const existingItem = prevItems.find((item) => item.question_id === quesId);
      const isMarkedForReview = markReview.includes(quesId);

      if (existingItem) {
        // Update existing entry with new option_id, keeping the correct type
        return prevItems.map((item) =>
          item.question_id === quesId
            ? { ...item, option_id: optId, type: isMarkedForReview ? "mark-review-next" : "save-next" }
            : item
        );
      } else {
        // Add a new entry with correct type
        return [...prevItems, { question_id: quesId, option_id: optId, type: "save-next" }];
      }
    });
  };


  const clearResponse = (quesId: number) => {
    if (!isRunning)
      Toast.show("Please resume the timer to start exam", Toast.LONG);
    else
      setSelectedOptions((prevItems) =>
        prevItems.filter((item) => item.question_id !== quesId)
      );
  };

  const loadPrevQuestion = () => {
    setExpanded(false)
    setQuesIndex(quesIndex - 1);
  };

  const loadQuestions = async () => {
    await axios
      .get(
        `${BASE_URL}/mockquestions/${user.user_id}/${titleId}?api_token=${token}`
      )
      .then(
        (res) => {
          setQuestions(res?.data?.result);
          setLoading(false);
          setIsRunning(true);
        },
        (error) => {
          setLoading(false);
          Toast.show("Network error. Tryagain.", Toast.LONG);
        }
      );
  };

  const loadPausedQuestions = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/loadsavedmock/${user.user_id}/${titleId}?api_token=${token}`
      );

      const answered = res.data.result
        .filter((item: any) => item.type === "answered")
        .map((item: any) => ({
          question_id: parseInt(item.questions_id),
          option_id: parseInt(item.options_id),
          type: "save-next",
        }));

      setSelectedOptions(answered);

      const visited = res.data.result
        .filter((item: any) => item.type === "visited")
        .map((item: any) => item.questions_id);

      setSkippedQues(visited);

      const savedIndex = await AsyncStorage.getItem(`pausedIndex_${titleId}`);
      if (savedIndex !== null) {
        setQuesIndex(Number(savedIndex));
      }

      setLoading(false);
      handleResume();
    } catch (error) {
      console.log("Error loading paused questions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && status == "Paused") {
      loadPausedQuestions();
    }
  }, [questions]);

  useEffect(() => {
    console.log("Updated Question Index:", quesIndex);
  }, [quesIndex]);

  const loadNextQuestion = () => {
    setExpanded(false)
    if (!isRunning) {
      Toast.show("Please resume the timer to start exam", Toast.LONG);
      return;
    }

    setIsNextLoading(true); // Disable the button when clicked

    const currentQuestionId = questions?.[quesIndex]?.id;

    if (!currentQuestionId) {
      setIsNextLoading(false); // Re-enable button if question ID is missing
      return;
    }

    const isAttempted = selectedOptions.some(
      (option) => option.question_id === currentQuestionId && option.type !== "mark-review-next"
    );

    const isMarkedForReview = markReview.includes(currentQuestionId);

    setSkippedQues((prevItems) => {
      let updatedSkippedQues = prevItems.filter((item) => item !== currentQuestionId);

      if (!isAttempted && !isMarkedForReview) {
        updatedSkippedQues = [...updatedSkippedQues, currentQuestionId]; // Add only if not attempted or marked
      }
      return updatedSkippedQues;
    });

    setQuesIndex((prevIndex) => prevIndex + 1);

    setTimeout(() => {
      setIsNextLoading(false); // Re-enable button after question loads
    }, 300);
  };


  const handlePause = () => {
    setIsRunning(false);
    setVerifyQusModal(true)
    setmodaltype('pause');
    // setPauseModal(true)
  };

  /** Resume Exam & Restart Timer */
  const handleResume = () => {
    setIsRunning(true); // Restart timer
    setPauseModal(false);
  };

  const finishTest = () => {
    const lastQuestionId = questions?.[quesIndex]?.id;
    setTestEndedManually(true);

    setSkippedQues((prev) => {
      // Check if the question was attempted or marked for review
      const isAttempted = selectedOptions.some((item) => item.question_id === lastQuestionId);
      // const isReviewed = /* Add your review condition here, if applicable */ false;
      const isReviewed = markReview.includes(lastQuestionId);

      if (isAttempted || isReviewed) {
        // Remove from skippedQues if it was attempted or reviewed
        return prev.filter((id) => id !== lastQuestionId);
      } else if (!prev.includes(lastQuestionId)) {
        // If not attempted and not already in skippedQues, add it
        return [...prev, lastQuestionId];
      }
      return prev; // No change needed
    });

    // Delay opening the modal to allow state updates
    setTimeout(() => {
      setVerifyQusModal(true);
    }, 100);
  };

  const endTest = () => {
    setVerifyQusModal(false);
    setEndModal(true);
  };

  const confirmPause = async () => {
    setSaving(true);
    await AsyncStorage.setItem(`pausedIndex_${titleId}`, JSON.stringify(quesIndex));

    await axios
      .post(
        `${BASE_URL}/savemock/${user.user_id}/${titleId}?api_token=${token}`,
        generatePayload()
      )
      .then(
        async (res) => {
          console.log("## confirm pause responser ##", res)
          await saveStatus("Paused", "", "", 1);
        },
        (error) => {
          setSaving(false);
          Toast.show("Network error. Tryagain.", Toast.LONG);
        }
      );
  };


  const generatePayload = () => {
    const answered = selectedOptions.map((item) => ({
      qid: item?.question_id,
      opt: item?.option_id,
      type: item?.type,
      guess: 0,
    }));

    const visited = skippedQues?.map((item) => ({
      qid: item,
      opt: 0,
      type: "visited",
      guess: 0,
    }));

    // **Ensure all unattempted questions are marked properly**
    const allQuestionIds = questions.map((q) => q.id); // Get all question IDs
    const attemptedQuestionIds = selectedOptions.map((item) => item.question_id);
    const visitedQuestionIds = skippedQues; // Already recorded as visited

    // **Filter only unattempted questions**
    const unattempted = allQuestionIds
      .filter((qid) => !attemptedQuestionIds.includes(qid) && !visitedQuestionIds.includes(qid))
      .map((qid) => ({
        qid,
        opt: 0,
        type: "visited",
        guess: 0,
      }));

    const payload = { answers: [...answered, ...visited, ...unattempted] };

    // Ensure latest markReview state is applied
    payload.answers = payload.answers.map((item) =>
      markReview.includes(item.qid) ? { ...item, type: "mark-review-next" } : item
    );

    payload.answers.forEach((item, index) => {
      if (guess.includes(item.qid)) {
        payload.answers[index].guess = 1;
      }
    });
    return payload;
  };


  const confirmEnd = async () => {
    setSaving(true);

    await axios
      .post(
        `${BASE_URL}/savemock/${user.user_id}/${titleId}?api_token=${token}`,
        generatePayload()
      )
      .then(
        async (res) => {
          console.log("## save mock response --", res)
          setSaving(false);
          setModal(false);
          setEndModal(false);
          setVerifyQusModal(false)
          setIsRunning(false); // Stop the timer when exiting
          await AsyncStorage.removeItem(`pausedIndex_${titleId}`);

          navigation.navigate("MockResult", {
            titleId: titleId,
            totalQues: totalQues,
            title: title,
            fromTab: tab
          });
        },
        (error) => {
          setSaving(false);
          Toast.show("Network error. Tryagain.", Toast.LONG);
        }
      );
  };

  const saveStatus = async (statusText = "", start = "", end = "", type = 0) => {
    statusText = status === "Paused" ? "Paused" : statusText;
    console.log("## statusText ##", statusText)
    if (type) setSaving(true);
    await axios
      .post(
        `${BASE_URL}/savemockstatus/${user.user_id}/${titleId}?api_token=${token}`,
        { status: statusText, start_time: start, end_time: end }
      )
      .then(
        (res) => {
          if (type) {
            setSaving(false);
            setModal(false);
            setVerifyQusModal(false)
            setPauseModal(false);
            navigation.navigate("MockScreen");
          }
        },
        (error) => {
          setSaving(false);
          Toast.show("Network error. Tryagain.", Toast.LONG);
        }
      );
  };


  const handleSubmitQuestion = () => {
    if (!isRunning) {
      Toast.show("Please resume the timer to start exam", Toast.LONG);
      return;
    }

    const currentQuestionId = questions?.[quesIndex]?.id;
    if (!currentQuestionId) return;

    // Remove the question from "mark for review" if it exists there
    setMarkReview((prevItems) =>
      prevItems.filter((item) => item !== currentQuestionId)
    );

    // Update the question type
    const existingItem = selectedOptions.find(
      (item) => item.question_id === currentQuestionId
    );

    if (existingItem) {
      // If option is selected, update type to "save-next"
      setSelectedOptions((prevItems) =>
        prevItems.map((item) =>
          item.question_id === currentQuestionId
            ? { ...item, type: "save-next" }
            : item
        )
      );
    } else {
      // If no option is selected, mark as "visited"
      setSkippedQues((prevItems) => [...prevItems, currentQuestionId]);
    }

    // Open the verification modal
    setTimeout(() => {
      setVerifyQusModal(true);
    }, 300);
  };


  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  const alphabets = ["A", "B", "C", "D"];

  const CHARACTER_LIMIT = 130;

  // function decodeEntities(str) {
  //   return str
  //     .replace(/&nbsp;/gi, ' ')  // replace non-breaking space with regular space
  //     .replace(/&amp;/gi, '&')
  //     .replace(/&lt;/gi, '<')
  //     .replace(/&gt;/gi, '>')
  //     .replace(/&quot;/gi, '"')
  //     .replace(/&#039;/gi, "'");
  // }

  // const questionHTML = questions?.[quesIndex]?.ques ?? '';

  // // Step 1: Convert breaks and block endings to newlines
  // let cleanedHTML = questionHTML
  //   .replace(/<br\s*\/?>/gi, '\n')
  //   .replace(/<\/p>/gi, '\n')
  //   .replace(/<\/div>/gi, '\n')
  //   .replace(/<[^>]+>/g, ''); // Remove remaining HTML tags

  // // Step 2: Decode HTML entities
  // let plainText = decodeEntities(cleanedHTML);

  // // Step 3: Normalize spacing and trim
  // plainText = plainText
  //   .replace(/[ \t]+/g, ' ')      // collapse spaces/tabs
  //   .replace(/\n{2,}/g, '\n')     // remove excessive line breaks
  //   .replace(/\r\n|\r/g, '\n')    // normalize newlines
  //   .trim();

  // const isTruncated = plainText.length > CHARACTER_LIMIT;
  // const truncatedText = isTruncated ? plainText.substring(0, CHARACTER_LIMIT).trimEnd() + '...' : plainText;


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

  const questionHTML = questions?.[quesIndex]?.ques ?? '';
  const plainText = convertHTMLToPlainText(questionHTML);
  const isTruncated = plainText.length > CHARACTER_LIMIT;
  const truncatedText = isTruncated
    ? plainText.substring(0, CHARACTER_LIMIT).trimEnd() + '...'
    : plainText;


  const [expanded, setExpanded] = useState(true);

  const Wrapper = expanded ? ScrollView : View;

  return (
    <>
      <Loading
        loading={loading || saving}
        text={
          loading
            ? "Loading questions. Please wait."
            : "Saving answers. Please wait."
        }
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text
            style={[styles.bold16, { flex: 1, marginEnd: 10, fontFamily: semi_bold }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View style={styles.displayFlex}>
            <View style={[styles.displayFlex, styles.timer]}>
              <Ionicons name="time-outline" size={moderateScale(20)} color="#000000" />
              <Text style={[styles.bold, styles.ms5]}>
                {time > 0
                  ? `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                  : "00:00:00"}
              </Text>
            </View>
            {
              !isRunning ?
                <TouchableOpacity onPress={() => handleResume()}>
                  <Ionicons name="play-circle-outline" size={moderateScale(20)} color="#000000" />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => handlePause()}>
                  <Ionicons name="pause-circle-outline" size={moderateScale(20)} color="#000000" />
                </TouchableOpacity>
            }
          </View>
        </View>

        <View style={[styles.displayFlex, styles.justifyBetween, { paddingHorizontal: 18, }]}>
          <Text style={styles.qTxt}>Question {quesIndex + 1}</Text>
          <TouchableOpacity
            style={styles.displayFlex}
            onPress={() => markForReview(questions?.[quesIndex]?.id)}
          >
            <View style={{ transform: [{ scale: 0.7 }], marginTop: 3 }}>
              <CheckBox
                disabled
                label=""
                checked={markReview.includes(questions?.[quesIndex]?.id)}
                onChange={() => markForReview(questions?.[quesIndex]?.id)}
              />
            </View>
            <Text style={styles.qTxt}> Mark for review</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 18,
          justifyContent: 'space-between',
        }}
          style={{ flex: 1 }}>
          {questions?.length > 0 && (
            <View style={styles.subcontainer}>

              <View style={styles.topHalf}>
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

                  {questions[quesIndex]?.image && (
                    <Image
                      source={{ uri: `${WEB_URL}${questions[quesIndex]?.image}` }}
                      style={styles.quesImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
              </View>

              <View style={styles.bottomHalf}>
                <View style={[styles.aboveChoice, styles.mt20, styles.mb20]}>
                  <Text style={styles.colorGrey}>Select one option</Text>
                  <TouchableOpacity
                    onPress={() => clearResponse(questions?.[quesIndex].id)}
                    style={styles.displayFlex}
                  >
                    <Ionicons name="refresh" size={20} color="#888888" />
                    <Text style={[styles.colorGrey, styles.font12]}>
                      CLEAR RESPONSE {questions?.[quesIndex]?.type}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.bottomContent}>
                  {questions?.[quesIndex]?.options?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() =>
                        selectOption(questions?.[quesIndex]?.id, item.id)
                      }
                      style={
                        filter(selectedOptions, {
                          question_id: questions?.[quesIndex]?.id,
                          option_id: item?.id,
                        })?.length > 0
                          ? [styles.displayFlex, styles.choiceActive]
                          : [styles.displayFlex, styles.choice]
                      }
                      key={item?.id?.toString()}
                    >
                      <View style={{ width: '8%' }} >
                        <Text style={styles.number}>{alphabets?.[index]}</Text>
                      </View>

                      <View style={{ width: '92%' }}>
                        <Text style={[styles.ms10, styles.opt]}>{item?.name}</Text>
                      </View>

                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

        </ScrollView>

        <View style={styles.ms10}>
          <TouchableOpacity
            style={styles.displayFlex}
            onPress={() => confirmGuess(questions?.[quesIndex]?.id)}
          >
            <View style={{ transform: [{ scale: 0.7 }], marginTop: 3 }}>
              <CheckBox
                disabled
                label=""
                checked={guess.includes(questions?.[quesIndex]?.id)}
                onChange={() => confirmGuess(questions?.[quesIndex]?.id)}
              />
            </View>
            <Text style={styles.qTxt}> Guess answer</Text>
          </TouchableOpacity>
        </View>

        {questions?.length > 0 && (
          <>

            <View style={styles.footer}>
              {quesIndex > 0 && (
                <TouchableOpacity
                  onPress={loadPrevQuestion}
                  style={styles.btnActive}
                  disabled={isReviewing}
                >
                  <Text style={styles.btnText}>Previous</Text>
                </TouchableOpacity>
              )}

              {quesIndex !== totalQues - 1 ? (
                <TouchableOpacity
                  onPress={isReviewing ? handleSubmitQuestion : loadNextQuestion}
                  disabled={isNextLoading}
                  style={
                    filter(selectedOptions, {
                      question_id: questions?.[quesIndex]?.id,
                    })?.length > 0
                      ? styles.btnActive
                      : styles.btnDisabled
                  }
                >
                  <Text style={styles.btnText}>{isReviewing ? "Submit" : "Next"}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={finishTest} style={styles.btnActive}>
                  <Text style={styles.btnText}>Finish test</Text>
                </TouchableOpacity>
              )}
            </View>

          </>
        )}
      </View>
      <QuestionsModal
        modalVisible={modal}
        setModalVisible={setModal}
        data={{ totalQues: totalQues }}
        questions={questions}
        selectedOptions={selectedOptions}
        setQuesIndex={setQuesIndex}
        skippedQues={skippedQues}
        isRunning={isRunning}
        handlePause={handlePause}
        handleResume={handleResume}
        endTest={endTest}
      />
      <AllQuestionsModal
        modalVisible={isVerify}
        setModalVisible={setVerifyQusModal}
        data={{ totalQues: totalQues }}
        questions={questions}
        selectedOptions={selectedOptions}
        setQuesIndex={setQuesIndex}
        skippedQues={skippedQues}
        markReview={markReview}
        setIsReviewing={setIsReviewing}
        title={title}
        endTest={endTest}
        modaltype={modaltype}
        pauseTest={confirmPause}
        setTimer={setIsRunning}
      />
      <EndModal
        modalVisible={endModal}
        setModalVisible={setEndModal}
        confirmEnd={confirmEnd}
      />
      <PauseModal
        modalVisible={pauseModal}
        setModalVisible={setPauseModal}
        confirmPause={confirmPause}
        onCancel={handleResume}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(StartMock);
