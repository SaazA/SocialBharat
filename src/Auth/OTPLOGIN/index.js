import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import {useEffect, useState} from 'react';
import React from 'react';
import {Picker} from '@react-native-picker/picker';
import colors from '../../constants/colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {getActiveCommunities} from '../../apis/apicalls';
import {Dropdown} from 'react-native-element-dropdown';
import routes from '../../constants/routes';

export default function OTPLogin({navigation}) {
  const onpressLogin = () => {
    navigation.navigate(routes.SIGNUP);
  };

  const [mobile, setMobile] = useState();
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = text => {
    // Regular expression to validate the input
    const validInput = /^[6789]\d{9}$/;

    // Check if the input matches the regular expression
    if (validInput.test(text)) {
      setMobile(text);
      setIsValid(true);
      return true;
    } else {
      console.log('number is invalid');
      setIsValid(false); // Update isValid to false when the number is invalid
      return false;
    }
  };

  const nav = () => {
    if (isValid && mobile) {
      navigation.navigate(routes.OTPVERIFYLOGIN, {
        mobile: mobile,
      });
    } else {
      Alert.alert('Number is invalid');
    }
  };

  const navtopassword = () => {
    navigation.navigate(routes.LOGIN);
  };
  return (
    <ScrollView style={styles.maincontainer}>
      <View style={styles.imagecontainer}>
        <Image
          source={require('../../assests/sb-logo.png')}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
      <Text style={styles.centerheadtext}>Sign In</Text>

      <View style={styles.labelcont}>
        <Text style={styles.labeltext}>
          Enter Your number <Text style={{color: colors.danger}}>*</Text>
        </Text>
        <TextInput
          style={styles.inputbox}
          placeholder="Enter your number"
          maxLength={10}
          placeholderTextColor={colors.black}
          keyboardType="number-pad"
          onChangeText={text => handleInputChange(text)}></TextInput>
      </View>

      {isValid ? (
        <View></View>
      ) : (
        <Text style={[styles.labeltext, styles.dangertext]}>
          Number should start from 6,7,8,9 and of 10 digits
        </Text>
      )}

      <TouchableOpacity style={styles.buttonbox} onPress={nav}>
        <Text style={styles.buttontext}>Send OTP</Text>
      </TouchableOpacity>
      <Text style={styles.midtext}>OR</Text>
      <TouchableOpacity style={styles.otpbuttonbox} onPress={navtopassword}>
        <Text style={styles.buttontext}>Login With Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.lefttextbox} onPress={onpressLogin}>
        <Text style={styles.text}>New User? SignUp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.white,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  imagecontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
  },
  centerheadtext: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.black,
  },
  inputbox: {
    height: 40,
    color: colors.black,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },

  lefttextbox: {
    height: 40,
    marginLeft: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  labeltext: {
    color: colors.black,
    fontSize: 15,
  },
  labelcont: {
    margin: 10,
    gap: 2,
  },
  buttonbox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: colors.bgcolorSign_up_in,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.RegisterandLoginButton,
  },
  buttontext: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 20,
  },
  midtext: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 17,
    color: colors.black,
  },
  otpbuttonbox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: colors.bgcolorSign_up_in,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.RegisterandLoginButton,
    backgroundColor: '#FF9933',
  },
  image: {
    width: 200,
    height: 200,
  },
  dropdowncontainer: {
    margin: 5,
  },
  labeltextdrop: {
    color: colors.black,
    marginLeft: 5,
  },
  labeltext: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.black,
  },
  dangertext: {
    color: colors.danger,
  },
});
