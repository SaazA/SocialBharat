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
  ActivityIndicator,
} from 'react-native';
import {useEffect, useState, useCallback} from 'react';
import React from 'react';
import {Picker} from '@react-native-picker/picker';
import colors from '../../constants/colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {getActiveCommunities} from '../../apis/apicalls';
import {Dropdown} from 'react-native-element-dropdown';
import routes from '../../constants/routes';
import {useFocusEffect} from '@react-navigation/native';

export default function SignUp({navigation}) {
  const onpressLogin = () => {
    navigation.navigate('LoginScreen');
  };
  const [selectedCommunity, setSelectedCommunity] = useState();
  const [communtiyData, setCommuntiyData] = useState();
  const [dataLoadedForCommunity, setDataLoadedForCommunity] = useState(false);
  const [isNumberValid, setisNumberValid] = useState(false);
  const [name, setName] = useState();
  const [number, setNumber] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const getCommunty = () => {
    setApiFailed(false);
    getActiveCommunities()
      .then(response => {
        console.log(response.data);
        setCommuntiyData(response.data);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
        // console.log('Community DATA ERROR1' + error);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setName('');
    setNumber('');
    getCommunty();
    setRefreshing(false);
  }, []);

  const communitiesdropdownoptions = communtiyData
    ? communtiyData.map(community => ({
        label: community.name,
        value: community.id,
      }))
    : [];

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Clear the data when the screen is unfocused
        setName('');
        setNumber('');
        setSelectedCommunity(null);
        getCommunty();
        setisNumberValid(false);
      };
    }, []),
  );
  useEffect(() => {
    getCommunty();
  }, []);

  const handleCommunityDropdown = selectedItem => {
    setSelectedCommunity(selectedItem.value);
    setDataLoadedForCommunity(true);
  };
  const handleClearCommunityDropdown = () => {
    setSelectedCommunity();
    setDataLoadedForCommunity(false);
  };

  // const checkInput = () => {
  //   if (!name || !number || !selectedCommunity) {
  //     Alert.alert('Enter all the Mandatory information');
  //     return false;
  //   }
  //   return true;
  // };

  // const nav = () => {
  //   if (checkInput()) {
  //     navigation.navigate(routes.OTPVERIFY, {
  //       name: name,
  //       mobile: number,
  //       community_id: selectedCommunity,
  //       from: 'SignupScreen',
  //     });
  //   }
  // };
  // const handleInputChange = text => {
  //   // Regular expression to validate the input
  //   const validInput = /^[6789]\d{0,9}$/;

  //   // Check if the input matches the regular expression
  //   if (validInput.test(text)) {
  //     setNumber(text);
  //     setisNumberValid(true);
  //   } else {
  //     console.log('number is invalid');
  //     setisNumberValid(false);
  //   }
  // };

  // const nav = () => {
  //   // Validate input fields
  //   if (!name || !number || !selectedCommunity) {
  //     Alert.alert('Enter all the Mandatory information');
  //     return;
  //   }

  //   if (name === '') {
  //     // If the input is empty after trimming, show an alert
  //     Alert.alert('Invalid Input', 'Input cannot be only spaces.');
  //     return;
  //   }

  //   // Validate the phone number
  //   const validNumber = /^[6789]\d{9}$/;
  //   if (!validNumber.test(number)) {
  //     Alert.alert(
  //       'Please enter a valid 10-digit mobile number',
  //       'starting with 6, 7, 8, or 9',
  //     );
  //     return;
  //   }

  //   // Navigate to the OTP verification screen if everything is valid
  //   navigation.navigate(routes.OTPVERIFYREGISTER, {
  //     name: name,
  //     mobile: number,
  //     community_id: selectedCommunity,
  //   });
  // };

  // const handleInputChange = text => {
  //   // Only set the number if it matches the valid pattern
  //   const validInput = /^[6789]\d{0,9}$/;
  //   if (validInput.test(text)) {
  //     setNumber(text);
  //     setisNumberValid(true);
  //   } else {
  //     setisNumberValid(false);
  //     console.log('Number is invalid');
  //   }
  // };

  // const handleTextChange = text => {
  //   const input = text.replace(/\d+/g, '');
  //   setName(input);
  // };

  const handleTextChange = text => {
    const input = text.replace(/\d+/g, ''); // Remove digits
    if (input.trim() === '') {
      ToastAndroid.show('Input Cannot start with spaces', ToastAndroid.SHORT);
      setName(''); // Clear the input if it's just spaces
    } else {
      setName(input); // Set the valid input
    }
  };

  const handleInputChange = text => {
    const validInput = /^[6789]\d{0,9}$/;
    if (validInput.test(text)) {
      setNumber(text); // Set the valid input
      setisNumberValid(true); // Mark as valid
    } else {
      setisNumberValid(false); // Mark as invalid
    }
  };

  const nav = () => {
    // Validate input fields
    if (!name || !number || !selectedCommunity) {
      ToastAndroid.show(
        'Enter all the Mandatory information',
        ToastAndroid.SHORT,
      );
      return;
    }

    if (name.trim() === '') {
      ToastAndroid.show('Invalid Input', ToastAndroid.SHORT);
      return;
    }

    // Validate the phone number
    const validNumber = /^[6789]\d{9}$/;
    if (!validNumber.test(number)) {
      Alert.alert(
        'Please enter a valid 10-digit mobile number',
        'starting with 6, 7, 8, or 9',
      );
      return;
    }

    // Navigate to the OTP verification screen if everything is valid
    navigation.navigate(routes.OTPVERIFYREGISTER, {
      name: name.trim(), // Ensure no trailing spaces
      mobile: number,
      community_id: selectedCommunity,
    });
  };

  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {!apiFailed && communtiyData ? (
        <>
          <View style={styles.imagecontainer}>
            <Image
              source={require('../../assests/sb-logo.png')}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <Text style={styles.centerheadtext}>Sign Up</Text>
          {/* <View style={styles.labelcont}>
            <Text style={styles.labeltext}>
              Enter Your Name <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <TextInput
              style={styles.inputbox}
              placeholder="Enter your name"
              placeholderTextColor={colors.black}
              onChangeText={handleTextChange}
              value={name}></TextInput>
          </View>
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
              value={number}
              onChangeText={text => handleInputChange(text)}></TextInput>
            {isNumberValid ? (
              <View></View>
            ) : (
              <Text style={[styles.labeltext, styles.dangertext]}>
                Number should start from 6,7,8,9
              </Text>
            )}
          </View> */}

          <View style={styles.labelcont}>
            <Text style={styles.labeltext}>
              Enter Your Name <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <TextInput
              style={styles.inputbox}
              placeholder="Enter your name"
              placeholderTextColor={colors.black}
              onChangeText={handleTextChange}
              value={name}
            />
          </View>

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
              value={number}
              onChangeText={text => handleInputChange(text)}
            />
            {!isNumberValid && (
              <Text style={[styles.labeltext, styles.dangertext]}>
                Number should start from 6, 7, 8, or 9
              </Text>
            )}
          </View>

          <View style={styles.dropdowncontainer}>
            <Text style={styles.labeltextdrop}>
              Community Selection <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={communitiesdropdownoptions}
              search
              itemTextStyle={styles.itemTextStyle}
              searchPlaceholder="Search"
              placeholderStyle={styles.placeholderStyle}
              // searchTextInput={{color: colors.black}}
              inputSearchStyle={styles.searchTextInput}
              selectedTextStyle={styles.selectedTextStyle}
              labelField="label"
              valueField="value"
              maxHeight={300}
              placeholder={'--Select--'}
              value={selectedCommunity}
              onChange={handleCommunityDropdown}
              renderRightIcon={() => {
                if (selectedCommunity && dataLoadedForCommunity !== null) {
                  return (
                    <FontAwesome6
                      name="circle-xmark"
                      color={colors.danger}
                      size={22}
                      onPress={handleClearCommunityDropdown}
                    />
                  );
                } else {
                  return (
                    <FontAwesome5
                      name="caret-down"
                      color={colors.blue}
                      size={28}
                    />
                  );
                }
              }}
            />
          </View>

          <TouchableOpacity style={styles.buttonbox} onPress={nav}>
            <Text style={styles.buttontext}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.lefttextbox} onPress={onpressLogin}>
            <Text style={styles.text}>Already User? Login</Text>
          </TouchableOpacity>
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
  inputbox: {
    height: 40,
    color: colors.black,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
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
  dropdown: {
    marginLeft: 10,
    marginRight: 10,
    margin: 5,
    padding: 5,
    height: 50,
    borderBottomColor: colors.black,
    borderWidth: 0.5,
  },
  dropdownoutsidecontainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.white,
    elevation: 25,
    borderRadius: 15,
  },
  searchTextInput: {
    color: colors.black,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    color: colors.black,
    fontSize: 18,
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
