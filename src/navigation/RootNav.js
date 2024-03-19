import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useSelector } from 'react-redux';

const RootNav = () => {
  const token = useSelector(state =>state.AuthReducer.authToken);
  return (
    <NavigationContainer>
       {
      token === null ?
      <AuthStack/>:
      <AppStack/>
    }
    </NavigationContainer>
  );
};

export default RootNav;
