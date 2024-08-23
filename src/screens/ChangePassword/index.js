// import {
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useState} from 'react';
// import colors from '../../constants/colors';
// import {UpdatePassword} from '../../apis/apicalls';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   LogoutAction,
//   setPasswordUpdated,
//   UserInfoDeleteAction,
// } from '../../redux/actions';

// const SetPassword = () => {
//   const token = useSelector(state => state.AuthReducer.authToken);
//   const [password, setPassword] = useState();
//   const [confirmPassword, setConfirmPassword] = useState();
//   const dispatch = useDispatch();
//   const logout = () => {
//     dispatch(LogoutAction());
//     dispatch(UserInfoDeleteAction());
//   };
//   const update = () => {
//     // console.log(
//     //   ('token',
//     //   token,
//     //   'password',
//     //   password,
//     //   'confirmPassword',
//     //   confirmPassword),
//     // );
//     UpdatePassword(token, password, confirmPassword)
//       .then(response => {
//         console.log('HEY', response);

//         // const Token = res.token.token;
//         // dispatch(UserInfoSaveAction(res));
//         // dispatch(LoginAction(Token));
//         // setCommuntiyData(response.data);
//         dispatch(setPasswordUpdated(true));
//       })
//       .catch(error => {
//         console.warn(error.response.data);
//         // Alert.alert(error.response.data.errors.mobile);
//       });
//   };
//   return (
//     <View style={styles.maincontainer}>
//       <View style={styles.imagecontainer}>
//         <Image
//           source={require('../../assests/sb-logo.png')}
//           resizeMode="contain"
//           style={styles.image}
//         />
//       </View>
//       <View style={styles.headingcontainer}>
//         <Text style={styles.Passwordheading}>Set Password</Text>
//       </View>
//       <View style={styles.innercont}>
//         <View style={styles.contentcontainer}>
//           <Text style={styles.labeltext}>Enter New Password</Text>
//           <TextInput
//             style={styles.textbox}
//             onChangeText={text => setPassword(text)}></TextInput>
//         </View>
//         <View style={styles.contentcontainer}>
//           <Text style={styles.labeltext}>Confirm Password</Text>
//           <TextInput
//             style={styles.textbox}
//             onChangeText={text => setConfirmPassword(text)}></TextInput>
//         </View>

//         <TouchableOpacity style={styles.buttonbox} onPress={update}>
//           <Text style={styles.buttontext}>Submit Password</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.buttonbox} onPress={logout}>
//           <Text style={styles.buttontext}>Log Out</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default SetPassword;

// const styles = StyleSheet.create({
//   maincontainer: {
//     flex: 1,
//     margin: 10,
//     backgroundColor: colors.white,
//   },
//   innercont: {},
//   textbox: {
//     borderWidth: 1,
//     borderRadius: 5,
//     color: colors.black,
//   },
//   Passwordheading: {
//     color: colors.black,
//     fontSize: 20,
//     fontWeight: '600',
//     fontStyle: 'italic',
//   },
//   image: {
//     width: 200,
//     height: 200,
//   },
//   imagecontainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headingcontainer: {
//     margin: 20,
//     padding: 20,
//     alignItems: 'center',
//   },
//   labeltext: {
//     color: colors.black,
//   },
//   contentcontainer: {
//     margin: 10,
//   },
//   buttonbox: {
//     height: 40,
//     margin: 12,
//     borderWidth: 1,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.primary,
//   },
//   buttontext: {
//     fontWeight: 'bold',
//     fontSize: 20,
//     color: colors.white,
//   },
// });
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../constants/colors';
import {UpdatePassword} from '../../apis/apicalls';
import {useDispatch, useSelector} from 'react-redux';
import {
  LogoutAction,
  setPasswordUpdated,
  UserInfoDeleteAction,
} from '../../redux/actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import routes from '../../constants/routes';

const ChangePassword = ({navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = password => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleUpdate = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Validation Error', 'Fields cannot be blank');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password length should be more than 6');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        'Validation Error',
        'Password must contain at least one number, one lowercase letter, and one uppercase letter and a special symbol',
      );
      return;
    }

    UpdatePassword(token, password, confirmPassword)
      .then(response => {
        console.log('Response:', response);
        Alert.alert('Password Changed');
        handleNav();
      })
      .catch(error => {
        Alert.alert(error.response.data);
        // Alert.alert(error.response.data.errors.mobile);
      });
  };

  const handleNav = () => {
    navigation.navigate(routes.DASHBOARD);
  };
  return (
    <View style={styles.maincontainer}>
      <View style={styles.imagecontainer}>
        <Image
          source={require('../../assests/sb-logo.png')}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
      <View style={styles.headingcontainer}>
        <Text style={styles.Passwordheading}>Set Password</Text>
      </View>
      <View style={styles.innercont}>
        <View style={styles.contentcontainer}>
          <Text style={styles.labeltext}>Enter New Password</Text>
          <View style={styles.textboxContainer}>
            <TextInput
              style={styles.textbox}
              secureTextEntry={!showPassword}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contentcontainer}>
          <Text style={styles.labeltext}>Confirm Password</Text>
          <View style={styles.textboxContainer}>
            <TextInput
              style={styles.textbox}
              secureTextEntry={!showConfirmPassword}
              onChangeText={text => setConfirmPassword(text)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon
                name={showConfirmPassword ? 'eye' : 'eye-slash'}
                size={20}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.buttonbox} onPress={handleUpdate}>
          <Text style={styles.buttontext}>Submit Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    margin: 10,
    backgroundColor: colors.white,
  },
  innercont: {},
  textbox: {
    borderWidth: 1,
    borderRadius: 5,
    color: colors.black,
    flex: 1,
    paddingHorizontal: 10,
  },
  Passwordheading: {
    color: colors.black,
    fontSize: 22,
    fontWeight: '600',
  },
  image: {
    width: 200,
    height: 200,
  },
  imagecontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingcontainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.bgcolorSign_up_in,
  },
  labeltext: {
    color: colors.black,
  },
  contentcontainer: {
    margin: 10,
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
  textboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
});
