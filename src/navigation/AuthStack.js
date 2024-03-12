import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator , CommonActions } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import Login from '../Auth/Login';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUp from '../Auth/SignUp';
import AppStack from './AppStack';
import routes from '../constants/routes';
import Signout from '../Auth/SignOut';
export default function AuthStack() {
    const stack = createNativeStackNavigator();
  return (
    <stack.Navigator>
    <stack.Screen name={'MainScreen'} component={MainScreen} options={{headerShown:false}}/>
    <stack.Screen name={'WelcomeScreen'} component={WelcomeScreen} options={{headerShown:false}}/>
    <stack.Screen name={'LoginScreen'} component={Login} options={{headerShown:false}}/>
    <stack.Screen name={'SignUpScreen'} component={SignUp} options={{headerShown:false}}/>
    <stack.Screen name={'HomeTab'} component={AppStack} options={{headerShown:false}}/>
  </stack.Navigator>
  )
}