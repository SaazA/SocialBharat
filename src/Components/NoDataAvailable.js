import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../constants/colors';

const NoDataAvailable = () => {
  return (
    <View style={styles.maincontaier}>
      <Text style={styles.text}>No Data Available</Text>
    </View>
  );
};

export default NoDataAvailable;

const styles = StyleSheet.create({
  maincontaier: {
    backgroundColor: colors.grayLight,
    margin: 10,
  },
  text: {
    fontSize: 18,
  },
});
