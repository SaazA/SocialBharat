import {View, Text, ImageBackground, Image} from 'react-native';
import React, {useEffect, useState} from 'react';

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import colors from '../constants/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {LogoutAction, UserInfoDeleteAction} from '../redux/actions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getCommunitybyid} from '../apis/apicalls';
import {useNavigation} from '@react-navigation/native';
import routes from '../constants/routes';

const CustomDrawer = props => {
  const [caste, setCaste] = useState('');
  const userInfo = useSelector(state => state.UserReducer.userData);
  const getusercommunity = () => {
    try {
      const id = userInfo.data.community_id;
      const token = userInfo.token.token;
      getCommunitybyid(id, token)
        .then(response => {
          const res = JSON.parse(JSON.stringify(response));
          setCaste(res.data.name);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const Navigation = useNavigation();

  useEffect(() => {
    getusercommunity();
  }, []);
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(LogoutAction());
    dispatch(UserInfoDeleteAction());
  };
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: colors.bgColor}}>
        <Image
          source={require('../assests/sb-logo.png')}
          style={{margin: 10, height: 90, width: '95%'}}></Image>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={
              userInfo.data.photo
                ? {uri: userInfo.data.photo}
                : require('../assests/nullphotocover.jpg')
            }
            style={{
              marginLeft: 10,
              height: 80,
              width: 80,
              borderRadius: 40,
              margin: 10,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginLeft: 20,
            }}>
            <Text style={{fontSize: 18, color: colors.orange}}>
              {userInfo.data.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.blue,
              }}>{`${'{'}${caste}${'}'}`}</Text>
          </View>
        </View>

        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          gap: 14,
        }}>
        <TouchableOpacity
          onPress={() => Navigation.navigate(routes.CHANGEPASSWORD)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="account-key"
            color={colors.RegisterandLoginButton}
            size={22}
          />
          <Text style={{color: colors.RegisterandLoginButton, marginLeft: 5}}>
            Change Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name="share-social-outline"
            color={colors.RegisterandLoginButton}
            size={22}
          />
          <Text style={{color: colors.RegisterandLoginButton, marginLeft: 5}}>
            Refer a Friend
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logout}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name="log-out-outline"
            color={colors.RegisterandLoginButton}
            size={22}
          />
          <Text style={{color: colors.RegisterandLoginButton, marginLeft: 5}}>
            SignOut
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
