import React from "react";
import { View, Text, ScrollView } from "react-native";
import Footer from "./layout/Footer";
import HeaderText from "./layout/HeaderText";
import styles from "./HomeStyles";

type MyProps = {
  navigation: any;
};

const About = ({ navigation }: MyProps) => {
  return (
    <View style={styles.container}>
      <HeaderText navigation={navigation} heading="Contact Us" />
      <ScrollView
        contentContainerStyle={[styles.scroller, { paddingHorizontal: 10 }]}
      >
        <Text style={[styles.ques,styles.mt10]}>Find us at the Office</Text>
        <Text style={[styles.mb10,styles.restxt]}>
          Kuttamathayathu, Karavaloor, Kollam, Kerala
        </Text>
        <Text style={styles.ques}>Give Us a Ring</Text>
        <Text style={[styles.mb10,styles.restxt]}>Dr Jaison Rajan - +91 9400090777</Text>
        <Text style={styles.ques}>Any Query</Text>
        <Text style={[styles.mb10,styles.restxt]}>info@homoeopaedia.com</Text>
      </ScrollView>
      <Footer navigation={navigation} page="" />
    </View>
  );
};

export default About;
