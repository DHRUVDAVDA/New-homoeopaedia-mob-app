import React from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";
import { theme_clr } from "../constants/colors";
type MyProps = {
    modalVisible: any;
    setModalVisible: any;
    data: any;
    questions: Array<any>;
    selectedOptions: Array<any>;
    setQuesIndex: Function;
    skippedQues: Array<any>;
    markReview: Array<any>;
    setIsReviewing: Function;
    title: String;
    endTest: Function;
    modaltype: any;
    pauseTest: Function;
    setTimer: any;
};

const AllQuestionsModal = ({
    modalVisible,
    setModalVisible,
    data,
    questions,
    selectedOptions,
    setQuesIndex,
    skippedQues,
    markReview,
    setIsReviewing,
    title,
    endTest,
    modaltype,
    pauseTest,
    setTimer,
}: MyProps) => {
    return (
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
                    <View style={styles.displayFlex}>
                        <Text style={styles.bold}>{title}</Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons
                                name="close-circle"
                                size={26}
                                color="#000000"
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.innerContainer}>
                        <View style={[styles.displayFlex, styles.mt20]}>
                            <View>
                                <Text style={[styles.textCenter, styles.blue, styles.txt]}>
                                    {selectedOptions.filter((item) => item.type !== "mark-review-next").length}
                                </Text>
                                <Text style={styles.colorGrey}>Attempted</Text>
                            </View>

                            <View>
                                <Text
                                    style={[styles.textCenter, styles.yellow, , styles.txt]}
                                >
                                    {markReview.length}
                                </Text>
                                <Text style={styles.colorGrey}>Review</Text>
                            </View>
                            <View>
                                <Text
                                    style={[styles.textCenter, styles.bold]}
                                >
                                    {skippedQues.length}
                                </Text>
                                <Text style={styles.colorGrey}>Skipped</Text>
                            </View>
                            {/* <View>
                                <Text style={[styles.textCenter, styles.bold]}>
                                    {data.totalQues -
                                        (selectedOptions.length +
                                        skippedQues.length + markReview.length)}
                                </Text>
                                <Text style={styles.colorGrey}>
                                    Not Visited
                                </Text>
                            </View> */}
                        </View>
                        <View style={styles.line} />
                        <Text style={[styles.mb10, , styles.txt]}>Questions</Text>
                        <View style={styles.numberContainer}>
                            {questions.map((item, index) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (markReview.includes(item.id)) { // Allow selection only if question is marked for review
                                            setQuesIndex(index);
                                            setModalVisible(false);
                                            setIsReviewing(true); // Enable "Submit" button
                                        } else {
                                            setQuesIndex(index);
                                            setModalVisible(false);
                                            setTimer(true);
                                            // Toast.show("You can only update marked-for-review questions.", Toast.LONG);
                                        }
                                    }}
                                    style={
                                        selectedOptions.some(
                                            (option) => parseInt(option.question_id) === parseInt(item.id)
                                        )
                                            ? markReview.includes(item.id)
                                                ? styles.numberReview // If answered & marked for review
                                                : styles.numberAttempted // If only answered
                                            : skippedQues.includes(item.id)
                                                ? styles.numberSkipped // If skipped
                                                : markReview.includes(item.id)
                                                    ? styles.numberReview // If only marked for review
                                                    : styles.number // Default
                                    }

                                    key={index.toString()}
                                >
                                    <Text style={styles.bold}>
                                        {index < 9
                                            ? `0${index + 1}`
                                            : index + 1}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={styles.line} />

                    {/* </View> { */}
                    {/* (modaltype && modaltype == 'pause') ? */}
                    <View style={styles.displayFlex}>

                        <TouchableOpacity
                            style={styles.pbtnEnd}
                            onPress={pauseTest}
                        >
                            <Text style={[styles.btnText, styles.pbtnTextWhite]}>
                                Pause
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btnEnd}
                            onPress={endTest}
                        >
                            <Text style={[styles.btnText, styles.btnTextWhite]}>
                                End test
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* //         :
                    //         <TouchableOpacity
                    //             onPress={endTest}
                    //             style={styles.btnEnd}
                    //         >
                    //             <Text style={[styles.btnText, styles.btnTextWhite]}>
                    //                 End test
                    //             </Text>
                    //         </TouchableOpacity>
                    // } */}


                </View>
        </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingVertical: 50,
    },
    modalView: {
        margin: 15,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    innerContainer: {
        flexGrow: 1,
    },
    displayFlex: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    bold: {
        fontFamily: semi_bold,
        fontSize: moderateScale(13)
    },
    mt20: {
        marginTop: 20,
    },
    mb10: {
        marginBottom: 10,
    },
    textCenter: {
        textAlign: "center",
    },
    blue: {
        color: "blue",
        fontWeight: "bold",
    },
    green: {
        color: "green",
        fontWeight: "bold",
    },
    yellow: {
        color: "#FFBF00",
        fontWeight: "bold",
    },
    colorGrey: {
        color: "#888888",
        fontFamily: semi_bold,
        fontSize: moderateScale(13)
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: "#e9e9e9",
        marginVertical: 20,
        marginBottom: 15,
    },
    numberContainer: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    number: {
        padding: 8,
        paddingHorizontal: 30,
        borderWidth: 1,
        borderColor: "#e9e9e9",
        borderRadius: 10,
        marginBottom: 10,
        marginRight: 5,
    },
    numberAttempted: {
        padding: 8,
        paddingHorizontal: 30,
        borderWidth: 1,
        borderColor: "blue",
        borderRadius: 10,
        marginBottom: 10,
        marginRight: 5,
    },
    numberReview: {
        padding: 8,
        paddingHorizontal: 30,
        borderWidth: 1,
        borderColor: "#FFBF00",
        borderRadius: 10,
        marginBottom: 10,
        marginRight: 5,
    },
    numberSkipped: {
        padding: 8,
        paddingHorizontal: 30,
        borderWidth: 1,
        borderColor: "#e9e9e9",
        borderRadius: 10,
        marginBottom: 10,
        marginRight: 5,
    },
    btnPause: {
        borderWidth: 1,
        borderColor: "#e9e9e9",
        flex: 1,
        paddingVertical: 8,
        borderRadius: 5,
        marginEnd: 5,
    },
    btnEnd: {
        borderWidth: 1,
        borderColor: theme_clr,
        flex: 1,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: theme_clr,
        marginStart: 5,
    },
    pbtnEnd: {
        borderWidth: 1,
        borderColor: theme_clr,
        flex: 1,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: "#FFF",
        marginStart: 5,
    },
    btnText: {
        textAlign: "center",
        fontFamily: semi_bold,
        fontSize: moderateScale(14)
    },
    btnTextWhite: {
        color: "#ffffff",
    },
    pbtnTextWhite: {
        color: theme_clr
    },
    txt: {
        fontFamily: semi_bold,
        fontSize: moderateScale(13)
    }
});

const mapStateToProps = (state: any) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    user: state.authReducer.user,
    token: state.authReducer.token,
});

export default connect(mapStateToProps)(AllQuestionsModal);
