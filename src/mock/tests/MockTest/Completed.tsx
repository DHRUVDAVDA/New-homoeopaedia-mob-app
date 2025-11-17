import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MockList from '../../MockList';
import { connect } from "react-redux";
import { User } from '../../../_redux/reducers/types';

type MyProps = {
  navigation: any;
  user: User;
  token: string;
  route: any;
};

const Completed = ({ navigation, route }: MyProps) => {
  return (
    <View style={styles.container}>
      <MockList navigation={navigation} tab={'Completed'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f6f6f6'
  },
  text: {
    fontSize: 24, fontWeight: 'bold', color: '#333'
  }
});

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(Completed);
