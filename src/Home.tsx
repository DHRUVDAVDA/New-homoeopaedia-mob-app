import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import HeaderHome from "./layout/HeaderHome";
import Footer from "./layout/Footer";
import styles from "./HomeStyles";
import axios from "axios";
import { BASE_URL, WEB_URL } from "./consts";
import { connect } from "react-redux";
import HTML from "react-native-render-html";
import Toast from "react-native-simple-toast";
import HomeVideo from "./components/HomeVideo";
import Loading from "./layout/Loading";
import Testimonial from "./components/Testimonial";
import Views from "./testimonials/Views";
import { main_font, regular } from "./constants/font";
import { moderateScale } from "react-native-size-matters";
import { FontAwesome5 } from "@expo/vector-icons";
import { User } from "./_redux/reducers/types";
import { theme_clr } from "./constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");
type MyProps = {
  navigation: any;
  token: string;
  user: User;
};

const Home = ({ navigation, token, user }: MyProps) => {
  const [mcq, setMCQ] = useState([]);
  const [one, setOne] = useState([]);
  const [mnemonics, setMnemonics] = useState([]);
  const [video, setVideo] = useState({});
  const [onlyVideo, setOnlyVideo] = useState([]);
  const [testimonial, setTestimonial] = useState({});
  const [onlyTestimonial, setOnlyTestimonial] = useState([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [vloading, setVLoading] = useState(false);
  const [tloading, setTLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [testiSelected, setTestiSelected] = useState({});
  const [subscription, setSubscription] = useState<any[] | number>([]);

  useEffect(() => {
    getSubscriptionDetails();
    getMCQ();
    getOne();
    getMnemonics();
    getVideo();
    getTestimonial();

  }, []);

  const getMCQ = () => {
    axios.get(`${BASE_URL}/mcq?api_token=${token}`).then(
      (res) => {
        setMCQ(res.data.mcq);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        Toast.show("Network error. Tryagain.", Toast.LONG);
      }
    );
  };

  const getOne = () => {
    axios.get(`${BASE_URL}/oneliner?api_token=${token}`).then(
      (res) => {
        setOne(res.data.one);
      },
      (error) => {
        Toast.show("Network error. Tryagain.", Toast.LONG);
      }
    );
  };

  const getMnemonics = () => {
    axios.get(`${BASE_URL}/mnemonics?api_token=${token}`).then(
      (res) => {
        setMnemonics(res.data.mnemonics);
      },
      (error) => {
        Toast.show("Network error. Tryagain.", Toast.LONG);
      }
    );
  };

  const getVideo = async (page = 1) => {
    await axios
      .get(`${BASE_URL}/video/home?page=${page}&api_token=${token}`)
      .then(
        (res) => {
          setVideo(res.data.video);
          setOnlyVideo((prev) => [...prev, ...res.data.video.data]);
        },
        (error) => {
          Toast.show("Network error. Tryagain.", Toast.LONG);
        }
      );
  };

  const loadMore = async () => {
    if (video?.current_page !== video?.last_page) {
      setVLoading(true);

      await getVideo(video?.current_page + 1);

      setVLoading(false);
    }
  };

  const getTestimonial = async (page = 1) => {
    await axios
      .get(`${BASE_URL}/testimonial/all?page=${page}&api_token=${token}`)
      .then(
        (res) => {
          setTestimonial(res.data.testimonial);
          setOnlyTestimonial((prev) => [...prev, ...res.data.testimonial.data]);
        },
        (error) => {
          Toast.show("Network error. Tryagain.", Toast.LONG);
        }
      );
  };

  const loadMoreTesti = async () => {
    if (testimonial?.current_page !== testimonial?.last_page) {
      setTLoading(true);

      await getTestimonial(testimonial?.current_page + 1);

      setTLoading(false);
    }
  };

  const getSubscriptionDetails = async () => {
    const fcm_token = await AsyncStorage.getItem('fcm_token')
    console.log("fcm_token", fcm_token)
    const postData = {
      user_id: user.user_id,  // Add the user_id here
      fcm_token: fcm_token
    };
    const URL = `${BASE_URL}/home/subscription-check/?api_token=${token}`;
    axios.post(URL, postData).then(
      (res) => {
        console.log("URL--", res);
        if (res.data.success) {
          if (res.data.data) {
            console.log(res.data.data);
            setSubscription(res.data.data);
          }
        }else{
          Alert.alert(res.data.message)
        }
      },
      (error) => {
        console.log("Error fetching subjects:", error);
      }
    );
  };

  const viewPopup = (data: any) => {
    setTestiSelected(data);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Loading loading={vloading} text="Loading videos. Please wait." />
      <Loading loading={tloading} text="Loading testimonials. Please wait." />
      <Views
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        data={testiSelected}
      />
      <HeaderHome navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scroller}>
        {onlyVideo?.length > 0 && (
          <>
            <View style={styles.title}>
              <Text style={[styles.bgWhite, styles.titleBold]}>
                Learn grow excel
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("VideoList")}
              >
                <Text style={[styles.bgWhite, styles.titleLink]}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contentVideo}>
              <FlatList
                horizontal
                data={onlyVideo}
                renderItem={({ item, index }) => (
                  <HomeVideo
                    navigation={navigation}
                    videos={item}
                    from="video"
                  />
                )}
                keyExtractor={(item) => `key${item.id}`}
                showsHorizontalScrollIndicator={false}
                onEndReachedThreshold={1}
                onEndReached={loadMore}
              />
            </View>
          </>
        )}
        {!loading && (
          <>
            <View style={styles.title}>
              <Text style={[styles.bgWhite, styles.titleBold]}>
                Quick Links
              </Text>
            </View>
            <View style={{ backgroundColor: '#FFF' }}>
              <View style={styles.uiContainer}>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.box}
                    onPress={() => navigation.navigate("Profile")}
                  >
                    <FontAwesome5 name="user" size={moderateScale(18)} color={theme_clr} />
                    <Text style={styles.boxText}>Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.box}
                    onPress={() => navigation.navigate("Results")}
                  >
                    <FontAwesome5 name="file-alt" size={moderateScale(18)} color={theme_clr} />
                    <Text style={styles.boxText}>My Result</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.box}
                    onPress={() =>
                      subscription > 0 ? navigation.navigate("TitleList") :
                        Toast.show("Plan expired", Toast.LONG)
                    }
                  >
                    <FontAwesome5 name="bookmark" size={moderateScale(18)} color={theme_clr} />
                    <Text style={styles.boxText}>Bookmarks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.box}
                    onPress={() => navigation.navigate("MockScreen")}
                  >
                    <FontAwesome5 name="clipboard" size={moderateScale(18)} color={theme_clr} />
                    <Text style={styles.boxText}>Tests</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
        {onlyTestimonial?.length > 0 && (
          <>
            <View style={styles.title}>
              <Text style={[styles.bgWhite, styles.titleBold]}>
                Success Story
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Testimonials")}
              >
                <Text style={[styles.bgWhite, styles.titleLink]}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contentVideo}>
              <FlatList
                horizontal
                data={onlyTestimonial}
                renderItem={({ item, index }) => (
                  <Testimonial
                    navigation={navigation}
                    data={item}
                    viewPopup={viewPopup}
                  />
                )}
                keyExtractor={(item) => `key${item.id}`}
                showsHorizontalScrollIndicator={false}
                onEndReachedThreshold={1}
                onEndReached={loadMoreTesti}
              />
            </View>
          </>
        )}
        {!loading && mcq.length > 0 && (
          <>
            <View style={styles.title}>
              <Text style={[styles.bgWhite, styles.titleBold]}>
                MCQ of the Day
              </Text>
            </View>
            <View style={[styles.p20, styles.contentVideo]}>
              <View style={[styles.quesBox, styles.question]}>
                {mcq.map((item, index) => (
                  <View key={index}>
                    <View style={styles.mb10}>
                      <HTML
                        source={{ html: item.ques }}
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
                      />
                    </View>
                    {item.options.map((option: any, index1: number) => (
                      <View key={index1}>
                        {selected != 0 ? (
                          selected == option.option_id ? (
                            <TouchableOpacity
                              onPress={() => setSelected(option.option_id)}
                              style={[
                                styles.choice,
                                {
                                  borderColor:
                                    selected == item.correct_ans
                                      ? "green"
                                      : "#f00",
                                },
                              ]}
                            >
                              <Text style={[styles.bgBlack, styles.txt]}>
                                {option.option}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => setSelected(option.option_id)}
                              style={[
                                styles.choice,
                                {
                                  backgroundColor: "#ffffff",
                                },
                              ]}
                            >
                              <Text style={[styles.bgBlack, styles.txt]}>
                                {option.option}
                              </Text>
                            </TouchableOpacity>
                          )
                        ) : (
                          <TouchableOpacity
                            onPress={() => setSelected(option.option_id)}
                            style={[
                              styles.choice,
                              {
                                backgroundColor: "#ffffff",
                              },
                            ]}
                          >
                            <Text style={[styles.bgBlack, styles.txt]}>
                              {option.option}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                    {selected > 0 && item.explain && (
                      <View style={styles.question}>
                        <Text style={styles.txt}>Explanation:</Text>
                        <HTML
                          source={{
                            html: item.explain,
                          }}
                          contentWidth={width}
                          tagsStyles={{
                            body: {
                              fontFamily: regular,
                              fontSize: moderateScale(14),
                            },
                            p: {
                              fontFamily: regular,
                              fontSize: moderateScale(14),
                            },
                            span: {
                              fontFamily: regular,
                              fontSize: moderateScale(14),
                            },
                          }}
                          defaultTextProps={{
                            style: {
                              fontFamily: regular,
                              fontSize: moderateScale(14),
                            },
                          }}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
        {one.length > 0 && (
          <View>
            <View style={styles.title}>
              <Text style={[styles.bgWhite, styles.titleBold]}>One Liner</Text>
              <TouchableOpacity onPress={() => navigation.navigate("OSubject")}>
                <Text style={[styles.bgWhite, styles.titleLink]}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.oneLiner]}>
              {one.map((item: any) => (
                <View key={`key${item.id}`}>
                  <Text style={styles.ques}>
                    {item.ques} <Text style={styles.ans}>{item.ans}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {mnemonics.length > 0 && (
          <View>
            <View style={styles.title}>
              <Text style={[styles.bgWhite, styles.titleBold]}>Mnemonics</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("MnSubject")}
              >
                <Text style={[styles.bgWhite, styles.titleLink]}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.oneLiner]}>
              {mnemonics.map((item: any) => (
                <View key={`key${item.id}`}>
                  <Text style={styles.ques}>{item.ques}</Text>
                  {item.image && (
                    <Image
                      style={styles.imageNew}
                      source={{
                        uri: `${WEB_URL}/${item.image}`,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
        {/* <View style={styles.heading}>
          <View style={styles.line} />
          <Text style={styles.headText}>Notification</Text>
          <View style={styles.line} />
        </View>
        <View style={[styles.quesBox, styles.question]}>
          <Text style={styles.headNoti}>
            National Ayush Mission extended to 2026
          </Text>
          <Text style={styles.mb10}>
            The Union Cabinet on 14 July 2021 approved the continuation of the
            National Ayush Mission as a Centrally Sponsored Scheme for another
            five years till 2026, Union minister Anurag Thakur said.
          </Text>
          <Text style={styles.mb10}>
            The scheme would continue from April 1, 2021 to March 31, 2026 with
            a financial implication of 4,607.30 crores to be spent during the
            period.
          </Text>
        </View> */}
      </ScrollView>
      <Footer navigation={navigation} page={`Home`} />
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(Home);
