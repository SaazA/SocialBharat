import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {getOTP, LoginWithOTP, RegisterVerify} from '../../apis/apicalls';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import colors from '../../constants/colors';
import {useDispatch} from 'react-redux';
import {LoginAction, UserInfoSaveAction} from '../../redux/actions';
import routes from '../../constants/routes';

const OTP_VERIFY_REGISTER = ({navigation, route}) => {
  const {mobile} = route.params;
  const {name} = route.params;
  const dispatch = useDispatch();
  const {community_id} = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [flag, setFlag] = useState(false);
  const inputs = useRef([]);
  useEffect(() => {
    getotp();
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsDisabled(false); // Re-enable the button when the timer ends
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getotp();

    setRefreshing(false);
  }, []);

  const resend = () => {
    getotp();
    ToastAndroid.show('OTP sent Again', ToastAndroid.SHORT);
    setIsDisabled(true);
    setTimer(30); // Set timer to 30 seconds
  };

  //   const getotp = () => {
  //     setApiFailed(false);
  //     getOTP(name, mobile, community_id)
  //       .then(response => {
  //         console.log(response);
  //         setIsSent(true);
  //         setNumberValid(true);
  //       })
  //       .catch(error => {
  //         let errorMessage;
  //         // console.log(error.response.data);
  //         if (error.response && error.response.data) {
  //           // Handle backend errors
  //           const {message, errors} = error.response.data;
  //           console.log('M' + message);
  //           console.log(errors);

  //           // Prioritize specific backend error if available, else fall back to general message
  //           errorMessage =
  //             message ||
  //             // message ||
  //             'An error occurred while processing your request.';
  //         } else {
  //           // Handle network or other errors
  //           errorMessage =
  //             error.message ||
  //             'An unexpected error occurred. Please check your internet connection and try again.';
  //         }

  //         // Show the error message in a toast
  //         ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  //         if (errorMessage === 'Network Error') {
  //           return;
  //         }
  //         setNumberInUse(true);
  //       });
  //   };

  const getotp = () => {
    setApiFailed(false);
    getOTP(name, mobile, community_id)
      .then(response => {
        console.log('HEY', response);
        setOtpSent(true);
      })
      .catch(error => {
        // console.warn(error.response.data);
        let errorMessage;

        if (error.response && error.response.data) {
          console.log('h');
          const {message, errors} = error.response.data;
          //   console.log(errors);
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              errorMessage = errors[key];
              console.log(`${errorMessage}`);
            }
          }
        } else if (error) {
          setApiFailed(true);
          return;
        }

        if (errorMessage.includes('Mobile number already in use')) {
          console.log('Setting flag to true');
          setFlag(true);
        }

        ToastAndroid.show(
          errorMessage ? errorMessage : 'Network Error',
          ToastAndroid.SHORT,
        );
        // if (errorMessage === 'Network Error') {
        //   return;
        // }
        setOtpSent(false);
      });
  };

  const verify = () => {
    const otpString = otp.join('');
    console.log(otpString);
    if (otpString.length !== 6) {
      ToastAndroid.show('OTP must be 6 digits long', ToastAndroid.SHORT);
      return; // Exit the function if OTP is not 6 digits
    }
    RegisterVerify(name, mobile, community_id, otpString)
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
  };

  const handleChangeText = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    console.log(newOtp);
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {!apiFailed ? (
        <View style={styles.maincontainer}>
          <View style={styles.imagecontainer}>
            <Image
              source={require('../../assests/sb-logo.png')}
              resizeMode="contain"
              style={styles.image}
            />
          </View>

          <View style={styles.headcontainer}>
            <Text style={styles.headtext}>Register</Text>
          </View>
          {/* <TextInput
          style={styles.input}
          onChangeText={text => setOtp(text)}></TextInput> */}
          {otpSent ? (
            <View style={styles.sentcontainer}>
              <Text style={styles.senttext}>
                OTP sent on your mobile Number
              </Text>
            </View>
          ) : (
            <></>
          )}

          <View style={styles.numbercontainer}>
            <Text style={styles.numbertext}>{mobile} </Text>
          </View>

          {otpSent ? (
            <>
              <View style={styles.container}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (inputs.current[index] = ref)}
                    style={styles.input}
                    value={digit}
                    onChangeText={text => handleChangeText(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.buttonbox} onPress={verify}>
                <Text style={styles.buttontext}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.ortext}>OR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.buttonbox,
                  isDisabled && {backgroundColor: '#ccc'},
                ]}
                onPress={resend}
                disabled={isDisabled}>
                <Text style={styles.buttontext}>
                  {isDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </>
          ) : flag ? ( // Check flag to render this part
            <>
              <View style={styles.notsent}>
                <Text style={{color: colors.black}}>
                  Number is Already Registered
                </Text>
              </View>
              <TouchableOpacity
                style={styles.buttonbox}
                onPress={() => navigation.navigate(routes.LOGIN)}>
                <Text style={styles.buttontext}>Sign IN</Text>
              </TouchableOpacity>
            </>
          ) : (
            <></>
          )}
        </View>
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
};

export default OTP_VERIFY_REGISTER;

const styles = StyleSheet.create({
  imagecontainer: {justifyContent: 'center', alignItems: 'center'},
  image: {
    width: 200,
    height: 200,
  },
  maincontainer: {
    flex: 1,

    backgroundColor: colors.white,
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
  input: {
    borderWidth: 1,
    margin: 10,
    color: colors.black,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    width: 40,
    height: 50,
    textAlign: 'center',
    fontSize: 24,
    color: colors.black,
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
  headcontainer: {
    margin: 10,
    alignItems: 'center',
    height: 30,
  },
  headtext: {
    color: colors.black,
    fontSize: 22,
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
  notsent: {
    margin: 10,
    alignItems: 'center',
  },
});
