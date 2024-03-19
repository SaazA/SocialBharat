
import Business from '../screens/Business';
import Home from '../screens/HomeScreen';
import Matrimonial from '../screens/Matrimonial';
import Members from '../screens/MemebersScreen';
import Services from '../screens/Services';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../Components/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import Dashboard from '../screens/Dashboard';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{ 
      drawerActiveBackgroundColor:colors.bgcolorSign_up_in,
      drawerLabelStyle: {marginLeft: -25},
      headerStyle: {
        backgroundColor: colors.bgcolorSign_up_in,
      },}}>
      <Drawer.Screen
        name={'HomeScreen'}
        component={Home}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" color={color} size={24} />
          ),
        }}
      /><Drawer.Screen
      name={'DashboardScreen'}
      component={Dashboard}
      options={{
        drawerIcon: ({color}) => (
          <Ionicons name="logo-electron" color={color} size={24} />
        ),
      }}
    />
      <Drawer.Screen
        name={'MembersScreen'}
        component={Members}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="accessibility-outline" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'BusinessScreen'}
        component={Business}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="briefcase-outline" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'MatrimonialScreen'}
        component={Matrimonial}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="logo-tableau" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'ServiceScreen'}
        component={Services}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="construct-outline" color={color} size={24} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
