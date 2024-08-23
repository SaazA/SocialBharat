import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SetPassword from '../screens/SetPasswordScreen';

const PasswordStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'PasswordStack'}
        component={SetPassword}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default PasswordStack;

const styles = StyleSheet.create({});
