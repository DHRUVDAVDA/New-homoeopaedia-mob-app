import React from "react";
import { View, Text, ScrollView } from "react-native";
import Footer from "./layout/Footer";
import HeaderText from "./layout/HeaderText";
import styles from "./HomeStyles";

type MyProps = {
  navigation: any;
};

const Contact = ({ navigation }: MyProps) => {
  return (
    <View style={styles.container}>
      <HeaderText navigation={navigation} heading="About Us" />
      <ScrollView
        contentContainerStyle={[styles.scroller, { paddingHorizontal: 10 }]}
      >
        <Text style={[styles.mb10, styles.restxt,styles.mt10]}>
          Homoeopaedia is an online Homoeopathic learning channel to help
          doctors crack AIAPGET, UPSC, NHM, PSC and other competitive exams.
        </Text>
        <Text style={[styles.mb10, styles.restxt]}>
          In the recent years, focus has shifted to a more student-focused,
          student-centric learning model. This means the model improves student
          results and satisfaction, that's what we at Homoeopaedia are striving
          for "Focused digital content learning to cater to each student’s
          unique learning needs."
        </Text>
        <Text style={[styles.mb10, styles.restxt]}>
          We are here to make every student’s dream true to conquer competitive
          examinations.
        </Text>
        <Text style={[styles.ques]}>Our Vision</Text>
        <Text style={[styles.mb10,styles.restxt,styles.mt10]}>
          Create a high-quality learning platform to make Homoeopathic continued
          medical education creative and smart with Up-to-date knowledge. To
          learn, grow and excel in Homoeopathy.
        </Text>
        <Text style={styles.ques}>Our Mission</Text>
        <Text style={[styles.mb10,styles.restxt,styles.mt10]}>
          This team believes in giving back to homoeopathy what Homoeopathy has
          given us. To help students and doctors cover all subjects recommended
          by CCH in a streamlined and user-friendly method with higher
          standards.
        </Text>
      </ScrollView>
      <Footer navigation={navigation} page="" />
    </View>
  );
};

export default Contact;
