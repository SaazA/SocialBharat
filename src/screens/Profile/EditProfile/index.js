import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {
  getCities,
  getCommunitybyid,
  getProfile,
  getState,
  SearchEvents,
  UpdateProfileDetails,
} from '../../../apis/apicalls';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../constants/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import routes from '../../../constants/routes';
import {ActivityIndicator} from 'react-native';

const EditProfile = ({route, navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  // const {community} = route.params;
  // console.log(community);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [dataLoadedforOccupation, setDataLoadedforOccupation] = useState(false);
  const [jobType, setJobType] = useState('');
  const [education, setEducation] = useState('');
  const [dataLoadedForEducation, setDataLoadedForEducation] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [dataLoadedForMarriage, setDataLoadedForMarriage] = useState('');
  const [gender, setGender] = useState(null);
  const [dataLoadedforgender, setDataLoadedforgender] = useState(false);
  const [userData, setUserData] = useState();
  const [changedName, setChangedName] = useState();
  const [changedEmail, setChangedEmail] = useState();
  const [changedDob, setChangedDob] = useState();
  const [stateEdit, setStateEdit] = useState(false);
  const [occupation, setOccupation] = useState('Other');
  const [cityEdit, setCityEdit] = useState(false);
  const [availableForMarriage, setIsAvailableForMarriage] = useState(false);
  const [maritalValue, setMaritalValue] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [communityName, setCommunityName] = useState();

  useEffect(() => {
    getusercommunity();
  }, []);

  const Community_id = useSelector(state => state.UserReducer.userData.data.id);
  const getusercommunity = () => {
    getCommunitybyid(Community_id, token)
      .then(response => {
        console.log(response);
        setCommunityName(response.data.name);
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const id = useSelector(state => state.UserReducer.userData.data.id);
  const getUserProfile = () => {
    setApiFailed(false);
    getProfile(token, id)
      .then(response => {
        console.log('UserProfiles' + JSON.stringify(response.data));
        setUserData(response.data.data);
        // setValue(response.data.data);
        const data = response.data.data;
        setMaritalStatus(data.marital_status);
        setChangedEmail(data.email);
        setChangedName(data.name);
        setChangedDob(data.dob ? moment(data.dob).format('YYYY-MM-DD') : 'NA');
        setGender(data.gender);
        setEducation(data.highest_qualification);
        setJobType(data.job_type);
        setSelectedState(data.native_place_state);
        setSelectedCity(data.native_place_city);
        if (data.is_available_for_marriage) {
          setMaritalValue(true);
        } else {
          setMaritalValue(false);
        }
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserProfile();
    getStateData();
    setRefreshing(false);
  }, []);

  const UpdateUserProfile = (
    dob,
    email,
    gender,
    highest_qualification,
    is_available_for_marriage,
    job_type,
    marital_status,
    name,
    native_place_city,
    native_place_state,
    occupation,
  ) => {
    UpdateProfileDetails(
      token,
      dob,
      email,
      gender,
      highest_qualification,
      is_available_for_marriage,
      job_type,
      marital_status,
      name,
      native_place_city,
      native_place_state,
      occupation,
    )
      .then(response => {
        console.log(response.data);
        Alert.alert('Profile Updated Succesfully');
        handleNav();
      })
      .catch(error => {
        if (error.message === 'Network Error') {
          const errorMessage = error.message || 'An unexpected error occurred';
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        } else {
          const {errors, message} = error.response.data;
          Alert.alert(Object.values(errors).join('\n'));
        }

        setApiFailed(true);
        // console.log(error, errors, message);
        // Alert.alert(JSON.stringify(errors));
      });
  };
  useEffect(() => {
    getUserProfile();
  }, []);

  const handleNav = () => {
    navigation.navigate(routes.PROFILESCREEN);
  };
  const getStateData = () => {
    getState(token)
      .then(response => {
        console.log('States' + response.data);
        setStateData(response.data);
      })
      .catch(error => {
        // console.log(error);
      });
  };

  const getCitiesData = stateId => {
    getCities(token, stateId)
      .then(response => {
        console.log('Cities' + response.data);
        setCityData(response.data);
      })
      .catch(error => {
        // console.log(error);
      });
  };
  const cityDropDownOptions = cityData
    ? cityData.map(city => ({
        label: city.name,
        value: city.id.toString(),
      }))
    : [];
  const handleCityDropDown = selectedItem => {
    setSelectedCityIdandName(selectedItem);
    handleCityIdAndName(selectedItem);
    console.log(selectedItem);
    setDataLoadedforCity(true);
  };

  const handleClearCityDropdown = () => {
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setDataLoadedforCity(false);
  };
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
  };

  const handleStateDropdown = selectedItem => {
    setSelectedStateIdandName(selectedItem);
    handleSelectedStates(selectedItem);
  };

  const handleClearStateDropdown = () => {
    setSelectedState(null);
    setSelectedStateIdandName(null);
    setDataLoadedforState(false);
    setCityData(null);
    setSelectedCity(null);
    // handleClearCityDropdown();
    setDataLoadedforCity(false);
  };
  const handleSelectedStates = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(state => state.id === selectedId)?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getCitiesData(selectedId);
    setDataLoadedforState(true);
  };

  const statedropdownOptions = stateData
    ? stateData.map(state => ({
        label: state.name,
        value: state.id.toString(),
      }))
    : [];

  useEffect(() => {
    getStateData();
  }, []);

  const genderoptions = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'other', value: ''},
  ];
  const handleGenderDropDown = item => {
    setGender(item.value);
    console.log(item.value);
    setDataLoadedforgender(true);
  };
  const handleClearClickGender = () => {
    setGender(null);
    setDataLoadedforgender(false);
  };

  const MaritalStatusoptions = [
    {label: 'Single', value: 'Single'},
    {label: 'Married', value: 'Married'},
    {label: 'Divorced', value: 'Divorced'},
    {label: 'Widow', value: 'Widow'},
  ];
  const handleMaritalStatusDropDown = item => {
    if (item.value == 'Married') {
      setMaritalValue(0);
    } else {
      setMaritalValue(1);
    }

    setMaritalStatus(item.value);

    console.log(item.value);
    setDataLoadedForMarriage(true);
  };
  const handleClearClickMaritalStatus = () => {
    setMaritalStatus(null);
    setDataLoadedForMarriage(false);
  };
  const occupationOptions = [
    {label: 'Government  Sector', value: 'Government Sector'},
    {label: 'Private Sector', value: 'Private Sector'},
    {label: 'Doctor', value: 'Doctor'},
    {label: 'Engineer', value: 'Engineer'},
    {label: 'Sales', value: 'Sales'},
    {label: 'Marketing', value: 'Marketing'},
  ];
  const handleOccupationDropDown = item => {
    setJobType(item.value);
    console.log(item.value);
    setDataLoadedforOccupation(true);
  };
  const handleClearOccupation = () => {
    setJobType(null);
    setDataLoadedforOccupation(false);
  };

  // const setValue = data => {
  //   // console.log(userData.marital_status);
  //   setMaritalStatus(data.marital_status);
  //   setChangedEmail(data.email);
  //   setChangedName(data.name);
  //   setChangedDob(data.dob ? moment(userData.dob).format('DD/MM/YYYY') : 'NA');
  //   setGender(data.gender);
  //   setEducation(data.highest_qualification);
  //   setJobType(data.job_type);
  //   setSelectedState(data.native_place_state);
  //   setSelectedCity(data.native_place_city);
  // };

  const EducationOptions = [
    {label: '10th', value: '10th'},
    {label: '12th', value: '12th'},
    {label: 'Graduate', value: 'Graduate'},
    {label: 'UnderGraduate', value: 'UnderGraduate'},
    {label: 'Diploma', value: 'Diploma'},
    {label: 'UnderDiploma', value: 'UnderDiploma'},
  ];
  const handleEducationOptionsDropdown = selectedItem => {
    handleEducationDropdown(selectedItem);
    setDataLoadedForEducation(true);
  };
  const handleEducationDropdown = selectedItem => {
    setEducation(selectedItem.value);
    console.log(selectedItem.value);
  };

  const handleClearEducationDropdown = () => {
    setEducation(null);
    setDataLoadedForEducation(false);
  };

  const calculateAge = dob => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Check if the birthday has passed this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleDobChange = text => {
    // Perform the age validation
    if (text.length === 10) {
      // Check if the date format is complete
      const age = calculateAge(text);

      if (age < 18) {
        ToastAndroid.show(
          'You must be at least 18 years old.',
          ToastAndroid.SHORT,
        );
        return;
      } else {
        setChangedDob(text);
      }
    }
  };

  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];

    // Perform validations for each field
    // if (
    //   !changedDob ||
    //   !changedEmail ||
    //   !gender ||
    //   !education ||
    //   !maritalValue ||
    //   !jobType ||
    //   !maritalStatus ||
    //   !changedName ||
    //   !selectedCity ||
    //   !selectedState ||
    //   !occupation
    // ) {
    //   errors.push('Please Fill out all the Mandatory Details');
    // }
    // if (errors.length > 0) {
    //   const errorMessage = errors.join('\n'); // Join error messages with newline character
    //   Alert.alert(errorMessage);
    //   return;
    // }

    UpdateUserProfile(
      changedDob,
      changedEmail,
      gender,
      education,
      maritalValue,
      jobType,
      maritalStatus,
      changedName,
      selectedCity,
      selectedState,
      occupation,
    );
    // All fields are filled, proceed with form submission
  };

  // const validateDateInput = text => {
  //   // Regex to check if the input follows YYYY-MM-DD format

  //   const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  //   const isValidDate = datePattern.test(text) && isValidDateValue(text);

  //   if (isValidDate || text === '') {
  //     setChangedDob(text);
  //   } else {
  //     ToastAndroid.show(
  //       'Invalid date format. Please use YYYY-MM-DD.',
  //       ToastAndroid.SHORT,
  //     );
  //   }
  // };

  // const isValidDateValue = text => {
  //   // Split the input into year, month, and day
  //   const [year, month, day] = text.split('-').map(Number);

  //   // Check if the year, month, and day are valid
  //   const isValidYear = year >= 1000 && year <= 9999;
  //   const isValidMonth = month >= 1 && month <= 12;
  //   const isValidDay = day >= 1 && day <= 31;

  //   // Simple day validation, consider improving this for month-specific day checks
  //   return isValidYear && isValidMonth && isValidDay;
  // };
  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.headingcontainer}>
        <Text style={styles.headingText}>Basic profile</Text>
      </View>
      {userData ? (
        <View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>
              Name <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={text => setChangedName(text)}
              defaultValue={changedName}
            />
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Email</Text>
            <TextInput
              style={styles.inputBox}
              defaultValue={changedEmail}
              onChangeText={text => setChangedEmail(text)}
            />
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>
              Dob <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <TextInput
              style={styles.inputBox}
              defaultValue={changedDob}
              onChangeText={text => handleDobChange(text)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="black"
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>

          {!stateEdit ? (
            <View style={styles.editcontainerwithlabel}>
              <Text style={styles.editcontainertext}>
                Selected State : {userData.native_place_state}
              </Text>
              <TouchableOpacity
                style={styles.editcontainer}
                onPress={() => {
                  setStateEdit(true),
                    setCityEdit(true),
                    setSelectedCity(null),
                    setSelectedState(null);
                }}>
                <FontAwesome5 size={24} name="edit" color={colors.black} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {stateData && (
                <>
                  <Text style={styles.dropdowntextLabel}>Select State</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={statedropdownOptions}
                    search
                    inputSearchStyle={{color: colors.black}}
                    itemTextStyle={styles.itemTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    value={selectedStateIdandName}
                    placeholder="--Select state--"
                    labelField="label"
                    valueField="value"
                    onChange={item => {
                      handleStateDropdown(item);
                    }}
                    renderRightIcon={() => {
                      if (dataLoadedforState && selectedState !== null) {
                        return (
                          <FontAwesome5
                            name="trash"
                            color={colors.orange}
                            size={20}
                            onPress={handleClearStateDropdown}
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
                </>
              )}
            </>
          )}

          {!cityEdit ? (
            <View style={styles.editcontainerwithlabel}>
              <Text style={styles.editcontainertext}>
                Selected City : {userData.native_place_city}
              </Text>
              <TouchableOpacity
                style={styles.editcontainer}
                onPress={() => {
                  setCityEdit(true),
                    setStateEdit(true),
                    setSelectedCity(null),
                    setSelectedState(null);
                }}>
                <FontAwesome5 size={24} name="edit" color={colors.black} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.dropdowntextLabel}>Select City</Text>
              <Dropdown
                style={styles.dropdown}
                data={cityDropDownOptions}
                search
                inputSearchStyle={{color: colors.black}}
                itemTextStyle={styles.itemTextStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                value={selectedCityIdandName}
                placeholder="--Select city--"
                labelField="label"
                valueField="value"
                onChange={item => {
                  handleCityDropDown(item);
                }}
                renderRightIcon={() => {
                  if (dataLoadedforCity && selectedCity !== null) {
                    return (
                      <FontAwesome5
                        name="trash"
                        color={colors.orange}
                        size={20}
                        onPress={handleClearCityDropdown}
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
            </>
          )}

          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>
              Community <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <TextInput
              style={styles.inputBox}
              value={communityName ? communityName : ''}
              editable={false}
              // onChangeText={text => setStreetAddress(text)}
            />
          </View>
          <View style={styles.dropdowncontainer}>
            <Text style={styles.dropdowntextLabel}>
              Gender <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={genderoptions}
              search // Enable search functionality
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              inputSearchStyle={styles.searchTextInput}
              selectedTextStyle={styles.selectedTextStyle}
              labelField="label"
              valueField="value"
              maxHeight={300}
              placeholder={'--Select-Gender--'}
              searchPlaceholder="Search..."
              value={gender}
              onChange={handleGenderDropDown}
              renderRightIcon={() => {
                if (dataLoadedforgender && gender !== null) {
                  return (
                    <FontAwesome6
                      name="circle-xmark"
                      color={colors.orange}
                      size={22}
                      onPress={handleClearClickGender}
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
          <View style={styles.dropdowncontainer}>
            <Text style={styles.dropdowntextLabel}>Select Education</Text>
            <Dropdown
              style={styles.dropdown}
              data={EducationOptions}
              search // Enable search functionality
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              inputSearchStyle={styles.searchTextInput}
              selectedTextStyle={styles.selectedTextStyle}
              labelField="label"
              valueField="value"
              maxHeight={300}
              placeholder={'--Select-Education--'}
              searchPlaceholder="Search..."
              value={education}
              onChange={handleEducationOptionsDropdown}
              renderRightIcon={() => {
                if (dataLoadedForEducation && education !== null) {
                  return (
                    <FontAwesome6
                      name="circle-xmark"
                      color={colors.danger}
                      size={22}
                      onPress={handleClearEducationDropdown}
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
          <View style={styles.dropdowncontainer}>
            <Text style={styles.dropdowntextLabel}>Select Job Profile</Text>
            <Dropdown
              style={styles.dropdown}
              data={occupationOptions}
              search // Enable search functionality
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              inputSearchStyle={styles.searchTextInput}
              selectedTextStyle={styles.selectedTextStyle}
              labelField="label"
              valueField="value"
              maxHeight={300}
              placeholder={'--Select-jobType--'}
              searchPlaceholder="Search..."
              value={jobType}
              onChange={handleOccupationDropDown}
              renderRightIcon={() => {
                if (dataLoadedforOccupation && jobType !== null) {
                  return (
                    <FontAwesome6
                      name="circle-xmark"
                      color={colors.danger}
                      size={22}
                      onPress={handleClearOccupation}
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
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>
              Occupation <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={text => setOccupation(text)}
              defaultValue={occupation}
            />
          </View>
          <View style={styles.dropdowncontainer}>
            <Text style={styles.dropdowntextLabel}>Marital Status</Text>
            <Dropdown
              style={styles.dropdown}
              data={MaritalStatusoptions}
              search // Enable search functionality
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              inputSearchStyle={styles.searchTextInput}
              selectedTextStyle={styles.selectedTextStyle}
              labelField="label"
              valueField="value"
              maxHeight={300}
              placeholder={'--Select-Gender--'}
              searchPlaceholder="Search..."
              value={maritalStatus}
              onChange={handleMaritalStatusDropDown}
              renderRightIcon={() => {
                if (dataLoadedForMarriage && maritalStatus !== null) {
                  return (
                    <FontAwesome6
                      name="circle-xmark"
                      color={colors.orange}
                      size={22}
                      onPress={handleClearClickMaritalStatus}
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
          <TouchableOpacity style={styles.confirmbutton} onPress={handleSubmit}>
            <Text style={styles.updatetext}>Update</Text>
          </TouchableOpacity>
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

export default EditProfile;

const styles = StyleSheet.create({
  maincontainer: {
    margin: 10,
  },
  searchboxinput: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#198754',
    borderRadius: 8,
  },
  searchbox: {
    color: colors.black,
    flex: 1,
  },
  dropdown: {
    margin: 5,
    height: 50,
    borderBottomColor: colors.black,
    borderWidth: 0.5,
    padding: 5,
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

  headingText: {fontSize: 16, color: colors.black},
  headingcontainer: {
    height: 30,
    margin: 5,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputcontainerwithlabel: {
    marginTop: 10,
    margin: 5,
  },
  labeltext: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.black,
  },
  inputBox: {
    height: 50,
    borderWidth: 2,
    color: colors.black,
    padding: 10,
    borderRadius: 15,
  },
  dropdowntextLabel: {
    color: colors.black,
    marginLeft: 10,
    fontSize: 15,
  },
  updatetext: {
    color: colors.white,
    fontSize: 18,
  },
  confirmbutton: {
    backgroundColor: colors.gradientForm,
    margin: 10,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dropdowncontainer: {},
  editcontainerwithlabel: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 5,
    height: 50,
  },
  editcontainertext: {
    color: colors.black,
    fontSize: 16,
  },
  editcontainer: {
    margin: 5,
    marginRight: 10,
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
