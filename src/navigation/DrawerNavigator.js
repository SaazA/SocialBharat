
import Business from '../screens/Business';
import Home from '../screens/HomeScreen';
import Matrimonial from '../screens/Matrimonial';
import Members from '../screens/MemebersScreen';
import Services from '../screens/Services';
import {CommonActions} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../Components/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../constants/colors';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{ 
      drawerActiveBackgroundColor:colors.bgcolorSign_up_in,
      drawerLabelStyle: {marginLeft: -25}}}>
      <Drawer.Screen
        name={'HomeScreen'}
        component={Home}
        options={{
          drawerIcon: ({color, size}) => (
            <FontAwesome5 name={'home'} color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={'MembersScreen'}
        component={Members}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'BusinessScreen'}
        component={Business}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'MatrimonialScreen'}
        component={Matrimonial}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={'ServiceScreen'}
        component={Services}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" color={color} size={24} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
