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
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {useEffect, useRef, useState, useCallback} from 'react';
import React from 'react';
import colors from '../../constants/colors';

import {
  getOTP,
  LoginWithOTP,
  RegisterVerify,
  SendOTP,
} from '../../apis/apicalls';
import routes from '../../constants/routes';
import {useDispatch} from 'react-redux';
import {LoginAction, UserInfoSaveAction} from '../../redux/actions';

export default function OTPVERIFY({navigation, route}) {
  const {from} = route.params;
  const dispatch = useDispatch();
  const {mobile} = route.params;
  const {name} = route.params;
  console.log(from);
  const {community_id} = route.params;

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [numberInUse, setNumberInUse] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const inputs = useRef([]);

  const [numberValid, setNumberValid] = useState(true);
  const [isSent, setIsSent] = useState(false);
  useEffect(() => {
    if (from === 'SignupScreen') {
      getotp();
    } else if (from === 'OTP_LOGIN') {
      sendotp();
    }
  }, [from, mobile, name, community_id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setNumberInUse(false);
    setNumberValid(true);
    if (from === 'SignupScreen') {
      getotp();
    } else if (from === 'OTP_LOGIN') {
      sendotp();
    }
    setRefreshing(false);
  }, []);

  const getotp = async () => {
    setApiFailed(false);
    try {
      const response = await getOTP(name, mobile, community_id);
      console.log(response);
      setIsSent(true);
      setNumberValid(true);
      return true; // OTP sent successfully
    } catch (error) {
      setNumberInUse(true);
      handleOtpError(error);
      return false; // OTP sending failed
    }
  };

  const sendotp = async () => {
    setApiFailed(false);
    try {
      const response = await SendOTP(mobile);
      // console.log('HEY', response.data);
      setIsSent(true);
      return true; // OTP sent successfully
    } catch (error) {
      handleOtpError(error);
      setNumberValid(false);
      return false; // OTP sending failed
    }
  };

  // Helper function to handle OTP errors
  const handleOtpError = error => {
    let errorMessage;

    if (error.response && error.response.data) {
      // Handle backend errors
      const {message, errors} = error.response.data;
      console.log('M' + message);
      console.log(errors);

      // Prioritize specific backend error if available, else fall back to general message
      errorMessage =
        message || 'An error occurred while processing your request.';
    } else {
      // Handle network or other errors
      errorMessage =
        error.message ||
        'An unexpected error occurred. Please check your internet connection and try again.';
    }

    console.log(errorMessage);

    // Show the error message in a toast
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);

    // Set appropriate flags based on the error
    if (errorMessage === 'Network Error') {
      setApiFailed(true);
    }
  };

  // const getotp = () => {
  //   setApiFailed(false);
  //   getOTP(name, mobile, community_id)
  //     .then(response => {
  //       console.log(response);
  //       setIsSent(true);
  //       setNumberValid(true);
  //     })
  //     .catch(error => {
  //       let errorMessage;
  //       // console.log(error.response.data);
  //       if (error.response && error.response.data) {
  //         // Handle backend errors
  //         const {message, errors} = error.response.data;
  //         console.log('M' + message);
  //         console.log(errors);

  //         // Prioritize specific backend error if available, else fall back to general message
  //         errorMessage =
  //           message ||
  //           // message ||
  //           'An error occurred while processing your request.';
  //       } else {
  //         // Handle network or other errors
  //         errorMessage =
  //           error.message ||
  //           'An unexpected error occurred. Please check your internet connection and try again.';
  //       }

  //       // Show the error message in a toast
  //       ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  //       if (errorMessage === 'Network Error') {
  //         return;
  //       }
  //       setNumberInUse(true);
  //     });
  // };

  // const sendotp = () => {
  //   setApiFailed(false);
  //   SendOTP(mobile)
  //     .then(response => {
  //       // console.log('HEY', response.data);
  //       setIsSent(true);
  //     })
  //     .catch(error => {
  //       // console.warn(error.response.data);

  //       let errorMessage;

  //       if (error.response && error.response.data) {
  //         // Handle backend errors
  //         const {message, errors} = error.response.data;
  //         console.log('M' + message);
  //         console.log(errors);

  //         // Prioritize specific backend error if available, else fall back to general message
  //         errorMessage =
  //           message ||
  //           // message ||
  //           'An error occurred while processing your request.';
  //       } else {
  //         // Handle network or other errors
  //         errorMessage =
  //           error.message ||
  //           'An unexpected error occurred. Please check your internet connection and try again.';
  //       }
  //       console.log(errorMessage);

  //       // Show the error message in a toast
  //       ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  //       if (errorMessage === 'Network Error') {
  //         return;
  //       }
  //       setNumberValid(false);
  //     });
  // };

  // const alertResend = () => {
  //   setOtp(new Array(6).fill(''));
  //   if (from === 'SignupScreen') {
  //     getotp();
  //   } else if (from === 'OTP_LOGIN') {
  //     sendotp();
  //   }
  //   Alert.alert('OTP Sent Again');
  // };

  const alertResend = async () => {
    setOtp(new Array(6).fill(''));

    let otpSentSuccessfully = false; // Initialize flag

    if (from === 'SignupScreen') {
      otpSentSuccessfully = await getotp(); // Update flag based on the result
    } else if (from === 'OTP_LOGIN') {
      otpSentSuccessfully = await sendotp(); // Update flag based on the result
    }

    if (otpSentSuccessfully) {
      Alert.alert('OTP Sent Again');
    }
  };

  const VerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (otp.some(digit => digit.trim() === '')) {
      Alert.alert(
        'Invalid OTP',
        'Please fill in all OTP fields without spaces.',
      );
      return;
    }

    if (enteredOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'OTP must be exactly 6 digits.');
      return;
    }

    if (from === 'SignupScreen') {
      RegisterVerify(name, mobile, community_id, enteredOtp)
        .then(response => {
          console.log(response);
          const Token = response.token.token;
          dispatch(UserInfoSaveAction(response));
          dispatch(LoginAction(Token));
          console.log('SIGNUP');
          // setCommuntiyData(response.data);
        })
        .catch(error => {
          let errorMessage;
          // console.log(error.response.data);
          if (error.response && error.response.data) {
            // Handle backend errors
            const {message, errors} = error.response.data;
            console.log('M' + message);
            console.log(errors);

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
        });
    } else if (from === 'OTP_LOGIN') {
      LoginWithOTP(mobile, enteredOtp)
        .then(response => {
          console.log(response.token.token);
          console.log('OTPLOGIN');
          const Token = response.token.token;
          dispatch(UserInfoSaveAction(response));
          dispatch(LoginAction(Token));
          // setCommuntiyData(response.data);
        })
        .catch(error => {
          let errorMessage;
          // console.log(error.response.data);
          if (error.response && error.response.data) {
            // Handle backend errors
            const {message, errors} = error.response.data;
            console.log('M' + message);
            console.log(errors);

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
        });
    }
  };

  const handleChange = (value, index) => {
    const newOtp = [...otp];

    // If the user backspaces and the current value is empty, move to the previous input
    if (value === '' && index > 0) {
      newOtp[index] = '';
      setOtp(newOtp);
      inputs.current[index - 1].focus();
      return;
    }

    // If the user enters a value, update the OTP and move to the next input
    if (value) {
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if it's not the last input
      if (index < otp.length - 1) {
        inputs.current[index + 1].focus();
      }
    } else {
      // If the current input is empty, update the OTP
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const navtosign = () => {
    navigation.navigate(routes.SIGNUP);
  };

  const navtoLogin = () => {
    navigation.navigate(routes.LOGIN);
  };

  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {!apiFailed ? (
        <>
          <View style={styles.imagecontainer}>
            <Image
              source={require('../../assests/sb-logo.png')}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <Text style={styles.centerheadtext}>Sign Up</Text>
          <View style={styles.numbercontainer}>
            <Text style={styles.numbertext}>{mobile} </Text>
          </View>
          {isSent ? (
            <View style={styles.sentcontainer}>
              <Text style={styles.senttext}>
                OTP sent on your mobile Number
              </Text>
            </View>
          ) : (
            <></>
          )}
          {numberValid && !numberInUse ? (
            <>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    value={digit}
                    onChangeText={value => handleChange(value, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={ref => (inputs.current[index] = ref)}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.buttonbox} onPress={VerifyOtp}>
                <Text style={styles.buttontext}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.ortext}>OR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonbox} onPress={alertResend}>
                <Text style={styles.buttontext}>Resend OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {!numberValid ? (
                <>
                  <View>
                    <Text style={styles.notRegtext}>
                      You are not Registered as a Member. We request you to Sign
                      Up.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.buttonbox}
                    onPress={navtosign}>
                    <Text style={styles.buttontext}>Sign Up</Text>
                  </TouchableOpacity>
                </>
              ) : numberInUse ? (
                <>
                  <View>
                    <Text style={styles.notRegtext}>Number Already in Use</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.buttonbox}
                    onPress={navtoLogin}>
                    <Text style={styles.buttontext}>Login</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        style={styles.input}
                        value={digit}
                        onChangeText={value => handleChange(value, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        ref={ref => (inputs.current[index] = ref)}
                      />
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.buttonbox}
                    onPress={VerifyOtp}>
                    <Text style={styles.buttontext}>Verify OTP</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.ortext}>OR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonbox}
                    onPress={alertResend}>
                    <Text style={styles.buttontext}>Resend OTP</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {apiFailed ? (
            <View style={styles.nomoretextcontainer}>
              <Text style={styles.nomoretext}>
                Check your Internet, pull to refresh
              </Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </>
      )}
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

  buttonbox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  buttontext: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.white,
  },
  ortext: {
    color: colors.black,
    fontSize: 18,
    textAlign: 'center',
  },

  image: {
    width: 200,
    height: 200,
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 18,
    margin: 5,
    color: colors.black,
  },
  otpContainer: {
    flexDirection: 'row',
    margin: 10,
    gap: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  numbercontainer: {
    borderWidth: 1,
    height: 40,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
  },
  numbertext: {
    color: colors.black,
    fontSize: 18,
  },
  sentcontainer: {
    margin: 10,
    height: 30,
  },
  senttext: {
    color: colors.danger,
    fontSize: 18,
  },
  notRegtext: {
    color: colors.black,
    margin: 20,
  },
  nomoretextcontainer: {
    borderWidth: 1,
    margin: 10,
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: colors.grayLight,
    padding: 5,
  },
  nomoretext: {
    fontSize: 20,
    color: colors.blue,
  },
});
