import { View, Text } from 'react-native';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/HomeScreen';
import Members from '../screens/MemebersScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import JobsScreen from '../screens/Jobs';
import Business from '../screens/Business';
import Matrimonial from '../screens/Matrimonial';
import Services from '../screens/Services';
import routes from '../constants/routes';


const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();
const DrawerNavigator = () =>{
    return(
        <Drawer.Navigator>
        <Drawer.Screen name={routes.HOME} component={Home}/>
        <Drawer.Screen name={routes.MEMBERSSCREEN} component={Members}/>
        <Drawer.Screen name={routes.BUSISNESSSCREEN} component={Business}/>
        <Drawer.Screen name={routes.MATRIMONIALSCREEN} component={Matrimonial}/>
        <Drawer.Screen name={routes.SERVICESCREEN} component={Services}/>
    </Drawer.Navigator>
    )
}
export default function AppStack() {
    return(
    <Stack.Navigator>
        <Stack.Screen name={routes.DRAWERNAVIGATION} component={DrawerNavigator} options={{ headerShown: false }}/>
        </Stack.Navigator>
    )
}