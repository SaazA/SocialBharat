import {View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {useSelector} from 'react-redux';
import PasswordStack from './PasswordStack';

const RootNav = () => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const UserObject = useSelector(state => state.UserReducer);

  const isPasswordSet =
    UserObject &&
    UserObject.userData &&
    UserObject.userData.data &&
    UserObject.userData.data.is_password_set;

  console.log(
    'HEY from ROOT',
    UserObject &&
      UserObject.userData &&
      UserObject.userData.data &&
      UserObject.userData.data.is_password_set,
  );

  // useEffect(() => {}, [isPasswordSet]);

  return (
    <NavigationContainer>
      {token === null ? (
        <AuthStack />
      ) : isPasswordSet ? (
        <AppStack />
      ) : (
        <PasswordStack />
      )}
    </NavigationContainer>
  );
};

export default RootNav;
