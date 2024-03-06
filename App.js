/**
 * Sample React Native App
 * https://github.com/facebook/react-native
*
* @format
*/

import 'react-native-gesture-handler';
import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import { useState } from 'react';





const App = () =>{
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <AuthStack />   
    </NavigationContainer>
)
}


export default App;
