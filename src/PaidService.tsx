import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { moderateScale } from "react-native-size-matters";
import { FontAwesome5 } from "@expo/vector-icons";
import { theme_clr } from "./constants/colors";
import { bold, regular, semi_bold } from "./constants/font";
import usePurchase from "./hooks/usePurchase";
import PremiumPurchaseModal from "./components/PremiumPurchaseModal";

type MyProps = {
  navigation: any;
  dispatch?: any;
};

const PaidService = ({ navigation, dispatch }: MyProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { isPurchased, triggerPurchase } = usePurchase();

  const handleUpgrade = () => {
    triggerPurchase(() => setModalVisible(true));
  };

  return (
    <View style={styles.container}>
      <PremiumPurchaseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => navigation.goBack()}
        dispatch={dispatch}
      />

      <Image
        source={require("../assets/paid.jpg")}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.heading}>Premium Feature</Text>
        <Text style={styles.subheading}>
          Upgrade to unlock all premium content and features.
        </Text>

        <View style={styles.benefitsList}>
          {[
            { icon: "clipboard-list", text: "Unlimited Mock Tests" },
            { icon: "video", text: "Premium Video Lectures" },
            { icon: "book-open", text: "Premium Study Material" },
            { icon: "star", text: "Future Premium Features" },
          ].map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <FontAwesome5
                name={b.icon as any}
                size={moderateScale(13)}
                color={theme_clr}
                style={styles.benefitIcon}
              />
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>

        {isPurchased ? (
          <View style={styles.purchasedBanner}>
            <FontAwesome5 name="check-circle" size={moderateScale(18)} color="#27AE60" />
            <Text style={styles.purchasedText}>  You already have Premium!</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade}>
            <Text style={styles.upgradeBtnText}>Get Premium</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.laterBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.laterText}>MAYBE LATER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontFamily: bold,
    fontSize: moderateScale(20),
    color: "#1A1A1A",
    marginBottom: 6,
  },
  subheading: {
    fontFamily: regular,
    fontSize: moderateScale(14),
    color: "#666666",
    marginBottom: 20,
  },
  benefitsList: {
    marginBottom: 28,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitIcon: {
    marginRight: 12,
    width: 18,
  },
  benefitText: {
    fontFamily: semi_bold,
    fontSize: moderateScale(13),
    color: "#333333",
  },
  upgradeBtn: {
    backgroundColor: theme_clr,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  upgradeBtnText: {
    fontFamily: bold,
    fontSize: moderateScale(15),
    color: "#FFFFFF",
  },
  purchasedBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#EAF9EF",
    borderRadius: 10,
  },
  purchasedText: {
    fontFamily: semi_bold,
    fontSize: moderateScale(14),
    color: "#27AE60",
  },
  laterBtn: {
    paddingVertical: 14,
    alignItems: "center",
  },
  laterText: {
    fontFamily: regular,
    fontSize: moderateScale(13),
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#888888",
  },
});

export default connect()(PaidService);
