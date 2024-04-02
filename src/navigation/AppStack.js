import { View, Text } from 'react-native';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/HomeScreen';
import Members from '../screens/MemebersScreen';

import JobsScreen from '../screens/Jobs';
import DrawerNavigator from './DrawerNavigator';
import Login from '../Auth/Login';
import AddMatrimonial from '../screens/Matrimonial/AddNewMatrimonial';

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return(
    <Stack.Navigator>
        <Stack.Screen name={'DrawerNavigator'} component={DrawerNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name={'JobsScreen'} component={JobsScreen} options={{ headerShown: true}}/>
        <Stack.Screen name={'AddMatrimonialScreen'} component={AddMatrimonial} options={{ headerShown: true}}/>
        </Stack.Navigator>
    )
}