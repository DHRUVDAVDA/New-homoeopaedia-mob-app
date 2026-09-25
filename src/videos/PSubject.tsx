import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../consts";
import { connect } from "react-redux";
import Loading from "../layout/Loading";
import Toast from "react-native-simple-toast";
import { User } from "../_redux/reducers/types";
import { regular, semi_bold } from "../constants/font";
import { moderateScale } from "react-native-size-matters";
import usePurchase from "../hooks/usePurchase";
import PremiumPurchaseModal from "../components/PremiumPurchaseModal";

// Shown to IAP-purchased users (Apple IAP doesn't go through Razorpay API)
const DUMMY_SUBJECTS = [
  { id: 4,  name: "Anatomy",                          slug: "anatomy",                          total: 6  },
  { id: 6,  name: "Biochemistry",                     slug: "biochemistry",                     total: 9  },
  { id: 18, name: "ENT",                              slug: "ent",                              total: 5  },
  { id: 7,  name: "Forensic Medicine and Toxicology", slug: "forensic-medicine-and-toxicology", total: 5  },
  { id: 15, name: "Gynaecology",                      slug: "gynaecology",                      total: 6  },
  { id: 9,  name: "Homoeopathic Philosophy",          slug: "homoeopathic-philosophy",          total: 10 },
  { id: 10, name: "Homoeopathic Repertory",           slug: "homoeopathic-repertory",           total: 19 },
  { id: 8,  name: "Materia Medica",                   slug: "materia-medica",                   total: 31 },
  { id: 23, name: "Microbiology",                     slug: "microbiology",                     total: 6  },
  { id: 14, name: "Obstetrics",                       slug: "obstetrics",                       total: 11 },
  { id: 19, name: "Ophthalmology",                    slug: "ophthalmology",                    total: 4  },
  { id: 26, name: "Orthopaedics",                     slug: "orthopaedics",                     total: 2  },
  { id: 22, name: "Pathology",                        slug: "pathology",                        total: 10 },
  { id: 20, name: "Pediatrics",                       slug: "pediatrics",                       total: 5  },
  { id: 1,  name: "Pharmacy",                         slug: "pharmacy",                         total: 7  },
  { id: 5,  name: "Physiology",                       slug: "physiology",                       total: 13 },
  { id: 3,  name: "Practice of Medicine",             slug: "practice-of-medicine",             total: 71 },
  { id: 21, name: "Radiology",                        slug: "radiology",                        total: 2  },
  { id: 13, name: "Social and Preventive Medicine",   slug: "social-and-preventive-medicine",   total: 10 },
  { id: 12, name: "Surgery",                          slug: "surgery",                          total: 9  },
];

type MyProps = {
  navigation: any;
  user: User;
  token: string;
  dispatch?: any;
};

const PSubject = ({ navigation, user, token, dispatch }: MyProps) => {
  const [subject, setSubject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { isPurchased, supportsInAppPurchase, triggerPurchase } = usePurchase();

  useEffect(() => {
    // IAP mode: no API call needed — dummy data or upgrade CTA handles display
    if (supportsInAppPurchase) return;
    // Non-IAP mode: let the Razorpay API decide what to show
    getSubject();
  }, [supportsInAppPurchase, isPurchased]);

  const getSubject = () => {
    axios.get(`${BASE_URL}/videopaid/${user.user_id}?api_token=${token}`).then(
      (res) => {
        console.log("videos", res.data.paid);
        setSubject(res.data.paid);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        Toast.show("Network error. Tryagain.", Toast.LONG);
      }
    );
  };

  const handleUpgrade = () => {
    triggerPurchase(() => setModalVisible(true));
  };

  // Decide what data to render
  const displayData = supportsInAppPurchase && isPurchased ? DUMMY_SUBJECTS : subject;

  return (
    <View style={styles.container}>
      <PremiumPurchaseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {}} // dummy data loads automatically when isPurchased flips
        dispatch={dispatch}
      />
      <Loading loading={loading} text="Loading contents. Please wait." />
      <View style={styles.content}>
        {displayData.length > 0 ? (
          <FlatList
            data={displayData}
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
            {supportsInAppPurchase && !isPurchased ? (
              // IAP mode — not yet purchased
              <TouchableOpacity onPress={handleUpgrade}>
                <Text style={styles.upgrade}>Upgrade to Premium</Text>
              </TouchableOpacity>
            ) : !supportsInAppPurchase ? (
              // Non-IAP mode — API returned empty (not subscribed via Razorpay)
              <TouchableOpacity onPress={handleUpgrade}>
                <Text style={styles.upgrade}>Upgrade to Premium</Text>
              </TouchableOpacity>
            ) : null}
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
    fontFamily: semi_bold,
    fontSize: moderateScale(13),
  },
  subheading: {
    color: "#22bdc1",
    fontFamily: regular,
    fontSize: moderateScale(12),
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
    fontFamily: semi_bold,
  },
  noContent: {
    fontSize: moderateScale(15),
    fontFamily: regular,
    color: "#777777",
    textAlign: "center",
  },
});

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(PSubject);
