import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Alert,
  ScrollView,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {useEffect, useState, useCallback} from 'react';
import React from 'react';

import {CommonActions, useNavigation} from '@react-navigation/native';
import routes from '../../constants/routes';
import colors from '../../constants/colors';
import {useDispatch} from 'react-redux';
import {LoginAction, UserInfoSaveAction} from '../../redux/actions';
import {LoginApi} from '../../apis/apicalls';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Login({navigation}) {
  const [showPassword, setShowPassword] = useState(false);
  const [borderColor, setBorderColor] = useState('#000');
  const [mobileBorderColor, setMobileBorderColor] = useState('#000'); // Initial border color for mobile
  const [passwordBorderColor, setPasswordBorderColor] = useState('#000');
  const [isFetching, setIsFetching] = useState(false);
  const [mobile, setMobile] = useState(null);
  const [password, setPassword] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isNumberValid, setisNumberValid] = useState(false);
  const dispatch = useDispatch();

  const validateNumber = mobile => {
    const hasNumber = /^[6789]\d{0,9}$/.test(mobile);
    return hasNumber;
  };

  const handleBlankValues = () => {
    let isValid = true;
    // Validate password field
    if (!password || !password.trim() || !mobile) {
      setPasswordBorderColor('#FF0000'); // Highlight the password field
      Alert.alert('Validation Error', 'Fields cannot be blank');
      isValid = false;
      return;
    } else {
      setPasswordBorderColor('#000'); // Reset the border color if filled
    }
    if (mobile.length < 10 || mobile.length > 10) {
      Alert.alert(
        'Validation Error',
        'Mobile length should not be more or less than 10',
      );
      return;
    }
    if (!validateNumber(mobile)) {
      Alert.alert('Number Invalid', 'Number should start from 6,7,8,9');
      return;
    }

    // Check if any input was invalid
    if (!isValid) {
      return; // Exit early if there's an invalid input
    }

    // If everything is valid, proceed with login
    handleLogin();
  };

  const nav = useNavigation();

  useEffect(() => {
    const unsubscribeFocus = nav.addListener('focus', () => {
      // This will be triggered when the screen is focused
      // You can keep this empty or handle any specific logic if needed
    });

    const unsubscribeBlur = nav.addListener('blur', () => {
      // Reset the state when the screen loses focus
      setMobile(null);
      setPassword(null);
      setMobileBorderColor('#000'); // Reset border color
      setPasswordBorderColor('#000');
      setisNumberValid(true); // Reset validation flag if needed
    });

    // Cleanup the listeners on component unmount
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [nav]);

  const handleLogin = async () => {
    if (isFetching) return;
    setIsFetching(true);
    return LoginApi(mobile, password)
      .then(response => {
        console.log('Raw response:', response);
        const res = JSON.parse(JSON.stringify(response));
        console.log(res);
        const Token = res.token.token;
        dispatch(UserInfoSaveAction(res));
        dispatch(LoginAction(Token));
      })
      .catch(error => {
        let errorMessage;

        if (error.response && error.response.data) {
          // Handle backend errors
          const {message, errors} = error.response.data;
          console.log('M' + message);
          console.log(errors);

          if (message === 'Invalid Password') {
            Alert.alert('Incorrect Password');
            setPasswordBorderColor('#FF0000');
          } else if (message === 'Validation Failed') {
            Alert.alert("User Doesn't exists");
            setMobileBorderColor('#FF0000');
            setPasswordBorderColor('#FF0000');
          } else if (message === 'data and hash arguments required') {
            Alert.alert(
              "User Password Doesn't exists",
              'Please Login with Otp and set your password',
            );
          }

          // Prioritize specific backend error if available, else fall back to general message
          errorMessage =
            message ||
            // message ||
            'An error occurred while processing your request.';
        } else {
          // Handle network or other errors
          errorMessage =
            error.message ||
            'An unexpected error occurred. Please check your internet connection and try again.';
        }

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setMobile(null);
    setPassword(null);
    setRefreshing(false);
  }, []);

  const onpressSignUp = () => {
    navigation.navigate(routes.SIGNUP);
  };
  return (
    <View style={styles.maincontainer}>
      <StatusBar backgroundColor={'#FF9933'} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.imagecontainer}>
          <Image
            source={require('../../assests/Signuppage.png')}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <View style={styles.contentcontainer}>
          <Text style={styles.centerheadtext}>Sign In</Text>
          <TextInput
            style={[styles.inputbox, {borderColor: mobileBorderColor}]}
            placeholder="Enter your mobile number"
            placeholderTextColor={colors.black}
            onChangeText={text => setMobile(text)}
            value={mobile}
            keyboardType="numeric"
            maxLength={10}
          />
          {isNumberValid ? (
            <View></View>
          ) : (
            <View style={styles.invaldcont}>
              <Text style={[styles.labeltext, styles.dangertext]}>
                Number should start from 6,7,8,9
              </Text>
            </View>
          )}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.inputbox, {borderColor: passwordBorderColor}]}
              placeholder="Enter your Password"
              placeholderTextColor={colors.black}
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.buttonbox, // Change color when fetching
            ]}
            onPress={isFetching ? null : handleBlankValues} // Disable button press during fetching
            disabled={isFetching} // Disable button interaction during fetching
          >
            <Text style={styles.buttontext}>
              {isFetching ? 'Fetching' : 'Login With Password'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.midtext}>OR</Text>
          <TouchableOpacity
            style={styles.otpbuttonbox}
            onPress={() => navigation.navigate(routes.OTPLOGIN)}>
            <Text style={styles.buttontext}>Login With OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.lefttextbox} onPress={onpressSignUp}>
            <Text style={styles.text}>New User? SignUp</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imagecontainer: {
    flex: 0.5,
    height: 350,
  },
  contentcontainer: {
    flex: 0.5,
    margin: 10,
    borderRadius: 20,
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
    borderRadius: 20,
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
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
  buttonbox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#FF9933',
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
  lefttextbox: {
    height: 40,

    marginLeft: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },

  midtext: {
    textAlign: 'center',
    color: '#000',
    fontSize: 17,
  },
  signuptext: {
    marginLeft: 40,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 25,
    top: 20,
  },
  labeltext: {
    color: colors.black,
    fontSize: 15,
  },
  dangertext: {
    color: colors.danger,
  },
  invaldcont: {
    marginLeft: 15,
  },
});
