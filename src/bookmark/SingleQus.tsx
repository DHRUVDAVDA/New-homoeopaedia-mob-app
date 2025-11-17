import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    Dimensions,
    Text,
    View,
    TouchableOpacity,
    BackHandler,
} from "react-native";
import { connect } from "react-redux";
import { User } from "../_redux/reducers/types";
import Back from "../layout/Back";
import { BASE_URL, WEB_URL } from "../consts";
import HTML from "react-native-render-html";
import { main_font, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";
import { theme_clr } from "../constants/colors";
import styles from "./bookmarkStyles";
import Loading from "../layout/Loading";
import HeaderText from "../layout/HeaderText";
import { useFocusEffect } from "@react-navigation/native";
const { width } = Dimensions.get("window");

type MyProps = {
    navigation: any;
    user: User;
    token: string;
    route: any;
};

const SingleQus = ({ navigation, route, user, token }: MyProps) => {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                navigation.goBack();
                return true; // Prevent default behavior (exit app)
            },
        );

        return () => backHandler.remove();
    }, []);


    const { data, titlename } = route.params;
    const [loading, setLoading] = useState(false);

    console.log("%%%", data)


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
    return (
        <View style={styles.containerNew}>
            <Loading loading={loading} text="Loading questions. Please wait." />
            <Back navigation={navigation} />
            <View style={styles.bookmarkTitle}>
                <Text
                    style={{
                        fontSize: moderateScale(16),
                        fontFamily: semi_bold,
                        color: "#000",
                    }}
                >
                    {titlename}
                </Text>
            </View>
            <ScrollView style={{
                flex: 1, margin: 10
            }}>
                <View style={{
                    flex: 1, height: 250
                }}>

                    <View>
                        <Text style={{
                            fontFamily: semi_bold,
                            fontSize: moderateScale(13),
                            marginBottom: 5
                        }}>Question {data.q_number}</Text>
                        <View style={{ marginBottom: 10 }}>
                            <HTML
                                source={{
                                    html: data.get_qustions.ques,
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
                            {data.get_qustions?.image && (
                                <Image
                                    source={{
                                        uri: `${WEB_URL}${data.get_qustions?.image}`,
                                    }}
                                    style={styles.quesImage}
                                />
                            )}
                        </View>


                    </View>
                </View>

                <View style={{
                    flex: 1
                }}>
                    <View>
                        {data.get_qustions?.options.map((item: any, index: number) => {
                            const isCorrect = data.get_qustions?.correct_ans == item.id;
                            const optionLabels = ["A", "B", "C", "D"];
                            return (
                                <View>
                                    <TouchableOpacity
                                        key={item.id}
                                    >
                                        <Text
                                            style={[
                                                styles.options,
                                                ...(isCorrect
                                                    ? [styles.active, styles.textGreen]
                                                    : [styles.textDefault]),
                                            ]}
                                        >
                                            {optionLabels[index]}. {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            );
                        })}
                    </View>
                </View>


                {
                    data && isValidExplanation(data.get_qustions?.expl) && (
                        <View>
                            <View style={{
                                marginTop: 9
                            }}
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
                                        html: data.get_qustions.expl,
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
                    )
                }
            </ScrollView>
        </View >
    );
};

const mapStateToProps = (state: any) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    user: state.authReducer.user,
    token: state.authReducer.token,
});

export default connect(mapStateToProps)(SingleQus);
