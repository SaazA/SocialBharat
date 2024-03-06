import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import Login from '../Auth/Login';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUp from '../Auth/SignUp';
import AppStack from './AppStack';
import routes from '../constants/routes';
export default function AuthStack() {
    const stack = createNativeStackNavigator();
  return (
    <stack.Navigator>
    <stack.Screen name={routes.MAINSCREEN} component={MainScreen} options={{headerShown:false}}/>
    <stack.Screen name={routes.WELCOMESCREEN} component={WelcomeScreen} options={{headerShown:false}}/>
    <stack.Screen name={routes.LOGIN} component={Login} options={{headerShown:false}}/>
    <stack.Screen name={routes.SIGNUP} component={SignUp} options={{headerShown:false}}/>
    <stack.Screen name={routes.HOME} component={AppStack} options={{headerShown:false}}/>
  </stack.Navigator>
  )
}