import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Linking,
} from "react-native";
import axios from "axios";
import { BASE_URL, WEB_URL } from "../consts";
import { connect } from "react-redux";
import Loading from "../layout/Loading";
import Toast from "react-native-simple-toast";
import { User } from "../_redux/reducers/types";
import { regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";

type MyProps = {
  navigation: any;
  user: User;
  token: string;
};

const PSubject = ({ navigation, user, token }: MyProps) => {
  const [subject, setSubject] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSubject();
  }, []);

  const getSubject = () => {
    axios.get(`${BASE_URL}/videopaid/${user.user_id}?api_token=${token}`).then(
      (res) => {
        setSubject(res.data.paid);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        Toast.show("Network error. Tryagain.", Toast.LONG);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Loading loading={loading} text="Loading contents. Please wait." />
      <View style={styles.content}>
        {subject.length > 0 ? (
          <FlatList
            data={subject}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Pvideo", {
                    subject_id: item.id,
                  })
                }
                style={styles.boxContainer}
              >
                <Text style={styles.heading}>{item.name}</Text>
                <Text style={styles.subheading}>
                  {item.total} Video
                  {item.total > 1 ? "s" : ""}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => `key${item.id}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.flex}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`${WEB_URL}/plans`);
              }}
            >
              <Text style={styles.upgrade}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9e9e9",
  },
  content: {
    margin: 20,
    marginTop: 0,
    marginBottom: 0,
    flex: 1,
  },
  boxContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    elevation: 1,
  },
  heading: {
    // fontWeight: "bold",
    fontFamily: semi_bold,
    fontSize: moderateScale(13)
  },
  subheading: {
    color: "#22bdc1",
    fontFamily: regular,
    fontSize: moderateScale(12)
  },
  flex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  upgrade: {
    backgroundColor: "#22bdc1",
    color: "#FFFFFF",
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    fontSize: moderateScale(16),
  },
});

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(PSubject);
