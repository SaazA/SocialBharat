import Business from '../screens/Business/BusinessHomeScreen';
import Home from '../screens/HomeScreen';
import Matrimonial from '../screens/Matrimonial/HomeScreenMatrimonial';
import Members from '../screens/MembersScreen/MembersHomeScreen';
import Services from '../screens/Services/HomeScreenService';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../Components/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../constants/colors';
import Dashboard from '../screens/Dashboard';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import Octions from 'react-native-vector-icons/Octicons';
import JobsScreen from '../screens/Jobs/JobsHomeScreen';
import {Image, TouchableOpacity, View} from 'react-native';
const Drawer = createDrawerNavigator();
const DrawerNavigator = ({navigation}) => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: colors.bgcolorSign_up_in,
        drawerLabelStyle: {marginLeft: -25},
        headerStyle: {
          backgroundColor: colors.bgcolorSign_up_in,
        },

        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              marginRight: 10,
              width: 100,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 30}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('HomeScreen');
                }}>
                <FontAwesome6
                  name="house"
                  size={24}
                  color={colors.black}
                  style={{marginRight: 10}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ProfileScreen');
                }}>
                <Ionicons name="person-circle" color={colors.black} size={34} />
              </TouchableOpacity>
            </View>
          </View>
        ),
      }}>
      <Drawer.Screen
        name={'HomeScreen'}
        component={Home}
        options={{
          title: 'Home',
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'MembersScreen'}
        component={Members}
        options={{
          title: 'Members',
          drawerIcon: ({color}) => (
            <Ionicons name="accessibility-outline" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'JobsScreen'}
        component={JobsScreen}
        options={{
          title: 'Jobs',
          drawerIcon: ({color}) => (
            <Ionicons name="briefcase-outline" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'BusinessScreen'}
        component={Business}
        options={{
          title: 'Business',
          drawerIcon: ({color}) => (
            <FontAwesome5 name="money-bill" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'MatrimonialScreen'}
        component={Matrimonial}
        options={{
          title: 'Matrimonial',
          drawerIcon: ({color}) => (
            <Ionicons name="logo-tableau" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'ServiceScreen'}
        component={Services}
        options={{
          title: 'Services',
          drawerIcon: ({color}) => (
            <Ionicons name="construct-outline" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'DashboardScreen'}
        component={Dashboard}
        options={{
          title: 'Dashboard',
          drawerIcon: ({color}) => (
            <Ionicons name="logo-electron" color={color} size={24} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
