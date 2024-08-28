import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  RefreshControl,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {getCities, getState, UpdateAddress} from '../../apis/apicalls';
import {Dropdown} from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import {TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native';
import routes from '../../constants/routes';
import {ActivityIndicator} from 'react-native';

const AddAddress = ({navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [addressLine, setAddressLine] = useState();
  const [selectedAddressType, setSelectedAddressType] = useState();
  const [country, setCountry] = useState('India');
  const [dataLoadedforAddress, setDataLoadedForAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const PostAddress = (address_type, address_line, city, country, state) => {
    UpdateAddress(token, address_type, address_line, city, country, state)
      .then(response => {
        console.log('updated', response.data);
        Alert.alert('Address Updated');
        handleNav();
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        // const {message, errors} = error.response.data;
        // console.log(message);
        // console.log(errors);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    setRefreshing(false);
  }, []);

  const getStateData = () => {
    setApiFailed(false);
    getState(token)
      .then(response => {
        console.log('States' + response.data);
        setStateData(response.data);
      })
      .catch(error => {
        // console.log(error);
        setApiFailed(true);
      });
  };
  const getCitiesData = stateId => {
    getCities(token, stateId)
      .then(response => {
        console.log('Cities' + response);
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
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setCityData(null);
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

  const AddresstypeOptions = [
    {label: 'Permanent', value: 'PERMANENT'},
    {label: 'Current', value: 'CURRENT'},
  ];

  const handleAddressDropDown = selectedItem => {
    handleAddressIdAndName(selectedItem);
    console.log(selectedItem);
    setDataLoadedForAddress(true);
  };

  const handleClearAddressDropdown = () => {
    setSelectedAddress(null);
    setDataLoadedForAddress(false);
  };
  const handleAddressIdAndName = selectedItem => {
    const selectedId = selectedItem.value;
    const selectedName = AddresstypeOptions.find(
      AddressType => AddressType.label === selectedId,
    )?.label;
    setSelectedAddress(selectedItem);
    setSelectedAddressType(selectedId);
  };

  const handleNav = () => {
    navigation.navigate(routes.PROFILESCREEN);
  };

  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];

    // console.log(
    //     address_type, address_line, country
    // );
    // Perform validations for each field
    if (!selectedAddress || !selectedState || !selectedCity || !addressLine) {
      errors.push('Please Fill out all the Mandatory Details');
    }
    if (errors.length > 0) {
      const errorMessage = errors.join('\n'); // Join error messages with newline character
      Alert.alert(errorMessage);
      return;
    }

    PostAddress(
      selectedAddressType,
      addressLine,
      selectedCity,
      country,
      selectedState,
    );
    // All fields are filled, proceed with form submission
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {stateData && !apiFailed ? (
        <View style={styles.outercontainer}>
          <View style={styles.headingcontainer}>
            <Text style={styles.headingtext}>Update Address</Text>
          </View>
          <View style={styles.dropdownoutsidecontainer}>
            <Text style={styles.textheaddropdown}>
              Address Type <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={AddresstypeOptions}
              search
              inputSearchStyle={styles.searchTextInput}
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              value={selectedAddress}
              placeholder="--Select--"
              labelField="label"
              valueField="value"
              onChange={handleAddressDropDown}
              renderRightIcon={() => {
                if (dataLoadedforAddress && selectedAddress !== null) {
                  return (
                    <FontAwesome5
                      name="trash"
                      color={colors.orange}
                      size={20}
                      onPress={handleClearAddressDropdown}
                    />
                  );
                } else {
                  return (
                    <FontAwesome5
                      name="caret-down"
                      color={'#ffc107'}
                      size={28}
                    />
                  );
                }
              }}
            />
            <Text style={styles.textheaddropdown}>
              Select State <Text style={{color: colors.danger}}>*</Text>
            </Text>
            {stateData && (
              <Dropdown
                style={styles.dropdown}
                data={statedropdownOptions}
                search
                inputSearchStyle={styles.searchTextInput}
                itemTextStyle={styles.itemTextStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                value={selectedStateIdandName}
                placeholder="--Select--"
                labelField="label"
                valueField="value"
                onChange={handleStateDropdown}
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
                        color={'#ffc107'}
                        size={28}
                      />
                    );
                  }
                }}
              />
            )}
            <Text style={styles.textheaddropdown}>
              Select City <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={cityDropDownOptions}
              search
              inputSearchStyle={styles.searchTextInput}
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              value={selectedCityIdandName}
              placeholder="--Select--"
              labelField="label"
              valueField="value"
              onChange={handleCityDropDown}
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
                      color={'#ffc107'}
                      size={28}
                    />
                  );
                }
              }}
            />

            <View style={styles.inputcontainerwithlabel}>
              <Text style={styles.labeltext}>
                Address Line<Text style={{color: colors.danger}}>*</Text>
              </Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={text => setAddressLine(text)}
                placeholder="Enter Address"
                placeholderTextColor={colors.black}
              />
            </View>
            <TouchableOpacity
              style={styles.submitcontainer}
              onPress={handleSubmit}>
              <Text style={styles.submittext}>Submit</Text>
            </TouchableOpacity>
          </View>
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

export default AddAddress;

const styles = StyleSheet.create({
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
  dropdown: {
    margin: 10,
    height: 50,
    borderBottomColor: colors.black,
    borderBottomWidth: 0.5,
  },
  dropdownoutsidecontainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.white,
    elevation: 25,
  },
  textheaddropdown: {
    fontSize: 16,
    backgroundColor: colors.bgcolorSign_up_in,
    borderRadius: 120,
    color: colors.black,
    textAlign: 'center',
  },
  outercontainer: {
    margin: 10,
    borderWidth: 1,
    borderColor: colors.grayLight,
    padding: 5,
    backgroundColor: colors.white,
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
  submitcontainer: {
    backgroundColor: colors.primary,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  submittext: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '500',
  },
  headingcontainer: {
    backgroundColor: colors.gray,
    height: 40,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingtext: {
    fontSize: 22,
    color: colors.white,
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
