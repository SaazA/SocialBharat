import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground
} from 'react-native';
import { useState } from 'react';
import React from 'react';

import { CommonActions } from '@react-navigation/native';
import routes from '../../constants/routes';
import colors from '../../constants/colors';
import { useDispatch } from 'react-redux';
import { LoginAction, UserInfoSaveAction } from '../../redux/actions';
import { LoginApi } from '../../apis/apicalls';
import Ionicons from 'react-native-vector-icons/Ionicons';



export default function Login({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  // const handleLogin = async () => {
  //   return LoginApi(mobile, password)
  //     .then(response => {
  //       console.log('Raw response:', response);
  //       const res = JSON.parse(JSON.stringify(response));
  //       console.log(res);
  //       const Token = res.token.token
  //       dispatch(UserInfoSaveAction(res));
  //       dispatch(LoginAction(Token));
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  const handleLogin = async () => {
    return LoginApi(mobile, password)
      .then(response => {
        console.log('Raw response:', response);
        const res = JSON.parse(JSON.stringify(response));
        console.log(res);
        const Token = res.token.token
        dispatch(UserInfoSaveAction(res));
        dispatch(LoginAction(Token));
      })
      .catch(error => {
  
        console.log(error);
  
      });
  
  };

  const [mobile, setMobile] = useState(null);
  const [password, setPassword] = useState(null);


  const onpressSignUp = () => {
    navigation.navigate(routes.SIGNUP);
  }
  return (
    <View style={styles.maincontainer}>

      <View style={styles.imagecontainer}>
        <Image
          source={require('../../assests/Signuppage.png')}
          resizeMode="cover"
          style={styles.image}
        />
      </View>
      <View style={styles.contentcontainer}>
        <Text style={styles.centerheadtext}>Sign In</Text>
        <TextInput
          style={styles.inputbox}
          placeholder="Enter your mobile mobile"
          onChangeText={(text) => setMobile(text)}/>
        <TextInput
          style={styles.inputbox}
          placeholder="Enter your Password"
          onChangeText={(text) => setPassword(text)} 
          />
        <TouchableOpacity style={styles.buttonbox} onPress={handleLogin}>
          <Text style={styles.buttontext}>Login With Password</Text>
        </TouchableOpacity>
        <Text style={styles.midtext}>OR</Text>
        <TouchableOpacity style={styles.buttonbox}>
          <Text style={styles.buttontext}>Login With OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lefttextbox} onPress={onpressSignUp}>
          <Text style={styles.text}>New User? SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.bgcolorSign_up_in,
  },
  imagecontainer: {
    flex: 0.5,
  },
  contentcontainer: {
    flex: 0.5,
    margin:10,
    borderRadius:20,
    
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  centerheadtext: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.black,
  },
  inputbox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color:colors.black,
  },
  buttonbox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.RegisterandLoginButton,
  },
  buttontext: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  lefttextbox: {
    height: 40,
    marginLeft: 15
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  midtext: {
    textAlign: 'center'
  }
  ,
  signuptext: {
    marginLeft: 40,
  }

});
