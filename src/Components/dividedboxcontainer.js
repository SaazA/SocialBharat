import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../constants/colors';

const dividedboxcontainer = ({label, value}) => {
  return (
    <View style={styles.content}>
      <View style={styles.textbox}>
        <Text style={styles.contenttextstatic}>{label}</Text>
      </View>
      <View style={styles.infobox}>
        <Text style={styles.contenttextDynamic}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  textbox: {
    flex: 0.4,
    justifyContent: 'center',
    padding: 5,
  },
  contenttextstatic: {
    color: '#000000',
    fontSize: 18,
  },
  contenttextDynamic: {
    color: colors.gray,
    fontSize: 18,
  },
  infobox: {
    flex: 0.6,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default dividedboxcontainer;
