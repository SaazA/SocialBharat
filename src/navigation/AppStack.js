import { View, Text } from 'react-native';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import Login from '../Auth/Login';
import AddMatrimonial from '../screens/Matrimonial/AddNewMatrimonial';
import ViewMatrimonialProfile from '../screens/Matrimonial/ViewMatrimonialProfile';
import ChatScreenMatrimonial from '../screens/Matrimonial/ChatScreenMatrimonial';
import ViewSpecificService from '../screens/Services/ViewSpecificServiceScreen';
import RegisteredServicesUser from '../screens/Services/RegisteredServiceScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return(
    <Stack.Navigator>
        <Stack.Screen name={'DrawerNavigator'} component={DrawerNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name={'AddMatrimonial'} component={AddMatrimonial} options={{ headerShown: true}}/>
        <Stack.Screen name={'ViewMatrimonial'} component={ViewMatrimonialProfile} options={{ headerShown: true}}/>
        <Stack.Screen name={'ChatScreenMatrimonial'} component={ChatScreenMatrimonial} options={{ headerShown: false}}/>
        <Stack.Screen name={'ViewSpecificService'} component={ViewSpecificService} options={{ headerShown: true}}/>
        <Stack.Screen name={'RegisteredServicesByUser'} component={RegisteredServicesUser} options={{ headerShown: true}}/>
        </Stack.Navigator>
    )
}