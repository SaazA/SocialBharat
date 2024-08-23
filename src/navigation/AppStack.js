import {View, Text} from 'react-native';
import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import AddMatrimonial from '../screens/Matrimonial/AddNewMatrimonial';
import ViewMatrimonialProfile from '../screens/Matrimonial/ViewMatrimonialProfile';
import ChatScreenMatrimonial from '../screens/Matrimonial/ChatScreenMatrimonial';
import ViewSpecificService from '../screens/Services/ViewSpecificServiceScreen';
import RegisteredServicesUser from '../screens/Services/RegisteredServiceScreen';
import Practice from '../screens/practice';
import ViewMembers from '../screens/MembersScreen/ViewMembersScreen';
import ChatScreenMembers from '../screens/MembersScreen/MembersChatScreen';
import CreateJobScreen from '../screens/Jobs/CreateJobScreen';
import UserAppliedJobs from '../screens/Jobs/ViewUserAppliedJobs';
import ProfileScreen from '../screens/Profile/ViewProfile';
import BusinessPromotion from '../screens/Business/BusinessPromote';
import UserCreatedJobs from '../screens/Jobs/ViewUserCreatedJobs';
import EducationUpdate from '../screens/EducationScreen';
import EventsScreen from '../screens/Events/HomeScreenViewEvents';
import ActivitiesScreen from '../screens/Activities/ViewActivities';
import FeedbackScreen from '../screens/Feedback';
import CreateEvents from '../screens/Events/CreateEvents';
import PostActivities from '../screens/Activities/Postactivities';
import EditProfile from '../screens/Profile/EditProfile';
import ViewSpecificEvent from '../screens/Events/ViewSpecificEvents';
import Myevents from '../screens/Events/Myevents';
import ChangePassword from '../screens/ChangePassword';
import AddAddress from '../screens/AddAddressScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'DrawerNavigator'}
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'AddMatrimonial'}
        component={AddMatrimonial}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={'ViewMatrimonial'}
        component={ViewMatrimonialProfile}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={'PracticeScreen'}
        component={Practice}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={'ChatScreenMatrimonial'}
        component={ChatScreenMatrimonial}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ViewSpecificService'}
        component={ViewSpecificService}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={'RegisteredServicesByUser'}
        component={RegisteredServicesUser}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={'ViewProfile'}
        component={ViewMembers}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={'ChatScreenMembers'}
        component={ChatScreenMembers}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'CreateJobScreen'}
        component={CreateJobScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'UserAppliedJobs'}
        component={UserAppliedJobs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ProfileScreen'}
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'BusinessPromote'}
        component={BusinessPromotion}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'UserCreatedJobs'}
        component={UserCreatedJobs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'EducationUpdate'}
        component={EducationUpdate}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'EventsScreen'}
        component={EventsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ActivitiesScreen'}
        component={ActivitiesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'FeedbackScreen'}
        component={FeedbackScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'CreateEvents'}
        component={CreateEvents}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'PostActivities'}
        component={PostActivities}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'EditProfile'}
        component={EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ViewSpecificEvent'}
        component={ViewSpecificEvent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'UserCreatedEvents'}
        component={Myevents}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ChangePassword'}
        component={ChangePassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'AddAddress'}
        component={AddAddress}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
